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
  selector: 'app-add-crime-sub-act',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    CommonModule
  ],
  templateUrl: './add-crime-sub-act.component.html',
  styleUrl: './add-crime-sub-act.component.css'
})
export class AddCrimeSubActComponent {

  editCrimeSubActData: any;
  crimeClassificationDropdown: DropdownListInterface[] = [];
  crimeActDropdown: DropdownListInterface[] = [];

  // ===================== FORM =====================
  addCrimeSubActForm: FormGroup = new FormGroup({
    crimeSubActEnglish: new FormControl(null, [Validators.required]),
    crimeSubActHindi:   new FormControl(''),
    crimeSubActShort:   new FormControl(null, [Validators.required]),
    crimeSubActDesc:    new FormControl(null, [Validators.required]),
    classification:     new FormControl(null, [Validators.required]),
    crimeAct:           new FormControl(null, [Validators.required])
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
    this.editCrimeSubActData = history.state?.editCrimeSubActData;

    if (this.editCrimeSubActData) {
      this.getClassificationDropdown();
      this.addCrimeSubActForm.patchValue({
        crimeSubActEnglish: this.editCrimeSubActData?.CrimeSubActNameEnglish || '',
        crimeSubActHindi:   this.editCrimeSubActData?.CrimeSubActNameHindi   || '',
        crimeSubActShort:   this.editCrimeSubActData?.CrimeSubActShortName   || '',
        crimeSubActDesc:    this.editCrimeSubActData?.CrimeSubActDescription  || '',
        classification:     this.editCrimeSubActData?.CrimeClsId             || null,
        crimeAct:           this.editCrimeSubActData?.CrimeActId             || null
      });
      // Load act dropdown without resetting the act value
      if (this.addCrimeSubActForm.value.classification) {
        this.getCrimeActDropdown(true);
      }
    } else {
      this.getClassificationDropdown();
    }
  }

  // ===================== COMPARE FN =====================
  compareWithFunc(a: any, b: any): boolean {
    return a?.['value'] ? a['value'] == b : false;
  }

  // ===================== DROPDOWNS =====================
  getClassificationDropdown() {
    this.api.get(this.url.getCrimeClassificationDropdown()).subscribe({
      next:  (res: any) => { this.crimeClassificationDropdown = res.data; },
      error: () => {}
    });
  }

  getCrimeActDropdown(ifInit?: boolean) {
    if (!ifInit) this.addCrimeSubActForm.controls['crimeAct'].reset();

    if (!this.addCrimeSubActForm.value.classification) {
      this.crimeActDropdown = [];
      return;
    }

    const reqParam = {
      CrimeClsId: this.addCrimeSubActForm.value.classification || 0
    };

    this.api.get(this.url.getCrimeActDropdown(), reqParam).subscribe({
      next:  (res: any) => { this.crimeActDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== SAVE =====================
  onSave() {
    if (!this.addCrimeSubActForm.valid) {
      this.addCrimeSubActForm.markAllAsTouched();
      return;
    }

    const reqParam = {
      crimeSubActId:          this.editCrimeSubActData?.CrimeSubActId || 0,
      crimeActId:             this.addCrimeSubActForm.value.crimeAct          || 0,
      crimeClsId:             this.addCrimeSubActForm.value.classification,
      crimeSubActNameEnglish: this.addCrimeSubActForm.value.crimeSubActEnglish || '',
      crimeSubActNameHindi:   this.addCrimeSubActForm.value.crimeSubActHindi   || '',
      crimeSubActShortName:   this.addCrimeSubActForm.value.crimeSubActShort   || '',
      crimeSubActDescription: this.addCrimeSubActForm.value.crimeSubActDesc    || '',
      createdBy:              0,
      updatedBy:              0
    };

    this.api.post(this.url.addEditSubCrimeAct(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.msg || res.message);
          window.scrollTo(0, 0);
          this._router.navigateByUrl('master/crime-sub-act');
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
    this._router.navigateByUrl('master/crime-sub-act');
  }
}