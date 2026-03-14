import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownListInterface } from '../../../shared/model/shared.model';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UrlService } from '../../../shared/services/url.service';
import { WordsRestrictService } from '../../../shared/services/words-restrict.service';
import constants from '../../../shared/utils/constants';

@Component({
  selector: 'app-add-court',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    CommonModule
  ],
  templateUrl: './add-court.component.html',
  styleUrl: './add-court.component.css'
})
export class AddCourtComponent {

  editCourt: any;
  divisionDropdown: DropdownListInterface[] = [];
  districtDropdown: DropdownListInterface[] = [];

  // ===================== FORM =====================
  addCourtForm: FormGroup = new FormGroup({
    courtEng: new FormControl(null, [Validators.required]),
    courtHin: new FormControl('',   [Validators.required]),
    division: new FormControl(null, [Validators.required]),
    district: new FormControl(null)
  });

  constructor(
    public restrictChar: WordsRestrictService,
    private notify:  NotificationService,
    private api:     ApiService,
    private url:     UrlService,
    private _router: Router
  ) {}

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.editCourt = history.state?.court;
    this.getDivisionDropdown();

    if (this.editCourt) {
      this.addCourtForm.patchValue({
        courtEng: this.editCourt?.JCourtEng   || '',
        courtHin: this.editCourt?.JCourtHindi || '',
        division: this.editCourt?.DivisionId  || null,
        district: this.editCourt?.DistrictId  || null
      });
      // Load district dropdown without resetting the district value
      if (this.addCourtForm.value.division) {
        this.getDistrictDropdown('init');
      }
    }
  }

  // ===================== COMPARE FN =====================
  compareWithFunc(a: any, b: any): boolean {
    return a?.['value'] ? a['value'] == b : false;
  }

  // ===================== DROPDOWNS =====================
  getDivisionDropdown() {
    this.api.post(this.url.getDivisionDropdown()).subscribe({
      next:  (res: any) => { this.divisionDropdown = res.data; },
      error: () => {}
    });
  }

  getDistrictDropdown(ifInit?: string) {
    if (!ifInit) this.addCourtForm.controls['district'].reset();

    if (!this.addCourtForm.value.division) {
      this.districtDropdown = [];
      return;
    }

    const reqParam = {
      DivisionId: this.addCourtForm.value.division
    };

    this.api.get(this.url.getDistrictDropDown(), reqParam).subscribe({
      next:  (res: any) => { this.districtDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== SAVE =====================
  onSave() {
    if (!this.addCourtForm.valid) {
      this.addCourtForm.markAllAsTouched();
      return;
    }

    const reqParam = {
      data: {
        jCourtId:    this.editCourt?.jCourtId              || 0,
        jCourtCode:  0,
        jCourtEng:   this.addCourtForm.value.courtEng      || '',
        jCourtHindi: this.addCourtForm.value.courtHin      || '',
        divisionId:  this.addCourtForm.value.division      || 0,
        districtId:  this.addCourtForm.value.district      || 0,
        officeId:    1,
        isActive:    true,
        createdBy:   0,
        updatedBy:   0
      }
    };

    this.api.post(this.url.addEditCourt(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.msg || res.message);
          window.scrollTo(0, 0);
          this._router.navigateByUrl('master/court');
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
        window.scrollTo(0, 0);
      }
    });
  }

  // ===================== CANCEL =====================
  onCancel() {
    this._router.navigateByUrl('master/court');
  }
}