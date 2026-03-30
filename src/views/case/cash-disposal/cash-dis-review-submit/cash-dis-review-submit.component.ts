// import { Component, inject, Input, OnInit } from '@angular/core';
// import { CommonModule }                      from '@angular/common';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router }                            from '@angular/router';
// import { NgSelectModule }                    from '@ng-select/ng-select';
// import { MatDialog }                         from '@angular/material/dialog';
// import { ApiService }                        from '../../../shared/services/api.service';
// import { UrlService }                        from '../../../shared/services/url.service';
// import { NotificationService }               from '../../../shared/services/notification.service';
// import { DatePickerComponent }               from '../../../shared/components/date-picker/date-picker.component';
// import { ConfirmationPopUpComponent }        from '../../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
// import { DropdownListInterface }             from '../../../shared/model/shared.model';
// import constants                             from '../../../shared/utils/constants';

// // ─── upload file shape ─────────────────────────────────────────────────────
// interface UploadFile {
//   file: File;
//   error?: string;
// }

// // ─── sentence row shape ────────────────────────────────────────────────────
// interface SentenceRow {
//   section:      string;
//   sentenceType: string;
//   period:       string;
//   fine:         string;
//   remarks:      string;
// }

// @Component({
//   selector:     'app-cash-dis-review-submit',
//   standalone:   true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     FormsModule,
//     NgSelectModule,
//     DatePickerComponent,
//   ],
//   templateUrl: './cash-dis-review-submit.component.html',
//   styleUrl:    './cash-dis-review-submit.component.css'
// })
// export class CashDisReviewSubmitComponent implements OnInit {

//   // ===================== SERVICES =====================
//   api    = inject(ApiService);
//   url    = inject(UrlService);
//   notify = inject(NotificationService);
//   router = inject(Router);
//   dialog = inject(MatDialog);

//   // ===================== INPUTS =====================
//   @Input() caseId: any;

//   // ===================== STATIC DROPDOWN DATA =====================
//   decisionTypeDropdown: DropdownListInterface[] = [
//     { value: '1', text: 'Acquittal (दोष मुक्ति)'  },
//     { value: '2', text: 'Conviction (दोषसिद्धि)'  },
//   ];


//   decisionReasonDropdown: DropdownListInterface[] = [
//     { value: '1', text: 'Lack of Evidence (साक्ष्य का अभाव)' },
//     { value: '2', text: 'Benefit of Doubt (संदेह का लाभ)'    },
//   ];

//   yesNoDropdown: DropdownListInterface[] = [
//     { value: 'yes', text: 'Yes' },
//     { value: 'no',  text: 'No'  },
//   ];

//   groundsForAppealDropdown: DropdownListInterface[] = [
//     { value: 'legal_error',      text: 'Legal Error'      },
//     { value: 'evidence_issue',   text: 'Evidence Issue'   },
//     { value: 'other',            text: 'Other'            },
//   ];

//   // ===================== FILE UPLOAD =====================
//   judgementFile:   UploadFile | null = null;
//   judgementPreviewUrl: string        = '';

//   // ===================== SENTENCE LIST =====================
//   sentenceList:        SentenceRow[] = [];
//   isEditingSentence:   boolean       = false;
//   editingSentenceIndex: number       = -1;

//   /** Temp model for ngModel-bound sentence input row */
//   sentenceTemp: SentenceRow = this.emptySentence();

//   // ===================== MAIN FORM =====================
//   caseSubmitForm: FormGroup = new FormGroup({
//     // Section 1 – Decision classification
//     decisionType:        new FormControl(null, Validators.required),
//     decisionReason:      new FormControl(null, Validators.required),
//     briefSummary:        new FormControl(null),
//     convictedSections:   new FormControl(null),

//     // Section 3 – विशुद्ध CONSTET CASE
//     isConsteCase:        new FormControl(null, Validators.required),
//     rulingCount:         new FormControl(null),
//     kishanBhaiProceeding:new FormControl(null),

//     // Section 4 – Dispatch & Appeal
//     dispatchRegNo:       new FormControl(null),
//     dispatchDate:        new FormControl(null),
//     appealProposed:      new FormControl(null, Validators.required),
//     // Appeal sub-fields (enabled only when appealProposed === 'yes')
//     dateOfRecommendation: new FormControl(null),
//     appealDispatchRegNo:  new FormControl(null),
//     groundsForAppeal:     new FormControl(null),
//     appealNotes:          new FormControl(null),

//     // Section 5 – Linked Case Info
//     linkedCnr:           new FormControl(null),
//     transferredCaseNo:   new FormControl(null),
//     linkedCaseRemarks:   new FormControl(null),

//     // Section 6 – Certified Copy
//     certifiedCopyAppDate:    new FormControl(null),
//     certifiedCopyReceiveDate: new FormControl(null),

//     // Remarks
//     remarks: new FormControl('', Validators.required),
//   });

//   // ===================== LIFECYCLE =====================
//   ngOnInit(): void {
//     const today = new Date().toISOString().split('T')[0];

//     // Auto-fill date fields
//     this.caseSubmitForm.patchValue({
//       dispatchDate:             today,
//       dateOfRecommendation:     today,
//       certifiedCopyAppDate:     today,
//       certifiedCopyReceiveDate: today,
//     });
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // UTILITY
//   // ─────────────────────────────────────────────────────────────────────────

//   private emptySentence(): SentenceRow {
//     return { section: '', sentenceType: '', period: '', fine: '', remarks: '' };
//   }

//   /** Allow only numeric key presses */
//   onlyNumeric(event: KeyboardEvent): boolean {
//     return /[0-9]/.test(event.key);
//   }

//   onBack(): void {
//     this.router.navigate(['/case/complaint-register/complain-register-details']);
//   }

//   onClear(): void {
//     const today = new Date().toISOString().split('T')[0];
//     this.caseSubmitForm.reset();
//     this.caseSubmitForm.patchValue({
//       dispatchDate:             today,
//       dateOfRecommendation:     today,
//       certifiedCopyAppDate:     today,
//       certifiedCopyReceiveDate: today,
//     });
//     this.sentenceList         = [];
//     this.sentenceTemp         = this.emptySentence();
//     this.isEditingSentence    = false;
//     this.editingSentenceIndex = -1;
//     this.judgementFile        = null;
//     this.judgementPreviewUrl  = '';
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // SENTENCE LIST  (mirrors Person section in ComplainRegisterComponent)
//   // ─────────────────────────────────────────────────────────────────────────

//   addSentence(): void {
//     const { section, sentenceType, period } = this.sentenceTemp;

//     if (!section || !sentenceType || !period) {
//       this.notify.showNotification('info', constants.allFieldsReq);
//       return;
//     }

//     const row: SentenceRow = { ...this.sentenceTemp };

//     if (this.isEditingSentence && this.editingSentenceIndex !== -1) {
//       this.sentenceList[this.editingSentenceIndex] = row;
//       this.notify.showNotification('success', 'Sentence updated successfully');
//     } else {
//       this.sentenceList.push(row);
//       this.notify.showNotification('success', 'Sentence added successfully');
//     }

//     this.sentenceTemp         = this.emptySentence();
//     this.isEditingSentence    = false;
//     this.editingSentenceIndex = -1;
//   }

//   editSentence(index: number): void {
//     this.isEditingSentence    = true;
//     this.editingSentenceIndex = index;
//     this.sentenceTemp         = { ...this.sentenceList[index] };
//   }

//   cancelSentenceEdit(): void {
//     this.sentenceTemp         = this.emptySentence();
//     this.isEditingSentence    = false;
//     this.editingSentenceIndex = -1;
//   }

//   confirmRemoveSentence(index: number): void {
//     const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
//       panelClass: 'confirm-dialog-panel',
//       data:       { msg: constants.confirmDelete }
//     });
//     dialogRef.afterClosed().subscribe((res: any) => {
//       if (res) this.removeSentence(index);
//     });
//   }

//   private removeSentence(index: number): void {
//     this.sentenceList.splice(index, 1);
//     this.notify.showNotification('delete', 'Sentence removed');
//     if (this.editingSentenceIndex === index)       { this.cancelSentenceEdit(); }
//     else if (this.editingSentenceIndex > index)    { this.editingSentenceIndex--; }
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // FILE UPLOAD  (mirrors ComplainRegisterComponent pattern)
//   // ─────────────────────────────────────────────────────────────────────────

//   onFileChange(event: any): void {
//     const file: File = event.target.files[0];
//     if (!file) return;

//     if (this.judgementPreviewUrl) {
//       URL.revokeObjectURL(this.judgementPreviewUrl);
//       this.judgementPreviewUrl = '';
//     }

//     if (file.type !== 'application/pdf') {
//       this.judgementFile = { file, error: 'Only PDF files are allowed' };
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       this.judgementFile = { file, error: 'File size must be less than 5MB' };
//       return;
//     }

//     this.judgementFile       = { file };
//     this.judgementPreviewUrl = URL.createObjectURL(file);
//   }

//   viewFile(): void {
//     if (!this.judgementPreviewUrl) return;
//     window.open(this.judgementPreviewUrl, '_blank');
//   }

//   confirmDeleteFile(): void {
//     const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
//       panelClass: 'confirm-dialog-panel',
//       data:       { msg: 'Are you sure you want to remove this file?' }
//     });
//     dialogRef.afterClosed().subscribe((res: any) => {
//       if (res) {
//         if (this.judgementPreviewUrl) {
//           URL.revokeObjectURL(this.judgementPreviewUrl);
//           this.judgementPreviewUrl = '';
//         }
//         this.judgementFile = null;
//       }
//     });
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // DISPOSE  →  build final JSON and call API
//   // ─────────────────────────────────────────────────────────────────────────

//   /** Public alias kept for CashDisStepperComponent ViewChild call */
//   submitCaseForm(): void { this.onDispose(); }

//   onDispose(): void {

//     // Basic required-field check
//     if (this.caseSubmitForm.invalid) {
//       Object.keys(this.caseSubmitForm.controls).forEach(k =>
//         this.caseSubmitForm.get(k)?.markAsTouched()
//       );
//       this.notify.showNotification('error', 'Please fill all required fields');
//       return;
//     }

//     if (!this.caseSubmitForm.value.remarks?.trim()) {
//       this.notify.showNotification('info', 'Remarks are required before disposing');
//       return;
//     }

//     const v = this.caseSubmitForm.value;

//     /* ── Build the final JSON payload ── */
//     const finalPayload = {

//       // Meta
//       caseId:   this.caseId,
//       steps:    '5',
//       caseStatus: '1',

//       // Section 1
//       decisionType:      v.decisionType,
//       decisionReason:    v.decisionReason,
//       briefSummary:      v.briefSummary      || '',
//       convictedSections: v.convictedSections || '',

//       // Section 2 – Sentence rows
//       sentenceDetails: this.sentenceList.map(row => ({
//         section:      row.section,
//         sentenceType: row.sentenceType,
//         period:       row.period,
//         fine:         row.fine        || '',
//         remarks:      row.remarks     || '',
//       })),

//       // Section 3 – विशुद्ध CONSTET CASE
//       isConsteCase:         v.isConsteCase,
//       rulingCount:          v.rulingCount          || null,
//       kishanBhaiProceeding: v.kishanBhaiProceeding || null,

//       // Section 4 – Dispatch & Appeal
//       dispatchRegNo:   v.dispatchRegNo || '',
//       dispatchDate:    v.dispatchDate  || '',
//       appealProposed:  v.appealProposed,
//       // Appeal sub-fields (only meaningful when appealProposed === 'yes')
//       ...(v.appealProposed === 'yes' && {
//         dateOfRecommendation: v.dateOfRecommendation || '',
//         appealDispatchRegNo:  v.appealDispatchRegNo  || '',
//         groundsForAppeal:     v.groundsForAppeal     || '',
//         appealNotes:          v.appealNotes          || '',
//       }),

//       // Section 5 – Linked Case Info
//       linkedCnr:          v.linkedCnr          || '',
//       transferredCaseNo:  v.transferredCaseNo  || '',
//       linkedCaseRemarks:  v.linkedCaseRemarks  || '',

//       // Section 6 – Certified Copy
//       certifiedCopyAppDate:     v.certifiedCopyAppDate     || '',
//       certifiedCopyReceiveDate: v.certifiedCopyReceiveDate || '',
//       judgementCopyFileName:    this.judgementFile?.file?.name || '',

//       // Remarks
//       remarks: v.remarks || '',
//     };

//     console.log('── DISPOSE: Final JSON Payload ──', finalPayload);

//     /* ── POST via FormData (file + json fields) ── */
//     const formData = new FormData();

//     // Append JSON blob so the server can parse the full payload atomically
//     formData.append('payload', JSON.stringify(finalPayload));

//     // Append file separately
//     if (this.judgementFile?.file && !this.judgementFile?.error) {
//       formData.append('JudgementCopyFile', this.judgementFile.file);
//     }

//     this.api.post(this.url.submitReviewCase(), formData).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           this.notify.showNotification('success', res.message || 'Case disposed successfully');
//           setTimeout(() => {
//             this.router.navigate(['/case/complaint-register/complain-register-details']);
//           }, 1500);
//         } else {
//           this.notify.showNotification('error', res.message);
//         }
//       },
//       error: (err: Error) => {
//         this.notify.showNotification('error', constants.apiError);
//         console.error('Dispose API error:', err);
//       }
//     });
//   }
// }

import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router }                            from '@angular/router';
import { NgSelectModule }                    from '@ng-select/ng-select';
import { MatDialog }                         from '@angular/material/dialog';
import { ApiService }                        from '../../../shared/services/api.service';
import { UrlService }                        from '../../../shared/services/url.service';
import { NotificationService }               from '../../../shared/services/notification.service';
import { DatePickerComponent }               from '../../../shared/components/date-picker/date-picker.component';
import { ConfirmationPopUpComponent }        from '../../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { DropdownListInterface }             from '../../../shared/model/shared.model';
import constants                             from '../../../shared/utils/constants';

// ─── upload file shape ─────────────────────────────────────────────────────
interface UploadFile {
  file: File;
  error?: string;
}

// ─── sentence row shape ────────────────────────────────────────────────────
interface SentenceRow {
  section:      string;
  sentenceType: string;
  period:       string;
  fine:         string;
  remarks:      string;
}

@Component({
  selector:     'app-cash-dis-review-submit',
  standalone:   true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    DatePickerComponent,
  ],
  templateUrl: './cash-dis-review-submit.component.html',
  styleUrl:    './cash-dis-review-submit.component.css'
})
export class CashDisReviewSubmitComponent implements OnInit {

  // ===================== SERVICES =====================
  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);
  router = inject(Router);
  dialog = inject(MatDialog);

  // ===================== INPUTS =====================
  @Input() caseId: any;

  // ===================== DYNAMIC DROPDOWN DATA =====================
  decisionTypeDropdown:   DropdownListInterface[] = [];   // loaded on init
  decisionReasonDropdown: DropdownListInterface[] = [];   // loaded on type change

  // ===================== STATIC DROPDOWN DATA =====================
  yesNoDropdown: DropdownListInterface[] = [
    { value: 'yes', text: 'Yes' },
    { value: 'no',  text: 'No'  },
  ];

  groundsForAppealDropdown: DropdownListInterface[] = [
    { value: 'legal_error',    text: 'Legal Error'    },
    { value: 'evidence_issue', text: 'Evidence Issue' },
    { value: 'other',          text: 'Other'          },
  ];

  // ===================== FILE UPLOAD =====================
  judgementFile:       UploadFile | null = null;
  judgementPreviewUrl: string            = '';

  // ===================== SENTENCE LIST =====================
  sentenceList:         SentenceRow[] = [];
  isEditingSentence:    boolean       = false;
  editingSentenceIndex: number        = -1;

  sentenceTemp: SentenceRow = this.emptySentence();

  // ===================== MAIN FORM =====================
  caseSubmitForm: FormGroup = new FormGroup({
    decisionType:         new FormControl(null, Validators.required),
    decisionReason:       new FormControl(null, Validators.required),
    briefSummary:         new FormControl(null),
    convictedSections:    new FormControl(null),

    isConsteCase:         new FormControl(null, Validators.required),
    rulingCount:          new FormControl(null),
    kishanBhaiProceeding: new FormControl(null),

    dispatchRegNo:        new FormControl(null),
    dispatchDate:         new FormControl(null),
    appealProposed:       new FormControl(null, Validators.required),
    dateOfRecommendation: new FormControl(null),
    appealDispatchRegNo:  new FormControl(null),
    groundsForAppeal:     new FormControl(null),
    appealNotes:          new FormControl(null),

    linkedCnr:            new FormControl(null),
    transferredCaseNo:    new FormControl(null),
    linkedCaseRemarks:    new FormControl(null),

    certifiedCopyAppDate:     new FormControl(null),
    certifiedCopyReceiveDate: new FormControl(null),

    remarks: new FormControl('', Validators.required),
  });

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.caseSubmitForm.patchValue({
      dispatchDate:             today,
      dateOfRecommendation:     today,
      certifiedCopyAppDate:     today,
      certifiedCopyReceiveDate: today,
    });

    // Load Decision Type dropdown on page load
    this.getDecisionTypeDropdown();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DROPDOWN API FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────

  /** Load Decision Type list — called once on ngOnInit */
  getDecisionTypeDropdown(): void {
    this.api.get(this.url.getDecisionTypeDropDownlist()).subscribe({    
      next: (res: any) => {
        this.decisionTypeDropdown = (res.data || []).map((item: any) => ({
          value: item.value,
          text:  item.text,
        }));
      },
      error: (err: Error) => { throw new Error(err?.message); }
    });
  }

  getDecisionReasonDropdown(decisionTypeId: any): void {
    this.decisionReasonDropdown = [];
    this.caseSubmitForm.get('decisionReason')!.reset(null);

    if (!decisionTypeId) return;

    // this.api.post('/PcmsMaster/CaseDecisionReason/GetReasonDropdown',
    //   { DecisionTypeId: decisionTypeId }
    // ).subscribe({
     this.api.get(this.url.getReasonDropdown(decisionTypeId)).subscribe({    
      next: (res: any) => {
        this.decisionReasonDropdown = (res.data || []).map((item: any) => ({
          value: item.value,
          text:  item.text,
        }));
      },
      error: (err: Error) => { throw new Error(err?.message); }
    });
  }

 
  private emptySentence(): SentenceRow {
    return { section: '', sentenceType: '', period: '', fine: '', remarks: '' };
  }

  onlyNumeric(event: KeyboardEvent): boolean {
    return /[0-9]/.test(event.key);
  }

  onBack(): void {
    this.router.navigate(['/case/complaint-register/complain-register-details']);
  }

  onClear(): void {
    const today = new Date().toISOString().split('T')[0];
    this.caseSubmitForm.reset();
    this.caseSubmitForm.patchValue({
      dispatchDate:             today,
      dateOfRecommendation:     today,
      certifiedCopyAppDate:     today,
      certifiedCopyReceiveDate: today,
    });
    this.decisionReasonDropdown   = [];
    this.sentenceList             = [];
    this.sentenceTemp             = this.emptySentence();
    this.isEditingSentence        = false;
    this.editingSentenceIndex     = -1;
    this.judgementFile            = null;
    this.judgementPreviewUrl      = '';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SENTENCE LIST
  // ─────────────────────────────────────────────────────────────────────────

  addSentence(): void {
    const { section, sentenceType, period } = this.sentenceTemp;
    if (!section || !sentenceType || !period) {
      this.notify.showNotification('info', constants.allFieldsReq);
      return;
    }
    const row: SentenceRow = { ...this.sentenceTemp };
    if (this.isEditingSentence && this.editingSentenceIndex !== -1) {
      this.sentenceList[this.editingSentenceIndex] = row;
      this.notify.showNotification('success', 'Sentence updated successfully');
    } else {
      this.sentenceList.push(row);
      this.notify.showNotification('success', 'Sentence added successfully');
    }
    this.sentenceTemp         = this.emptySentence();
    this.isEditingSentence    = false;
    this.editingSentenceIndex = -1;
  }

  editSentence(index: number): void {
    this.isEditingSentence    = true;
    this.editingSentenceIndex = index;
    this.sentenceTemp         = { ...this.sentenceList[index] };
  }

  cancelSentenceEdit(): void {
    this.sentenceTemp         = this.emptySentence();
    this.isEditingSentence    = false;
    this.editingSentenceIndex = -1;
  }

  confirmRemoveSentence(index: number): void {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      panelClass: 'confirm-dialog-panel',
      data:       { msg: constants.confirmDelete }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) this.removeSentence(index);
    });
  }

  private removeSentence(index: number): void {
    this.sentenceList.splice(index, 1);
    this.notify.showNotification('delete', 'Sentence removed');
    if (this.editingSentenceIndex === index)    { this.cancelSentenceEdit(); }
    else if (this.editingSentenceIndex > index) { this.editingSentenceIndex--; }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FILE UPLOAD
  // ─────────────────────────────────────────────────────────────────────────

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
    if (this.judgementPreviewUrl) {
      URL.revokeObjectURL(this.judgementPreviewUrl);
      this.judgementPreviewUrl = '';
    }
    if (file.type !== 'application/pdf') {
      this.judgementFile = { file, error: 'Only PDF files are allowed' };
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.judgementFile = { file, error: 'File size must be less than 5MB' };
      return;
    }
    this.judgementFile       = { file };
    this.judgementPreviewUrl = URL.createObjectURL(file);
  }

  viewFile(): void {
    if (!this.judgementPreviewUrl) return;
    window.open(this.judgementPreviewUrl, '_blank');
  }

  confirmDeleteFile(): void {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      panelClass: 'confirm-dialog-panel',
      data:       { msg: 'Are you sure you want to remove this file?' }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (this.judgementPreviewUrl) {
          URL.revokeObjectURL(this.judgementPreviewUrl);
          this.judgementPreviewUrl = '';
        }
        this.judgementFile = null;
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DISPOSE
  // ─────────────────────────────────────────────────────────────────────────

  submitCaseForm(): void { this.onDispose(); }

  onDispose(): void {
    if (this.caseSubmitForm.invalid) {
      Object.keys(this.caseSubmitForm.controls).forEach(k =>
        this.caseSubmitForm.get(k)?.markAsTouched()
      );
      this.notify.showNotification('error', 'Please fill all required fields');
      return;
    }

    if (!this.caseSubmitForm.value.remarks?.trim()) {
      this.notify.showNotification('info', 'Remarks are required before disposing');
      return;
    }

    const v = this.caseSubmitForm.value;

    const finalPayload = {
      caseId:     this.caseId,
      steps:      '5',
      caseStatus: '1',

      decisionType:      v.decisionType,
      decisionReason:    v.decisionReason,
      briefSummary:      v.briefSummary      || '',
      convictedSections: v.convictedSections || '',

      sentenceDetails: this.sentenceList.map(row => ({
        section:      row.section,
        sentenceType: row.sentenceType,
        period:       row.period,
        fine:         row.fine    || '',
        remarks:      row.remarks || '',
      })),

      isConsteCase:         v.isConsteCase,
      rulingCount:          v.rulingCount          || null,
      kishanBhaiProceeding: v.kishanBhaiProceeding || null,

      dispatchRegNo:  v.dispatchRegNo || '',
      dispatchDate:   v.dispatchDate  || '',
      appealProposed: v.appealProposed,
      ...(v.appealProposed === 'yes' && {
        dateOfRecommendation: v.dateOfRecommendation || '',
        appealDispatchRegNo:  v.appealDispatchRegNo  || '',
        groundsForAppeal:     v.groundsForAppeal     || '',
        appealNotes:          v.appealNotes          || '',
      }),

      linkedCnr:         v.linkedCnr         || '',
      transferredCaseNo: v.transferredCaseNo || '',
      linkedCaseRemarks: v.linkedCaseRemarks || '',

      certifiedCopyAppDate:     v.certifiedCopyAppDate     || '',
      certifiedCopyReceiveDate: v.certifiedCopyReceiveDate || '',
      judgementCopyFileName:    this.judgementFile?.file?.name || '',

      remarks: v.remarks || '',
    };

    console.log('── DISPOSE: Final JSON Payload ──', finalPayload);

    const formData = new FormData();
    formData.append('payload', JSON.stringify(finalPayload));
    if (this.judgementFile?.file && !this.judgementFile?.error) {
      formData.append('JudgementCopyFile', this.judgementFile.file);
    }

    this.api.post(this.url.submitReviewCase(), formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.message || 'Case disposed successfully');
          setTimeout(() => {
            this.router.navigate(['/case/complaint-register/complain-register-details']);
          }, 1500);
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        console.error('Dispose API error:', err);
      }
    });
  }
}