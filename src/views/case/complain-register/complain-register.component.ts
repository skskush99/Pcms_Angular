import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NotificationService } from '../../shared/services/notification.service';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';
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
  api = inject(ApiService);
  url = inject(UrlService);

  // ------------------ DROPDOWNS ------------------

  complaintTypeDropdown: DropdownListInterface[] = [
    { value: '0', text: 'निजी परिवाद' },
    { value: '1', text: 'सरकारी परिवाद' }
  ];

  actsDropdown: DropdownListInterface[] = [];
  sectionsDropdown: DropdownListInterface[] = [];
  classificationDropdown: DropdownListInterface[] = [];
  deptDropdown: DropdownListInterface[] = [];

  fileType = FileType;
  files: Partial<Record<FileType, UploadFile>> = {};

  // ------------------ LISTS ------------------

  chargeSheetCrimeList: any[] = [];
  personList: any[] = [];

  // ------------------ COMPLAINT TYPE FLAGS ------------------

  isPrivateComplaint: boolean = false;
  isGovernmentComplaint: boolean = false;

  // ------------------ EDIT MODE FLAGS (Person) ------------------

  isEditingPerson: boolean = false;
  editingPersonIndex: number = -1;

  // ------------------ EDIT MODE FLAGS (Offence) ------------------

  isEditingCrime: boolean = false;
  editingCrimeIndex: number = -1;

  complaintRegId: number = 0;

  // ------------------ MAIN FORM ------------------

  complaintRegForm: FormGroup = new FormGroup({
    complaintNo: new FormControl(null, [Validators.required]),
    complaintDate: new FormControl(null, [Validators.required]),
    complaintType: new FormControl(null, [Validators.required]),
    officeranddesignation: new FormControl(null),
    department: new FormControl(null),
    descOffence: new FormControl(null, [Validators.required]),
    datefiledincourt: new FormControl(null, [Validators.required]),
    CfpNo: new FormControl(null, [Validators.required]),
    fullComplaintPDF: new FormControl(null),
    uploadOtherDocNo: new FormControl(null),
    isDeclarationAccepted: new FormControl(null),
    searchByCaseId: new FormControl(null),
  });

  // ------------------ TEMP PERSON FORM ------------------

  personTempForm: FormGroup = new FormGroup({
    personAgainstId: new FormControl(0),
    caseFiledAgainstName: new FormControl(null),
    caseFiledAgainstAddress: new FormControl(null),
    caseFiledAgainstDesignation: new FormControl(null),
    caseFiledAgainstInstituation: new FormControl(null),
  });

  // ------------------ CHARGE SHEET FORM ------------------

  chargeSheetForm: FormGroup = new FormGroup({
    chargeSheetNo: new FormControl(null),
    chartSheetDate: new FormControl(null),
    dateFilingBeforeCourt: new FormControl(null),
    investigatingOfficer: new FormControl(null),
    caseTitle: new FormControl(null),
    classification: new FormControl(null),
    sections: new FormControl(null),
    acts: new FormControl(null),
  });

  // ------------------ INIT ------------------

  // ngOnInit(): void {
  //   this.getClassificationDropdown();
  //   this.getDeptDropdown();

  //   this.complaintRegForm.get('complaintType')?.valueChanges.subscribe(value => {
  //     this.onComplaintTypeChange(value);
  //   });
  // }


  ngOnInit(): void {
  this.getClassificationDropdown();
  this.getDeptDropdown();

  this.complaintRegForm.get('complaintType')?.valueChanges.subscribe(value => {
    this.onComplaintTypeChange(value);
  });

  // ← Check if edit data was passed from list page
  const editData = history.state?.editData;
  if (editData) {
    this.fillFormForEdit(editData);
  }
}

fillFormForEdit(data: any) {  
  this.onComplaintTypeChange(String(data.ComplaintTypeID));
  this.complaintRegForm.patchValue({
    complaintNo:            data.ComplaintRegNo   || '',
    complaintDate:          data.ComplaintDate
                              ? data.ComplaintDate.split('T')[0]
                              : null,
    complaintType:          String(data.ComplaintTypeID),
    department:             data.AdmDeptId        || null,
    officeranddesignation:  data.DeptOfficerNameDesignation || '',
    descOffence:            data.OffenceBrief     || '',
    datefiledincourt:       data.DateFiledInCourt
                              ? data.DateFiledInCourt.split('T')[0]
                              : null,
    isDeclarationAccepted:  data.IsDeclaration    || false,
  }); 
  this.complaintRegId = data.ComplaintRegId || 0;
}
  // ------------------ COMPLAINT TYPE CHANGE HANDLER ------------------

  onComplaintTypeChange(complaintType: string | null): void {
    this.isPrivateComplaint = false;
    this.isGovernmentComplaint = false;

    if (complaintType === '0') {
      this.isPrivateComplaint = true;
      this.complaintRegForm.get('department')?.clearValidators();
      this.complaintRegForm.get('officeranddesignation')?.clearValidators();
      this.complaintRegForm.patchValue({
        department: null,
        officeranddesignation: null
      });
    } else if (complaintType === '1') {
      this.isGovernmentComplaint = true;
      this.complaintRegForm.get('department')?.setValidators([Validators.required]);
      this.complaintRegForm.get('officeranddesignation')?.setValidators([Validators.required]);
    }

    this.complaintRegForm.get('department')?.updateValueAndValidity();
    this.complaintRegForm.get('officeranddesignation')?.updateValueAndValidity();
  }

  // ------------------ SUBMIT ------------------

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
    if (
      !this.files[this.fileType.chargeSheetDocs]?.file ||
      !this.files[this.fileType.fullChargeSheetDocs]?.file
    ) {
      this.notify.showNotification('info', constants.allFilesMandate);
      return;
    }
    const classificationIDs = this.chargeSheetCrimeList
      .map(crime => crime.offenceClassifId)
      .filter(id => id > 0);

      const offenceClassifId = this.chargeSheetCrimeList
      .map(crime => crime.offenceClassifId)
      .filter(id => id > 0);

    const personAgainstIds = this.personList
      .map(person => person.personAgainstId)
      .filter(id => id > 0);

    const formData = new FormData();
    formData.append('ComplaintFirstPageDocs', this.files[this.fileType.chargeSheetDocs]!.file);
    formData.append('FullComplaintDocs', this.files[this.fileType.fullChargeSheetDocs]!.file);
    if (this.files[this.fileType.otherDocs]?.file) {
      formData.append('OtherDocs', this.files[this.fileType.otherDocs]!.file);
    }
    // -- File names
    formData.append('ComplaintFirstPageDocs', this.files[this.fileType.chargeSheetDocs]!.file?.name || '');
    formData.append('FullComplaintDocs', this.files[this.fileType.fullChargeSheetDocs]!.file?.name || '');
    formData.append('OtherDocs', this.files[this.fileType.otherDocs]?.file?.name || '');
    // -- Main form fields
    formData.append('ComplaintRegId', '0');
    formData.append('ComplaintRegNo', this.complaintRegForm.value.complaintNo || '');
    formData.append('ComplaintNo', this.complaintRegForm.value.complaintNo || '');
    formData.append('ComplaintDate', this.complaintRegForm.value.complaintDate || '');
    formData.append('ComplaintTypeID', this.complaintRegForm.value.complaintType || '');
    formData.append('OffenceBrief', this.complaintRegForm.value.descOffence || '');
    formData.append('DateFiledInCourt', this.complaintRegForm.value.datefiledincourt || '');
    formData.append('IsDeclaration', this.complaintRegForm.value.isDeclarationAccepted ? 'true' : 'false');
    formData.append('CaseStatus', '1');
    formData.append('IsCognizance', 'true');
    if (this.isGovernmentComplaint) {
      formData.append('DepartmentId', this.complaintRegForm.value.department || '');
      formData.append('DeptOfficerNameDesignation', this.complaintRegForm.value.officeranddesignation || '');
    }
    classificationIDs.forEach(id => formData.append('classificationID', id.toString()));
    personAgainstIds.forEach(id => formData.append('PersonAgainstId', id.toString()));
    offenceClassifId.forEach(id => formData.append('offenceClassifId', id.toString()));
    console.log('Final FormData:');
    formData.forEach((value, key) => console.log(`  ${key}:`, value));
    this.api.post(this.url.saveComplaint(), formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.complaintRegId = res.returnID || 0;
          this.notify.showNotification('success', res.message);
        } else {
          this.notify.showNotification('error', res.message );
        }
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }
  onClear() {
    this.complaintRegForm.reset();
    this.personTempForm.reset();
    this.chargeSheetForm.reset();
    this.chargeSheetCrimeList = [];
    this.personList = [];
    this.isPrivateComplaint = false;
    this.isGovernmentComplaint = false;
    this.isEditingPerson = false;
    this.editingPersonIndex = -1;
    this.isEditingCrime = false;
    this.editingCrimeIndex = -1;
  }

  // ============================================================
  //              OFFENCE CLASSIFICATION SECTION
  // ============================================================

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
    const act = this.actsDropdown.find(i => i.value == form.acts);
    const section = this.sectionsDropdown.find(i => i.value == form.sections);

    const payload = {
      offenceClassifId: this.isEditingCrime
        ? (this.chargeSheetCrimeList[this.editingCrimeIndex]?.offenceClassifId || 0)
        : 0,
      offenceClassifGroupNo: this.complaintRegId || 0,
      isCaseComplaintReg: 1,
      classificationID: form.classification,
      classificationName: classification?.text || '',
      actsID: form.acts,
      actsName: act?.text || '',
      sectionsID: form.sections,
      sectionsName: section?.text || '',
    };

    console.log('Offence Payload:', payload);

    this.api.post(this.url.DierRegistrationsEditOffence(), payload).subscribe({
      next: (res: any) => {
        console.log('Offence API Response:', res);
        if (res.status) {

          // ✅ Store returnID as offenceClassifId — used by edit & delete
          const crimeItem = {
            offenceClassifId: res.returnID || payload.offenceClassifId,
            classification,
            act,
            section
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
          this.actsDropdown = [];
          this.sectionsDropdown = [];
          this.isEditingCrime = false;
          this.editingCrimeIndex = -1;

        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: (err: Error) => {
        console.error('Offence API Error:', err);
        this.notify.showNotification('error', 'Failed to save offence. Please try again.');
      }
    });
  }


  editChargeSheetCrime(index: number) {
    const crime = this.chargeSheetCrimeList[index];
    this.isEditingCrime = true;
    this.editingCrimeIndex = index;

    // Step 1: Patch classification
    this.chargeSheetForm.patchValue({ classification: crime.classification?.value });

    // Step 2: Load Acts dropdown for this classification
    const actsParam = { CrimeClsId: crime.classification?.value };
    this.api.get(this.url.getCrimeActDropdown(), actsParam).subscribe({
      next: (res: any) => {
        this.actsDropdown = res.data;

        // Step 3: Patch acts AFTER acts dropdown is populated
        this.chargeSheetForm.patchValue({ acts: crime.act?.value });

        // Step 4: Load Sections dropdown for this act + classification
        const sectionsParam = {
          CrimeActId: crime.act?.value,
          CrimeClsId: crime.classification?.value,
        };
        this.api.get(this.url.getCrimeSubActDropdown(), sectionsParam).subscribe({
          next: (res2: any) => {
            this.sectionsDropdown = res2.data;

            // Step 5: Patch sections AFTER sections dropdown is populated
            this.chargeSheetForm.patchValue({ sections: crime.section?.value });
          },
          error: (err: Error) => {
            console.error('Sections dropdown error:', err);
          }
        });
      },
      error: (err: Error) => {
        console.error('Acts dropdown error:', err);
      }
    });

    // Scroll to top of offence section
    const offenceSection = document.querySelector('.offence-section');
    if (offenceSection) {
      offenceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  cancelEditCrime() {
    ['classification', 'acts', 'sections'].forEach(i =>
      this.chargeSheetForm.controls[i].reset()
    );
    this.actsDropdown = [];
    this.sectionsDropdown = [];
    this.isEditingCrime = false;
    this.editingCrimeIndex = -1;
  }

  removeChargeSheetCrime(index: number) {
    const crime = this.chargeSheetCrimeList[index];
    const offenceClassifId = crime.offenceClassifId || 0;   // ✅ correct key

    if (offenceClassifId > 0) {
      // const payload = { offenceClassifId };

      this.api.post(this.url.DeleteDierOffence(offenceClassifId), {}).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.chargeSheetCrimeList.splice(index, 1);
            this.notify.showNotification('delete', res.message);

            if (this.editingCrimeIndex === index) {
              this.cancelEditCrime();
            } else if (this.editingCrimeIndex > index) {
              this.editingCrimeIndex--;
            }
          } else {
            this.notify.showNotification('error', res.message);
          }
        },
        error: (err: Error) => {
          console.error('Delete Offence Error:', err);
          this.notify.showNotification('error', 'Failed to delete offence. Please try again.');
        }
      });

    } else {
      // Not saved to API yet — remove from local list only
      this.chargeSheetCrimeList.splice(index, 1);
      if (this.editingCrimeIndex === index) {
        this.cancelEditCrime();
      } else if (this.editingCrimeIndex > index) {
        this.editingCrimeIndex--;
      }
    }
  }

  // ============================================================
  //              PERSON SECTION LOGIC WITH API
  // ============================================================

  addPersonToList() {
    const form = this.personTempForm.value;

    if (!form.caseFiledAgainstName ||
      !form.caseFiledAgainstAddress ||
      !form.caseFiledAgainstDesignation ||
      !form.caseFiledAgainstInstituation) {
      this.notify.showNotification('info', constants.allFieldsReq);
      return;
    }

    const payload = {
      PersonAgainstId: form.personAgainstId || 0,
      ComplaintRegId: this.complaintRegId || 0,
      Name: form.caseFiledAgainstName,
      Address: form.caseFiledAgainstAddress,
      Designation: form.caseFiledAgainstDesignation,
      Institution: form.caseFiledAgainstInstituation
    };

    console.log('Sending Payload:', payload);

    this.api.post(this.url.AddEditPersonAgainst(), payload).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        if (res.status) {
          const personAgainstId = res.returnID || form.personAgainstId || 0;

          if (this.isEditingPerson && this.editingPersonIndex !== -1) {
            this.personList[this.editingPersonIndex] = {
              personAgainstId,
              caseFiledAgainstName: form.caseFiledAgainstName,
              caseFiledAgainstAddress: form.caseFiledAgainstAddress,
              caseFiledAgainstDesignation: form.caseFiledAgainstDesignation,
              caseFiledAgainstInstituation: form.caseFiledAgainstInstituation
            };
            this.notify.showNotification('success', res.message);
          } else {
            this.personList.push({
              personAgainstId,
              caseFiledAgainstName: form.caseFiledAgainstName,
              caseFiledAgainstAddress: form.caseFiledAgainstAddress,
              caseFiledAgainstDesignation: form.caseFiledAgainstDesignation,
              caseFiledAgainstInstituation: form.caseFiledAgainstInstituation
            });
            this.notify.showNotification('success', res.message);
          }

          this.personTempForm.reset();
          this.personTempForm.patchValue({ personAgainstId: 0 });
          this.isEditingPerson = false;
          this.editingPersonIndex = -1;
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: (err: Error) => {
        console.error('API Error:', err);
        this.notify.showNotification('error', 'Failed to save person. Please try again.');
      }
    });
  }

  editPerson(index: number) {
    const person = this.personList[index];
    console.log('Editing Person:', person);
    this.isEditingPerson = true;
    this.editingPersonIndex = index;
    this.personTempForm.patchValue({
      personAgainstId: person.personAgainstId || 0,
      caseFiledAgainstName: person.caseFiledAgainstName,
      caseFiledAgainstAddress: person.caseFiledAgainstAddress,
      caseFiledAgainstDesignation: person.caseFiledAgainstDesignation,
      caseFiledAgainstInstituation: person.caseFiledAgainstInstituation
    });

    const personCard = document.querySelector('.person-card');
    if (personCard) {
      personCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  cancelEdit() {
    this.personTempForm.reset();
    this.personTempForm.patchValue({ personAgainstId: 0 });
    this.isEditingPerson = false;
    this.editingPersonIndex = -1;
  }

  removePerson(index: number) {
    const person = this.personList[index];
    const personAgainstId = person.personAgainstId || 0;

    if (personAgainstId > 0) {
      this.api.post(this.url.DeletePersonAgainst(personAgainstId), {}).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.personList.splice(index, 1);
            this.notify.showNotification('delete', res.message);
            if (this.editingPersonIndex === index) {
              this.cancelEdit();
            } else if (this.editingPersonIndex > index) {
              this.editingPersonIndex--;
            }
          } else {
            this.notify.showNotification('error', res.message);
          }
        },
        error: (err: Error) => {
          this.notify.showNotification('error', 'Failed to delete person. Please try again.');
        }
      });
    } else {
      this.personList.splice(index, 1);
      if (this.editingPersonIndex === index) {
        this.cancelEdit();
      } else if (this.editingPersonIndex > index) {
        this.editingPersonIndex--;
      }
    }
  }


  //===========  DROPDOWN API CALLS ============= // 

  getClassificationDropdown() {
    this.api.get(this.url.getCrimeClassificationDropdown()).subscribe({
      next: (res: any) => {
        this.classificationDropdown = res.data;
      },
      error: (err: Error) => {
        console.error(err);
      }
    });
  }

  getActsDropdown(ifInit?: string) {
    if (!ifInit)
      this.chargeSheetForm.controls['acts'].setValue(null);

    this.getCrimeSubActDropdown(ifInit ? 'init' : '');

    if (!this.chargeSheetForm.value.classification) {
      this.actsDropdown = [];
      return;
    }

    const reqParam = {
      CrimeClsId: this.chargeSheetForm.value.classification
    };

    this.api.get(this.url.getCrimeActDropdown(), reqParam).subscribe({
      next: (res: any) => {
        this.actsDropdown = res.data;
      }
    });
  }

  getCrimeSubActDropdown(ifInit?: string) {
    if (!ifInit)
      this.chargeSheetForm.controls['sections'].setValue(null);

    if (!this.chargeSheetForm.value.acts) {
      this.sectionsDropdown = [];
      return;
    }

    const reqParam = {
      CrimeActId: this.chargeSheetForm.value.acts,
      CrimeClsId: this.chargeSheetForm.value.classification,
    };

    this.api.get(this.url.getCrimeSubActDropdown(), reqParam).subscribe({
      next: (res: any) => {
        this.sectionsDropdown = res.data;
      }
    });
  }

  getDeptDropdown() {
    this.api.get(this.url.getAdminDeptDropdown()).subscribe({
      next: (res: any) => {
        this.deptDropdown = res.data;
      },
      error: (err: Error) => {
        console.error(err);
      }
    });
  }


  onFileChange(event: any, type: FileType) {
    const file = event.target.files[0];
    if (!file) return;
    const allowedTypes = ['application/pdf'];
    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.files[type] = {
        file,
        error: 'Only PDF files are allowed'
      };
      return;
    }
    if (file.size > maxSizeBytes) {
      this.files[type] = {
        file,
        error: 'File size must be less than 5MB'
      };
      return;
    }
    // valid file
    this.files[type] = { file };
  }
}