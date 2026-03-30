// import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { ApiService } from '../../../shared/services/api.service';
// import { UrlService } from '../../../shared/services/url.service';
// import { NotificationService } from '../../../shared/services/notification.service';
// import constants from '../../../shared/utils/constants';

// // ===================== ENUMS / INTERFACES =====================
// enum FileType {
//   chargeSheetDocs     = 1,
//   fullChargeSheetDocs = 2,
//   otherDocs           = 3
// }

// interface UploadFile {
//   file:   File;
//   error?: string;
// }

// @Component({
//   selector: 'app-case-dis-file',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './case-dis-file.component.html',
//   styleUrl: './case-dis-file.component.css'
// })
// export class CaseDisFileComponent implements OnInit {

//   // ===================== SERVICES =====================
//   api    = inject(ApiService);
//   url    = inject(UrlService);
//   notify = inject(NotificationService);

//   // ===================== INPUTS / OUTPUTS =====================
//   @Input()  caseId: any;

//   // ✅ FIX 1: Add @Output so stepper can listen and call saveAndNext()
//   @Output() caseFileSubmit = new EventEmitter<any>();

//   // ===================== STATE =====================
//   fileType = FileType;
//   files: Partial<Record<FileType, UploadFile>> = {};

 
//   // ===================== LIFECYCLE =====================
//   ngOnInit(): void {}

//   // ===================== FILE UPLOAD =====================
//   onFileChange(event: any, type: FileType): void {
//     const file = event.target.files[0];
//     if (!file) return;

//     const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

//     if (file.type !== 'application/pdf') {
//       this.files[type] = { file, error: 'Only PDF files are allowed' };
//       return;
//     }

//     if (file.size > maxSizeBytes) {
//       this.files[type] = { file, error: 'File size must be less than 5MB' };
//       return;
//     }

//     // Valid file — clear any previous error
//     this.files[type] = { file };
//   }

//   // ===================== SUBMIT =====================
//   submitCasefile(): void {

//     // 1. Check file validation errors
//     const hasError =
//       this.files[this.fileType.chargeSheetDocs]?.error     ||
//       this.files[this.fileType.fullChargeSheetDocs]?.error  ||
//       this.files[this.fileType.otherDocs]?.error;

//     if (hasError) {
//       this.notify.showNotification('error', constants.FileSizeExceeding);
//       return;
//     }

//     // 2. Check required files are selected
//     if (
//       !this.files[this.fileType.chargeSheetDocs]?.file ||
//       !this.files[this.fileType.fullChargeSheetDocs]?.file
//     ) {
//       this.notify.showNotification('info', constants.allFilesMandate);
//       return;
//     }

//     // 3. Build FormData
//     const formData = new FormData();
//     formData.append('SelectFile',          this.files[this.fileType.chargeSheetDocs]!.file);
//     formData.append('SelectFile1',         this.files[this.fileType.fullChargeSheetDocs]!.file);
//     if (this.files[this.fileType.otherDocs]?.file) {
//       formData.append('SelectFile2',       this.files[this.fileType.otherDocs]!.file);
//       formData.append('OtherDocs',         this.files[this.fileType.otherDocs]!.file.name);
//     }
//     formData.append('DirRegId',            String(this.caseId));
//     formData.append('Steps',              '4');  
//     formData.append('ChargeSheetDocs',     this.files[this.fileType.chargeSheetDocs]!.file.name);
//     formData.append('FullChargeSheetDocs', this.files[this.fileType.fullChargeSheetDocs]!.file.name);
//     formData.append('CaseStatus',         '1');

//     // 4. Submit — ✅ FIX 2: emit caseFileSubmit on success so stepper advances
//     this.api.post(this.url.submitReviewCase(), formData).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           this.notify.showNotification('success', res.message);
//           this.caseFileSubmit.emit(this.caseId); // ← stepper saveAndNext() is called
//         } else {
//           this.notify.showNotification('error', res.message);
//         }
//       },
//       error: (err: Error) => {
//         this.notify.showNotification('error', constants.apiError);
//         throw new Error(err?.message);
//       }
//     });
//   }
// }


import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
  file:        File;
  previewUrl?: string;
  error?:      string;
}

interface ExistingFile {
  path:        string;
  fileName:    string;
  previewUrl:  string;
}

@Component({
  selector: 'app-case-dis-file',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './case-dis-file.component.html',
  styleUrl: './case-dis-file.component.css'
})
export class CaseDisFileComponent implements OnInit, OnChanges {

  // ===================== SERVICES =====================
  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);

  // ===================== INPUTS / OUTPUTS =====================
  @Input()  caseId:   any;
  @Input()  caseData: any = null;
  @Output() caseFileSubmit = new EventEmitter<any>();

  // ===================== STATE =====================
  fileType = FileType;

  /** Newly selected files (for upload) */
  files: Partial<Record<FileType, UploadFile>> = {};

  /** Existing files already saved on server (from caseData) */
  existingFiles: Partial<Record<FileType, ExistingFile>> = {};

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    if (this.caseData) this._bindExistingFiles(this.caseData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['caseData']?.currentValue) {
      this._bindExistingFiles(changes['caseData'].currentValue);
    }
  }

  // ===================== DATA BINDING =====================
  private _bindExistingFiles(data: any): void {
    if (!data) return;

    if (data.ChargeSheetDocs) {
      this.existingFiles[FileType.chargeSheetDocs] = {
        path:       data.ChargeSheetDocs,
        fileName:   this._getFileName(data.ChargeSheetDocs),
        previewUrl: this._buildFileUrl(data.ChargeSheetDocs),
      };
    }

    if (data.FullChargeSheetDocs) {
      this.existingFiles[FileType.fullChargeSheetDocs] = {
        path:       data.FullChargeSheetDocs,
        fileName:   this._getFileName(data.FullChargeSheetDocs),
        previewUrl: this._buildFileUrl(data.FullChargeSheetDocs),
      };
    }

    if (data.OtherDocs) {
      this.existingFiles[FileType.otherDocs] = {
        path:       data.OtherDocs,
        fileName:   this._getFileName(data.OtherDocs),
        previewUrl: this._buildFileUrl(data.OtherDocs),
      };
    }
  }

  /**
   * Constructs the full URL for a server-side file path.
   * ⚠️  Update this base URL to match your API server.
   * Example: 'https://your-api-server.com/' + relativePath
   */
  private _buildFileUrl(relativePath: string): string {
    if (!relativePath) return '';
    // TODO: Replace with your actual API base URL
    // e.g. const base = environment.apiUrl;
    const base = (window as any).__API_BASE_URL__ || '';
    return base ? `${base.replace(/\/$/, '')}/${relativePath}` : `/${relativePath}`;
  }

  private _getFileName(path: string): string {
    if (!path) return '';
    // Extract filename – strip the timestamp suffix pattern if needed for display
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  }

  // ===================== OPEN EXISTING FILE =====================
  openExistingFile(type: FileType): void {
    const existing = this.existingFiles[type];
    if (existing?.previewUrl) {
      window.open(existing.previewUrl, '_blank');
    }
  }

  removeExistingFile(type: FileType): void {
    delete this.existingFiles[type];
  }

  // ===================== NEW FILE UPLOAD =====================
  onFileChange(event: any, type: FileType): void {
    const file: File = event.target.files?.[0];
    if (!file) return;

    // Clean up previous object URL for this slot
    const prev = this.files[type];
    if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);

    if (file.type !== 'application/pdf') {
      this.files[type] = { file, error: 'Only PDF files are allowed' };
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.files[type] = { file, error: 'File size must be less than 5MB' };
      return;
    }

    // Valid file
    this.files[type] = {
      file,
      previewUrl: URL.createObjectURL(file),
    };

    // Clear existing file for this slot since a new one is chosen
    delete this.existingFiles[type];
  }

  openNewFile(type: FileType): void {
    const f = this.files[type];
    if (f?.previewUrl) window.open(f.previewUrl, '_blank');
  }

  removeNewFile(type: FileType): void {
    const f = this.files[type];
    if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
    delete this.files[type];
  }

  // ===================== HELPERS =====================
  hasFile(type: FileType): boolean {
    return !!(this.files[type]?.file || this.existingFiles[type]?.path);
  }

  // ===================== SUBMIT =====================
  submitCasefile(): void {

    // Check new-file validation errors
    const hasError =
      this.files[FileType.chargeSheetDocs]?.error     ||
      this.files[FileType.fullChargeSheetDocs]?.error  ||
      this.files[FileType.otherDocs]?.error;

    if (hasError) {
      this.notify.showNotification('error', constants.FileSizeExceeding);
      return;
    }

    // Required: must have either a new file OR an existing file
    const hasChargeThumbnail  = this.files[FileType.chargeSheetDocs]?.file     || this.existingFiles[FileType.chargeSheetDocs]?.path;
    const hasFullChargeSheet  = this.files[FileType.fullChargeSheetDocs]?.file  || this.existingFiles[FileType.fullChargeSheetDocs]?.path;

    if (!hasChargeThumbnail || !hasFullChargeSheet) {
      this.notify.showNotification('info', constants.allFilesMandate);
      return;
    }

    const formData = new FormData();
    formData.append('DirRegId', String(this.caseId));
    formData.append('Steps',    '4');
    formData.append('CaseStatus', '1');

    // Charge Sheet Thumbnail
    if (this.files[FileType.chargeSheetDocs]?.file) {
      formData.append('SelectFile',      this.files[FileType.chargeSheetDocs]!.file);
      formData.append('ChargeSheetDocs', this.files[FileType.chargeSheetDocs]!.file.name);
    } else {
      formData.append('ChargeSheetDocs', this.existingFiles[FileType.chargeSheetDocs]?.path || '');
    }

    // Full Charge Sheet PDF
    if (this.files[FileType.fullChargeSheetDocs]?.file) {
      formData.append('SelectFile1',          this.files[FileType.fullChargeSheetDocs]!.file);
      formData.append('FullChargeSheetDocs',  this.files[FileType.fullChargeSheetDocs]!.file.name);
    } else {
      formData.append('FullChargeSheetDocs', this.existingFiles[FileType.fullChargeSheetDocs]?.path || '');
    }

    // Other Docs (optional)
    if (this.files[FileType.otherDocs]?.file) {
      formData.append('SelectFile2', this.files[FileType.otherDocs]!.file);
      formData.append('OtherDocs',   this.files[FileType.otherDocs]!.file.name);
    } else if (this.existingFiles[FileType.otherDocs]?.path) {
      formData.append('OtherDocs',   this.existingFiles[FileType.otherDocs]!.path);
    }

    this.api.post(this.url.submitReviewCase(), formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.message);
          this.caseFileSubmit.emit(this.caseId);
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

  // ===================== CLEANUP =====================
  ngOnDestroy(): void {
    // Revoke all object URLs to prevent memory leaks
    Object.values(this.files).forEach(f => {
      if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
  }
}