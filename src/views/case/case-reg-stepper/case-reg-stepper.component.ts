import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CaseIdentificationComponent } from '../case-identification/case-identification.component';
import { FirChargesSheetComponent }    from '../fir-charges-sheet/fir-charges-sheet.component';
import { CasePartiesComponent }        from '../case-parties/case-parties.component';
import { CaseReviewSubmitComponent }   from '../case-review-submit/case-review-submit.component';

@Component({
  selector: 'app-case-reg-stepper',
  standalone: true,
  imports: [ CommonModule, CaseIdentificationComponent, FirChargesSheetComponent, CasePartiesComponent, CaseReviewSubmitComponent ],
  templateUrl: './case-reg-stepper.component.html',
  styleUrl: './case-reg-stepper.component.css'
})
export class CaseRegStepperComponent implements OnInit {

  currentForm = 1;
  caseId      = 0;
  caseData:   any;
  prevRoute   = '';
  ifCaseRegisterd = false; withoutCaseNoReg = false; ifDecidedFirstHearing = false;
  ifUpdateAddDecision = false; firstHearing = false; firstHearingCaseEntered = false;
  submitFormClicked = 0;

  step1Unlocked = false;

  /** CCTNS data stored here and passed as @Input to all child steps */
  cctnsData: any = null;

  /**
   * '1' = Diar Register  (default — requires CCTNS)
   * '2' = Final Register FR  (no CCTNS, Save & Next always enabled)
   */
  regType: string = '1';

  formsName = ['Case Identification', 'FIR & Charge Sheet', 'Parties', 'Review & Submit'];

  @ViewChild(CaseIdentificationComponent) caseIdentification!: CaseIdentificationComponent;
  @ViewChild(FirChargesSheetComponent)    firChargeSheet!:      FirChargesSheetComponent;
  @ViewChild(CasePartiesComponent)        caseParties!:         CasePartiesComponent;
  @ViewChild(CaseReviewSubmitComponent)   reviewSubmit!:        CaseReviewSubmitComponent;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.caseData  = history.state?.caseData;
    this.prevRoute = history.state?.prevRoute;
    if (this.caseData) {
      this.caseId      = this.caseData?.DirRegId;
      this.currentForm = this.caseData?.Steps || 1;
      if (this.caseData?.Steps > 1) this.step1Unlocked = true;
    }
  }

  /**
   * Called when CaseIdentificationComponent emits (cctnsDataReceived)
   * For FR (regType='2') this emits null — but step1 is already unlocked via regTypeChanged
   */
  onCctnsDataReceived(data: any): void {
    this.step1Unlocked = !!data;
    this.cctnsData     = data;
  }

  /**
   * Called when user changes Register Type radio in CaseIdentificationComponent
   * FR selected → unlock Save & Next immediately, no CCTNS needed
   */
  onRegTypeChanged(type: string): void {
    this.regType = type;
    if (type === '2') {
      this.step1Unlocked = true;
      this.cctnsData     = null;   // clear any previous CCTNS data
    } else {
      // Diar Register — re-lock until CCTNS fetched
      this.step1Unlocked = false;
      this.cctnsData     = null;
    }
  }

  navigateToCaseList(): void { this.router.navigateByUrl('/case/case-list'); }

  saveAndNext(caseId?: any): void {
    if (!this.caseId) this.caseId = caseId;
    this.currentForm += 1;
  }

  formPrev(): void { if (this.currentForm > 1) this.currentForm -= 1; }

  formNext(): void {
    if (this.currentForm === 1 && !this.step1Unlocked) return;
    switch (this.currentForm) {
      case 1: this.caseIdentification.regCaseIdentification(); break;
      case 2: this.firChargeSheet.addEditChargeSheet();        break;
      case 3: this.caseParties.regCaseParties();               break;
      case 4: this.reviewSubmit.submitCaseForm();              break;
    }
  }
}