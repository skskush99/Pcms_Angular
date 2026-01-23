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
  selector: 'app-add-crime-classification',
  standalone: true,
  imports: [ButtonComponent , ReactiveFormsModule , CommonModule],
  templateUrl: './add-crime-classification.component.html',
  styleUrl: './add-crime-classification.component.css'
})
export class AddCrimeClassificationComponent {

  editCrimeClassification : any;
    addClassClassificationForm : FormGroup = new FormGroup({
      classificationEnglish : new FormControl(null , [Validators.required]),
      classificationHindi : new FormControl(null , []),
    })
  
  
    constructor(public restrictChar : WordsRestrictService , private notify : NotificationService ,  private api : ApiService , private url : UrlService , private _router : Router ){
    }
  
  
    ngOnInit(): void {
      this.editCrimeClassification = history.state?.addEditCrimeClassification;
      //console.log(this.editCrimeClassification);
      
      if(this.editCrimeClassification){
        this.addClassClassificationForm.controls['classificationEnglish'].setValue(this.editCrimeClassification.CrimeClsNameEnglish || '')
        this.addClassClassificationForm.controls['classificationHindi'].setValue(this.editCrimeClassification.CrimeClsNameHindi || '')
      }
    }
  
    
  
  
    onSave(){
      if(!this.addClassClassificationForm.valid){
        this.addClassClassificationForm.markAllAsTouched();
        return
      }
      let reqParam = {
        "crimeClsId": this.editCrimeClassification?.CrimeClsId || 0,
        "crimeClsNameEnglish": this.addClassClassificationForm.value.classificationEnglish || '',
        "crimeClsNameHindi": this.addClassClassificationForm.value.classificationHindi || '',
        "createdBy": 0,
        "updatedBy": 0
      }
      this.api.post(this.url.addEditCrimeClassification() , reqParam).subscribe({
        next : (res :any) => {
          //console.log(res);
          if(res.status){
            this.notify.showNotification('success' , res.msg || res.message)
            window.scrollTo(0 , 0)
            this._router.navigateByUrl("master/crime-classification")
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
        this._router.navigateByUrl("master/crime-classification")
       }
  
}
