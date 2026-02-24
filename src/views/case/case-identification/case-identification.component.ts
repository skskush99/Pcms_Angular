import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { createYearList } from '../../shared/utils/utils';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';
import { NotificationService } from '../../shared/services/notification.service';
import constants from '../../shared/utils/constants';
import { MatDialog } from '@angular/material/dialog';
import { ECourtCnrSearchComponent } from '../../shared/components/e-court-cnr-search/e-court-cnr-search.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-case-identification',
  standalone: true,
  imports: [NgSelectModule , ReactiveFormsModule , CommonModule],
  templateUrl: './case-identification.component.html',
  styleUrl: './case-identification.component.css'
})
export class CaseIdentificationComponent implements OnInit{

  thanaDropdown : DropdownListInterface[] = [];
  firYearDropdown : DropdownListInterface[] = [];
  @Output() caseIdentification = new EventEmitter<any>();
  @Input() caseId : any;
  api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  dialog = inject(MatDialog);


  caseIdentificationForm : FormGroup = new FormGroup({
    regType : new FormControl("1"),
    searchCaseVia : new FormControl("1"),
    thana : new FormControl(null),
    firNo : new FormControl("" , {validators : [Validators.required]}),
    firYear : new FormControl(null),
    cisCnr : new FormControl(""),
  })


  ngOnInit(): void {
    this.firYearDropdown = createYearList(1950);
    this.getPoliceStationDropdown();
    console.log(this.caseId);
    
  }


  getPoliceStationDropdown(){
    this.api.get(this.url.getPoliceStationDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.thanaDropdown = res.data;
      },
      error : (err : Error) => {
        throw new Error(err?.message)
      }
    })
  }


  regCaseIdentification(){
    if(!this.caseIdentificationForm.valid){
      this.caseIdentificationForm.markAllAsTouched();
      return
    }
    let reqParams = {
      "dirRegId": 0,
      "steps": 1,
      "districtId": 8,
      "officeId": 8,
      "jCourtId": 8,
      "registerType": this.caseIdentificationForm.value.regType,
      "searchCaseVia": this.caseIdentificationForm.value.searchCaseVia,
      "dierNo": "",
      "cnrNo": this.caseIdentificationForm.value.cisCnr || "",
      "firNo": this.caseIdentificationForm.value.firNo || "",
      "firYear": this.caseIdentificationForm.value.firYear || 0
    }
    
    // console.log(reqParams);
    this.api.post(this.url.regCaseIdentification() , reqParams).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res?.status){
          this.notify.showNotification('success' , res.message);
          this.caseIdentification.emit(res?.returnID) //to set id for all forms
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })
  }


  searnCnrCis(){
    if(!this.caseIdentificationForm.value.cisCnr){
      this.notify.showNotification('info' , constants.cnrNotAvail);
      return
    }
    this.api.get(this.url.searchCaseByCNRECourt(this.caseIdentificationForm.value.cisCnr)).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status && !Object.hasOwn(res.data?.data , 'Error')){
          this.dialog.open(ECourtCnrSearchComponent , {
            width : '95dvw',
            maxHeight : '85dvh',
            data: res.data?.data
          })
        }else this.notify.showNotification('error' , res.message);
        
      },
      error : (err : Error) => {
        console.log(err);
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })
  }
}
