import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { WordsRestrictService } from '../../../shared/services/words-restrict.service';
import { ApiService } from '../../../shared/services/api.service';
import { UrlService } from '../../../shared/services/url.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import constants from '../../../shared/utils/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-court-type',
  standalone: true,
  imports: [ReactiveFormsModule , ButtonComponent , CommonModule],
  templateUrl: './add-court-type.component.html',
  styleUrl: './add-court-type.component.css'
})
export class AddCourtTypeComponent implements OnInit{

  restrictChar = inject(WordsRestrictService);
  api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  router = inject(Router);
  editCourtType : any


  addCourtTypeForm : FormGroup = new FormGroup({
    courtTypeName : new FormControl('' , {validators : [Validators.required]}),
    courtTypeShortName : new FormControl('' , {validators : [Validators.required]}),
    orderNo : new FormControl('' , {validators : [Validators.required]}),
  })


  ngOnInit(): void {
    this.editCourtType = history.state?.courtType;
    if(this.editCourtType){
      console.log(this.editCourtType);
      this.addCourtTypeForm.patchValue({
        courtTypeName : this.editCourtType?.courtTypeName,
        courtTypeShortName : this.editCourtType?.courtTypeShortName,
        orderNo : this.editCourtType?.orderNo
      })
    }
  }


  onCancel(){
    this.router.navigateByUrl('master/court-type')
  }

  onSave(){
    if(!this.addCourtTypeForm.valid){
      this.addCourtTypeForm.markAllAsTouched();
      return
    }
    let reqParam = {
      "data": {
      "rowID": 0,
      "courtTypeId": this.editCourtType?.courtTypeId || 0,
      "courtTypeName": this.addCourtTypeForm.value.courtTypeName,
      "courtTypeShortName": this.addCourtTypeForm.value.courtTypeShortName,
      "orderNo": this.addCourtTypeForm.value.orderNo,
      "active": true,
      "createdBy": 0,
      "createdOn": new Date().toISOString(),
      "updatedBy": 0,
      "updatedOn": new Date().toISOString(),
      "deleteBy": 0,
      "deleteOn": new Date().toISOString()
    }
    }
    this.api.post(this.url.addEditCourtType() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('success' , res.message);
          this.router.navigateByUrl('master/court-type');
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        console.error(err);
        this.notify.showNotification('error' , constants.apiError);
      }

    })
  }
}
