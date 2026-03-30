// import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
// import { NotificationService } from '../../../shared/services/notification.service';
// import { ApiService } from '../../../shared/services/api.service';
// import { UrlService } from '../../../shared/services/url.service';
// import { DropdownListInterface } from '../../../shared/model/shared.model';
// import constants from '../../../shared/utils/constants';


// @Component({
//  selector: 'app-cash-dis-charges-sheet',
//   standalone: true,
//   imports: [CommonModule, DatePickerComponent, NgSelectModule, ReactiveFormsModule],
// templateUrl: './cash-dis-charges-sheet.component.html',
//   styleUrl: './cash-dis-charges-sheet.component.css'
// })
// export class CashDisChargesSheetComponent implements OnInit {

//   // ===================== SERVICES =====================
//   notify = inject(NotificationService);
//   api    = inject(ApiService);
//   url    = inject(UrlService);

//   // ===================== INPUTS / OUTPUTS =====================
//   @Input()  caseId: any;
//   @Output() firChargeSheetC = new EventEmitter<any>();

//   // ===================== STATE =====================
//   sectionsDropdown:       DropdownListInterface[] = [];
//   actsDropdown:           DropdownListInterface[] = [];
//   classificationDropdown: DropdownListInterface[] = [];
//   adhikaris:              any[] = [];
//   chargeSheetCrimeList:   any[] = [];
//   editOffenceId:          any;
//   adhikariEditId:         any;

//   // ===================== FORMS =====================
//   firDetailsForm: FormGroup = new FormGroup({
//     firNo:            new FormControl(''),
//     firDate:          new FormControl(''),
//     stationName:      new FormControl(''),
//     thanaCode:        new FormControl(''),
//     adhiThana:        new FormControl(''),
//     adhiDesignation:  new FormControl(''),
//     adhiName:         new FormControl(''),
//   });

//   chargeSheetForm: FormGroup = new FormGroup({
//     chargeSheetNo:          new FormControl(''),
//     chartSheetDate:         new FormControl(''),
//     dateFilingBeforeCourt:  new FormControl(''),
//     investigatingOfficer:   new FormControl(''),
//     caseTitle:              new FormControl(''),
//     classification:         new FormControl(null),
//     sections:               new FormControl(null),
//     acts:                   new FormControl(null),
//   });

//   // ===================== LIFECYCLE =====================
//   ngOnInit(): void {
//     this.getClassificationDropdown();
//     this.getChargeSheetAdhikariList();
//     this.getChargeSheetOffenceList();
//   }
//   // ===================== ADHIKARI =====================
//   addAdhikari(): void {
//     const vals = this.firDetailsForm.value;
//     const reqFields = ['adhiName', 'adhiThana', 'adhiDesignation'];

//     if (!vals.adhiThana || !vals.adhiDesignation || !vals.adhiName) {
//       reqFields.forEach(key => this.firDetailsForm.get(key)?.markAsTouched());
//       this.notify.showNotification('info', constants.allFieldsReq);
//       return;
//     }

//     if (!this.caseId) {
//       this.notify.showNotification('error', constants.apiError);
//       return;
//     }

//     const reqParam = {
//       investId:       this.adhikariEditId || 0,
//       investGroupNo:  this.caseId,
//       investName:     vals.adhiName,
//       fatherName:     '',
//       rankName:       vals.adhiDesignation,
//       postingPlace:   vals.adhiThana,
//       gender:         0,
//       mobileNo:       '',
//       districtId:     8,
//       thanaId:        0,
//       investStatus:   1
//     };

//     this.api.post(this.url.addFirChargeSheetAdhikari(), reqParam).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           this.adhikariEditId = null;
//           this.notify.showNotification('success', res.message);
//           reqFields.forEach(i => this.firDetailsForm.controls[i].reset());
//           this.getChargeSheetAdhikariList();
//         } else {
//           this.notify.showNotification('error', res.message);
//         }
//       },
//       error: (err: Error) => {
//         this.notify.showNotification('error', constants.apiError);
//         throw new Error(err?.message);
//       }
//     });
//   }

//   editAdhikari(e: any): void {
//     this.firDetailsForm.patchValue({
//       adhiName:        e?.InvestName    || '',
//       adhiDesignation: e?.RankName      || '',
//       adhiThana:       e?.PostingPlace  || '',
//     });
//     this.adhikariEditId = e?.InvestId;
//   }

//   removeAdhikari(id: number): void {
//     this.api.post(this.url.deleteChargeSheetAdhikari(id), {}).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           this.notify.showNotification('delete', res.message);
//           this.getChargeSheetAdhikariList();
//         } else {
//           this.notify.showNotification('error', res.message);
//         }
//       },
//       error: (err: Error) => {
//         this.notify.showNotification('error', constants.apiError);
//         throw new Error(err?.message);
//       }
//     });
//   }

//   getChargeSheetAdhikariList(): void {
//     if (!this.caseId) return;
//     this.api.get(this.url.getChargeSheetAdhikariList(this.caseId)).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           this.adhikaris = res.data;
//         } else {
//           this.notify.showNotification('error', res.message);
//         }
//       },
//       error: (err: Error) => {
//         this.notify.showNotification('error', constants.apiError);
//         throw new Error(err?.message);
//       }
//     });
//   }

//   // ===================== DROPDOWNS =====================
//   getClassificationDropdown(): void {
//     this.api.get(this.url.getCrimeClassificationDropdown()).subscribe({
//       next:  (res: any) => { this.classificationDropdown = res.data; },
//       error: (err: Error) => { throw new Error(err?.message); }
//     });
//   }

//   getActsDropdown(ifInit?: string): void {
//     if (!ifInit) this.chargeSheetForm.controls['acts'].setValue(null);
//     this.getCrimeSubActDropdown(ifInit ? 'init' : '');

//     if (!this.chargeSheetForm.value.classification) {
//       this.actsDropdown = [];
//       return;
//     }

//     const reqParam = { CrimeClsId: this.chargeSheetForm.value.classification };
//     this.api.get(this.url.getCrimeActDropdown(), reqParam).subscribe({
//       next:  (res: any) => { this.actsDropdown = res.data; },
//       error: (_err: any) => {}
//     });
//   }

//   getCrimeSubActDropdown(ifInit?: string): void {
//     if (!ifInit) this.chargeSheetForm.controls['sections'].setValue(null);

//     if (!this.chargeSheetForm.value.acts) {
//       this.sectionsDropdown = [];
//       return;
//     }

//     const reqParam = {
//       CrimeActId: this.chargeSheetForm.value.acts,
//       CrimeClsId: this.chargeSheetForm.value.classification,
//     };
//     this.api.get(this.url.getCrimeSubActDropdown(), reqParam).subscribe({
//       next:  (res: any) => { this.sectionsDropdown = res.data; },
//       error: (_err: any) => {}
//     });
//   }

//   // ===================== CHARGE SHEET CRIME =====================
//   addChargeSheetCrime(): void {
//     const form      = this.chargeSheetForm.value;
//     const reqFields = ['classification', 'acts', 'sections'];

//     if (!form.classification || !form.acts || !form.sections) {
//       reqFields.forEach(key => this.chargeSheetForm.get(key)?.markAsTouched());
//       this.notify.showNotification('info', constants.allFieldsReq);
//       return;
//     }

//     const classificationName = this.classificationDropdown.find(i => i.value == form.classification)?.text;
//     const actName            = this.actsDropdown.find(i => i.value == form.acts)?.text;
//     const sectionName        = this.sectionsDropdown.find(i => i.value == form.sections)?.text;

//     const reqParams = {
//       offenceClassifId:       this.editOffenceId || 0,
//       offenceClassifGroupNo:  this.caseId,
//       isCaseComplaintReg:     0,
//       classificationID:       form.classification,
//       classificationName:     classificationName || '',
//       actsID:                 form.acts,
//       actsName:               actName            || '',
//       sectionsID:             form.sections,
//       sectionsName:           sectionName        || ''
//     };

//     this.api.post(this.url.addEditClassificationOffence(), reqParams).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           this.editOffenceId = null;
//           this.notify.showNotification('success', res.message);
//           this.getChargeSheetOffenceList();
//           reqFields.forEach(i => this.chargeSheetForm.controls[i].reset());
//         }
//       },
//       error: (err: Error) => {
//         this.notify.showNotification('error', constants.apiError);
//         throw new Error(err?.message);
//       }
//     });
//   }

//   getChargeSheetOffenceList(): void {
//     this.api.get(this.url.getClassificationOffence(this.caseId)).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           this.chargeSheetCrimeList = res?.data;
//         } else {
//           this.notify.showNotification('error', res.message);
//         }
//       },
//       error: (err: Error) => { throw new Error(err?.message); }
//     });
//   }

//   deleteChargeSheetOffence(e: any): void {
//     this.api.post(this.url.deleteClassificationOffence(e?.OffenceClassifId), {}).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           this.notify.showNotification('delete', res.message);
//           this.getChargeSheetOffenceList();
//         } else {
//           this.notify.showNotification('error', res.message);
//         }
//       },
//       error: (err: Error) => {
//         this.notify.showNotification('error', constants.apiError);
//         throw new Error(err?.message);
//       }
//     });
//   }

//   editChargeSheetOffence(e: any): void {
//     this.chargeSheetForm.patchValue({
//       classification: e?.ClassificationID || null,
//       acts:           e?.ActsID           || null,
//       sections:       e?.SectionsID       || null
//     });
//     if (this.chargeSheetForm.value.classification) this.getActsDropdown('init');
//     this.editOffenceId = e?.OffenceClassifId;
//   }

//   // ===================== SAVE STEP =====================
//   addEditChargeSheet(): void {
//     if (!this.firDetailsForm.valid) {
//       this.firDetailsForm.markAllAsTouched();
//       return;
//     }

//     const reqParam = {
//       dirRegId:                 this.caseId,
//       steps:                    2,
//       firNo:                    this.firDetailsForm.value.firNo              || '',
//       firDt:                    this.firDetailsForm.value.firDate            || '',
//       psName:                   this.firDetailsForm.value.stationName        || '',
//       psCode:                   this.firDetailsForm.value.thanaCode          || '',
//       investGroupNo:            this.caseId,
//       chargeSheetNo:            this.chargeSheetForm.value.chargeSheetNo,
//       chargeSheetDate:          this.chargeSheetForm.value.chartSheetDate,
//       dateBeforeFillingCourt:   this.chargeSheetForm.value.dateFilingBeforeCourt,
//       investigatingNameRank:    this.chargeSheetForm.value.investigatingOfficer,
//       titleOfCase:              this.chargeSheetForm.value.caseTitle,
//       cClassificationId:        0,
//       crimeActId:               0,
//       crimeActSubId:            0
//     };

//     this.api.post(this.url.regChargeSheet(), reqParam).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           this.notify.showNotification('success', res.message);
//           this.firChargeSheetC.emit(true);
//         } else {
//           this.notify.showNotification('error', res.message);
//         }
//       },
//       error: (err: Error) => {
//         this.notify.showNotification('error', constants.apiError);
//         throw new Error(err?.message);
//       }
//     });
//   }

//   // ===================== UTILS =====================
//   compareWithFunc(a: any, b: any): boolean {
//     return a?.['value'] ? a['value'] == b : false;
//   }
// }


import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { ApiService } from '../../../shared/services/api.service';
import { UrlService } from '../../../shared/services/url.service';
import { DropdownListInterface } from '../../../shared/model/shared.model';
import constants from '../../../shared/utils/constants';

@Component({
  selector: 'app-cash-dis-charges-sheet',
  standalone: true,
  imports: [CommonModule, DatePickerComponent, NgSelectModule, ReactiveFormsModule],
  templateUrl: './cash-dis-charges-sheet.component.html',
  styleUrl: './cash-dis-charges-sheet.component.css'
})
export class CashDisChargesSheetComponent implements OnInit, OnChanges {

  // ===================== SERVICES =====================
  notify = inject(NotificationService);
  api    = inject(ApiService);
  url    = inject(UrlService);

  // ===================== INPUTS / OUTPUTS =====================
  @Input()  caseId:   any;
  @Input()  caseData: any = null;
  @Output() firChargeSheetC = new EventEmitter<any>();

  // ===================== STATE =====================
  isReadonly:             boolean                  = false;
  sectionsDropdown:       DropdownListInterface[]  = [];
  actsDropdown:           DropdownListInterface[]  = [];
  classificationDropdown: DropdownListInterface[]  = [];
  adhikaris:              any[]                    = [];
  chargeSheetCrimeList:   any[]                    = [];
  editOffenceId:          any;
  adhikariEditId:         any;

  // ===================== FORMS =====================
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
    chargeSheetNo:         new FormControl(''),
    chartSheetDate:        new FormControl(''),
    dateFilingBeforeCourt: new FormControl(''),
    investigatingOfficer:  new FormControl(''),
    caseTitle:             new FormControl(''),
    classification:        new FormControl(null),
    sections:              new FormControl(null),
    acts:                  new FormControl(null),
  });

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.getClassificationDropdown();
    this.getChargeSheetAdhikariList();
    this.getChargeSheetOffenceList();
    if (this.caseData) this._bindCaseData(this.caseData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['caseData']?.currentValue) {
      this._bindCaseData(changes['caseData'].currentValue);
    }
  }

  // ===================== DATA BINDING =====================
  /**
   * Returns empty string for invalid/1900 dates so the date-picker stays blank.
   */
  private _safeDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime()) || date.getFullYear() <= 1900) return '';
    return dateStr;
  }

  private _bindCaseData(data: any): void {
    if (!data) return;
    this.isReadonly = true;

    // FIR Details section
    this.firDetailsForm.patchValue({
      firNo:       data.FIRNo    || '',
      firDate:     this._safeDate(data.FIRDt),
      stationName: data.PSName   || '',
      thanaCode:   data.PSCode   || '',
      // adhiName / adhiDesignation / adhiThana come from the adhikari list API
    });

    // Charge Sheet section
    this.chargeSheetForm.patchValue({
      chargeSheetNo:         data.ChargeSheetNo            || '',
      chartSheetDate:        this._safeDate(data.ChargeSheetDate),
      dateFilingBeforeCourt: this._safeDate(data.DateBeforeFillingCourt),
      investigatingOfficer:  data.InvestigatingNameRank    || '',
      caseTitle:             data.TitleOfCase              || '',
    });

    // Disable all fields to make them readonly
    this.firDetailsForm.disable();
    this.chargeSheetForm.disable();
  }

  // ===================== ADHIKARI =====================
  addAdhikari(): void {
    if (this.isReadonly) return;

    const vals      = this.firDetailsForm.value;
    const reqFields = ['adhiName', 'adhiThana', 'adhiDesignation'];

    if (!vals.adhiThana || !vals.adhiDesignation || !vals.adhiName) {
      reqFields.forEach(key => this.firDetailsForm.get(key)?.markAsTouched());
      this.notify.showNotification('info', constants.allFieldsReq);
      return;
    }

    if (!this.caseId) {
      this.notify.showNotification('error', constants.apiError);
      return;
    }

    const reqParam = {
      investId:      this.adhikariEditId || 0,
      investGroupNo: this.caseId,
      investName:    vals.adhiName,
      fatherName:    '',
      rankName:      vals.adhiDesignation,
      postingPlace:  vals.adhiThana,
      gender:        0,
      mobileNo:      '',
      districtId:    8,
      thanaId:       0,
      investStatus:  1
    };

    this.api.post(this.url.addFirChargeSheetAdhikari(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.adhikariEditId = null;
          this.notify.showNotification('success', res.message);
          reqFields.forEach(i => this.firDetailsForm.controls[i].reset());
          this.getChargeSheetAdhikariList();
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }

  editAdhikari(e: any): void {
    if (this.isReadonly) return;
    this.firDetailsForm.patchValue({
      adhiName:        e?.InvestName   || '',
      adhiDesignation: e?.RankName     || '',
      adhiThana:       e?.PostingPlace || '',
    });
    this.adhikariEditId = e?.InvestId;
  }

  removeAdhikari(id: number): void {
    if (this.isReadonly) return;
    this.api.post(this.url.deleteChargeSheetAdhikari(id), {}).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('delete', res.message);
          this.getChargeSheetAdhikariList();
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }

  getChargeSheetAdhikariList(): void {
    if (!this.caseId) return;
    this.api.get(this.url.getChargeSheetAdhikariList(this.caseId)).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.adhikaris = res.data;
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }

  // ===================== DROPDOWNS =====================
  getClassificationDropdown(): void {
    this.api.get(this.url.getCrimeClassificationDropdown()).subscribe({
      next:  (res: any) => { this.classificationDropdown = res.data; },
      error: (err: Error) => { throw new Error(err?.message); }
    });
  }

  getActsDropdown(ifInit?: string): void {
    if (!ifInit) this.chargeSheetForm.controls['acts'].setValue(null);
    this.getCrimeSubActDropdown(ifInit ? 'init' : '');

    if (!this.chargeSheetForm.value.classification) {
      this.actsDropdown = [];
      return;
    }

    const reqParam = { CrimeClsId: this.chargeSheetForm.value.classification };
    this.api.get(this.url.getCrimeActDropdown(), reqParam).subscribe({
      next:  (res: any) => { this.actsDropdown = res.data; },
      error: (_err: any) => {}
    });
  }

  getCrimeSubActDropdown(ifInit?: string): void {
    if (!ifInit) this.chargeSheetForm.controls['sections'].setValue(null);

    if (!this.chargeSheetForm.value.acts) {
      this.sectionsDropdown = [];
      return;
    }

    const reqParam = {
      CrimeActId: this.chargeSheetForm.value.acts,
      CrimeClsId: this.chargeSheetForm.value.classification,
    };
    this.api.get(this.url.getCrimeSubActDropdown(), reqParam).subscribe({
      next:  (res: any) => { this.sectionsDropdown = res.data; },
      error: (_err: any) => {}
    });
  }

  // ===================== CHARGE SHEET CRIME =====================
  addChargeSheetCrime(): void {
    if (this.isReadonly) return;

    const form      = this.chargeSheetForm.value;
    const reqFields = ['classification', 'acts', 'sections'];

    if (!form.classification || !form.acts || !form.sections) {
      reqFields.forEach(key => this.chargeSheetForm.get(key)?.markAsTouched());
      this.notify.showNotification('info', constants.allFieldsReq);
      return;
    }

    const classificationName = this.classificationDropdown.find(i => i.value == form.classification)?.text;
    const actName            = this.actsDropdown.find(i => i.value == form.acts)?.text;
    const sectionName        = this.sectionsDropdown.find(i => i.value == form.sections)?.text;

    const reqParams = {
      offenceClassifId:      this.editOffenceId || 0,
      offenceClassifGroupNo: this.caseId,
      isCaseComplaintReg:    0,
      classificationID:      form.classification,
      classificationName:    classificationName || '',
      actsID:                form.acts,
      actsName:              actName            || '',
      sectionsID:            form.sections,
      sectionsName:          sectionName        || ''
    };

    this.api.post(this.url.addEditClassificationOffence(), reqParams).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.editOffenceId = null;
          this.notify.showNotification('success', res.message);
          this.getChargeSheetOffenceList();
          reqFields.forEach(i => this.chargeSheetForm.controls[i].reset());
        }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }

  getChargeSheetOffenceList(): void {
    this.api.get(this.url.getClassificationOffence(this.caseId)).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.chargeSheetCrimeList = res?.data;
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: (err: Error) => { throw new Error(err?.message); }
    });
  }

  deleteChargeSheetOffence(e: any): void {
    if (this.isReadonly) return;
    this.api.post(this.url.deleteClassificationOffence(e?.OffenceClassifId), {}).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('delete', res.message);
          this.getChargeSheetOffenceList();
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }

  editChargeSheetOffence(e: any): void {
    if (this.isReadonly) return;
    this.chargeSheetForm.patchValue({
      classification: e?.ClassificationID || null,
      acts:           e?.ActsID           || null,
      sections:       e?.SectionsID       || null
    });
    if (this.chargeSheetForm.value.classification) this.getActsDropdown('init');
    this.editOffenceId = e?.OffenceClassifId;
  }

  // ===================== SAVE STEP =====================
  addEditChargeSheet(): void {
    if (this.isReadonly) return;

    if (!this.firDetailsForm.valid) {
      this.firDetailsForm.markAllAsTouched();
      return;
    }

    const reqParam = {
      dirRegId:               this.caseId,
      steps:                  2,
      firNo:                  this.firDetailsForm.value.firNo              || '',
      firDt:                  this.firDetailsForm.value.firDate            || '',
      psName:                 this.firDetailsForm.value.stationName        || '',
      psCode:                 this.firDetailsForm.value.thanaCode          || '',
      investGroupNo:          this.caseId,
      chargeSheetNo:          this.chargeSheetForm.value.chargeSheetNo,
      chargeSheetDate:        this.chargeSheetForm.value.chartSheetDate,
      dateBeforeFillingCourt: this.chargeSheetForm.value.dateFilingBeforeCourt,
      investigatingNameRank:  this.chargeSheetForm.value.investigatingOfficer,
      titleOfCase:            this.chargeSheetForm.value.caseTitle,
      cClassificationId:      0,
      crimeActId:             0,
      crimeActSubId:          0
    };

    this.api.post(this.url.regChargeSheet(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.message);
          this.firChargeSheetC.emit(true);
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: (err: Error) => {
        this.notify.showNotification('error', constants.apiError);
        throw new Error(err?.message);
      }
    });
  }

  // ===================== UTILS =====================
  compareWithFunc(a: any, b: any): boolean {
    return a?.['value'] ? a['value'] == b : false;
  }
}