import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DatePickerComponent } from "../../shared/components/date-picker/date-picker.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../shared/services/notification.service';
import constants from '../../shared/utils/constants';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';

@Component({
  selector: 'app-fir-charges-sheet',
  standalone: true,
  imports: [DatePickerComponent , NgSelectModule , ReactiveFormsModule , CommonModule],
  templateUrl: './fir-charges-sheet.component.html',
  styleUrl: './fir-charges-sheet.component.css'
})
export class FirChargesSheetComponent implements OnInit{

  notify = inject(NotificationService);
  api = inject(ApiService);
  url = inject(UrlService);

  sectionsDropdown : DropdownListInterface[] = [];
  actsDropdown : DropdownListInterface[] = [];
  classificationDropdown : DropdownListInterface[] = [];
  adhikaris : any[] = [];
  chargeSheetCrimeList : any[] = [];
  editOffenceId : any;
  adhikariEditId : any;
  @Input() caseId : any;
  @Output() firChargeSheetC = new EventEmitter<any>();

  firDetailsForm : FormGroup = new FormGroup({
    firNo : new FormControl(""),
    firDate : new FormControl(""),
    stationName : new FormControl(""),
    thanaCode : new FormControl(""),
    adhiThana : new FormControl(''),
    adhiDesignation : new FormControl(''),
    adhiName : new FormControl(''),
  })


  chargeSheetForm : FormGroup = new FormGroup({
    chargeSheetNo : new FormControl(""),
    chartSheetDate : new FormControl(""),
    dateFilingBeforeCourt : new FormControl(""),
    investigatingOfficer : new FormControl(""),
    caseTitle : new FormControl(""),
    classification : new FormControl(null),
    sections : new FormControl(null),
    acts : new FormControl(null),
  })



  ngOnInit(): void {
    console.log(this.caseId);
    
    this.getClassificationDropdown();
    this.getChargeSheetAdhikariList();
    this.getChargeSheetOffenceList();
  }


  addAdhikari(){
    let vals = this.firDetailsForm.value;
    let reqFields : string[] = ['adhiName', 'adhiThana', 'adhiDesignation'];
    if(!vals.adhiThana || !vals.adhiDesignation || !vals.adhiName){
      reqFields.forEach(key => 
        this.firDetailsForm.get(key)?.markAsTouched()
      );
      this.notify.showNotification('info' , constants.allFieldsReq)
      return
    }
    // this.adhikaris.push({
    //   name : vals.adhiName,
    //   designation : vals.adhiDesignation,
    //   thana : vals.adhiThana
    // })
    if(!this.caseId){
      this.notify.showNotification('error' , constants.apiError);
      return
    }

    let reqParam = {
      "investId": this.adhikariEditId || 0,
      "investGroupNo": this.caseId,
      "investName": this.firDetailsForm.value.adhiName,
      "fatherName": "",
      "rankName": this.firDetailsForm.value.adhiDesignation,
      "postingPlace": this.firDetailsForm.value.adhiThana,
      "gender": 0,
      "mobileNo": "",
      "districtId": 8,
      "thanaId": 0,
      "investStatus": 1
    }
    this.api.post(this.url.addFirChargeSheetAdhikari() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.adhikariEditId = null;
          this.notify.showNotification('success' , res.message);
          reqFields.forEach(i => this.firDetailsForm.controls[i?.toString()].reset());
          this.getChargeSheetAdhikariList(); 
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })

  }


  editAdhikari(e : any){
    this.firDetailsForm.patchValue({
      adhiName : e?.InvestName || '',
      adhiDesignation : e?.RankName || '',
      adhiThana : e?.PostingPlace || '',
    })
    this.adhikariEditId = e?.InvestId;
  }


  getChargeSheetAdhikariList(){
    if(!this.caseId)return;
    this.api.get(this.url.getChargeSheetAdhikariList(this.caseId)).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.adhikaris = res.data;
        }else this.notify.showNotification('error' , res.message)
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })
  }


  removeAdhikari(i : number){
    
    this.api.post(this.url.deleteChargeSheetAdhikari(i), {}).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('delete' , res.message);
          this.getChargeSheetAdhikariList();
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })
  }


  getClassificationDropdown(){
    this.api.get(this.url.getCrimeClassificationDropdown()).subscribe({
      next : (res  : any) => {
        console.log(res);
        this.classificationDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      }
    })
  }


  getActsDropdown(ifInit?:string){
    if(!ifInit)this.chargeSheetForm.controls['acts'].setValue(null)
      this.getCrimeSubActDropdown(ifInit ? 'init' : '');
      if(!this.chargeSheetForm.value.classification){
        this.actsDropdown = [];
        return
      }
    let reqParam = {
      CrimeClsId : this.chargeSheetForm.value.classification
    }

    this.api.get(this.url.getCrimeActDropdown() , reqParam).subscribe({
      next : (res : any) => {
        //console.log(res);
        this.actsDropdown = res.data;
      },
      error : (err) => {
        //console.log(err);

      }
    })
  }

  getCrimeSubActDropdown(ifInit?:string){
    if(!ifInit)this.chargeSheetForm.controls['sections'].setValue(null);
    if(!this.chargeSheetForm.value.acts){
      this.sectionsDropdown = [];
      return
    }
    let reqParam = {
      CrimeActId : this.chargeSheetForm.value.acts,
      CrimeClsId : this.chargeSheetForm.value.classification,
    }

    this.api.get(this.url.getCrimeSubActDropdown() , reqParam).subscribe({
      next : (res : any) => {
        //console.log(res);
        this.sectionsDropdown = res.data

      },
      error : (err) =>{
        //console.log(err);

      }
    })
  }



  addChargeSheetCrime(){
    let form = this.chargeSheetForm.value;
    
    let reqFields : string[] = ['classification' , 'acts' , 'sections'];

    if(!form.classification || !form.acts || !form.sections){
      reqFields.forEach(key => 
        this.chargeSheetForm.get(key)?.markAsTouched()
      );
      this.notify.showNotification('info' , constants.allFieldsReq)
      return
    }
    let classificationName = this.classificationDropdown.find(i => i.value == this.chargeSheetForm.value.classification)?.text;
    let actName = this.actsDropdown.find(i => i.value == this.chargeSheetForm.value.acts)?.text;
    let sectionName = this.sectionsDropdown.find(i => i.value == this.chargeSheetForm.value.sections)?.text;

    let reqParams = {
      "offenceClassifId": this.editOffenceId || 0,
      "offenceClassifGroupNo": this.caseId,
      "isCaseComplaintReg": 0,
      "classificationID": this.chargeSheetForm.value.classification,
      "classificationName": classificationName || "",
      "actsID": this.chargeSheetForm.value.acts,
      "actsName": actName || "",
      "sectionsID": this.chargeSheetForm.value.sections,
      "sectionsName": sectionName || ""
    }
    this.api.post(this.url.addEditClassificationOffence() , reqParams).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.editOffenceId = null;
          this.notify.showNotification('success' , res.message);
          this.getChargeSheetOffenceList();
          reqFields.forEach(i => this.chargeSheetForm.controls[i].reset());
        }
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })

  }


  getChargeSheetOffenceList(){
    this.api.get(this.url.getClassificationOffence(this.caseId)).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.chargeSheetCrimeList = res?.data;
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        throw new Error(err?.message);
      }
    })
  }


  deleteChargeSheetOffence(e : any){
    this.api.post(this.url.deleteClassificationOffence(e?.OffenceClassifId) , {}).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('delete' , res.message);
          this.getChargeSheetOffenceList();
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })
  }

  editChargeSheetOffence(e : any){
    this.chargeSheetForm.patchValue({
      classification : e?.ClassificationID || null,
      acts : e?.ActsID || null,
      sections : e?.SectionsID || null
    })
    if(this.chargeSheetForm.value.classification)this.getActsDropdown('init');
    this.editOffenceId = e?.OffenceClassifId
  }


  addEditChargeSheet(){
    if(this.firDetailsForm.value.invalid){
      this.firDetailsForm.value.markAllAsTouched();
      return
    }
    let reqParam = {
      "dirRegId": this.caseId,
      "steps": 2,
      "firNo": this.firDetailsForm.value.firNo || "",
      "firDt": this.firDetailsForm.value.firDate || "",
      "psName": this.firDetailsForm.value.stationName || "",
      "psCode": this.firDetailsForm.value.thanaCode || "",
      "investGroupNo": this.caseId,
      "chargeSheetNo": this.chargeSheetForm.value.chargeSheetNo,
      "chargeSheetDate": this.chargeSheetForm.value.chartSheetDate,
      "dateBeforeFillingCourt": this.chargeSheetForm.value.dateFilingBeforeCourt,
      "investigatingNameRank": this.chargeSheetForm.value.investigatingOfficer,
      "titleOfCase": this.chargeSheetForm.value.caseTitle,
      "cClassificationId": 0,
      "crimeActId": 0,
      "crimeActSubId": 0
    }
    console.log(reqParam);
    
    this.api.post(this.url.regChargeSheet() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('success' , res.message);
          this.firChargeSheetC.emit(true);
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })
  }


  compareWithFunc(a : any,b : any) {
    let res = false;
    if (a['value'] && b) {
      res = (a['value'] == b);
    }
    return res
  }





}
