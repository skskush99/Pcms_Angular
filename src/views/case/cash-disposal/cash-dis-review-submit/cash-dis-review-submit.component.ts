import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { UrlService } from '../../../shared/services/url.service';
import { NotificationService } from '../../../shared/services/notification.service';
import constants from '../../../shared/utils/constants';


// ===================== ENUMS / INTERFACES =====================
enum FileType {
  chargeSheetDocs     = 1,
  fullChargeSheetDocs = 2,
  otherDocs           = 3
}

interface UploadFile {
  file:   File;
  error?: string;
  name?:  string;
}

@Component({
 selector: 'app-cash-dis-review-submit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cash-dis-review-submit.component.html',
  styleUrl: './cash-dis-review-submit.component.css'
})
export class CashDisReviewSubmitComponent implements OnInit {

  // ===================== SERVICES =====================
  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);

  // ===================== INPUTS =====================
  @Input() caseId: any;

  // ===================== STATE =====================
  fileType = FileType;
  files: Partial<Record<FileType, UploadFile>> = {};

  // ===================== FORM =====================
  caseSubmitForm: FormGroup = new FormGroup({
    remarks: new FormControl('')
  });

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {}

  // ===================== FILE UPLOAD =====================
  onFileChange(event: any, type: FileType): void {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes  = ['application/pdf'];
    const maxSizeBytes  = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      this.files[type] = { file, error: 'Only PDF files are allowed' };
      return;
    }

    if (file.size > maxSizeBytes) {
      this.files[type] = { file, error: 'File size must be less than 5MB' };
      return;
    }

    this.files[type] = { file };
  }

  // ===================== SUBMIT =====================
  submitCaseForm(): void {
    const hasError =
      this.files[this.fileType.chargeSheetDocs]?.error ||
      this.files[this.fileType.fullChargeSheetDocs]?.error ||
      this.files[this.fileType.otherDocs]?.error;

    if (hasError) {
      this.notify.showNotification('error', constants.FileSizeExceeding);
      return;
    }

    if (
      !this.files[this.fileType.chargeSheetDocs]?.file ||
      !this.files[this.fileType.fullChargeSheetDocs]?.file
    ) {
      this.notify.showNotification('info', constants.allFilesMandate);
      return;
    }

    const formData = new FormData();
    formData.append('SelectFile',         this.files[this.fileType.chargeSheetDocs]!.file);
    formData.append('SelectFile1',        this.files[this.fileType.fullChargeSheetDocs]!.file);
    formData.append('SelectFile2',        this.files[this.fileType.otherDocs]!.file);
    formData.append('DirRegId',           this.caseId);
    formData.append('Steps',              '5');
    formData.append('Remarks',            this.caseSubmitForm.value.remarks || '');
    formData.append('ChargeSheetDocs',    this.files[this.fileType.chargeSheetDocs]!.file?.name || '');
    formData.append('FullChargeSheetDocs',this.files[this.fileType.fullChargeSheetDocs]!.file?.name || '');
    formData.append('OtherDocs',          this.files[this.fileType.otherDocs]!.file?.name || '');
    formData.append('CaseStatus',         '1');

    this.api.post(this.url.submitReviewCase(), formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.message);
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