import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownListInterface } from '../../../shared/model/shared.model';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UrlService } from '../../../shared/services/url.service';
import { WordsRestrictService } from '../../../shared/services/words-restrict.service';
import constants from '../../../shared/utils/constants';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-crime-sub-act',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule , ButtonComponent , NgSelectModule],
  templateUrl: './add-crime-sub-act.component.html',
  styleUrl: './add-crime-sub-act.component.css'
})
export class AddCrimeSubActComponent {

    editCrimeSubActData : any;
    crimeClassificationDropdown : DropdownListInterface[] = [];
    crimeActDropdown : DropdownListInterface[] = [];


    addCrimeSubActForm : FormGroup = new FormGroup({
      crimeSubActEnglish : new FormControl(null , [Validators.required ,]),
      crimeSubActHindi : new FormControl('' , []),
      crimeSubActShort : new FormControl(null , [Validators.required , ]),
      crimeSubActDesc : new FormControl(null , [Validators.required]),
      classification : new FormControl(null , [Validators.required]),
      crimeAct : new FormControl(null , [Validators.required]),
    })
  
  
    constructor(public restrictChar : WordsRestrictService , private notify : NotificationService ,  private api : ApiService , private url : UrlService , private _router : Router ){
    }
  
  
    ngOnInit(): void {
      this.editCrimeSubActData = history.state?.editCrimeSubActData;
      console.log(this.editCrimeSubActData);
      if(this.editCrimeSubActData){
        this.getClassificationDropdown();
        this.addCrimeSubActForm.patchValue({
          crimeSubActEnglish : this.editCrimeSubActData?.CrimeSubActNameEnglish || '',
          crimeSubActHindi : this.editCrimeSubActData?.CrimeSubActNameHindi || '',
          crimeSubActShort : this.editCrimeSubActData?.CrimeSubActShortName || '',
          crimeSubActDesc : this.editCrimeSubActData?.CrimeSubActDescription || '',
          classification : this.editCrimeSubActData?.CrimeClsId || null,
          crimeAct : this.editCrimeSubActData?.CrimeActId || null,
        })
        if(this.addCrimeSubActForm.value.classification)this.getCrimeActDropdown(true);
      }
      
      
    }



  public compareWithFunc(a : any,b : any) {
    let res = false;
    if (a['value'] && b) {
      res = (a['value'] == b);
    }
    return res
  }
  
  
  
  
    onSave(){
      if(!this.addCrimeSubActForm.valid){
        this.addCrimeSubActForm.markAllAsTouched();
        return
      }
      let reqParam = {
        "crimeSubActId": this.editCrimeSubActData?.CrimeSubActId || 0,
        "crimeActId": this.addCrimeSubActForm.value.crimeAct || 0,
        "crimeClsId": this.addCrimeSubActForm.value.classification,
        "crimeSubActNameEnglish": this.addCrimeSubActForm.value.crimeSubActEnglish || '',
        "crimeSubActNameHindi": this.addCrimeSubActForm.value.crimeSubActHindi || '',
        "crimeSubActShortName": this.addCrimeSubActForm.value.crimeSubActShort || '',
        "crimeSubActDescription": this.addCrimeSubActForm.value.crimeSubActDesc || '',
        "createdBy": 0,
        "updatedBy": 0,
      }
      this.api.post(this.url.addEditSubCrimeAct() , reqParam).subscribe({
        next : (res :any) => {
          console.log(res);
          if(res.status){
            this.notify.showNotification('success' , res.msg || res.message)
            this._router.navigateByUrl("master/crime-sub-act")
          }else this.notify.showNotification('error' , res.message)
        },
        error : (err) => {
          //console.log(err);
          this.notify.showNotification('error' , constants.apiError)
          
        },
        complete() {
          window.scrollTo(0 , 0)
        },
      })
       }
  
  
       onCancel(){
        this._router.navigateByUrl("master/crime-sub-act")
       }


       getClassificationDropdown(){
        this.api.get(this.url.getCrimeClassificationDropdown()).subscribe({
          next : (res : any) => {
            console.log(res);
            this.crimeClassificationDropdown = res.data;
          },
          error : (err : Error) => {
            console.error(err);
            
          }
        })
       }


       getCrimeActDropdown(ifInit?:boolean){
        if(!ifInit)this.addCrimeSubActForm.controls['crimeAct'].reset();
        if(!this.addCrimeSubActForm.value.classification){
          this.crimeActDropdown = [];
          return
        }

        let reqParam = {
          CrimeClsId : this.addCrimeSubActForm.value.classification || 0
        }

        this.api.get(this.url.getCrimeActDropdown() , reqParam).subscribe({
          next : (res : any) => {
            console.log(res);
            this.crimeActDropdown = res.data;
          },
          error : (err : Error) => {
            console.error(err);
            
          }
        })
      }
  
}
