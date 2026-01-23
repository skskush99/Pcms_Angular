import { Component } from '@angular/core';
import { DatePickerComponent } from "../../shared/components/date-picker/date-picker.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complain-register',
  standalone: true,
  imports: [DatePickerComponent , NgSelectModule , ReactiveFormsModule , CommonModule],
  templateUrl: './complain-register.component.html',
  styleUrl: './complain-register.component.css'
})
export class ComplainRegisterComponent {

  complaintTypeDropdown : DropdownListInterface[] = [];

  complaintRegForm : FormGroup = new FormGroup({
    descOffence : new FormControl(''),
    complaintNo : new FormControl(''),
    complaintDate : new FormControl(''),
    complaintType : new FormControl(''),
    classification : new FormControl(''),
    actUnderOffence : new FormControl(''),
    section : new FormControl(''),
    searchByCaseId : new FormControl(""),
    personDetailCaseFiledForm : new FormArray([]),
  })








  get personDetailCaseFiledForm(){
    return this.complaintRegForm.get('personDetailCaseFiledForm') as FormArray
  }


  addPersonDetailCaseFiled(){
    this.personDetailCaseFiledForm.push(new FormGroup({
      caseFiledAgainstName : new FormControl(''),
      caseFiledAgainstAddress : new FormControl(''),
      caseFiledAgainstDesignation : new FormControl(''),
      caseFiledAgainstInstituation : new FormControl(''),
    }))
  }

  removePersonDetailCaseFiled(i : number){
    this.personDetailCaseFiledForm.removeAt(i)
  }
}
