import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { WordsRestrictService } from '../../shared/services/words-restrict.service';
import { NotificationService } from '../../shared/services/notification.service';
import constants from '../../shared/utils/constants';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';

@Component({
  selector: 'app-case-parties',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule , CommonModule],
  templateUrl: './case-parties.component.html',
  styleUrl: './case-parties.component.css'
})
export class CasePartiesComponent implements OnInit{


  statusDropdown : DropdownListInterface[] = [];
  accusedList : any[] = [];
  victimWitnessList : any[] = [];
  victimWitnessEditId : any;
  accusedEditId : any;

  restrictKeys = inject(WordsRestrictService);
  notify = inject(NotificationService);
  api = inject(ApiService);
  url = inject(UrlService);



  @Input() caseId : any;
  @Output() caseParty = new EventEmitter<any>();

  accusedForm : FormGroup = new FormGroup({
      accusedName : new FormControl('' , [Validators.required]),
      accusedAddress : new FormControl('' , [Validators.required]),
      accusedAge : new FormControl('' , [Validators.required]),
      accusedGender : new FormControl('' , [Validators.required]),
      accusedStatus : new FormControl(null , [Validators.required]),
      accusedRemark : new FormControl('' , [Validators.required]),
      govtAccused : new FormControl(false),
  })
  
  
  victimWitnessForm : FormGroup = new FormGroup({
      victimWitnessName : new FormControl('' , [Validators.required]),
      victimWitnessAddress : new FormControl('' , [Validators.required]),
      victimWitnessAge : new FormControl('' , [Validators.required]),
      victimWitnessGender : new FormControl('' , [Validators.required]),
      victimWitnessStatus : new FormControl(null , [Validators.required]),
      victimWitnessRemark : new FormControl('' , [Validators.required]),
      isVictim : new FormControl(1)
  })



  ngOnInit(): void {
    this.getFirStatusDropdown();
    this.getAccusedList();
    this.getVictimWitnessList();

    // this.addVictim();
  }



  compareWithFunc(a : any,b : any) {
    let res = false;
    if (a['value'] && b) {
      res = (a['value'] == b);
    }
    return res
  }


  getFirStatusDropdown(){
    this.api.get(this.url.getFirStatusDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.statusDropdown = res.data;
      },
      error : (err : Error) => {
        throw new Error(err?.message)
      }
    })
  }


  addAccused(){
    if(!this.accusedForm.valid){
      this.accusedForm.markAllAsTouched();
      this.notify.showNotification('info' , constants.ALL_MANDATE);
      return
    }
    let form = this.accusedForm.value;
    let reqParams = {
      "accusedId": this.accusedEditId || 0,
      "accusedGroupNo": this.caseId,
      "accuseName": form.accusedName || '',
      "fatherName": "",
      "gender": form.accusedGender || 0,
      "address": form.accusedAddress || '',
      "mobileNo": "",
      "uidNo": "",
      "districtId": 0,
      "thanaId": 0,
      "firStatusId": form.accusedStatus || 0
  }
  this.api.post(this.url.addEditCaseAccused() , reqParams).subscribe({
    next : (res : any) => {
      console.log(res);
      if(res.status){
        this.notify.showNotification('success' , res.message);
        this.accusedEditId = null;
        this.accusedForm.reset();
        this.accusedForm.controls['accusedGender'].setValue("");
        this.getAccusedList();
      }else this.notify.showNotification('error' , res.message)
      
    },
    error : (err : Error) => {
      this.notify.showNotification('error' , constants.apiError)
    },
    complete() {
      
    },
  })
    
    
    
  }


  editAccused(e : any){
    console.log(e);
    this.accusedForm.patchValue({
      accusedName : e?.AccuseName || '',
      accusedAddress : e?.Address || '',
      accusedAge : e?.Age || '',
      accusedGender : e?.Gender || 1,
      accusedStatus : e?.FIRStatusId || null,
      accusedRemark : e?.Remarks || '',
      // govtAccused : e?.,
    })
    this.accusedEditId = e?.AccusedId;
  }


  getAccusedList(){
    if(!this.caseId)return;
    this.api.get(this.url.getCaseAccusedList(this.caseId)).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.accusedList = res.data;

        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        throw new Error(err?.message);
      }
    })
  }



  removeAccused(i : number){
    console.log(i);
    if(!i){
      this.notify.showNotification('error' , constants.apiError);
      return
    }
    this.api.post(this.url.deleteCaseAccused(i) , {}).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('delete' , res.message);
          this.getAccusedList();
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message)
      }
    })
  }
  
  
  addVictimWitness(){
    if(!this.victimWitnessForm.valid){
      this.victimWitnessForm.markAllAsTouched();
      this.notify.showNotification('info' , constants.ALL_MANDATE);
      return
    }
    if(!this.caseId){
      this.notify.showNotification('error' , constants.apiError);
      return
    }
    let reqParams = {
      "id": this.victimWitnessEditId || 0,
      "isVictimWitness": this.victimWitnessForm.value.isVictim,
      "groupNo": this.caseId,
      "name": this.victimWitnessForm.value.victimWitnessName || "",
      "fatherName": "",
      "gender": this.victimWitnessForm.value.victimWitnessGender,
      "address": this.victimWitnessForm.value.victimWitnessAddress || "",
      "mobileNo": "",
      "uidNo": "",
      "districtId": 0,
      "thanaId": 0,
      "status": this.victimWitnessForm.value.victimWitnessStatus
    }
    this.api.post(this.url.addEditCaseVictimWitness() , reqParams).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('success' , res.message);
          this.victimWitnessEditId = null;
          this.victimWitnessForm.reset();
          this.victimWitnessForm.controls['victimWitnessGender'].setValue("");
          this.victimWitnessForm.controls['isVictim'].setValue(1);
          this.getVictimWitnessList();
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message)
      }
    })
  }



  editVictimWitness(e : any){
    // console.log('edit' , e);
    this.victimWitnessForm.patchValue({
      victimWitnessName : e?.Name || '',
      victimWitnessAddress : e?.Address || '', 
      victimWitnessAge : e?.Age || '',
      victimWitnessGender : e?.Gender || "",
      victimWitnessStatus : e?.Status || null,
      victimWitnessRemark : e?.Remark || "",
      isVictim : e?.isVictimWitness || 2
    });
    this.victimWitnessEditId = e?.Id;
  }

  getVictimWitnessList(){
    if(!this.caseId)return;
    this.api.get(this.url.getCaseVictimWitnessList(this.caseId)).subscribe({
      next : (res : any) => {
        if(res.status){
          this.victimWitnessList = res.data;
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })
  }

  
  
  
  removeVictimWitness(i : number){
    this.api.post(this.url.deleteCaseVictimWitness(i) , {}).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('delete' , res.message);
          this.getVictimWitnessList();
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })
  }


  regCaseParties(){
    if(!this.caseId){
      this.notify.showNotification('error' , constants.apiError);
      return
    }
    let reqParams = {
      "dirRegId": this.caseId,
      "steps": 3,
      "isAccusedType": this.accusedForm.value.govtAccused ? 1 : 2,
      "accusedGroupNo": this.caseId,
      "victimWitnessGroupNo": this.caseId
    }
    this.api.post(this.url.regCaseParties() , reqParams).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('success' , res.message);
          this.caseParty.emit(true)
        }
      },
      error : (err : Error) => {
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })

  }



}
