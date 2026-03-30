import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
}

@Component({
  selector: 'app-case-dis-file',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './case-dis-file.component.html',
  styleUrl: './case-dis-file.component.css'
})
export class CaseDisFileComponent implements OnInit {

  // ===================== SERVICES =====================
  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);

  // ===================== INPUTS / OUTPUTS =====================
  @Input()  caseId: any;

  // ✅ FIX 1: Add @Output so stepper can listen and call saveAndNext()
  @Output() caseFileSubmit = new EventEmitter<any>();

  // ===================== STATE =====================
  fileType = FileType;
  files: Partial<Record<FileType, UploadFile>> = {};

 
  // ===================== LIFECYCLE =====================
  ngOnInit(): void {}

  // ===================== FILE UPLOAD =====================
  onFileChange(event: any, type: FileType): void {
    const file = event.target.files[0];
    if (!file) return;

    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    if (file.type !== 'application/pdf') {
      this.files[type] = { file, error: 'Only PDF files are allowed' };
      return;
    }

    if (file.size > maxSizeBytes) {
      this.files[type] = { file, error: 'File size must be less than 5MB' };
      return;
    }

    // Valid file — clear any previous error
    this.files[type] = { file };
  }

  // ===================== SUBMIT =====================
  submitCasefile(): void {

    // 1. Check file validation errors
    const hasError =
      this.files[this.fileType.chargeSheetDocs]?.error     ||
      this.files[this.fileType.fullChargeSheetDocs]?.error  ||
      this.files[this.fileType.otherDocs]?.error;

    if (hasError) {
      this.notify.showNotification('error', constants.FileSizeExceeding);
      return;
    }

    // 2. Check required files are selected
    if (
      !this.files[this.fileType.chargeSheetDocs]?.file ||
      !this.files[this.fileType.fullChargeSheetDocs]?.file
    ) {
      this.notify.showNotification('info', constants.allFilesMandate);
      return;
    }

    // 3. Build FormData
    const formData = new FormData();
    formData.append('SelectFile',          this.files[this.fileType.chargeSheetDocs]!.file);
    formData.append('SelectFile1',         this.files[this.fileType.fullChargeSheetDocs]!.file);
    if (this.files[this.fileType.otherDocs]?.file) {
      formData.append('SelectFile2',       this.files[this.fileType.otherDocs]!.file);
      formData.append('OtherDocs',         this.files[this.fileType.otherDocs]!.file.name);
    }
    formData.append('DirRegId',            String(this.caseId));
    formData.append('Steps',              '4');  
    formData.append('ChargeSheetDocs',     this.files[this.fileType.chargeSheetDocs]!.file.name);
    formData.append('FullChargeSheetDocs', this.files[this.fileType.fullChargeSheetDocs]!.file.name);
    formData.append('CaseStatus',         '1');

    // 4. Submit — ✅ FIX 2: emit caseFileSubmit on success so stepper advances
    this.api.post(this.url.submitReviewCase(), formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.message);
          this.caseFileSubmit.emit(this.caseId); // ← stepper saveAndNext() is called
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