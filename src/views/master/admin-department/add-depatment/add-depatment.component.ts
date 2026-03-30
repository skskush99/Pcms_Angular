import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UrlService } from '../../../shared/services/url.service';
import { WordsRestrictService } from '../../../shared/services/words-restrict.service';

@Component({
  selector: 'app-add-depatment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-depatment.component.html',
  styleUrl: './add-depatment.component.css'
})
export class AddDepatmentComponent {

  editAdminDept: any;

  // ✅ FORM
  addAdminDeptForm: FormGroup = new FormGroup({
    adminDept: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[A-Za-z ]+$')
    ]),
    shortName: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[A-Za-z ]+$')
    ])
  });

  constructor(
    public restrictChar: WordsRestrictService,
    private notify: NotificationService,
    private api: ApiService,
    private url: UrlService,
    private _router: Router
  ) {}

  // ===================== INIT =====================
  ngOnInit(): void {
    this.editAdminDept = history.state?.addEditAdminDept;

    if (this.editAdminDept) {

      console.log('EDIT DATA:', this.editAdminDept); // debug

      // ✅ Bind values
      this.addAdminDeptForm.patchValue({
        adminDept: this.editAdminDept.AdmDeptName || '',
        shortName: this.editAdminDept.AdmDeptShortName || ''
      });
    }
  }

  // ===================== SAVE =====================
  onSave() {
    if (!this.addAdminDeptForm.valid) {
      this.addAdminDeptForm.markAllAsTouched();
      return;
    }

    const reqParam = {
      data: {
        // 🔥 FIX: use correct ID mapping
        admDeptId: this.editAdminDept?.admDeptId || this.editAdminDept?.AdmDeptId || 0,

        admDeptName: this.addAdminDeptForm.value.adminDept,
        admDeptShortName: this.addAdminDeptForm.value.shortName,

        active: true,
        createdBy: 0,
        createdOn: new Date().toISOString(),
        updatedBy: 0,
        updatedOn: new Date().toISOString(),
        deleteBy: 0,
        deleteOn: new Date().toISOString(),
        rowID: 0
      }
    };

    console.log('FINAL PAYLOAD:', reqParam); // debug

    this.api.post(this.url.addEditAdminDept(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.msg || res.message);
          window.scrollTo(0, 0);
          this._router.navigateByUrl('master/admin-dept');
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
  onCancel() {
    this._router.navigateByUrl('master/admin-dept');
  }

  // ===================== PASTE HANDLER =====================
  onPasteOnlyLetters(event: ClipboardEvent, controlName: string): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const lettersOnly = pastedText.replace(/[^a-zA-Z]/g, '');
    this.addAdminDeptForm.patchValue({ [controlName]: lettersOnly.trim() });
  }
}