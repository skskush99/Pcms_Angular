import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';
import { NotificationService } from '../../shared/services/notification.service';
import constants from '../../shared/utils/constants';

@Component({
  selector: 'app-fir-charges-sheet',
  standalone: true,
  imports: [CommonModule, DatePickerComponent, NgSelectModule, ReactiveFormsModule],
  templateUrl: './fir-charges-sheet.component.html',
  styleUrl: './fir-charges-sheet.component.css'
})
export class FirChargesSheetComponent implements OnInit, OnChanges {

  notify = inject(NotificationService);
  api    = inject(ApiService);
  url    = inject(UrlService);

  @Input()  caseId: any;
  @Input()  cctnsData: any = null;
  @Input()  regType: string = '1';    // '1' = Diar | '2' = Final Register (FR)
  @Output() firChargeSheetC = new EventEmitter<any>();

  /** Returns true when Final Register (FR) is selected */
  get isFR(): boolean { return this.regType === '2'; }

  sectionsDropdown:       DropdownListInterface[] = [];
  actsDropdown:           DropdownListInterface[] = [];
  classificationDropdown: DropdownListInterface[] = [];
  adhikaris:              any[] = [];
  chargeSheetCrimeList:   any[] = [];
  editOffenceId:          any;
  adhikariEditId:         any;

  // ── CCTNS preview data (shown in grids, NOT auto-filled in forms) ──
  cctnsStationOfficers:   any[] = [];   // policeStation + investigatingOfficer
  cctnsChargeSheetsBasic: any[] = [];   // chargeSheetNumber + date + officer
  cctnsOffences:          any[] = [];   // Classification + Act + Section

  /** FR Status options */
  frStatusDropdown = [
    { value: 'Accepted',                        text: 'Accepted' },
    { value: 'Rejected',                         text: 'Rejected' },
    { value: 'Returned for Further Investigation', text: 'Returned for Further Investigation' },
  ];

  firDetailsForm: FormGroup = new FormGroup({
    firNo:           new FormControl(''),
    firDate:         new FormControl(''),
    stationName:     new FormControl(''),
    thanaCode:       new FormControl(''),
    adhiThana:       new FormControl(''),
    adhiDesignation: new FormControl(''),
    adhiName:        new FormControl(''),
  });

  chargeSheetForm: FormGroup = new FormGroup({
    // ── Diar Register fields ──
    chargeSheetNo:         new FormControl(''),
    chartSheetDate:        new FormControl(''),
    dateFilingBeforeCourt: new FormControl(''),
    investigatingOfficer:  new FormControl(''),
    // ── Common ──
    caseTitle:             new FormControl(''),
    classification:        new FormControl(null),
    sections:              new FormControl(null),
    acts:                  new FormControl(null),
    // ── Final Register (FR) only fields ──
    frNo:               new FormControl(''),      // FR संख्या (CCTNS)
    frDate:             new FormControl(''),      // FR दिनांक (CCTNS)
    presentationDate:   new FormControl(''),      // प्रस्तुत करने की तिथि (न्यायालय में)
    frStatus:           new FormControl(null),    // एफआर स्थिति का चयन करें
    cisCnrDetails:      new FormControl(''),      // CIS / CNR Details (shown only on Rejected)
  });

  ngOnInit(): void {
    this.getClassificationDropdown();
    this.getChargeSheetAdhikariList();
    this.getChargeSheetOffenceList();
    if (this.cctnsData) this._patchFromCctns(this.cctnsData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cctnsData']?.currentValue) this._patchFromCctns(changes['cctnsData'].currentValue);
  }

  // ===================== CCTNS AUTO-FILL =====================
  private _patchFromCctns(data: any): void {
    if (!data) return;

    // ── FIR Details ──
    const fir = data.firDetails;
    if (fir) {
      this.firDetailsForm.patchValue({
        firNo:     fir.firNumber         || '',
        firDate:   this._toDateOnly(fir.firDate),
        thanaCode: fir.policeStationCode || '',
      });

      const op = this._parseOfficer(fir.investigatingOfficer);
      this.cctnsStationOfficers = [{
        policeStationName:   fir.policeStationName || '—',
        officerName:         op.name              || '—',
        officerRank:         op.rank              || '—',
        _raw_stationName:    fir.policeStationName || '',
        _raw_officerName:    op.name              || '',
        _raw_officerRank:    op.rank              || '',
        _raw_stationAsThana: fir.policeStationName || '',
      }];
    }

    // ── chargeSheetDetails ──
    const csArr = data.chargeSheetDetails || [];
    if (csArr.length) {
      const first  = csArr[0];
      const firstO = this._parseOfficer(first.investigatingOfficer);
      const ioLabel = `${firstO.name}${firstO.rank ? ' (' + firstO.rank + ')' : ''}`.trim();

      // Auto-fill CS basic fields INCLUDING investigatingOfficer
      this.chargeSheetForm.patchValue({
        chargeSheetNo:        first.chargeSheetNumber || '',
        chartSheetDate:       this._toDateOnly(first.chargeSheetDate),
        investigatingOfficer: ioLabel,
      });

      // Build charge sheet basic preview grid (Edit → fills form fields)
      this.cctnsChargeSheetsBasic = csArr.map((cs: any) => {
        const o = this._parseOfficer(cs.investigatingOfficer);
        return {
          chargeSheetNumber: cs.chargeSheetNumber || '—',
          chargeSheetDate:   cs.chargeSheetDate   || '—',
          officerName:       o.name               || '—',
          officerRank:       o.rank               || '—',
          _raw_csNo:         cs.chargeSheetNumber || '',
          _raw_csDate:       this._toDateOnly(cs.chargeSheetDate),
          _raw_officer:      `${o.name}${o.rank ? ' (' + o.rank + ')' : ''}`.trim(),
        };
      });

      // Build offences grid — handles both naming conventions:
      // Real API:  ClassificationName / ActsName / SectionsName
      // Mock data: Classification   / Act       / Section
      this.cctnsOffences = csArr
        .filter((cs: any) =>
          cs.ClassificationName || cs.ActsName || cs.SectionsName ||
          cs.Classification     || cs.Act      || cs.Section
        )
        .map((cs: any) => ({
          classificationName: cs.ClassificationName || cs.Classification || '—',
          actsName:           cs.ActsName           || cs.Act            || '—',
          sectionsName:       cs.SectionsName       || cs.Section        || '—',
          _raw_cls:           cs.ClassificationName || cs.Classification || '',
          _raw_act:           cs.ActsName           || cs.Act            || '',
          _raw_sec:           cs.SectionsName       || cs.Section        || '',
        }));
    }
  }

  // ===================== CCTNS GRID EDIT ACTIONS =====================

  /** Edit station row → fills stationName + adhiThana in the form */
  editCctnsStation(item: any): void {
    this.firDetailsForm.patchValue({
      stationName:     item._raw_stationName    || '',
      adhiName:        item._raw_officerName    || '',
      adhiDesignation: item._raw_officerRank    || '',
      adhiThana:       item._raw_stationAsThana || '',
    });
  }


  /** Edit charge sheet basic row → fills chargeSheetNo, date, investigatingOfficer */
  editCctnsChargeSheet(item: any): void {
    this.chargeSheetForm.patchValue({
      chargeSheetNo:        item._raw_csNo     || '',
      chartSheetDate:       item._raw_csDate   || '',
      investigatingOfficer: item._raw_officer  || '',
    });
  }

  /** Edit offence row → match Classification/Act/Section by name in loaded dropdowns */
  editCctnsOffence(item: any): void {
    // Match Classification by text name
    const clsMatch = this.classificationDropdown.find(
      d => d.text?.toLowerCase().trim() === item._raw_cls?.toLowerCase().trim()
    );
    if (clsMatch) {
      this.chargeSheetForm.patchValue({ classification: clsMatch.value });
      // Load Acts dropdown, then match Act
      this.api.get(this.url.getCrimeActDropdown(), { CrimeClsId: clsMatch.value }).subscribe({
        next: (res: any) => {
          this.actsDropdown = res.data || [];
          const actMatch = this.actsDropdown.find(
            d => d.text?.toLowerCase().trim() === item._raw_act?.toLowerCase().trim()
          );
          if (actMatch) {
            this.chargeSheetForm.patchValue({ acts: actMatch.value });
            // Load Sections dropdown, then match Section
            this.api.get(this.url.getCrimeSubActDropdown(), {
              CrimeActId: actMatch.value,
              CrimeClsId: clsMatch.value
            }).subscribe({
              next: (res2: any) => {
                this.sectionsDropdown = res2.data || [];
                const secMatch = this.sectionsDropdown.find(
                  d => d.text?.toLowerCase().trim() === item._raw_sec?.toLowerCase().trim()
                );
                if (secMatch) {
                  this.chargeSheetForm.patchValue({ sections: secMatch.value });
                } else {
                  this.notify.showNotification('info', `Section "${item._raw_sec}" not found — select manually`);
                }
              },
              error: () => {}
            });
          } else {
            this.notify.showNotification('info', `Act "${item._raw_act}" not found — select manually`);
          }
        },
        error: () => {}
      });
    } else {
      this.notify.showNotification('info', `Classification "${item._raw_cls}" not found — select manually`);
    }
  }

  // ===================== HELPERS =====================
  private _parseOfficer(raw: string | undefined): { name: string; rank: string } {
    if (!raw) return { name: '', rank: '' };
    try {
      const parsed  = JSON.parse(raw.trim());
      const officer = Array.isArray(parsed) ? parsed[0] : parsed;
      return { name: officer?.name || '', rank: officer?.rank || '' };
    } catch { return { name: raw, rank: '' }; }
  }

  private _toDateOnly(dateStr: string | undefined): string {
    if (!dateStr) return '';
    return dateStr.split(' ')[0] || dateStr;
  }

  // ===================== ADHIKARI =====================
  addAdhikari(): void {
    const vals = this.firDetailsForm.value;
    if (!vals.adhiThana || !vals.adhiDesignation || !vals.adhiName) {
      ['adhiName','adhiThana','adhiDesignation'].forEach(k => this.firDetailsForm.get(k)?.markAsTouched());
      this.notify.showNotification('info', constants.allFieldsReq);
      return;
    }
    if (!this.caseId) { this.notify.showNotification('error', constants.apiError); return; }
    const reqParam = { investId: this.adhikariEditId || 0, investGroupNo: this.caseId, investName: vals.adhiName, fatherName: '', rankName: vals.adhiDesignation, postingPlace: vals.adhiThana, gender: 0, mobileNo: '', districtId: 8, thanaId: 0, investStatus: 1 };
    this.api.post(this.url.addFirChargeSheetAdhikari(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) { this.adhikariEditId = null; this.notify.showNotification('success', res.message); ['adhiName','adhiThana','adhiDesignation'].forEach(i => this.firDetailsForm.controls[i].reset()); this.getChargeSheetAdhikariList(); }
        else { this.notify.showNotification('error', res.message); }
      },
      error: (err: Error) => { this.notify.showNotification('error', constants.apiError); throw new Error(err?.message); }
    });
  }

  editAdhikari(e: any): void {
    this.firDetailsForm.patchValue({ adhiName: e?.InvestName || '', adhiDesignation: e?.RankName || '', adhiThana: e?.PostingPlace || '' });
    this.adhikariEditId = e?.InvestId;
  }

  removeAdhikari(id: number): void {
    this.api.post(this.url.deleteChargeSheetAdhikari(id), {}).subscribe({
      next: (res: any) => { if (res.status) { this.notify.showNotification('delete', res.message); this.getChargeSheetAdhikariList(); } else { this.notify.showNotification('error', res.message); } },
      error: (err: Error) => { this.notify.showNotification('error', constants.apiError); throw new Error(err?.message); }
    });
  }

  getChargeSheetAdhikariList(): void {
    if (!this.caseId) return;
    this.api.get(this.url.getChargeSheetAdhikariList(this.caseId)).subscribe({
      next: (res: any) => { if (res.status) this.adhikaris = res.data; else this.notify.showNotification('error', res.message); },
      error: (err: Error) => { this.notify.showNotification('error', constants.apiError); throw new Error(err?.message); }
    });
  }

  // ===================== DROPDOWNS =====================
  getClassificationDropdown(): void {
    this.api.get(this.url.getCrimeClassificationDropdown()).subscribe({ next: (res: any) => { this.classificationDropdown = res.data; }, error: (err: Error) => { throw new Error(err?.message); } });
  }

  getActsDropdown(ifInit?: string): void {
    if (!ifInit) this.chargeSheetForm.controls['acts'].setValue(null);
    this.getCrimeSubActDropdown(ifInit ? 'init' : '');
    if (!this.chargeSheetForm.value.classification) { this.actsDropdown = []; return; }
    this.api.get(this.url.getCrimeActDropdown(), { CrimeClsId: this.chargeSheetForm.value.classification }).subscribe({ next: (res: any) => { this.actsDropdown = res.data; }, error: () => {} });
  }

  getCrimeSubActDropdown(ifInit?: string): void {
    if (!ifInit) this.chargeSheetForm.controls['sections'].setValue(null);
    if (!this.chargeSheetForm.value.acts) { this.sectionsDropdown = []; return; }
    this.api.get(this.url.getCrimeSubActDropdown(), { CrimeActId: this.chargeSheetForm.value.acts, CrimeClsId: this.chargeSheetForm.value.classification }).subscribe({ next: (res: any) => { this.sectionsDropdown = res.data; }, error: () => {} });
  }

  // ===================== CHARGE SHEET CRIME =====================
  addChargeSheetCrime(): void {
    const form = this.chargeSheetForm.value;
    if (!form.classification || !form.acts || !form.sections) {
      ['classification','acts','sections'].forEach(k => this.chargeSheetForm.get(k)?.markAsTouched());
      this.notify.showNotification('info', constants.allFieldsReq);
      return;
    }
    const reqParams = {
      offenceClassifId: this.editOffenceId || 0, offenceClassifGroupNo: this.caseId, isCaseComplaintReg: 0,
      classificationID:   form.classification, classificationName: this.classificationDropdown.find(i => i.value == form.classification)?.text || '',
      actsID:             form.acts,           actsName:           this.actsDropdown.find(i => i.value == form.acts)?.text || '',
      sectionsID:         form.sections,       sectionsName:       this.sectionsDropdown.find(i => i.value == form.sections)?.text || ''
    };
    this.api.post(this.url.addEditClassificationOffence(), reqParams).subscribe({
      next: (res: any) => {
        if (res.status) { this.editOffenceId = null; this.notify.showNotification('success', res.message); this.getChargeSheetOffenceList(); ['classification','acts','sections'].forEach(i => this.chargeSheetForm.controls[i].reset()); }
      },
      error: (err: Error) => { this.notify.showNotification('error', constants.apiError); throw new Error(err?.message); }
    });
  }

  getChargeSheetOffenceList(): void {
    this.api.get(this.url.getClassificationOffence(this.caseId)).subscribe({ next: (res: any) => { if (res.status) this.chargeSheetCrimeList = res?.data; else this.notify.showNotification('error', res.message); }, error: (err: Error) => { throw new Error(err?.message); } });
  }

  deleteChargeSheetOffence(e: any): void {
    this.api.post(this.url.deleteClassificationOffence(e?.OffenceClassifId), {}).subscribe({ next: (res: any) => { if (res.status) { this.notify.showNotification('delete', res.message); this.getChargeSheetOffenceList(); } else { this.notify.showNotification('error', res.message); } }, error: (err: Error) => { this.notify.showNotification('error', constants.apiError); throw new Error(err?.message); } });
  }

  editChargeSheetOffence(e: any): void {
    this.chargeSheetForm.patchValue({ classification: e?.ClassificationID || null, acts: e?.ActsID || null, sections: e?.SectionsID || null });
    if (this.chargeSheetForm.value.classification) this.getActsDropdown('init');
    this.editOffenceId = e?.OffenceClassifId;
  }

  // ===================== SAVE STEP =====================
  addEditChargeSheet(): void {
    if (!this.firDetailsForm.valid) { this.firDetailsForm.markAllAsTouched(); return; }
    const cs   = this.chargeSheetForm.value;
    const fir  = this.firDetailsForm.value;
    const reqParam = {
      dirRegId: this.caseId, steps: 2,
      firNo:    fir.firNo      || '', firDt:  fir.firDate  || '',
      psName:   fir.stationName || '', psCode: fir.thanaCode || '',
      investGroupNo: this.caseId,
      // Diar Register fields
      chargeSheetNo:          cs.chargeSheetNo,
      chargeSheetDate:        cs.chartSheetDate,
      dateBeforeFillingCourt: cs.dateFilingBeforeCourt,
      investigatingNameRank:  cs.investigatingOfficer,
      titleOfCase:            cs.caseTitle,
      cClassificationId: 0, crimeActId: 0, crimeActSubId: 0,
      // FR fields (sent only when FR mode; backend ignores for Diar)
      frNo:             cs.frNo             || '',
      frDate:           cs.frDate           || '',
      presentationDate: cs.presentationDate || '',
      frStatus:         cs.frStatus         || '',
      cisCnrDetails:    cs.cisCnrDetails    || '',
    };
    this.api.post(this.url.regChargeSheet(), reqParam).subscribe({
      next: (res: any) => { if (res.status) { this.notify.showNotification('success', res.message); this.firChargeSheetC.emit(true); } else { this.notify.showNotification('error', res.message); } },
      error: (err: Error) => { this.notify.showNotification('error', constants.apiError); throw new Error(err?.message); }
    });
  }

  /** Show CIS/CNR Details textbox only when FR status = Rejected */
  get showCisCnr(): boolean {
    return this.chargeSheetForm.get('frStatus')?.value === 'Rejected';
  }

  compareWithFunc(a: any, b: any): boolean { return a?.['value'] ? a['value'] == b : false; }
}