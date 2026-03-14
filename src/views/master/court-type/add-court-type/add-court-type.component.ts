import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UrlService } from '../../../shared/services/url.service';
import { WordsRestrictService } from '../../../shared/services/words-restrict.service';
import constants from '../../../shared/utils/constants';

@Component({
  selector: 'app-add-court-type',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-court-type.component.html',
  styleUrl: './add-court-type.component.css'
})
export class AddCourtTypeComponent implements OnInit {

  restrictChar = inject(WordsRestrictService);
  api          = inject(ApiService);
  url          = inject(UrlService);
  notify       = inject(NotificationService);
  router       = inject(Router);

  editCourtType: any;

  // ===================== FORM =====================
  addCourtTypeForm: FormGroup = new FormGroup({
    courtTypeName:      new FormControl('', { validators: [Validators.required] }),
    courtTypeShortName: new FormControl('', { validators: [Validators.required] }),
    orderNo:            new FormControl('', { validators: [Validators.required] })
  });

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.editCourtType = history.state?.courtType;

    if (this.editCourtType) {
      this.addCourtTypeForm.patchValue({
        courtTypeName:      this.editCourtType?.courtTypeName,
        courtTypeShortName: this.editCourtType?.courtTypeShortName,
        orderNo:            this.editCourtType?.orderNo
      });
    }
  }

  // ===================== SAVE =====================
  onSave() {
    if (!this.addCourtTypeForm.valid) {
      this.addCourtTypeForm.markAllAsTouched();
      return;
    }

    const reqParam = {
      data: {
        rowID:              0,
        courtTypeId:        this.editCourtType?.courtTypeId || 0,
        courtTypeName:      this.addCourtTypeForm.value.courtTypeName,
        courtTypeShortName: this.addCourtTypeForm.value.courtTypeShortName,
        orderNo:            this.addCourtTypeForm.value.orderNo,
        active:             true,
        createdBy:          0,
        createdOn:          new Date().toISOString(),
        updatedBy:          0,
        updatedOn:          new Date().toISOString(),
        deleteBy:           0,
        deleteOn:           new Date().toISOString()
      }
    };

    this.api.post(this.url.addEditCourtType(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.message);
          this.router.navigateByUrl('master/court-type');
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ===================== CANCEL =====================
  onCancel() {
    this.router.navigateByUrl('master/court-type');
  }
}