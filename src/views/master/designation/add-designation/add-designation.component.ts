import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UrlService } from '../../../shared/services/url.service';
import { WordsRestrictService } from '../../../shared/services/words-restrict.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-add-designation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './add-designation.component.html',
  styleUrl: './add-designation.component.css'
})
export class AddDesignationComponent {

   data : string = '';
   roleId : any;
    editDesignation : any;
    addDesignationForm : FormGroup = new FormGroup({
      desigEnglish : new FormControl(null , [Validators.required , Validators.pattern('^[A-Za-z ]+$')]),
      desigHindi : new FormControl('' , [Validators.required]),
      // shortName : new FormControl(null , [Validators.required , Validators.pattern('^[A-Za-z ]+$')]),
      // date : new FormControl('' , [])
  
    })
  
  
    constructor(public restrictChar : WordsRestrictService , private notify : NotificationService ,  private api : ApiService , private url : UrlService , private _router : Router ){
    }
  
  
    ngOnInit(): void {
      console.log(history.state);
      
      this.editDesignation = history.state?.designation;
      //console.log(this.editDesignation);
      
      if(this.editDesignation){
        this.addDesignationForm.controls['desigEnglish'].setValue(this.editDesignation.designationEng)
        this.addDesignationForm.controls['desigHindi'].setValue(this.editDesignation.designationHindi)
      }
      let userDetails : any = localStorage.getItem('roleId');
      this.roleId = JSON.parse(userDetails)?.roleId;
  
      // this.addDesignationForm.get('date')?.valueChanges.subscribe(val => {
      //   //console.log('Selected date:', val); // Date object
      // });
    }
  
    
  
  
    onSave(){
      if(!this.addDesignationForm.valid){
        this.addDesignationForm.markAllAsTouched();
        return
      }
    
      let reqParam = {
        data : {
          "designationId": this.editDesignation?.designationId || 0,
          "designationEng": this.addDesignationForm.value.desigEnglish,
          "designationHindi": this.addDesignationForm.value.desigHindi,
          "levelId": this.roleId,
          "isActive": true,
          "createdBy": 0,
          "updatedBy": 0
        }
      }
      this.api.post(this.url.addEditDesignation() , reqParam).subscribe({
        next : (res :any) => {
          //console.log(res);
          if(res.status){
            this.notify.showNotification('success' , res.msg || res.message)
            window.scrollTo(0 , 0)
            this._router.navigateByUrl("master/designation")
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
        this._router.navigateByUrl("master/designation")
       }
  
  
  
    // On paste, allow only letters
    onPasteOnlyLetters(event: ClipboardEvent, controlName: string): void {
      event.preventDefault();
      const pastedText = event.clipboardData?.getData('text') || '';
      const lettersOnly = pastedText.replace(/[^a-zA-Z]/g, '');
      this.addDesignationForm.patchValue({
        [controlName]: lettersOnly.trim()
      });
    }
}
