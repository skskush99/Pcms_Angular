import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../shared/services/notification.service';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import constants from '../../shared/utils/constants';

enum FileType {
  chargeSheetDocs = 1,
  fullChargeSheetDocs = 2,
  otherDocs = 3
}

interface UploadFile {
  file: File;
  error?: string;
  name?: string;
}

@Component({
  selector: 'app-complain-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    DatePickerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './complain-register.component.html',
  styleUrls: ['./complain-register.component.css']
})
export class ComplainRegisterComponent implements OnInit {

  notify = inject(NotificationService);
  api    = inject(ApiService);
  url    = inject(UrlService);
  router = inject(Router);
  dialog = inject(MatDialog);

  previewUrlMap: Partial<Record<FileType, string>> = {};

  complaintTypeDropdown: DropdownListInterface[] = [
    { value: '0', text: 'निजी परिवाद' },
    { value: '1', text: 'सरकारी परिवाद' }
  ];

  actsDropdown: DropdownListInterface[]           = [];
  sectionsDropdown: DropdownListInterface[]        = [];
  classificationDropdown: DropdownListInterface[] = [];
  deptDropdown: DropdownListInterface[]           = [];

  fileType = FileType;
  files: Partial<Record<FileType, UploadFile>> = {};

  chargeSheetCrimeList: any[] = [];
  personList: any[]           = [];

  isPrivateComplaint:    boolean = false;
  isGovernmentComplaint: boolean = false;

  isEditingPerson:    boolean = false;
  editingPersonIndex: number  = -1;

  isEditingCrime:    boolean = false;
  editingCrimeIndex: number  = -1;

  complaintRegId: number = 0;

  complaintRegForm: FormGroup = new FormGroup({
    complaintNo:            new FormControl(null, [Validators.required]),
    complaintDate:          new FormControl(null, [Validators.required]),
    complaintType:          new FormControl(null, [Validators.required]),
    officeranddesignation:  new FormControl(null),
    department:             new FormControl(null),
    descOffence:            new FormControl(null, [Validators.required]),
    datefiledincourt:       new FormControl(null, [Validators.required]),
    isDeclarationAccepted:  new FormControl(null),
    searchByCaseId:         new FormControl(null),
  });

  personTempForm: FormGroup = new FormGroup({
    personAgainstId:             new FormControl(0),
    caseFiledAgainstName:        new FormControl(null),
    caseFiledAgainstAddress:     new FormControl(null),
    caseFiledAgainstDesignation: new FormControl(null),
    caseFiledAgainstInstituation:new FormControl(null),
  });

  chargeSheetForm: FormGroup = new FormGroup({
    chargeSheetNo:         new FormControl(null),
    chartSheetDate:        new FormControl(null),
    dateFilingBeforeCourt: new FormControl(null),
    investigatingOfficer:  new FormControl(null),
    caseTitle:             new FormControl(null),
    classification:        new FormControl(null),
    sections:              new FormControl(null),
    acts:                  new FormControl(null),
  });

  // ─────────────────────────────────────────────
  private toSqlString(ids: number[]): string {
    if (!ids.length) return '';
    return ids.join(',');
  }

  // ─────────────────────────────────────────────
  ngOnInit(): void {
    this.getClassificationDropdown();

    const today = new Date().toISOString().split('T')[0];
    this.complaintRegForm.patchValue({ datefiledincourt: today });

    this.complaintRegForm.get('complaintType')?.valueChanges.subscribe(value => {
      this.onComplaintTypeChange(value);
    });

    const editData = history.state?.editData;
    if (editData) {
      this.getDeptDropdown(() => this.fillFormForEdit(editData));
    } else {
      this.getDeptDropdown();
    }
  }

  // ─────────────────────────────────────────────
  getFileName(fullPath: string): string {
    if (!fullPath) return '';
    return fullPath.split('/').pop() || '';
  }

  // ─────────────────────────────────────────────
  fillFormForEdit(data: any) {
    this.complaintRegId = data.ComplaintRegId || 0;

    this.onComplaintTypeChange(String(data.ComplaintTypeID));

    this.complaintRegForm.patchValue({
      complaintNo:           data.ComplaintRegNo || '',
      complaintDate:         data.ComplaintDate ? data.ComplaintDate.split('T')[0] : null,
      complaintType:         String(data.ComplaintTypeID),
      department:            data.AdmDeptId != null ? String(data.AdmDeptId) : null,
      officeranddesignation: data.DeptOfficerNameDesignation || '',
      descOffence:           data.OffenceBrief || '',
      datefiledincourt:      data.DateFiledInCourt ? data.DateFiledInCourt.split('T')[0] : null,
      isDeclarationAccepted: data.IsDeclaration || false,
    });

    if (data.ComplaintFirstPageDocs) {
      const fileName = this.getFileName(data.ComplaintFirstPageDocs);
      const f = new File([], fileName, { type: 'application/pdf' });
      this.files[FileType.chargeSheetDocs] = { file: f, name: fileName };
      this.previewUrlMap[FileType.chargeSheetDocs] = data.ComplaintFirstPageDocs;
    }

    if (data.FullComplaintDocs) {
      const fileName = this.getFileName(data.FullComplaintDocs);
      const f = new File([], fileName, { type: 'application/pdf' });
      this.files[FileType.fullChargeSheetDocs] = { file: f, name: fileName };
      this.previewUrlMap[FileType.fullChargeSheetDocs] = data.FullComplaintDocs;
    }

    if (data.OtherDocs) {
      const fileName = this.getFileName(data.OtherDocs);
      const f = new File([], fileName, { type: 'application/pdf' });
      this.files[FileType.otherDocs] = { file: f, name: fileName };
      this.previewUrlMap[FileType.otherDocs] = data.OtherDocs;
    }

    if (this.complaintRegId > 0) {
      this.loadOffenceListForEdit(this.complaintRegId);
      this.loadPersonListForEdit(this.complaintRegId);
    }
  }

  // ─────────────────────────────────────────────
  loadOffenceListForEdit(complaintRegId: number) {
    this.api.get(this.url.GetOffenceListByComplaintId(complaintRegId)).subscribe({
      next: (res: any) => {
        const list = res?.data || res?.Data || [];
        if (list.length) {
          this.chargeSheetCrimeList = list.map((item: any) => ({
            offenceClassifId: item.OffenceClassifId || item.offenceClassifId || 0,
            classification: {
              value: String(item.ClassificationID || item.classificationID || ''),
              text:  item.ClassificationName || item.classificationName || ''
            },
            act: {
              value: String(item.ActsID || item.actsID || ''),
              text:  item.ActsName || item.actsName || ''
            },
            section: {
              value: String(item.SectionsID || item.sectionsID || ''),
              text:  item.SectionsName || item.sectionsName || ''
            },
          }));
        }
      },
      error: (err: Error) => { console.error('Load offence list error:', err); }
    });
  }

  // ─────────────────────────────────────────────
  loadPersonListForEdit(complaintRegId: number) {
    this.api.get(this.url.GetPersonListByComplaintId(complaintRegId)).subscribe({
      next: (res: any) => {
        const list = res?.data || res?.Data || [];
        if (list.length) {
          this.personList = list.map((item: any) => ({
            personAgainstId:              item.PersonAgainstId || item.personAgainstId || 0,
            caseFiledAgainstName:         item.Name        || item.name        || '',
            caseFiledAgainstAddress:      item.Address     || item.address     || '',
            caseFiledAgainstDesignation:  item.Designation || item.designation || '',
            caseFiledAgainstInstituation: item.Institution || item.institution || '',
          }));
        }
      },
      error: (err: Error) => { console.error('Load person list error:', err); }
    });
  }

  // ─────────────────────────────────────────────
  onBack(): void {
    this.router.navigate(['/case/complaint-register/complain-register-details']);
  }

  // ─────────────────────────────────────────────
  onSubmit(): void {
    Object.keys(this.complaintRegForm.controls).forEach(key => {
      this.complaintRegForm.get(key)?.markAsTouched();
    });

    if (this.complaintRegForm.invalid) {
      this.notify.showNotification('error', 'Please fill all required fields');
      return;
    }

    if (
      this.files[this.fileType.chargeSheetDocs]?.error ||
      this.files[this.fileType.fullChargeSheetDocs]?.error ||
      this.files[this.fileType.otherDocs]?.error
    ) {
      this.notify.showNotification('error', constants.FileSizeExceeding);
      return;
    }

    if (!this.files[this.fileType.chargeSheetDocs]?.file) {
      this.notify.showNotification('info', 'Complaint First Page is required');
      return;
    }

    const classificationIDs    = this.chargeSheetCrimeList.map(c => c.offenceClassifId).filter(id => id > 0);
    const offenceClassifIds    = this.chargeSheetCrimeList.map(c => c.offenceClassifId).filter(id => id > 0);
    const personAgainstIds     = this.personList.map(p => p.personAgainstId).filter(id => id > 0);

    const classificationIdString = this.toSqlString(classificationIDs);
    const offenceClassifIdString = this.toSqlString(offenceClassifIds);
    const personIdString         = this.toSqlString(personAgainstIds);

    const formData = new FormData();

    formData.append('SelectFile',  this.files[this.fileType.chargeSheetDocs]!.file);
    formData.append('SelectFile1', this.files[this.fileType.fullChargeSheetDocs]?.file ?? new Blob());
    formData.append('SelectFile2', this.files[this.fileType.otherDocs]?.file ?? new Blob());
    formData.append('ComplaintFirstPageDocs', this.files[this.fileType.chargeSheetDocs]!.file?.name || '');
    formData.append('FullComplaintDocs',      this.files[this.fileType.fullChargeSheetDocs]?.file?.name || '');
    formData.append('OtherDocs',              this.files[this.fileType.otherDocs]?.file?.name || '');

    formData.append('ComplaintRegId',   String(this.complaintRegId));
    formData.append('ComplaintRegNo',   this.complaintRegForm.value.complaintNo  || '');
    formData.append('ComplaintNo',      this.complaintRegForm.value.complaintNo  || '');
    formData.append('ComplaintDate',    this.complaintRegForm.value.complaintDate || '');
    formData.append('ComplaintTypeID',  this.complaintRegForm.value.complaintType || '');
    formData.append('OffenceBrief',     this.complaintRegForm.value.descOffence   || '');
    formData.append('DateFiledInCourt', this.complaintRegForm.value.datefiledincourt || '');
    formData.append('IsDeclaration',    this.complaintRegForm.value.isDeclarationAccepted ? 'true' : 'false');
    formData.append('CaseStatus',       '1');
    formData.append('IsCognizance',     'true');

    if (this.isGovernmentComplaint) {
      formData.append('DepartmentId',             this.complaintRegForm.value.department || '');
      formData.append('DeptOfficerNameDesignation', this.complaintRegForm.value.officeranddesignation || '');
    }

    formData.append('classificationID',  classificationIdString);
    formData.append('PersonAgainstId',   personIdString);
    formData.append('offenceClassifId',  offenceClassifIdString);

    console.log('Final FormData (ComplaintRegId =', this.complaintRegId, '):');
    formData.forEach((value, key) => console.log(`  ${key}:`, value));

    this.api.post(this.url.saveComplaint(), formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.complaintRegId = res.returnID || 0;
          this.notify.showNotification('success', res.message);
          setTimeout(() => {
            this.router.navigate(['/case/complaint-register/complain-register-details']);
          }, 1500);
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ─────────────────────────────────────────────
  onClear() {
    const today = new Date().toISOString().split('T')[0];
    this.complaintRegForm.reset();
    this.complaintRegForm.patchValue({ datefiledincourt: today });
    this.personTempForm.reset();
    this.chargeSheetForm.reset();
    this.chargeSheetCrimeList = [];
    this.personList           = [];
    this.files                = {};
    this.previewUrlMap        = {};
    this.isPrivateComplaint    = false;
    this.isGovernmentComplaint = false;
    this.isEditingPerson       = false;
    this.editingPersonIndex    = -1;
    this.isEditingCrime        = false;
    this.editingCrimeIndex     = -1;
    this.complaintRegId        = 0;
  }

  // ─────────────────────────────────────────────
  viewFile(type: FileType): void {
    const previewUrl = this.previewUrlMap[type];
    if (!previewUrl) return;
    if (previewUrl.startsWith('blob:')) {
      window.open(previewUrl, '_blank');
    } else {
      window.open(`${this.url.getFileUrl(previewUrl)}`, '_blank');
    }
  }

  // ─────────────────────────────────────────────
  deleteFile(type: FileType): void {
    if (this.previewUrlMap[type]) {
      URL.revokeObjectURL(this.previewUrlMap[type]!);
      delete this.previewUrlMap[type];
    }
    delete this.files[type];
  }

  // ── NEW: confirmation wrapper for file delete ──
  confirmDeleteFile(type: FileType): void {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      panelClass: 'confirm-dialog-panel',
      data: { msg: 'Are you sure you want to remove this file?' }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) this.deleteFile(type);
    });
  }

  // ─────────────────────────────────────────────
  addChargeSheetCrime() {
    const form = this.chargeSheetForm.value;

    if (!form.classification || !form.acts || !form.sections) {
      ['classification', 'acts', 'sections'].forEach(key =>
        this.chargeSheetForm.get(key)?.markAsTouched()
      );
      this.notify.showNotification('info', constants.allFieldsReq);
      return;
    }

    const classification = this.classificationDropdown.find(i => i.value == form.classification);
    const act            = this.actsDropdown.find(i => i.value == form.acts);
    const section        = this.sectionsDropdown.find(i => i.value == form.sections);

    const payload = {
      offenceClassifId:      this.isEditingCrime
        ? (this.chargeSheetCrimeList[this.editingCrimeIndex]?.offenceClassifId || 0)
        : 0,
      offenceClassifGroupNo: this.complaintRegId || 0,
      isCaseComplaintReg:    1,
      classificationID:      form.classification,
      classificationName:    classification?.text || '',
      actsID:                form.acts,
      actsName:              act?.text || '',
      sectionsID:            form.sections,
      sectionsName:          section?.text || '',
    };

    this.api.post(this.url.DierRegistrationsEditOffence(), payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          const crimeItem = {
            offenceClassifId: res.returnID || payload.offenceClassifId,
            classification, act, section
          };

          if (this.isEditingCrime && this.editingCrimeIndex !== -1) {
            this.chargeSheetCrimeList[this.editingCrimeIndex] = crimeItem;
          } else {
            this.chargeSheetCrimeList.push(crimeItem);
          }

          this.notify.showNotification('success', res.message);
          ['classification', 'acts', 'sections'].forEach(i =>
            this.chargeSheetForm.controls[i].reset()
          );
          this.actsDropdown    = [];
          this.sectionsDropdown = [];
          this.isEditingCrime   = false;
          this.editingCrimeIndex = -1;
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', 'Failed to save offence. Please try again.');
      }
    });
  }

  // ─────────────────────────────────────────────
  editChargeSheetCrime(index: number) {
    const crime = this.chargeSheetCrimeList[index];
    this.isEditingCrime    = true;
    this.editingCrimeIndex = index;

    this.chargeSheetForm.patchValue({ classification: crime.classification?.value });

    this.api.get(this.url.getCrimeActDropdown(), { CrimeClsId: crime.classification?.value }).subscribe({
      next: (res: any) => {
        this.actsDropdown = res.data;
        this.chargeSheetForm.patchValue({ acts: crime.act?.value });

        this.api.get(this.url.getCrimeSubActDropdown(), {
          CrimeActId: crime.act?.value,
          CrimeClsId: crime.classification?.value,
        }).subscribe({
          next: (res2: any) => {
            this.sectionsDropdown = res2.data;
            this.chargeSheetForm.patchValue({ sections: crime.section?.value });
          },
          error: (err: Error) => { console.error('Sections dropdown error:', err); }
        });
      },
      error: (err: Error) => { console.error('Acts dropdown error:', err); }
    });

    const offenceSection = document.querySelector('.offence-section');
    if (offenceSection) {
      offenceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ─────────────────────────────────────────────
  cancelEditCrime() {
    ['classification', 'acts', 'sections'].forEach(i =>
      this.chargeSheetForm.controls[i].reset()
    );
    this.actsDropdown     = [];
    this.sectionsDropdown  = [];
    this.isEditingCrime    = false;
    this.editingCrimeIndex = -1;
  }

  // ── NEW: confirmation wrapper for crime delete ──
  confirmRemoveChargeSheetCrime(index: number): void {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      panelClass: 'confirm-dialog-panel',
      data: { msg: constants.confirmDelete }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) this.removeChargeSheetCrime(index);
    });
  }

  // ─────────────────────────────────────────────
  removeChargeSheetCrime(index: number) {
    const crime          = this.chargeSheetCrimeList[index];
    const offenceClassifId = crime.offenceClassifId || 0;

    if (offenceClassifId > 0) {
      this.api.post(this.url.DeleteDierOffence(offenceClassifId), {}).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.chargeSheetCrimeList.splice(index, 1);
            this.notify.showNotification('delete', res.message);
            if (this.editingCrimeIndex === index) { this.cancelEditCrime(); }
            else if (this.editingCrimeIndex > index) { this.editingCrimeIndex--; }
          } else {
            this.notify.showNotification('error', res.message);
          }
        },
        error: () => {
          this.notify.showNotification('error', 'Failed to delete offence. Please try again.');
        }
      });
    } else {
      this.chargeSheetCrimeList.splice(index, 1);
      if (this.editingCrimeIndex === index) { this.cancelEditCrime(); }
      else if (this.editingCrimeIndex > index) { this.editingCrimeIndex--; }
    }
  }

  // ─────────────────────────────────────────────
  addPersonToList() {
    const form = this.personTempForm.value;

    if (
      !form.caseFiledAgainstName ||
      !form.caseFiledAgainstAddress ||
      !form.caseFiledAgainstDesignation ||
      !form.caseFiledAgainstInstituation
    ) {
      this.notify.showNotification('info', constants.allFieldsReq);
      return;
    }

    const payload = {
      PersonAgainstId: form.personAgainstId || 0,
      ComplaintRegId:  this.complaintRegId || 0,
      Name:            form.caseFiledAgainstName,
      Address:         form.caseFiledAgainstAddress,
      Designation:     form.caseFiledAgainstDesignation,
      Institution:     form.caseFiledAgainstInstituation
    };

    this.api.post(this.url.AddEditPersonAgainst(), payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          const personAgainstId = res.returnID || form.personAgainstId || 0;
          const personItem = {
            personAgainstId,
            caseFiledAgainstName:         form.caseFiledAgainstName,
            caseFiledAgainstAddress:      form.caseFiledAgainstAddress,
            caseFiledAgainstDesignation:  form.caseFiledAgainstDesignation,
            caseFiledAgainstInstituation: form.caseFiledAgainstInstituation
          };

          if (this.isEditingPerson && this.editingPersonIndex !== -1) {
            this.personList[this.editingPersonIndex] = personItem;
          } else {
            this.personList.push(personItem);
          }

          this.notify.showNotification('success', res.message);
          this.personTempForm.reset();
          this.personTempForm.patchValue({ personAgainstId: 0 });
          this.isEditingPerson    = false;
          this.editingPersonIndex = -1;
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', 'Failed to save person. Please try again.');
      }
    });
  }

  // ─────────────────────────────────────────────
  editPerson(index: number) {
    const person = this.personList[index];
    this.isEditingPerson    = true;
    this.editingPersonIndex = index;
    this.personTempForm.patchValue({
      personAgainstId:              person.personAgainstId || 0,
      caseFiledAgainstName:         person.caseFiledAgainstName,
      caseFiledAgainstAddress:      person.caseFiledAgainstAddress,
      caseFiledAgainstDesignation:  person.caseFiledAgainstDesignation,
      caseFiledAgainstInstituation: person.caseFiledAgainstInstituation
    });

    const personCard = document.querySelector('.offence-section');
    if (personCard) { personCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  // ─────────────────────────────────────────────
  cancelEdit() {
    this.personTempForm.reset();
    this.personTempForm.patchValue({ personAgainstId: 0 });
    this.isEditingPerson    = false;
    this.editingPersonIndex = -1;
  }

  // ── NEW: confirmation wrapper for person delete ──
  confirmRemovePerson(index: number): void {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      panelClass: 'confirm-dialog-panel',
      data: { msg: constants.confirmDelete }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) this.removePerson(index);
    });
  }

  // ─────────────────────────────────────────────
  removePerson(index: number) {
    const person         = this.personList[index];
    const personAgainstId = person.personAgainstId || 0;

    if (personAgainstId > 0) {
      this.api.post(this.url.DeletePersonAgainst(personAgainstId), {}).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.personList.splice(index, 1);
            this.notify.showNotification('delete', res.message);
            if (this.editingPersonIndex === index) { this.cancelEdit(); }
            else if (this.editingPersonIndex > index) { this.editingPersonIndex--; }
          } else {
            this.notify.showNotification('error', res.message);
          }
        },
        error: () => {
          this.notify.showNotification('error', 'Failed to delete person. Please try again.');
        }
      });
    } else {
      this.personList.splice(index, 1);
      if (this.editingPersonIndex === index) { this.cancelEdit(); }
      else if (this.editingPersonIndex > index) { this.editingPersonIndex--; }
    }
  }

  // ─────────────────────────────────────────────
  getClassificationDropdown() {
    this.api.get(this.url.getCrimeClassificationDropdown()).subscribe({
      next: (res: any) => { this.classificationDropdown = res.data; },
      error: (err: Error) => { console.error(err); }
    });
  }

  // ─────────────────────────────────────────────
  getActsDropdown(ifInit?: string) {
    if (!ifInit) this.chargeSheetForm.controls['acts'].setValue(null);
    this.getCrimeSubActDropdown(ifInit ? 'init' : '');

    if (!this.chargeSheetForm.value.classification) {
      this.actsDropdown = [];
      return;
    }

    this.api.get(this.url.getCrimeActDropdown(), {
      CrimeClsId: this.chargeSheetForm.value.classification
    }).subscribe({
      next: (res: any) => { this.actsDropdown = res.data; }
    });
  }

  // ─────────────────────────────────────────────
  getCrimeSubActDropdown(ifInit?: string) {
    if (!ifInit) this.chargeSheetForm.controls['sections'].setValue(null);

    if (!this.chargeSheetForm.value.acts) {
      this.sectionsDropdown = [];
      return;
    }

    this.api.get(this.url.getCrimeSubActDropdown(), {
      CrimeActId: this.chargeSheetForm.value.acts,
      CrimeClsId: this.chargeSheetForm.value.classification,
    }).subscribe({
      next: (res: any) => { this.sectionsDropdown = res.data; }
    });
  }

  // ─────────────────────────────────────────────
  getDeptDropdown(callback?: () => void) {
    this.api.get(this.url.getAdminDeptDropdown()).subscribe({
      next: (res: any) => {
        this.deptDropdown = res.data;
        if (callback) callback();
      },
      error: (err: Error) => { console.error(err); }
    });
  }

  // ─────────────────────────────────────────────
  onFileChange(event: any, type: FileType) {
    const file = event.target.files[0];
    if (!file) return;

    if (this.previewUrlMap[type]) {
      URL.revokeObjectURL(this.previewUrlMap[type]!);
      delete this.previewUrlMap[type];
    }

    if (!['application/pdf'].includes(file.type)) {
      this.files[type] = { file, error: 'Only PDF files are allowed' };
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.files[type] = { file, error: 'File size must be less than 5MB' };
      return;
    }

    this.files[type]         = { file };
    this.previewUrlMap[type] = URL.createObjectURL(file);
  }

  // ─────────────────────────────────────────────
  onComplaintTypeChange(complaintType: string | null): void {
    this.isPrivateComplaint    = false;
    this.isGovernmentComplaint = false;

    if (complaintType === '0') {
      this.isPrivateComplaint = true;
      this.complaintRegForm.get('department')?.clearValidators();
      this.complaintRegForm.get('officeranddesignation')?.clearValidators();
      this.complaintRegForm.patchValue({ department: null, officeranddesignation: null });
    } else if (complaintType === '1') {
      this.isGovernmentComplaint = true;
      this.complaintRegForm.get('department')?.setValidators([Validators.required]);
      this.complaintRegForm.get('officeranddesignation')?.setValidators([Validators.required]);
    }

    this.complaintRegForm.get('department')?.updateValueAndValidity();
    this.complaintRegForm.get('officeranddesignation')?.updateValueAndValidity();
  }
}