import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { createYearList } from '../../shared/utils/utils';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';
import { NotificationService } from '../../shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ECourtCnrSearchComponent } from '../../shared/components/e-court-cnr-search/e-court-cnr-search.component';
import constants from '../../shared/utils/constants';

@Component({
  selector: 'app-case-identification',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule],
  templateUrl: './case-identification.component.html',
  styleUrl: './case-identification.component.css'
})
export class CaseIdentificationComponent implements OnInit {

  api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  dialog = inject(MatDialog);

  @Input() caseId: any;
  @Output() caseIdentification = new EventEmitter<any>();

  /**
   * Emits the full CCTNS data object on success (truthy)
   * Emits null on failure → stepper keeps Save & Next disabled
   */
  @Output() cctnsDataReceived = new EventEmitter<any>();

  /**
   * Emits whenever Register Type radio changes
   * '1' = Diar Register | '2' = Final Register (FR)
   */
  @Output() regTypeChanged = new EventEmitter<string>();

  cctnsSuccess = false;
  cctnsData: any = null;

  thanaDropdown: DropdownListInterface[] = [];
  firYearDropdown: DropdownListInterface[] = [];

  caseIdentificationForm: FormGroup = new FormGroup({
    regType: new FormControl('1'),
    searchCaseVia: new FormControl('1'),
    thana: new FormControl(null, [Validators.required]),
    firNo: new FormControl('', [
      Validators.required,
      Validators.maxLength(4),
      Validators.pattern(/^\d{1,4}$/),
    ]),
    firYear: new FormControl(null, [Validators.required]),
    cisCnr: new FormControl(''),
  });

  ngOnInit(): void {
    this.firYearDropdown = createYearList(1950);
    this.getPoliceStationDropdown();
  }

  isFirDetailsFilled(): boolean {
    const f = this.caseIdentificationForm.value;
    return !!(f.thana && f.firNo && f.firYear);
  }

  /** Returns true when Final Register (FR) is selected */
  get isFR(): boolean {
    return this.caseIdentificationForm.get('regType')?.value === '2';
  }

  /** Called on every Register Type radio change */
  onRegTypeChange(): void {
    const type = this.caseIdentificationForm.get('regType')?.value;
    this.regTypeChanged.emit(type);
    // Reset CCTNS state when switching type
    this.cctnsSuccess = false;
    this.cctnsData = null;
    // NOTE: do NOT emit cctnsDataReceived here —
    // stepper handles step1Unlocked via onRegTypeChanged(type)
  }

  getInvestigatingOfficer(raw: string | undefined): string {
    if (!raw) return '—';
    try {
      const parsed = JSON.parse(raw.trim());
      const officer = Array.isArray(parsed) ? parsed[0] : parsed;
      return `${officer?.name || ''}${officer?.rank ? ' (' + officer.rank + ')' : ''}`.trim() || '—';
    } catch { return raw; }
  }

  onFirNoKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.charCode ?? event.keyCode;
    if (charCode < 48 || charCode > 57) { event.preventDefault(); return false; }
    const current = (event.target as HTMLInputElement).value;
    if (current.length >= 4) { event.preventDefault(); return false; }
    return true;
  }

  getPoliceStationDropdown(): void {
    this.api.get(this.url.getPoliceStationDropdownall()).subscribe({
      next: (res: any) => {
        this.thanaDropdown = (res.data || []).map((item: any) => ({
          ...item,
          text: `${item.text} (${item.value})`
        }));
      },
      // next:  (res: any) => { this.thanaDropdown = res.data; },
      error: (err: Error) => { throw new Error(err?.message); }
    });
  }

  onCctnsSearch(): void {
    if (!this.isFirDetailsFilled() || this.cctnsSuccess) return;

    // ── TEMPORARY MOCK DATA (remove when API is ready) ──
    const MOCK_RESPONSE = {
      status: true,
      message: 'Success',
      data: {
        firDetails: {
          firNumber: '27564051250030', firDate: '2025-12-26 10:06:36',
          policeStationCode: '27564051', policeStationName: 'BAR',
          investigatingOfficer: '[{"name": "Prahlad Ray Gurjar", "rank": "निरीक्षक"}]'
        },
        chargeSheetDetails: [{ chargeSheetNumber: '2756405125003001', chargeSheetDate: '2026-02-10 10:33:09', investigatingOfficer: '{"name": "Prahlad Ray Gurjar", "rank": "I (Inspector)"}', Classification: 'BNS/BNSS', Act: 'Indian Penal Code,1860', Section: 'Section 302–Murder' }],
        sectionsAndActs: [{ gdNum: '27564051250030', actId: '3039', actValue: 'लैंगिक अपराधों से बालकों का सरंक्षण  अधिनियम (संशोधित), 2012, 2019', sectionId: '3039-4', sectionValue: '4' }],
        accusedDetails: [{ fullName: 'Vikas', permanentAddress: 'Beawer', policeStation: 'BAR', district: 'BEAWAR', state: 'RAJASTHAN', pinCode: 'Not Available', age: 22, gender: 'Male', isGovernmentEmployee: 'False', isAbscondingOrNot: 'False', status: 'NOT ARRESTED', arrestBailStatus: 'False' }],
        complainantDetails: { fullName: 'abhinaar', contactNumber: '91 3658914567', permanentAddress: '', policeStation: 'BAR', district: 'BEAWAR', state: 'RAJASTHAN', pinCode: 'Not Available' },
        victimDetails: [{ fullName: 'abhinaar', contactNumber: '91 3658914567', permanentAddress: '', policeStation: 'BAR', district: 'BEAWAR', state: 'RAJASTHAN', pinCode: 'Not Available' }],
        courtInformation: { empty: true },
        fileRoomDetails: [
          { fileSrno: 27564051250030, fileName: 'IIF-1.pdf', moduleName: 'IIF-1', regDate: '26/12/2025', docId: '27564051250030,tfr' },
          { fileSrno: 2756405125003001, fileName: 'download.pdf', moduleName: 'IIF-1', regDate: '26/12/2025', docId: '2756405125003001,tffu' },
          { fileSrno: 27564051250030000, fileName: 'Case_Diary_01.pdf', moduleName: 'Case Diary Jasper', regDate: '26/12/2025', docId: '27564051250030001,tcd' },
          { fileSrno: 2756405125003001, fileName: 'IIF-5.pdf', moduleName: 'IIF-5', regDate: '10/02/2026', docId: '2756405125003001,tfrp' }
        ]
      }
    };
    this._handleCctnsResponse(MOCK_RESPONSE);
    return;
    // ── END MOCK (uncomment API below when ready) ──

    // const f = this.caseIdentificationForm.value;
    // this.api.post(this.url.searchCctns(), { thanaId: f.thana, firNo: f.firNo || '', firYear: f.firYear || 0 }).subscribe({
    //   next:  (res: any)  => { this._handleCctnsResponse(res); },
    //   error: (err: Error) => {
    //     this.notify.showNotification('error', constants.apiError);
    //     this.cctnsDataReceived.emit(null);
    //     throw new Error(err?.message);
    //   }
    // });
  }

  private _handleCctnsResponse(res: any): void {
    if (res?.status && res?.data && Object.keys(res.data).length > 0) {
      this.cctnsData = res.data;
      this.cctnsSuccess = true;
      this.notify.showNotification('success', res.message);
      this.cctnsDataReceived.emit(res.data);   // ← emits full data to stepper
    } else {
      this.notify.showNotification('error', res?.message || 'No data found');
      this.cctnsSuccess = false;
      this.cctnsDataReceived.emit(null);
    }
  }

  regCaseIdentification(): void {
    if (!this.caseIdentificationForm.valid) { this.caseIdentificationForm.markAllAsTouched(); return; }
    const f = this.caseIdentificationForm.value;
    const reqParams = { dirRegId: 0, steps: 1, districtId: 8, officeId: 8, jCourtId: 8, registerType: f.regType, searchCaseVia: f.searchCaseVia, dierNo: '', cnrNo: f.cisCnr || '', firNo: f.firNo || '', firYear: f.firYear || 0 };
    this.api.post(this.url.regCaseIdentification(), reqParams).subscribe({
      next: (res: any) => {
        if (res?.status) { this.notify.showNotification('success', res.message); this.caseIdentification.emit(res?.returnID); }
        else { this.notify.showNotification('error', res.message); }
      },
      error: (err: Error) => { this.notify.showNotification('error', constants.apiError); throw new Error(err?.message); }
    });
  }

  searnCnrCis(): void {
    if (!this.caseIdentificationForm.value.cisCnr) { this.notify.showNotification('info', constants.cnrNotAvail); return; }
    this.api.get(this.url.searchCaseByCNRECourt(this.caseIdentificationForm.value.cisCnr)).subscribe({
      next: (res: any) => {
        if (res.status && !Object.hasOwn(res.data?.data, 'Error')) {
          this.dialog.open(ECourtCnrSearchComponent, { width: '95dvw', maxHeight: '85dvh', data: res.data?.data });
        } else { this.notify.showNotification('error', res.message); }
      },
      error: (err: Error) => { this.notify.showNotification('error', constants.apiError); throw new Error(err?.message); }
    });
  }
}


