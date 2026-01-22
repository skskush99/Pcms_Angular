import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { WordsRestrictService } from '../../shared/services/words-restrict.service';
import { NotificationService } from '../../shared/services/notification.service';
import constants from '../../shared/utils/constants';

@Component({
  selector: 'app-case-parties',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule , CommonModule],
  templateUrl: './case-parties.component.html',
  styleUrl: './case-parties.component.css'
})
export class CasePartiesComponent implements OnInit{


  statusDropdown : DropdownListInterface[] = [
    {value : '1' ,text : 'status 1'},
    {value : '2' ,text : 'status 2'},
  ];
  accusedList : any[] = [];
  victimWitnessList : any[] = [];


  restrictKeys = inject(WordsRestrictService);
  notify = inject(NotificationService);

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
      isVictim : new FormControl(true)
  })



  ngOnInit(): void {
    // this.addAccused();
    // this.addVictim();
  }


  // get accused(){
  //   return this.pariesForm.get('accused') as FormArray;
  // }
  
  
  // get victims(){
  //   return this.pariesForm.get('victims') as FormArray;
  // }


  addAccused(){
    // this.accused.push(new FormGroup({
    //   
    // }))
    // console.log(this.accused.value);
    if(!this.accusedForm.valid){
      this.accusedForm.markAllAsTouched();
      this.notify.showNotification('info' , constants.ALL_MANDATE);
      return
    }
    let form = this.accusedForm.value;
    this.accusedList.push({
      name : form.accusedName,
      address : form.accusedAddress,
      age : form.accusedAge,
      gender : form.accusedGender,
      status : form.accusedStatus,
      remark : form.accusedRemark,
    })
    this.accusedForm.reset();
    console.log(this.accusedList);
    
    
  }
  
  
  addVictimWitness(){
    if(!this.victimWitnessForm.valid){
      this.victimWitnessForm.markAllAsTouched();
      this.notify.showNotification('info' , constants.ALL_MANDATE);
      return
    }
    let form = this.victimWitnessForm.value;
    this.victimWitnessList.push({
      name : form.victimWitnessName,
      address : form.victimWitnessAddress,
      age : form.victimWitnessAge,
      gender : form.victimWitnessGender,
      status : form.victimWitnessStatus,
      remark : form.victimWitnessRemark,
    })
    this.accusedForm.reset();
    console.log(this.victimWitnessList);
  }

  removeAccused(i : number){
    console.log(i);
    this.accusedList.splice(i , 1);
    // if(this.accused.length == 1){
    //   this.notify.showNotification('info' , constants.atleastOneAccusedReq);
    //   return
    // }
    // this.accused.removeAt(i)
  }
  
  
  removeVictimWitness(i : number){
    this.victimWitnessList.splice(i , 1);
  }
}
