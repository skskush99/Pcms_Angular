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
  selector: 'app-add-office',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    CommonModule
  ],
  templateUrl: './add-office.component.html',
  styleUrl: './add-office.component.css'
})
export class AddOfficeComponent {

  editOffice: any;
  districtDropdown: DropdownListInterface[] = [];

  // ===================== FORM =====================
  addOfficeForm: FormGroup = new FormGroup({
    officeEng: new FormControl(null, [Validators.required]),
    officeHin: new FormControl(''),
    district:  new FormControl(null, [Validators.required])
  });

  constructor(
    public restrictChar: WordsRestrictService,
    private notify:  NotificationService,
    private api:     ApiService,
    private url:     UrlService,
    private _router: Router
  ) {}

  // ===================== INIT =====================
  ngOnInit(): void {
    this.editOffice = history.state?.office;

    if (this.editOffice) {

      console.log('EDIT DATA:', this.editOffice); // 🔍 debug

      this.addOfficeForm.patchValue({
        officeEng: this.editOffice?.OfficeEng || '',

        // 🔥 FIX HERE (handle both possible keys)
        officeHin: this.editOffice?.OfficeHin || this.editOffice?.OfficeHindi || '',

        district: this.editOffice?.DistrictId || null
      });
    }

    this.getDistrictDropdown();
  }

  // ===================== COMPARE FN =====================
  compareWithFunc(a: any, b: any): boolean {
    return a?.['value'] ? a['value'] == b : false;
  }

  // ===================== DROPDOWN =====================
  getDistrictDropdown() {
    this.api.get(this.url.getDistrictDropDown()).subscribe({
      next:  (res: any) => { this.districtDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== SAVE =====================
  onSave() {
    if (!this.addOfficeForm.valid) {
      this.addOfficeForm.markAllAsTouched();
      return;
    }

    const reqParam = {
      data: {
        officeId: this.editOffice?.OfficeId || 0,
        officeEng: this.addOfficeForm.value.officeEng,

        // 🔥 always send correct field name
        officeHindi: this.addOfficeForm.value.officeHin || '',

        districtId: this.addOfficeForm.value.district,
        isActive: 1,
        createdBy: 0,
        updatedBy: 0
      }
    };

    console.log('FINAL PAYLOAD:', reqParam);

    this.api.post(this.url.addEditOffice(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.msg || res.message);
          window.scrollTo(0, 0);
          this._router.navigateByUrl('master/office');
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
    this._router.navigateByUrl('master/office');
  }
}