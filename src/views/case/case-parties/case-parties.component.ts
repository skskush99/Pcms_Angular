import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { WordsRestrictService } from '../../shared/services/words-restrict.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';
import constants from '../../shared/utils/constants';

/*
  accusedType values
  ─────────────────
  1 = Is the Accused          (default — no extra fields)
  2 = Is the accused Govt. Accused  (Department, Designation, EmployeeId)
  3 = Is the accused an MP/MLA      (MP/MLA dropdown, Constituency, Sanction)
*/

@Component({
  selector: 'app-case-parties',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './case-parties.component.html',
  styleUrl: './case-parties.component.css'
})
export class CasePartiesComponent implements OnInit {

  // ===================== SERVICES =====================
  restrictKeys = inject(WordsRestrictService);
  notify       = inject(NotificationService);
  api          = inject(ApiService);
  url          = inject(UrlService);

  // ===================== INPUTS / OUTPUTS =====================
  @Input()  caseId: any;
  @Output() caseParty = new EventEmitter<any>();

  // ===================== STATE =====================
  statusDropdown:      DropdownListInterface[] = [];
  accusedList:         any[] = [];
  victimWitnessList:   any[] = [];
  accusedEditId:       any;
  victimWitnessEditId: any;
  showConstituencyDetails = false;

  // Sanction document upload state
  sanctionFile:       { file?: File; error?: string } | null = null;
  sanctionPreviewUrl: string | null = null;    // Object URL for preview

  // ===================== STATIC DROPDOWNS =====================
  genderDropdown: DropdownListInterface[] = [
    { value: '1', text: 'Male'   },
    { value: '2', text: 'Female' },
    { value: '3', text: 'Other'  },
  ];

  mpMlaDropdown: DropdownListInterface[] = [
    { value: '1', text: 'None / कोई नहीं'      },
    { value: '2', text: 'MP / सांसद'           },
    { value: '3', text: 'MLA / विधायक'          },
    { value: '4', text: 'Councilor / पार्षद'    },
    { value: '5', text: 'Other / अन्य'          },
  ];

  // ===================== FORMS =====================
  accusedForm: FormGroup = new FormGroup({
    // ── Always required ──
    accusedName:         new FormControl('',   [Validators.required]),
    accusedAddress:      new FormControl('',   [Validators.required]),
    accusedAge:          new FormControl('',   [Validators.required]),
    accusedGender:       new FormControl(null, [Validators.required]),
    accusedStatus:       new FormControl(null, [Validators.required]),
    accusedRemark:       new FormControl('',   [Validators.required]),

    // ── Accused type radio (1 = normal, 2 = govt, 3 = MP/MLA) ──
    accusedType:         new FormControl(1,    [Validators.required]),

    // ── Govt. Accused fields (required when accusedType === 2) ──
    accusedDepartment:   new FormControl(''),
    accusedDesignation:  new FormControl(''),
    accusedEmployeeId:   new FormControl(''),

    // ── MP/MLA fields (required when accusedType === 3) ──
    accusedMpMla:        new FormControl(null),
    constituencyDetails: new FormControl(''),
    isSanctionRequired:  new FormControl(false),   // default → No
  });

  victimWitnessForm: FormGroup = new FormGroup({
    victimWitnessName:    new FormControl('',   [Validators.required]),
    victimWitnessAddress: new FormControl('',   [Validators.required]),
    victimWitnessAge:     new FormControl('',   [Validators.required]),
    victimWitnessGender:  new FormControl(null, [Validators.required]),
    victimWitnessStatus:  new FormControl(null, [Validators.required]),
    victimWitnessRemark:  new FormControl('',   [Validators.required]),
    isVictim:             new FormControl(1),
  });

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.getFirStatusDropdown();
    this.getAccusedList();
    this.getVictimWitnessList();
  }

  // ===================== ACCUSED TYPE RADIO CHANGE =====================

  onAccusedTypeChange(): void {
    const type = this.accusedForm.get('accusedType')?.value;

    // Clear ALL conditional validators first
    this._clearGovtFields();
    this._clearMpMlaFields();
    this.showConstituencyDetails = false;
    this.sanctionFile       = null;
    if (this.sanctionPreviewUrl) { URL.revokeObjectURL(this.sanctionPreviewUrl); this.sanctionPreviewUrl = null; }

    if (type === 2) {
      // Govt. Accused — require dept / designation / employeeId + sanction (default No)
      this._setRequired('accusedDepartment');
      this._setRequired('accusedDesignation');
      this._setRequired('accusedEmployeeId');
      this.accusedForm.get('isSanctionRequired')?.setValue(false);
    }

    if (type === 3) {
      // MP/MLA — require MP/MLA dropdown; sanction defaults to false
      this._setRequired('accusedMpMla');
      this.accusedForm.get('isSanctionRequired')?.setValue(false);
    }
  }

  /** Called when the MP/MLA dropdown value changes */
  onMpMlaChange(): void {
    const val = String(this.accusedForm.get('accusedMpMla')?.value ?? '');
    this.showConstituencyDetails = ['2', '3', '4', '5'].includes(val);

    if (this.showConstituencyDetails) {
      this._setRequired('constituencyDetails');
    } else {
      this._clearField('constituencyDetails', '');
    }
  }

  /** Sanction document file upload handler */
  onSanctionFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    // Revoke previous object URL to avoid memory leaks
    if (this.sanctionPreviewUrl) {
      URL.revokeObjectURL(this.sanctionPreviewUrl);
      this.sanctionPreviewUrl = null;
    }

    if (!allowedTypes.includes(file.type)) {
      this.sanctionFile = { file, error: 'Only PDF files are allowed' };
      return;
    }
    if (file.size > maxSizeBytes) {
      this.sanctionFile = { file, error: 'File size must be less than 5MB' };
      return;
    }

    this.sanctionFile       = { file };
    this.sanctionPreviewUrl = URL.createObjectURL(file);  // create blob URL for preview
  }

  /** Opens the uploaded sanction PDF in a new browser tab */
  previewSanctionFile(): void {
    if (!this.sanctionPreviewUrl) return;
    window.open(this.sanctionPreviewUrl, '_blank');
  }

  /** Clears the sanction file and revokes its preview URL */
  removeSanctionFile(): void {
    if (this.sanctionPreviewUrl) {
      URL.revokeObjectURL(this.sanctionPreviewUrl);
      this.sanctionPreviewUrl = null;
    }
    this.sanctionFile = null;
  }

  // ===================== PRIVATE HELPERS =====================

  private _setRequired(name: string): void {
    const c = this.accusedForm.get(name);
    c?.setValidators([Validators.required]);
    c?.updateValueAndValidity();
  }

  private _clearField(name: string, resetVal: any = null): void {
    const c = this.accusedForm.get(name);
    c?.clearValidators();
    c?.setValue(resetVal);
    c?.updateValueAndValidity();
  }

  private _clearGovtFields(): void {
    this._clearField('accusedDepartment',  '');
    this._clearField('accusedDesignation', '');
    this._clearField('accusedEmployeeId',  '');
  }

  private _clearMpMlaFields(): void {
    this._clearField('accusedMpMla',        null);
    this._clearField('constituencyDetails', '');
    this._clearField('isSanctionRequired',  false);
  }

  // ===================== UTILS =====================

  compareWithFunc(a: any, b: any): boolean {
    return a?.['value'] ? a['value'] == b : false;
  }

  getMpMlaLabel(value: any): string {
    if (!value) return '—';
    return this.mpMlaDropdown.find(x => x.value == String(value))?.text ?? '—';
  }

  getAccusedTypeLabel(type: number): string {
    const map: Record<number, string> = {
      1: 'Accused',
      2: 'Govt. Accused',
      3: 'MP / MLA',
    };
    return map[type] ?? '—';
  }

  // ===================== DROPDOWN =====================
  getFirStatusDropdown(): void {
    this.api.get(this.url.getFirStatusDropdown()).subscribe({
      next:  (res: any) => { this.statusDropdown = res.data; },
      error: (err: Error) => { throw new Error(err?.message); }
    });
  }

  // ===================== ACCUSED CRUD =====================

  addAccused(): void {
    if (!this.accusedForm.valid) {
      this.accusedForm.markAllAsTouched();
      this.notify.showNotification('info', constants.ALL_MANDATE);
      return;
    }

    const f = this.accusedForm.value;

    // If sanction is required, file must be uploaded and valid
    if (f.isSanctionRequired) {
      if (!this.sanctionFile?.file) {
        this.notify.showNotification('info', 'Please upload the Sanction Document');
        return;
      }
      if (this.sanctionFile?.error) {
        this.notify.showNotification('error', this.sanctionFile.error);
        return;
      }
    }

    const formData = new FormData();
    formData.append('accusedId',           String(this.accusedEditId || 0));
    formData.append('accusedGroupNo',      String(this.caseId));
    formData.append('accuseName',          f.accusedName          || '');
    formData.append('fatherName',          '');
    formData.append('gender',              String(f.accusedGender  || 0));
    formData.append('address',             f.accusedAddress        || '');
    formData.append('mobileNo',            '');
    formData.append('uidNo',               '');
    formData.append('districtId',          '0');
    formData.append('thanaId',             '0');
    formData.append('firStatusId',         String(f.accusedStatus  || 0));
    formData.append('remark',              f.accusedRemark         || '');
    formData.append('accusedType',         String(f.accusedType));
    formData.append('department',          f.accusedDepartment     || '');
    formData.append('designation',         f.accusedDesignation    || '');
    formData.append('employeeId',          f.accusedEmployeeId     || '');
    formData.append('mpMlaType',           String(f.accusedMpMla   || 0));
    formData.append('constituencyDetails', f.constituencyDetails   || '');
    formData.append('isSanctionRequired',  String(f.isSanctionRequired ?? false));

    // Attach sanction file only when required and present
    if (f.isSanctionRequired && this.sanctionFile?.file) {
      formData.append('sanctionDoc', this.sanctionFile.file, this.sanctionFile.file.name);
    }

    this.api.post(this.url.addEditCaseAccused(), formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.message);
          this.accusedEditId = null;
          this.showConstituencyDetails = false;
          this.sanctionFile = null;
          if (this.sanctionPreviewUrl) { URL.revokeObjectURL(this.sanctionPreviewUrl); this.sanctionPreviewUrl = null; }
          // Reset to default state (type = 1, sanction = false)
          this.accusedForm.reset({ accusedType: 1, isSanctionRequired: false });
          this._clearGovtFields();
          this._clearMpMlaFields();
          this.getAccusedList();
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => { this.notify.showNotification('error', constants.apiError); }
    });
  }

  editAccused(e: any): void {
    const type: number = e?.AccusedType ?? 1;

    this.accusedForm.patchValue({
      accusedName:         e?.AccuseName            || '',
      accusedAddress:      e?.Address               || '',
      accusedAge:          e?.Age                   || '',
      accusedGender:       e?.Gender   ? String(e.Gender)   : null,
      accusedStatus:       e?.FIRStatusId            || null,
      accusedRemark:       e?.Remarks               || '',
      accusedType:         type,
      accusedDepartment:   e?.Department             || '',
      accusedDesignation:  e?.Designation            || '',
      accusedEmployeeId:   e?.EmployeeId             || '',
      accusedMpMla:        e?.MpMlaType ? String(e.MpMlaType) : null,
      constituencyDetails: e?.ConstituencyDetails    || '',
      isSanctionRequired:  e?.IsSanctionRequired     ?? false,
    });
    this.accusedEditId = e?.AccusedId;
    this.sanctionFile  = null;
    if (this.sanctionPreviewUrl) { URL.revokeObjectURL(this.sanctionPreviewUrl); this.sanctionPreviewUrl = null; }
    this._clearGovtFields();
    this._clearMpMlaFields();

    if (type === 2) {
      this._setRequired('accusedDepartment');
      this._setRequired('accusedDesignation');
      this._setRequired('accusedEmployeeId');
    }

    if (type === 3) {
      this._setRequired('accusedMpMla');
      const mpVal = e?.MpMlaType ? String(e.MpMlaType) : '';
      this.showConstituencyDetails = ['2', '3', '4', '5'].includes(mpVal);
      if (this.showConstituencyDetails) this._setRequired('constituencyDetails');
    }
  }

  getAccusedList(): void {
    if (!this.caseId) return;
    this.api.get(this.url.getCaseAccusedList(this.caseId)).subscribe({
      next:  (res: any) => { if (res.status) this.accusedList = res.data; },
      error: (err: Error) => { throw new Error(err?.message); }
    });
  }

  removeAccused(id: number): void {
    if (!id) { this.notify.showNotification('error', constants.apiError); return; }
    this.api.post(this.url.deleteCaseAccused(id), {}).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('delete', res.message);
          this.getAccusedList();
        } else { this.notify.showNotification('error', res.message); }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }

  // ===================== VICTIM / WITNESS CRUD =====================

  addVictimWitness(): void {
    if (!this.victimWitnessForm.valid) {
      this.victimWitnessForm.markAllAsTouched();
      this.notify.showNotification('info', constants.ALL_MANDATE);
      return;
    }
    if (!this.caseId) { this.notify.showNotification('error', constants.apiError); return; }

    const f = this.victimWitnessForm.value;
    const reqParams = {
      id:              this.victimWitnessEditId || 0,
      isVictimWitness: f.isVictim,
      groupNo:         this.caseId,
      name:            f.victimWitnessName    || '',
      fatherName:      '',
      gender:          f.victimWitnessGender  || 0,
      address:         f.victimWitnessAddress || '',
      mobileNo:        '',
      uidNo:           '',
      districtId:      0,
      thanaId:         0,
      status:          f.victimWitnessStatus  || 0
    };

    this.api.post(this.url.addEditCaseVictimWitness(), reqParams).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.message);
          this.victimWitnessEditId = null;
          this.victimWitnessForm.reset();
          this.victimWitnessForm.controls['isVictim'].setValue(1);
          this.getVictimWitnessList();
        } else { this.notify.showNotification('error', res.message); }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }

  editVictimWitness(e: any): void {
    this.victimWitnessForm.patchValue({
      victimWitnessName:    e?.Name             || '',
      victimWitnessAddress: e?.Address          || '',
      victimWitnessAge:     e?.Age              || '',
      victimWitnessGender:  e?.Gender ? String(e.Gender) : null,
      victimWitnessStatus:  e?.Status           || null,
      victimWitnessRemark:  e?.Remark           || '',
      isVictim:             e?.isVictimWitness  || 2,
    });
    this.victimWitnessEditId = e?.Id;
  }

  getVictimWitnessList(): void {
    if (!this.caseId) return;
    this.api.get(this.url.getCaseVictimWitnessList(this.caseId)).subscribe({
      next:  (res: any) => { if (res.status) this.victimWitnessList = res.data; },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }

  removeVictimWitness(id: number): void {
    this.api.post(this.url.deleteCaseVictimWitness(id), {}).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('delete', res.message);
          this.getVictimWitnessList();
        } else { this.notify.showNotification('error', res.message); }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }

  // ===================== SAVE STEP =====================

  regCaseParties(): void {
    if (!this.caseId) { this.notify.showNotification('error', constants.apiError); return; }

    const reqParams = {
      dirRegId:             this.caseId,
      steps:                3,
      isAccusedType:        this.accusedForm.value.accusedType,
      accusedGroupNo:       this.caseId,
      victimWitnessGroupNo: this.caseId
    };

    this.api.post(this.url.regCaseParties(), reqParams).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.message);
          this.caseParty.emit(true);
        }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }
}