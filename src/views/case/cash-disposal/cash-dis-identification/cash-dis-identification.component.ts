

import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
export class CashDisIdentificationComponent implements OnInit {

  // ===================== SERVICES =====================
  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);
  dialog = inject(MatDialog);

  // ===================== INPUTS / OUTPUTS =====================
  @Input()  caseId: any;
  @Output() caseIdentification = new EventEmitter<any>();

  // ===================== DROPDOWNS =====================
  thanaDropdown:   DropdownListInterface[] = [];
  firYearDropdown: DropdownListInterface[] = [];

  // ===================== FORM =====================
  caseIdentificationForm: FormGroup = new FormGroup({
    regType:        new FormControl('1'),
    searchCaseVia:  new FormControl('1'),
    thana:          new FormControl(null),
    firNo:          new FormControl('', [Validators.required]),
    firYear:        new FormControl(null),
    cisCnr:         new FormControl(''),
  });

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.firYearDropdown = createYearList(1950);
    this.getPoliceStationDropdown();
  }

  // ===================== DROPDOWN =====================
  getPoliceStationDropdown(): void {
    this.api.get(this.url.getPoliceStationDropdown()).subscribe({
      next:  (res: any) => { this.thanaDropdown = res.data; },
      error: (err: Error) => { throw new Error(err?.message); }
    });
  }

  // ===================== ACTIONS =====================
  regCaseIdentification(): void {
    if (!this.caseIdentificationForm.valid) {
      this.caseIdentificationForm.markAllAsTouched();
      return;
    }

    const f = this.caseIdentificationForm.value;
    const reqParams = {
      dirRegId:       0,
      steps:          1,
      districtId:     8,
      officeId:       8,
      jCourtId:       8,
      registerType:   f.regType,
      searchCaseVia:  f.searchCaseVia,
      dierNo:         '',
      cnrNo:          f.cisCnr  || '',
      firNo:          f.firNo   || '',
      firYear:        f.firYear || 0
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
            data:       res.data?.data
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