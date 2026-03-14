import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UrlService } from '../../../shared/services/url.service';
import { WordsRestrictService } from '../../../shared/services/words-restrict.service';

@Component({
  selector: 'app-add-case-decision',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-case-decision.component.html',
  styleUrl: './add-case-decision.component.css'
})
export class AddCaseDecisionComponent implements OnInit {

  editDecision: any;

  // ===================== FORM =====================
  addDecisionForm: FormGroup = new FormGroup({
    decisTypeEnglish: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[A-Za-z ]+$')
    ]),
    decisTypeHindi: new FormControl('', [
      Validators.required
    ])
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
    this.editDecision = history.state?.decision;

    if (this.editDecision) {
      // ✅ FIX 1: JSON fields are PascalCase — DecisionTypeEnglish, DecisionTypeHindi
      this.addDecisionForm.controls['decisTypeEnglish'].setValue(this.editDecision.DecisionTypeEnglish);
      this.addDecisionForm.controls['decisTypeHindi'].setValue(this.editDecision.DecisionTypeHindi);
    }
  }

  // ===================== SAVE =====================
  onSave(): void {
    if (!this.addDecisionForm.valid) {
      this.addDecisionForm.markAllAsTouched();
      return;
    }

    // ✅ FIX 2: API expects PascalCase keys — DecisionTypeEnglish, DecisionTypeHindi, DecisionTypeId
    const reqParam = {
      DecisionTypeId:      this.editDecision?.DecisionTypeId || 0,
      DecisionTypeEnglish: this.addDecisionForm.value.decisTypeEnglish,
      DecisionTypeHindi:   this.addDecisionForm.value.decisTypeHindi,
      CreatedBy:           0,
      UpdatedBy:           0
    };

    this.api.post(this.url.addEditDecision(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.msg || res.message);
          window.scrollTo(0, 0);
          this._router.navigateByUrl('master/case-decision-type');
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', 'Something Went Wrong');
        window.scrollTo(0, 0);
      }
    });
  }

  // ===================== CANCEL =====================
  onCancel(): void {
    this._router.navigateByUrl('master/case-decision-type');
  }

  // ===================== PASTE HANDLER =====================
  onPasteOnlyLetters(event: ClipboardEvent, controlName: string): void {
    event.preventDefault();
    const pastedText  = event.clipboardData?.getData('text') || '';
    const lettersOnly = pastedText.replace(/[^a-zA-Z]/g, '');
    this.addDecisionForm.patchValue({ [controlName]: lettersOnly.trim() });
  }
}