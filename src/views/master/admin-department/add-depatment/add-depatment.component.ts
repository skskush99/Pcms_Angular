import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UrlService } from '../../../shared/services/url.service';
import { WordsRestrictService } from '../../../shared/services/words-restrict.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-add-depatment',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule, ButtonComponent],
  templateUrl: './add-depatment.component.html',
  styleUrl: './add-depatment.component.css'
})
export class AddDepatmentComponent {

   data : string = '';
  editAdminDept : any;
  addAdminDeptForm : FormGroup = new FormGroup({
    adminDept : new FormControl(null , [Validators.required , Validators.pattern('^[A-Za-z ]+$')]),
    majorMinor : new FormControl('' , [Validators.required]),
    shortName : new FormControl(null , [Validators.required , Validators.pattern('^[A-Za-z ]+$')]),
    // date : new FormControl('' , [])

  })


  constructor(public restrictChar : WordsRestrictService , private notify : NotificationService ,  private api : ApiService , private url : UrlService , private _router : Router ){
  }


  ngOnInit(): void {
    this.editAdminDept = history.state?.addEditAdminDept;
    //console.log(this.editAdminDept);
    
    if(this.editAdminDept){
      this.addAdminDeptForm.controls['adminDept'].setValue(this.editAdminDept.AdmDeptName || '')
      this.addAdminDeptForm.controls['majorMinor'].setValue(this.editAdminDept.MajorMinor || '')
      this.addAdminDeptForm.controls['shortName'].setValue(this.editAdminDept.AdmDeptShortName || '')
    }

    // this.addAdminDeptForm.get('date')?.valueChanges.subscribe(val => {
    //   //console.log('Selected date:', val); // Date object
    // });
  }

  


  onSave(){
    if(!this.addAdminDeptForm.valid){
      this.addAdminDeptForm.markAllAsTouched();
      return
    }
    // //console.log(this.addAdminDeptForm.value);
    // return
  
    let reqParam = {
      // tocken : this.api.token,
      data : {
        admDeptId: this.editAdminDept?.admDeptId ? this.editAdminDept.admDeptId : 0,
        nicDeptId : 0,
        admDeptName : this.addAdminDeptForm.value.adminDept,
        admDeptShortName : this.addAdminDeptForm.value.shortName,
        majorMinor : this.addAdminDeptForm.value.majorMinor,
        active : true,
        createdBy : 0,
        createdOn : new Date().toISOString(),
        updatedBy : 0,
        updatedOn : new Date().toISOString(),
        deleteBy : 0,
        deleteOn : new Date().toISOString(),
        rowID : 0
      }
    }
    this.api.post(this.url.addEditAdminDept() , reqParam).subscribe({
      next : (res :any) => {
        //console.log(res);
        if(res.status){
          this.notify.showNotification('success' , res.msg || res.message)
          window.scrollTo(0 , 0)
          this._router.navigateByUrl("master/admin-dept")
        }else this.notify.showNotification('error' , res.message)
      },
      error : (err) => {
        //console.log(err);
        this.notify.showNotification('error' , 'Something Went Wrong')
        window.scrollTo(0 , 0)
      }
    })
     }


     onCancel(){
      this._router.navigateByUrl("master/admin-dept")
     }



  // On paste, allow only letters
  onPasteOnlyLetters(event: ClipboardEvent, controlName: string): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const lettersOnly = pastedText.replace(/[^a-zA-Z]/g, '');
    this.addAdminDeptForm.patchValue({
      [controlName]: lettersOnly.trim()
    });
  }
}
