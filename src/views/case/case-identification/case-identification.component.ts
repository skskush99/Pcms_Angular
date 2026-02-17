import { Component, inject, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { createYearList } from '../../shared/utils/utils';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';
import { NotificationService } from '../../shared/services/notification.service';
import constants from '../../shared/utils/constants';
import { MatDialog } from '@angular/material/dialog';
import { ECourtCnrSearchComponent } from '../../shared/components/e-court-cnr-search/e-court-cnr-search.component';

@Component({
  selector: 'app-case-identification',
  standalone: true,
  imports: [NgSelectModule , ReactiveFormsModule],
  templateUrl: './case-identification.component.html',
  styleUrl: './case-identification.component.css'
})
export class CaseIdentificationComponent implements OnInit{

  thanaDropdown : DropdownListInterface[] = [];
  firYearDropdown : DropdownListInterface[] = [];


  api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  dialog = inject(MatDialog);


  caseIdentificationForm : FormGroup = new FormGroup({
    regType : new FormControl("diar"),
    searchCaseVia : new FormControl("fir"),
    thana : new FormControl(null),
    firNo : new FormControl(""),
    firYear : new FormControl(null),
    cisCnr : new FormControl(""),
  })


  ngOnInit(): void {
    this.firYearDropdown = createYearList(1950);
  }


  searnCnrCis(){
    if(!this.caseIdentificationForm.value.cisCnr){
      this.notify.showNotification('info' , constants.cnrNotAvail);
      return
    }
    this.api.get(this.url.searchCaseByCNRECourt(this.caseIdentificationForm.value.cisCnr)).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status && !Object.hasOwn(res.data?.data , 'Error')){
          this.dialog.open(ECourtCnrSearchComponent , {
            width : '95dvw',
            maxHeight : '85dvh',
            data: res.data?.data
          })
        }else this.notify.showNotification('error' , res.message);
        
      },
      error : (err : Error) => {
        console.log(err);
        this.notify.showNotification('error' , constants.apiError);
        throw new Error(err?.message);
      }
    })
  }
}
