import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';
import { NotificationService } from '../../shared/services/notification.service';
import constants from '../../shared/utils/constants';



enum FileType{
  chargeSheetDocs = 1,
  fullChargeSheetDocs = 2,
  otherDocs = 3
}

interface UploadFile {
  file: File;
  error?: string;
  name?:string;
}

@Component({
  selector: 'app-case-review-submit',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './case-review-submit.component.html',
  styleUrl: './case-review-submit.component.css'
})
export class CaseReviewSubmitComponent implements OnInit{

  @Input() caseId : any;
  fileType = FileType ;
  files : Partial<Record<FileType , UploadFile>> = {};

  api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);

  caseSubmitForm : FormGroup = new FormGroup({
    remarks : new FormControl(""),
  })


  ngOnInit(): void {
    console.log(this.caseId);


  }



  onFileChange(event: any, type: FileType) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf'];
    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.files[type] = {
        file,
        error: 'Only PDF files are allowed'
      };
      return;
    }

    if (file.size > maxSizeBytes) {
      this.files[type] = {
        file,
        error: 'File size must be less than 5MB'
      };
      return;
    }

    // valid file
    this.files[type] = {file};
  }


  submitCaseForm(){
    if(this.files[this.fileType.fullChargeSheetDocs]?.error || 
      this.files[this.fileType.chargeSheetDocs]?.error ||
      this.files[this.fileType.otherDocs]?.error
    ){
      this.notify.showNotification('error' , constants.FileSizeExceeding);
      return
    }
    if(!this.files[this.fileType.chargeSheetDocs]?.file ||
       !this.files[this.fileType.fullChargeSheetDocs]?.file
    ){
      this.notify.showNotification('info' , constants.allFilesMandate);
      return
    }
    let formData = new FormData();
    formData.append('SelectFile' , this.files[this.fileType.chargeSheetDocs]!.file);
    formData.append('SelectFile1' , this.files[this.fileType.fullChargeSheetDocs]!.file);
    formData.append('SelectFile2' , this.files[this.fileType.otherDocs]!.file);
    formData.append('DirRegId' , this.caseId);
    formData.append('Steps' , '4');
    formData.append('Remarks' , this.caseSubmitForm.value.remarks || '');
    formData.append('ChargeSheetDocs' , this.files[this.fileType.chargeSheetDocs]!.file?.name || '');
    formData.append('FullChargeSheetDocs' , this.files[this.fileType.fullChargeSheetDocs]!.file?.name || '');
    formData.append('OtherDocs' , this.files[this.fileType.otherDocs]!.file?.name || '');
    formData.append('CaseStatus' , '1');
    this.api.post(this.url.submitReviewCase() , formData).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('success' , res.message);
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })
    
  }






}
