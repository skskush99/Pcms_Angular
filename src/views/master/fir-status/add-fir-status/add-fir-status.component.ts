import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UrlService } from '../../../shared/services/url.service';
import { WordsRestrictService } from '../../../shared/services/words-restrict.service';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { CommonModule } from '@angular/common';
import constants from '../../../shared/utils/constants';

@Component({
  selector: 'app-add-fir-status',
  standalone: true,
  imports: [ButtonComponent , ReactiveFormsModule , CommonModule],
  templateUrl: './add-fir-status.component.html',
  styleUrl: './add-fir-status.component.css'
})
export class AddFirStatusComponent {

  addEditFirStatus : any;
    addFirStatusForm : FormGroup = new FormGroup({
      firStatusEnglish : new FormControl(null , [Validators.required]),
      firStatusHindi : new FormControl(null , []),
    })
  
  
    constructor(public restrictChar : WordsRestrictService , private notify : NotificationService ,  private api : ApiService , private url : UrlService , private _router : Router ){
    }
  
  
    ngOnInit(): void {
      this.addEditFirStatus = history.state?.addEditFirStatus;
      //console.log(this.editCrimeClassification);
      
      if(this.addEditFirStatus){
        this.addFirStatusForm.controls['firStatusEnglish'].setValue(this.addEditFirStatus.FirStatusNameEnglish || '')
        this.addFirStatusForm.controls['firStatusHindi'].setValue(this.addEditFirStatus.FirStatusNameHindi || '')
      }
    }
  
    
  
  
    onSave(){
      if(!this.addFirStatusForm.valid){
        this.addFirStatusForm.markAllAsTouched();
        return
      }
      let reqParam = {
        "firStatusId": this.addEditFirStatus?.FirStatusId || 0,
        "firStatusNameEnglish": this.addFirStatusForm.value.firStatusEnglish || '',
        "firStatusNameHindi": this.addFirStatusForm.value.firStatusHindi || '',
        "createdBy": 0,
        "updatedBy": 0
      }
      this.api.post(this.url.addEditFirStatus() , reqParam).subscribe({
        next : (res :any) => {
          //console.log(res);
          if(res.status){
            this.notify.showNotification('success' , res.msg || res.message)
            window.scrollTo(0 , 0)
            this._router.navigateByUrl("master/fir-status")
          }else this.notify.showNotification('error' , res.message)
        },
        error : (err : Error) => {
          //console.log(err);
          this.notify.showNotification('error' , constants.apiError)
          window.scrollTo(0 , 0)
        }
      })
       }
  
  
       onCancel(){
        this._router.navigateByUrl("master/fir-status")
       }
  
}
