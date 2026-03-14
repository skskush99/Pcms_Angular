import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CashDisIdentificationComponent } from '../cash-dis-identification/cash-dis-identification.component';
import { CashDisChargesSheetComponent } from '../cash-dis-charges-sheet/cash-dis-charges-sheet.component';
import { CashDisPartiesComponent } from '../cash-dis-parties/cash-dis-parties.component';
import { CashDisReviewSubmitComponent } from '../cash-dis-review-submit/cash-dis-review-submit.component';
import { CaseDisFileComponent } from '../case-dis-file/case-dis-file.component';


@Component({
  selector: 'app-cash-dis-stepper',
  standalone: true,
  imports: [
    CommonModule,
    CashDisIdentificationComponent,
    CashDisChargesSheetComponent,
    CashDisPartiesComponent,
    CaseDisFileComponent,
    CashDisReviewSubmitComponent
  ],
  templateUrl: './cash-dis-stepper.component.html',
  styleUrl: './cash-dis-stepper.component.css'
})
export class CashDisStepperComponent implements OnInit {

  // ===================== STATE =====================
  currentForm: number = 1;
  caseId: number = 0;
  caseData: any;
  prevRoute: string = '';
  ifCaseRegisterd: boolean = false;
  withoutCaseNoReg: boolean = false;
  ifDecidedFirstHearing: boolean = false;
  ifUpdateAddDecision: boolean = false;
  firstHearing: boolean = false;
  firstHearingCaseEntered: boolean = false;
  submitFormClicked: number = 0;

  formsName: string[] = [
    'Case Identification',
    'FIR & Charge Sheet',
    'Parties',
    'Case File',
    'Disposed Case'
  ];

  // ===================== VIEW CHILDREN =====================
  @ViewChild(CashDisIdentificationComponent) caseIdentification!: CashDisIdentificationComponent;
  @ViewChild(CashDisChargesSheetComponent) firChargeSheet!: CashDisChargesSheetComponent;
  @ViewChild(CashDisPartiesComponent) caseParties!: CashDisPartiesComponent;
  @ViewChild(CaseDisFileComponent) caseFile!: CaseDisFileComponent;
  @ViewChild(CashDisReviewSubmitComponent) reviewSubmit!: CashDisReviewSubmitComponent;
  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.caseData = history.state?.caseData;
    this.prevRoute = history.state?.prevRoute;

    if (this.caseData) {
      this.caseId = this.caseData?.DirRegId;
      this.currentForm = this.caseData?.Steps || 1;
    }
  }

  // ===================== NAVIGATION =====================
  saveAndNext(caseId?: any): void {
    if (!this.caseId) this.caseId = caseId;
    this.currentForm += 1;
  }

  formPrev(): void {
    if (this.currentForm > 1) this.currentForm -= 1;
  }

  formNext(): void {
    switch (this.currentForm) {
      case 1: this.caseIdentification.regCaseIdentification(); break;
      case 2: this.firChargeSheet.addEditChargeSheet();        break;
      case 3: this.caseParties.regCaseParties();               break;
      case 4: this.caseFile.submitCasefile();               break;
      case 5: this.reviewSubmit.submitCaseForm();              break;
      default: break;
    }
  }
}