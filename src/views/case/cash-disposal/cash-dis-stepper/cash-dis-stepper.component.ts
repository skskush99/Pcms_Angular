
// import { CommonModule } from '@angular/common';
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { CashDisIdentificationComponent } from '../cash-dis-identification/cash-dis-identification.component';
// import { CashDisChargesSheetComponent } from '../cash-dis-charges-sheet/cash-dis-charges-sheet.component';
// import { CashDisPartiesComponent } from '../cash-dis-parties/cash-dis-parties.component';
// import { CashDisReviewSubmitComponent } from '../cash-dis-review-submit/cash-dis-review-submit.component';
// import { CaseDisFileComponent } from '../case-dis-file/case-dis-file.component';

// @Component({
//   selector: 'app-cash-dis-stepper',
//   standalone: true,
//   imports: [
//     CommonModule,
//     CashDisIdentificationComponent,
//     CashDisChargesSheetComponent,
//     CashDisPartiesComponent,
//     CaseDisFileComponent,
//     CashDisReviewSubmitComponent
//   ],
//   templateUrl: './cash-dis-stepper.component.html',
//   styleUrl: './cash-dis-stepper.component.css'
// })
// export class CashDisStepperComponent implements OnInit {

//   // ===================== STATE =====================
//   currentForm : number = 1;
//   caseId      : number = 0;
//   caseData    : any    = null;
//   prevRoute   : string = '';

//   formsName: string[] = [
//     'Case Identification',
//     'FIR & Charge Sheet',
//     'Parties',
//     'Case File',
//     'Disposed Case'
//   ];

//   // ===================== VIEW CHILDREN =====================
//   @ViewChild(CashDisIdentificationComponent) caseIdentification!: CashDisIdentificationComponent;
//   @ViewChild(CashDisChargesSheetComponent)   firChargeSheet!: CashDisChargesSheetComponent;
//   @ViewChild(CashDisPartiesComponent)        caseParties!: CashDisPartiesComponent;
//   @ViewChild(CaseDisFileComponent)           caseFile!: CaseDisFileComponent;
//   @ViewChild(CashDisReviewSubmitComponent)   reviewSubmit!: CashDisReviewSubmitComponent;

//   // ===================== LIFECYCLE =====================
//   ngOnInit(): void {
//     const state    = history.state;
//     this.caseData  = state?.caseData  ?? null;
//     this.prevRoute = state?.prevRoute ?? '';

//     if (this.caseData) {
//       this.caseId      = this.caseData?.DirRegId ?? 0;
//       this.currentForm = 1; // always start from step 1 to review data
//     }
//   }

//   // ===================== NAVIGATION =====================
//   /** Called by child @Output events – kept for new-record flow compatibility */
//   saveAndNext(caseId?: any): void {
//     if (caseId && !this.caseId) this.caseId = caseId;
//     if (this.currentForm < this.formsName.length) {
//       this.currentForm += 1;
//     }
//   }

//   formPrev(): void {
//     if (this.currentForm > 1) this.currentForm -= 1;
//   }

//   /**
//    * Steps 1–4  → just move to the next step (no API call).
//    * Step 5     → call submitCaseForm() for final disposal.
//    */
//   formNext(): void {
//     if (this.currentForm === this.formsName.length) {
//       this.reviewSubmit?.submitCaseForm();
//     } else {
//       this.currentForm += 1;
//     }
//   }
// }

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
  caseId:      number = 0;
  caseData:    any    = null;
  prevRoute:   string = '';

  formsName: string[] = [
    'Case Identification',
    'FIR & Charge Sheet',
    'Parties',
    'Case File',
    'Disposed Case'
  ];

  // ===================== VIEW CHILDREN =====================
  @ViewChild(CashDisIdentificationComponent) caseIdentification!: CashDisIdentificationComponent;
  @ViewChild(CashDisChargesSheetComponent)   firChargeSheet!: CashDisChargesSheetComponent;
  @ViewChild(CashDisPartiesComponent)        caseParties!: CashDisPartiesComponent;
  @ViewChild(CaseDisFileComponent)           caseFile!: CaseDisFileComponent;
  @ViewChild(CashDisReviewSubmitComponent)   reviewSubmit!: CashDisReviewSubmitComponent;

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    const state    = history.state;
    this.caseData  = state?.caseData  ?? null;
    this.prevRoute = state?.prevRoute ?? '';

    if (this.caseData) {
      this.caseId      = this.caseData?.DirRegId ?? 0;
      this.currentForm = 1; // हमेशा step 1 से start
    }
  }

  // ===================== NAVIGATION =====================
  saveAndNext(caseId?: any): void {
    if (caseId && !this.caseId) {
      this.caseId = caseId;
    }
    if (this.currentForm < this.formsName.length) {
      this.currentForm += 1;
    }
  }

  formPrev(): void {
    if (this.currentForm > 1) {
      this.currentForm -= 1;
    }
  }

  formNext(): void {
    if (this.currentForm === this.formsName.length) {
      this.reviewSubmit?.submitCaseForm();
    } else {
      this.currentForm += 1;
    }
  }
}