import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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


  statusDropdown : DropdownListInterface[] = [];



  restrictKeys = inject(WordsRestrictService);
  notify = inject(NotificationService);

  pariesForm : FormGroup = new FormGroup({
    accused : new FormArray([]),
    victims : new FormArray([]),
    witness : new FormArray([]),
  })



  ngOnInit(): void {
    this.addAccused();
    this.addVictim();
  }


  get accused(){
    return this.pariesForm.get('accused') as FormArray;
  }
  
  
  get victims(){
    return this.pariesForm.get('victims') as FormArray;
  }


  addAccused(){
    this.accused.push(new FormGroup({
      accusedName : new FormControl(''),
      accusedAddress : new FormControl(''),
      accusedAge : new FormControl(''),
      accusedGender : new FormControl(''),
      accusedStatus : new FormControl(null),
      accusedRemark : new FormControl(''),
    }))
    console.log(this.accused.value);
    
  }
  
  
  addVictim(){
    this.victims.push(new FormGroup({
      victimName : new FormControl(''),
      victimAddress : new FormControl(''),
      victimAge : new FormControl(''),
      victimGender : new FormControl(""),
      victimStatus : new FormControl(null),
      victimRemark : new FormControl(''),
    }))
    console.log(this.victims.value);
    
  }

  removeAccused(i : number){
    if(this.accused.length == 1){
      this.notify.showNotification('info' , constants.atleastOneAccusedReq);
      return
    }
    this.accused.removeAt(i)
  }
  
  
  removeVictim(i : number){
    if(this.victims.length == 1){
      this.notify.showNotification('info' , constants.atLeastOneVictimReq);
      return
    }
    this.victims.removeAt(i)
  }
}
