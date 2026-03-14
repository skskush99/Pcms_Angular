import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';                                          // ← added
import { CaseIdentificationComponent } from '../case-identification/case-identification.component';
import { FirChargesSheetComponent }    from '../fir-charges-sheet/fir-charges-sheet.component';
import { CasePartiesComponent }        from '../case-parties/case-parties.component';
import { CaseReviewSubmitComponent }   from '../case-review-submit/case-review-submit.component';

@Component({
  selector: 'app-case-reg-stepper',
  standalone: true,
  imports: [
    CommonModule,
    CaseIdentificationComponent,
    FirChargesSheetComponent,
    CasePartiesComponent,
    CaseReviewSubmitComponent
  ],
  templateUrl: './case-reg-stepper.component.html',
  styleUrl: './case-reg-stepper.component.css'
})
export class CaseRegStepperComponent implements OnInit {

  // ===================== STATE =====================
  currentForm:             number  = 1;
  caseId:                  number  = 0;
  caseData:                any;
  prevRoute:               string  = '';
  ifCaseRegisterd:         boolean = false;
  withoutCaseNoReg:        boolean = false;
  ifDecidedFirstHearing:   boolean = false;
  ifUpdateAddDecision:     boolean = false;
  firstHearing:            boolean = false;
  firstHearingCaseEntered: boolean = false;
  submitFormClicked:       number  = 0;

  formsName: string[] = [
    'Case Identification',
    'FIR & Charge Sheet',
    'Parties',
    'Review & Submit'
  ];

  // ===================== VIEW CHILDREN =====================
  @ViewChild(CaseIdentificationComponent) caseIdentification!: CaseIdentificationComponent;
  @ViewChild(FirChargesSheetComponent)    firChargeSheet!:      FirChargesSheetComponent;
  @ViewChild(CasePartiesComponent)        caseParties!:         CasePartiesComponent;
  @ViewChild(CaseReviewSubmitComponent)   reviewSubmit!:        CaseReviewSubmitComponent;

  // ===================== CONSTRUCTOR =====================
  constructor(private router: Router) {}               // ← Router injected

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.caseData  = history.state?.caseData;
    this.prevRoute = history.state?.prevRoute;

    if (this.caseData) {
      this.caseId      = this.caseData?.DirRegId;
      this.currentForm = this.caseData?.Steps || 1;
    }
  }

  // ===================== NAVIGATION =====================

  /** Redirect to Case List — used by Back (step 1) and after final Submit */
  navigateToCaseList(): void {
    this.router.navigateByUrl('/case/case-list');
  }

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
      case 4: this.reviewSubmit.submitCaseForm();              break;   // child emits (caseSubmitted) → navigateToCaseList()
      default: break;
    }
  }
}