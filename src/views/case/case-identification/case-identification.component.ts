import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { createYearList } from '../../shared/utils/utils';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-case-identification',
  standalone: true,
  imports: [NgSelectModule , ReactiveFormsModule],
  templateUrl: './case-identification.component.html',
  styleUrl: './case-identification.component.css'
})
export class CaseIdentificationComponent implements OnInit{

  thanaDropdown : DropdownListInterface[] = [];
  firYearDropdown : DropdownListInterface[] = [];



  caseIdentificationForm : FormGroup = new FormGroup({
    regType : new FormControl("diar"),
    searchCaseVia : new FormControl("fir"),
    thana : new FormControl(null),
    firNo : new FormControl(""),
    firYear : new FormControl(null),
    cnrNo : new FormControl(""),
  })


  ngOnInit(): void {
    this.firYearDropdown = createYearList(1950);
  }
}
