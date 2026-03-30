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
  selector: 'app-add-nodal-officer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    CommonModule
  ],
  templateUrl: './add-nodal-officer.component.html',
  styleUrl: './add-nodal-officer.component.css'
})
export class AddNodalOfficerComponent {

  editCrimeActData: any;
  NodalOfficersDropdown: DropdownListInterface[] = [];

  // ===================== FORM =====================
  addCrimeActForm: FormGroup = new FormGroup({
    crimeActEnglish: new FormControl(null, [Validators.required]),
    crimeActHindi:   new FormControl(''),
    crimeActShort:   new FormControl(null, [Validators.required]),
    crmieActDesc:    new FormControl(null, [Validators.required]),
    classification:  new FormControl(null, [Validators.required])
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
    this.editCrimeActData = history.state?.editCrimeActData;

    if (this.editCrimeActData) {
      this.addCrimeActForm.patchValue({
        crimeActEnglish: this.editCrimeActData?.CrimeActNameEnglish || '',
        crimeActHindi:   this.editCrimeActData?.CrimeActNameHindi   || '',
        crimeActShort:   this.editCrimeActData?.CrimeActShortName   || '',
        crmieActDesc:    this.editCrimeActData?.CrimeActDescription  || '',
        classification:  this.editCrimeActData?.CrimeClsId          || null
      });
    }

    this.getNodalofficerDropdown();
  }

  // ===================== COMPARE FN =====================
  compareWithFunc(a: any, b: any): boolean {
    return a?.['value'] ? a['value'] == b : false;
  }

  // ===================== DROPDOWN =====================
  getNodalofficerDropdown() {
    this.api.get(this.url.getNodalOfficerDropdown()).subscribe({
      next:  (res: any) => { this.NodalOfficersDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== SAVE =====================
  onSave() {
    if (!this.addCrimeActForm.valid) {
      this.addCrimeActForm.markAllAsTouched();
      return;
    }

    const reqParam = {
      crimeActId:          this.editCrimeActData?.CrimeActId || 0,
      crimeClsId:          this.addCrimeActForm.value.classification,
      crimeActNameEnglish: this.addCrimeActForm.value.crimeActEnglish || '',
      crimeActNameHindi:   this.addCrimeActForm.value.crimeActHindi   || '',
      crimeActShortName:   this.addCrimeActForm.value.crimeActShort   || '',
      crimeActDescription: this.addCrimeActForm.value.crmieActDesc    || '',
      createdBy:           0,
      updatedBy:           0
    };

    this.api.post(this.url.addEditNodalOfficer(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.msg || res.message);
          window.scrollTo(0, 0);
          this._router.navigateByUrl('master/nodal-officer');
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
    this._router.navigateByUrl('master/nodal-officer');
  }
}