import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownListInterface } from '../../../shared/model/shared.model';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UrlService } from '../../../shared/services/url.service';
import { WordsRestrictService } from '../../../shared/services/words-restrict.service';
import constants from '../../../shared/utils/constants';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-office',
  standalone: true,
  imports: [ReactiveFormsModule , NgSelectModule , ButtonComponent , CommonModule],
  templateUrl: './add-office.component.html',
  styleUrl: './add-office.component.css'
})
export class AddOfficeComponent {

  // data : string = '';
  districtDropdown : DropdownListInterface[] = [];
  // divisionDropdown : DropdownListInterface[] = [];
    editOffice : any;
    addOfficeForm : FormGroup = new FormGroup({
      officeEng : new FormControl(null , [Validators.required ,]),
      officeHin : new FormControl('' , []),
      // division : new FormControl(null , [Validators.required , ]),
      district : new FormControl(null , [Validators.required])
    })
  
  
    constructor(public restrictChar : WordsRestrictService , private notify : NotificationService ,  private api : ApiService , private url : UrlService , private _router : Router ){
    }
  
  
    ngOnInit(): void {
      this.editOffice = history.state?.office;
      console.log(this.editOffice);
      if(this.editOffice){
        
        this.addOfficeForm.patchValue({
          officeEng : this.editOffice?.OfficeEng || '',
          officeHin : this.editOffice?.OfficeHin || '',
          district : this.editOffice?.DistrictId || null
        })
      }
      this.getDistrictDropdown();
      
      
      // this.addOfficeForm.get('date')?.valueChanges.subscribe(val => {
      //   //console.log('Selected date:', val); // Date object
      // });
    }



  public compareWithFunc(a : any,b : any) {
    let res = false;
    if (a['value'] && b) {
      res = (a['value'] == b);
    }
    return res
  }
  
  
  getDistrictDropdown(){
    
    this.api.get(this.url.getDistrictDropDown()).subscribe({
      next: (res : any) => {
        console.log(res);
        this.districtDropdown = res.data;
      },
      error : (err : Error) => {
        //console.error(err);
        
      }
    })
  }
  
    
  
  
    onSave(){
      if(!this.addOfficeForm.valid){
        this.addOfficeForm.markAllAsTouched();
        return
      }
      // //console.log(this.addOfficeForm.value);
      // return
    
      let reqParam = {
        // tocken : this.api.token,
        data : {
          "officeId": this.editOffice?.OfficeId || 0,
          "officeEng": this.addOfficeForm.value.officeEng,
          "officeHindi": this.addOfficeForm.value.officeHin || '',
          "districtId": this.addOfficeForm.value.district,
          "isActive": 1,
          "createdBy": 0,
          "updatedBy": 0
        }
      }
      this.api.post(this.url.addEditOffice() , reqParam).subscribe({
        next : (res :any) => {
          console.log(res);
          if(res.status){
            this.notify.showNotification('success' , res.msg || res.message)
            window.scrollTo(0 , 0)
            this._router.navigateByUrl("master/office")
          }else this.notify.showNotification('error' , res.message)
        },
        error : (err) => {
          //console.log(err);
          this.notify.showNotification('error' , constants.apiError)
          window.scrollTo(0 , 0)
        }
      })
       }
  
  
       onCancel(){
        this._router.navigateByUrl("master/office")
       }
  
  
  
}
