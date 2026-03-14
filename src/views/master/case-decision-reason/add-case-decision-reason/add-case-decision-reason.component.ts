import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-add-case-decision-reason',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, CommonModule],
  templateUrl: './add-case-decision-reason.component.html',
  styleUrl: './add-case-decision-reason.component.css'
})
export class AddCaseDecisionReasonComponent implements OnInit {

  editDecisionReason: any;
  decisionTypeDropdown: DropdownListInterface[] = [];

  // ===================== FORM =====================
  addDecisionReasonForm: FormGroup = new FormGroup({
    decisionReasonEnglish: new FormControl(null, [Validators.required]),
    decisionReasonHindi:   new FormControl(''),
    decisionType:          new FormControl(null, [Validators.required])
  });

  constructor(
    public restrictChar: WordsRestrictService,
    private notify:      NotificationService,
    private api:         ApiService,
    private url:         UrlService,
    private _router:     Router
  ) {}

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.editDecisionReason = history.state?.office;

    this.getDecisionTypeDropdown();

    if (this.editDecisionReason) {
      // ✅ FIX 1: use correct PascalCase field names from actual JSON
      this.addDecisionReasonForm.patchValue({
        decisionReasonEnglish: this.editDecisionReason?.DecisionReasonEnglish || '',
        decisionReasonHindi:   this.editDecisionReason?.DecisionReasonHindi   || '',
        decisionType:          this.editDecisionReason?.DecisionTypeId        || null
      });
    }
  }

  // ===================== COMPARE FN =====================
  compareWithFunc(a: any, b: any): boolean {
    return a?.['value'] ? a['value'] == b : false;
  }

  // ===================== DROPDOWN =====================
  getDecisionTypeDropdown(): void {
    this.api.get(this.url.getDecisionTypeDropDownlist()).subscribe({
      next:  (res: any) => { this.decisionTypeDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== SAVE =====================
  onSave(): void {
    if (!this.addDecisionReasonForm.valid) {
      this.addDecisionReasonForm.markAllAsTouched();
      return;
    }

    // ✅ FIX 2: remove data:{} wrapper — API expects root-level PascalCase fields
    const reqParam = {
      DecisionReasonId:      this.editDecisionReason?.DecisionReasonId || 0,
      DecisionTypeId:        this.addDecisionReasonForm.value.decisionType,
      DecisionReasonEnglish: this.addDecisionReasonForm.value.decisionReasonEnglish,
      DecisionReasonHindi:   this.addDecisionReasonForm.value.decisionReasonHindi || '',
      CreatedBy:             0,
      UpdatedBy:             0
    };

    this.api.post(this.url.addEditDecisionReason(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.msg || res.message);
          window.scrollTo(0, 0);
          this._router.navigateByUrl('master/case-decision-reason');
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
  onCancel(): void {
    this._router.navigateByUrl('master/case-decision-reason');
  }
}