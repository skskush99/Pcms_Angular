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
    { value: '01', text: 'निजी परिवाद' },
    { value: '02', text: 'सरकारी परिवाद' }
  ];

  actsDropdown: DropdownListInterface[] = [];
  sectionsDropdown: DropdownListInterface[] = [];
  classificationDropdown: DropdownListInterface[] = [];
  deptDropdown: DropdownListInterface[] = [];

  // ------------------ LISTS ------------------

  chargeSheetCrimeList: any[] = [];
  personList: any[] = [];

  // ------------------ COMPLAINT TYPE FLAGS ------------------
  
  isPrivateComplaint: boolean = false;
  isGovernmentComplaint: boolean = false;

  // ------------------ EDIT MODE FLAGS ------------------
  
  isEditingPerson: boolean = false;
  editingPersonIndex: number = -1;
  complaintRegId: number = 0; // Will be set after complaint registration

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
    isDeclarationAccepted: new FormControl(false, [Validators.requiredTrue]),
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

  ngOnInit(): void {
    this.getClassificationDropdown();
    this.getDeptDropdown();
    
    this.complaintRegForm.get('complaintType')?.valueChanges.subscribe(value => {
      this.onComplaintTypeChange(value);
    });
  }

  // ------------------ COMPLAINT TYPE CHANGE HANDLER ------------------

  onComplaintTypeChange(complaintType: string | null): void {
    this.isPrivateComplaint = false;
    this.isGovernmentComplaint = false;

    if (complaintType === '01') {
      this.isPrivateComplaint = true;
      this.complaintRegForm.get('department')?.clearValidators();
      this.complaintRegForm.get('officeranddesignation')?.clearValidators();
      this.complaintRegForm.patchValue({
        department: null,
        officeranddesignation: null
      });
    } else if (complaintType === '02') {
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

    if (this.chargeSheetCrimeList.length === 0) {
      this.notify.showNotification('error', 'Please add at least one offence classification');
      return;
    }

    if (this.personList.length === 0) {
      this.notify.showNotification('error', 'Please add at least one person');
      return;
    }

    const complaintTypeObj = this.complaintTypeDropdown.find(
      item => item.value === this.complaintRegForm.value.complaintType
    );

    const finalPayload = {
      complaintTypeFlag: this.complaintRegForm.value.complaintType,
      complaintTypeName: complaintTypeObj?.text || '',
      isPrivateComplaint: this.isPrivateComplaint,
      isGovernmentComplaint: this.isGovernmentComplaint,
      complaintNo: this.complaintRegForm.value.complaintNo,
      complaintDate: this.complaintRegForm.value.complaintDate,
      complaintType: this.complaintRegForm.value.complaintType,
      
      ...(this.isGovernmentComplaint && {
        department: this.complaintRegForm.value.department,
        departmentName: this.deptDropdown.find(d => d.value === this.complaintRegForm.value.department)?.text || '',
        officeranddesignation: this.complaintRegForm.value.officeranddesignation,
      }),
      
      descOffence: this.complaintRegForm.value.descOffence,
      datefiledincourt: this.complaintRegForm.value.datefiledincourt,
      CfpNo: this.complaintRegForm.value.CfpNo,
      fullComplaintPDF: this.complaintRegForm.value.fullComplaintPDF,
      uploadOtherDocNo: this.complaintRegForm.value.uploadOtherDocNo,
      isDeclarationAccepted: this.complaintRegForm.value.isDeclarationAccepted,
      
      chargeSheetCrimes: this.chargeSheetCrimeList.map((crime, index) => ({
        srNo: index + 1,
        classificationId: crime.classification?.value,
        classificationName: crime.classification?.text,
        actId: crime.act?.value,
        actName: crime.act?.text,
        sectionId: crime.section?.value,
        sectionName: crime.section?.text
      })),
      
      persons: this.personList.map((person, index) => ({
        srNo: index + 1,
        personAgainstId: person.personAgainstId || 0,
        name: person.caseFiledAgainstName,
        address: person.caseFiledAgainstAddress,
        designation: person.caseFiledAgainstDesignation,
        institution: person.caseFiledAgainstInstituation
      })),
      
      submittedAt: new Date().toISOString(),
    };

    console.log('═══════════════════════════════════════');
    console.log('FINAL PAYLOAD FOR SUBMISSION:');
    console.log('═══════════════════════════════════════');
    console.log(JSON.stringify(finalPayload, null, 2));
    console.log('═══════════════════════════════════════');
    
    this.notify.showNotification('success', 'Complaint Registered Successfully CRWC/00028/2026');
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
  }

  // =====================================================
  //        PERSON SECTION LOGIC WITH API
  // =====================================================

  addPersonToList() {
    const form = this.personTempForm.value;

    if (!form.caseFiledAgainstName ||
        !form.caseFiledAgainstAddress ||
        !form.caseFiledAgainstDesignation ||
        !form.caseFiledAgainstInstituation) {
      this.notify.showNotification('info', constants.allFieldsReq);
      return;
    }

    // Prepare payload for API
    const payload = {
      PersonAgainstId: form.personAgainstId || 0,
      ComplaintRegId: this.complaintRegId || 0,
      Name: form.caseFiledAgainstName,
      Address: form.caseFiledAgainstAddress,
      Designation: form.caseFiledAgainstDesignation,
      Institution: form.caseFiledAgainstInstituation
    };

    // Call API
    this.api.post(this.url.AddEditPersonAgainst(), payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          // If editing existing person
          if (this.isEditingPerson && this.editingPersonIndex !== -1) {
            this.personList[this.editingPersonIndex] = {
              personAgainstId: res.data?.personAgainstId || form.personAgainstId,
              caseFiledAgainstName: form.caseFiledAgainstName,
              caseFiledAgainstAddress: form.caseFiledAgainstAddress,
              caseFiledAgainstDesignation: form.caseFiledAgainstDesignation,
              caseFiledAgainstInstituation: form.caseFiledAgainstInstituation
            };
            this.notify.showNotification('success', 'Person updated successfully');
          } else {
            // Adding new person
            this.personList.push({
              personAgainstId: res.data?.personAgainstId || 0,
              caseFiledAgainstName: form.caseFiledAgainstName,
              caseFiledAgainstAddress: form.caseFiledAgainstAddress,
              caseFiledAgainstDesignation: form.caseFiledAgainstDesignation,
              caseFiledAgainstInstituation: form.caseFiledAgainstInstituation
            });
            this.notify.showNotification('success', 'Person added successfully');
          }

          // Reset form and edit mode
          this.personTempForm.reset();
          this.personTempForm.patchValue({ personAgainstId: 0 });
          this.isEditingPerson = false;
          this.editingPersonIndex = -1;
        } else {
          this.notify.showNotification('error', res.message || 'Failed to save person');
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
    
    // Set edit mode
    this.isEditingPerson = true;
    this.editingPersonIndex = index;

    // Fill form with person data
    this.personTempForm.patchValue({
      personAgainstId: person.personAgainstId || 0,
      caseFiledAgainstName: person.caseFiledAgainstName,
      caseFiledAgainstAddress: person.caseFiledAgainstAddress,
      caseFiledAgainstDesignation: person.caseFiledAgainstDesignation,
      caseFiledAgainstInstituation: person.caseFiledAgainstInstituation
    });

    // Scroll to form (optional)
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

    // If person has ID from backend, call delete API
    if (personAgainstId > 0) {
      const reqParam = {
        PersonAgainstId: personAgainstId
      };

      this.api.get(this.url.DeletePersonAgainst(), reqParam).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.personList.splice(index, 1);
            this.notify.showNotification('success', 'Person deleted successfully');
            
            // If we were editing this person, cancel edit mode
            if (this.editingPersonIndex === index) {
              this.cancelEdit();
            }
          } else {
            this.notify.showNotification('error', res.message || 'Failed to delete person');
          }
        },
        error: (err: Error) => {
          console.error('API Error:', err);
          this.notify.showNotification('error', 'Failed to delete person. Please try again.');
        }
      });
    } else {
      // Person not saved to backend yet, just remove from list
      this.personList.splice(index, 1);
      
      if (this.editingPersonIndex === index) {
        this.cancelEdit();
      }
    }
  }

  // =====================================================
  //                CHARGE SHEET SECTION
  // =====================================================

  addChargeSheetCrime() {
    let form = this.chargeSheetForm.value;
    let reqFields: string[] = ['classification', 'acts', 'sections'];

    if (!form.classification || !form.acts || !form.sections) {
      reqFields.forEach(key =>
        this.chargeSheetForm.get(key)?.markAsTouched()
      );
      this.notify.showNotification('info', constants.allFieldsReq);
      return;
    }

    let classification = this.classificationDropdown.find(i => i.value == form.classification);
    let act = this.actsDropdown.find(i => i.value == form.acts);
    let section = this.sectionsDropdown.find(i => i.value == form.sections);

    this.chargeSheetCrimeList.push({
      classification,
      act,
      section
    });

    reqFields.forEach(i => this.chargeSheetForm.controls[i].reset());
  }

  removeChargeSheetCrime(index: number) {
    this.chargeSheetCrimeList.splice(index, 1);
  }

  // =====================================================
  //                DROPDOWN API CALLS
  // =====================================================

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

    let reqParam = {
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

    let reqParam = {
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
}