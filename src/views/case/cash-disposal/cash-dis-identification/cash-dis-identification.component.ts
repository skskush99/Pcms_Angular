import {
  Component, EventEmitter, Input, OnChanges, OnInit,
  Output, SimpleChanges, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../shared/services/api.service';
import { UrlService } from '../../../shared/services/url.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { DropdownListInterface } from '../../../shared/model/shared.model';
import { createYearList } from '../../../shared/utils/utils';
import constants from '../../../shared/utils/constants';
import { ECourtCnrSearchComponent } from '../../../shared/components/e-court-cnr-search/e-court-cnr-search.component';

@Component({
  selector: 'app-cash-dis-identification',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule],
  templateUrl: './cash-dis-identification.component.html',
  styleUrl: './cash-dis-identification.component.css'
})
export class CashDisIdentificationComponent implements OnInit, OnChanges {

  // SERVICES
  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);
  dialog = inject(MatDialog);

  // INPUT / OUTPUT
  @Input()  caseId:   any;
  @Input()  caseData: any = null;
  @Output() caseIdentification = new EventEmitter<any>();

  // STATE
  isReadonly = false;

  // DROPDOWN DATA
  thanaDropdown:   DropdownListInterface[] = [];
  firYearDropdown: DropdownListInterface[] = [];

  // FORM
  caseIdentificationForm: FormGroup = new FormGroup({
    regType:       new FormControl('1'),
    searchCaseVia: new FormControl('1'),
    thana:         new FormControl<string | null>(null),
    firNo:         new FormControl('', [Validators.required]),
    firYear:       new FormControl<string | null>(null),
    cisCnr:        new FormControl(''),
  });

  ngOnInit(): void {
    this.firYearDropdown = createYearList(1950);
    this.getPoliceStationDropdown();
    if (this.caseData) this._bindCaseData(this.caseData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['caseData']?.currentValue) {
      this._bindCaseData(changes['caseData'].currentValue);
    }
  }

  private _bindCaseData(data: any): void {
    if (!data) return;

    this.isReadonly = true;

    this.caseIdentificationForm.patchValue({
      regType:       String(data.RegisterType  ?? '1'),
      searchCaseVia: String(data.SearchCaseVia ?? '1'),
      thana:         data.PSName || null,                         // सीधे PSName bind
      firNo:         data.FIRNo  || '',
      firYear:       data.FIRYear ? String(data.FIRYear) : null,
      cisCnr:        data.CNRNo  || '',
    });

    this.caseIdentificationForm.disable();
  }
  



getPoliceStationDropdown(): void {
  this.api.get(this.url.getPoliceStationDropdown()).subscribe({
    next: (res: any) => {    
      this.thanaDropdown = res.data.map((x: any) => ({
        text:  x.PSName?.trim(),   
        value: x.PSName?.trim()    
      }));      
      if (this.caseData) {
        this._bindCaseData(this.caseData);
      }
    },
    error: (err: Error) => { throw new Error(err?.message); }
  });
}
  

  regCaseIdentification(): void {
    if (this.isReadonly) return;

    if (!this.caseIdentificationForm.valid) {
      this.caseIdentificationForm.markAllAsTouched();
      return;
    }

    const f = this.caseIdentificationForm.value;
    const reqParams = {
      dirRegId:      0,
      steps:         1,
      districtId:    8,
      officeId:      8,
      jCourtId:      8,
      registerType:  f.regType,
      searchCaseVia: f.searchCaseVia,
      dierNo:        '',
      cnrNo:         f.cisCnr  || '',
      firNo:         f.firNo   || '',
      firYear:       f.firYear || 0
    };

    this.api.post(this.url.regCaseIdentification(), reqParams).subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.notify.showNotification('success', res.message);
          this.caseIdentification.emit(res?.returnID);
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

  searnCnrCis(): void {
    if (this.isReadonly) return;

    if (!this.caseIdentificationForm.value.cisCnr) {
      this.notify.showNotification('info', constants.cnrNotAvail);
      return;
    }

    this.api.get(this.url.searchCaseByCNRECourt(this.caseIdentificationForm.value.cisCnr)).subscribe({
      next: (res: any) => {
        if (res.status && !Object.hasOwn(res.data?.data, 'Error')) {
          this.dialog.open(ECourtCnrSearchComponent, {
            width:     '95dvw',
            maxHeight: '85dvh',
            data:      res.data?.data
          });
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
}