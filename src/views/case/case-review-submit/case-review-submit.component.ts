import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';
import { NotificationService } from '../../shared/services/notification.service';
import constants from '../../shared/utils/constants';

enum FileType { chargeSheetDocs = 1, fullChargeSheetDocs = 2, otherDocs = 3 }
interface UploadFile { file: File; error?: string; name?: string; }

@Component({
  selector: 'app-case-review-submit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './case-review-submit.component.html',
  styleUrl: './case-review-submit.component.css'
})
export class CaseReviewSubmitComponent implements OnInit {

  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);

  @Input() caseId:    any;
  @Input() cctnsData: any = null;
  @Input() regType:   string = '1';    // '1' = Diar | '2' = Final Register (FR)
  @Output() caseSubmitted = new EventEmitter<void>();

  get isFR(): boolean { return this.regType === '2'; }

  fileType = FileType;
  files:         Partial<Record<FileType, UploadFile>> = {};
  previewUrlMap: Partial<Record<FileType, string>>     = {};

  get fileRoomDetails(): any[] { return this.cctnsData?.fileRoomDetails || []; }

  caseSubmitForm: FormGroup = new FormGroup({ remarks: new FormControl('') });

  ngOnInit(): void {}

  onFileChange(event: any, type: FileType): void {
    const file = event.target.files[0];
    if (!file) return;
    if (this.previewUrlMap[type]) { URL.revokeObjectURL(this.previewUrlMap[type]!); delete this.previewUrlMap[type]; }
    if (!['application/pdf'].includes(file.type)) { this.files[type] = { file, error: 'Only PDF files are allowed' }; return; }
    if (file.size > 5 * 1024 * 1024)              { this.files[type] = { file, error: 'File size must be less than 5MB' }; return; }
    this.files[type]         = { file };
    this.previewUrlMap[type] = URL.createObjectURL(file);
  }

  previewFile(type: FileType): void { const url = this.previewUrlMap[type]; if (url) window.open(url, '_blank'); }

  removeFile(type: FileType): void {
    if (this.previewUrlMap[type]) { URL.revokeObjectURL(this.previewUrlMap[type]!); delete this.previewUrlMap[type]; }
    delete this.files[type];
  }

  /**
   * Opens a CCTNS file room document in a new tab.
   * docId format: "27564051250030,tfr"
   * Extend this when the actual file-download API URL is known.
   */
  openFileRoomDoc(file: any): void {
    if (!file?.docId) {
      this.notify.showNotification('info', 'Document URL not available');
      return;
    }
    // TODO: replace with actual API endpoint when available
    // e.g. window.open(`${this.url.getCctnsFileUrl()}?docId=${file.docId}`, '_blank');
    this.notify.showNotification('info', `Opening: ${file.fileName} (DocID: ${file.docId})`);
  }

  submitCaseForm(): void {
    const hasError = this.files[this.fileType.chargeSheetDocs]?.error || this.files[this.fileType.fullChargeSheetDocs]?.error || this.files[this.fileType.otherDocs]?.error;
    if (hasError) { this.notify.showNotification('error', constants.FileSizeExceeding); return; }

    // Diar: both chargeSheet + fullChargeSheet mandatory | FR: only chargeSheet (FR First Page) mandatory
    const requiredMissing = !this.files[this.fileType.chargeSheetDocs]?.file ||
      (!this.isFR && !this.files[this.fileType.fullChargeSheetDocs]?.file);
    if (requiredMissing) { this.notify.showNotification('info', constants.allFilesMandate); return; }

    const formData = new FormData();
    formData.append('SelectFile',  this.files[this.fileType.chargeSheetDocs]!.file);
    formData.append('SelectFile1', this.files[this.fileType.fullChargeSheetDocs]?.file ?? new Blob());
    formData.append('SelectFile2', this.files[this.fileType.otherDocs]?.file ?? new Blob());
    formData.append('DirRegId',    this.caseId);
    formData.append('Steps',       '4');
    formData.append('Remarks',     this.caseSubmitForm.value.remarks || '');
    formData.append('ChargeSheetDocs',     this.files[this.fileType.chargeSheetDocs]!.file?.name  || '');
    formData.append('FullChargeSheetDocs', this.files[this.fileType.fullChargeSheetDocs]?.file?.name || '');
    formData.append('OtherDocs',           this.files[this.fileType.otherDocs]?.file?.name || '');
    formData.append('CaseStatus', "1");
    this.api.post(this.url.submitReviewCase(), formData).subscribe({
      next: (res: any) => {
        if (res.status) { this.notify.showNotification('success', `${res.message}, Dier Registration Number : ${res.dierNoGenrated}`); this.caseSubmitted.emit(); }
        else { this.notify.showNotification('error', res.message); }
      },
      error: (err: Error) => { this.notify.showNotification('error', constants.apiError); throw new Error(err?.message); }
    });
  }
}