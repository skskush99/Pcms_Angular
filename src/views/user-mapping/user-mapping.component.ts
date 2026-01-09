import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { UrlService } from '../shared/services/url.service';
import { NotificationService } from '../shared/services/notification.service';
import { DropdownListInterface } from '../shared/model/shared.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import constants from '../shared/utils/constants';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-user-mapping',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, FormsModule, AgGridAngular, DatePipe, NgClass],
  templateUrl: './user-mapping.component.html',
  styleUrl: './user-mapping.component.css'
})
export class UserMappingComponent implements OnInit{

  @ViewChild('redirectBackToSSO', { static: false })
  redirectBackToSSO!: ElementRef<HTMLFormElement>;

  api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  ssoId : string = '';
  colDef : ColDef[] = [];
  officeDropdown : DropdownListInterface[] = [];
  divisionDropdown : DropdownListInterface[] = [];
  districtDropdown : DropdownListInterface[] = [];
  levelDropdown : DropdownListInterface[] = [];
  roleDropdown : DropdownListInterface[] = [];
  designationDropdown : DropdownListInterface[] = [];
  courtDropdown : DropdownListInterface[] = [];
  sToken : string | null = '';
  ssoDetails : any;
  userMappedRequested : boolean = false;
  permissionMappingRequestList : any;
  mappingReqData : any;

  roleMappingForm : FormGroup = new FormGroup({
    court : new FormControl(null , [Validators.required]),
    division : new FormControl(null , [Validators.required]),
    district : new FormControl(null , [Validators.required]),
    office : new FormControl(null , [Validators.required]),
    designation : new FormControl(null , [Validators.required]),
    role : new FormControl(null , [Validators.required]),
    level : new FormControl(null , [Validators.required]),
  })

  ngOnInit(): void {
    this.mappingReqData = history.state?.mappingReqData;
    this.ssoId = history.state?.ssoId || this.mappingReqData[0]?.rssoid || 'RTSP.TEST';
    this.userMappedRequested = history.state?.userMappedRequest || false;
    console.log(this.mappingReqData);
    console.log(this.userMappedRequested);
    
    if(!this.userMappedRequested) this.getUserDetailsFromSSO(this.ssoId );
    if(this.userMappedRequested){
      this.createGrid();
      this.permissionMappingRequestList = this.mappingReqData;
    }
    else{
    this.getOfficeDropdown();
    this.getRolesDropdown();
    this.getDivisionDropdown();
    this.getDesignationDropdown();
    this.getCourtDropdown();
    this.getLevelDropdown();
    }

    console.log(this.permissionMappingRequestList);
    
  }

  getOfficeDropdown(){
    this.api.get(this.url.getOfficeAuthDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.officeDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      }
    })
  }


  createGrid(){
      this.colDef = [
        // {headerName : 'Sr. No' , field : 'RowID', width : 80 , valueFormatter : e => e.node?.rowIndex + 1},
        { field: 'rUserName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Name/Role' , flex : 1 , filter : false , cellRenderer : (e : any) => `<div class="flex flex-col gap-0.5 justify-center" style="line-height: 1.5;"><p style="margin: 0; padding: 0;" class="font-semibold text-base">${e.data?.rUserName || '-'}</p><p class="mb-2 text-sm text-gray-600">(${e.data?.roleName || '-'})</p></div>`},
        { field: 'divisionName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Division/District' , flex : 1 , filter : false , cellRenderer : (e : any) => `<div class="flex flex-col gap-0.5 justify-center" style="line-height: 1.5;"><p style="margin: 0; padding: 0;" class="font-semibold text-base">${e.data?.divisionName || '-'}</p><p class="mb-2 text-gray-600">(${e.data?.districtName || '-'})</p></div>`},
        { field: 'officeName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Office' , flex : 1 , filter : false ,},
        { field: 'courtName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Court' , flex : 1 , filter : false ,},
        { field: 'userMapped', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , headerName: 'Status' , flex : 1 , filter : false , cellRenderer : (e : any) => {
  
         if (e.value === 0) {
        return `
           <div class="flex justify-center items-center h-full">
        <p class="bg-amber-100 text-amber-800 rounded-lg w-24 text-center py-1.5 m-0 text-sm font-medium">
          Pending
        </p>
      </div>
        `;
         }if (e.value === 1) {
        return `
          <div class="flex justify-center items-center h-full">
        <p class="bg-[#DCFCE7] text-[#166534] rounded-lg w-24 text-center py-1.5 m-0 text-sm font-medium">
          Approved
        </p>
      </div>
        `;
      }if (e.value === 2) {
        return `
          <div class="flex justify-center items-center h-full">
        <p class="bg-[#d35d65] text-[#611629] rounded-lg w-24 text-center py-1.5 m-0 text-sm font-medium">
          Rejected
        </p>
      </div>
        `;
      }
      return '-'
        }},
        // { field: 'action', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Action', width : 130 ,  filter : false , 
        //   cellRenderer : GridActionButtonComponent  , cellRendererParams : {
        //     Type : 'permissionMappingApprove',
        //     permissionMappingApprove : (field : any) => this.permissionMappingApprove(field)
        //   }},
      ]
    }


  getUserDetailsFromSSO(ssoId : string){
    let reqParam = {
      ssoid : ssoId
    }
    this.api.post(this.url.getUserDetailsFromSSO() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.ssoDetails = res.data[0];
        }else this.notify.showNotification('error' , res.message)
      },
      error : (err : Error) => {
        console.error(err);
        this.notify.showNotification('error' , constants.apiError)
      }
    })
  }


  getLevelDropdown(){
    this.api.get(this.url.getLevelAuthDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.levelDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      }
    })
  }


  getRolesDropdown(){
    this.api.get(this.url.getRoleAuthDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.roleDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      }
    })
  }
  
  
  getDivisionDropdown(){
    this.api.get(this.url.getDivisionAuthDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.divisionDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      }
    })
  }

  getDistrictDropdown(){
    this.roleMappingForm.controls['district'].reset();
    if(!this.roleMappingForm.value.division){
      this.roleMappingForm.controls['district'].reset();
      this.districtDropdown = [];
      return
    }
    let reqParams = {
      DivisionId : this.roleMappingForm.value.division
    }
    this.api.get(this.url.getDistrictAuthDropdown() , reqParams).subscribe({
      next : (res : any) => {
        console.log(res);
        this.districtDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      } 
    })
  }

  onSave(){
    if(!this.roleMappingForm.valid){
      this.roleMappingForm.markAllAsTouched();
      return
    }
    let reqParam = {
      "tocken": this.api.token || localStorage.getItem('stoken'),
      "data": {
        "rId": 0,
        "rssoid": this.ssoId || '',
        "rUserName": this.ssoDetails?.displayName || '',
        "rDesignationId": 0,
        "rDesignationName": this.ssoDetails?.designation || "",
        "rDepartmentId": 0,
        "rDepartmentName": this.ssoDetails?.department || '',
        "rdob": this.ssoDetails?.dateOfBirth || '',
        "rGender": this.ssoDetails?.gender || '',
        "rOfficialMail": this.ssoDetails?.mailOfficial || '',
        "rMobile": this.ssoDetails?.mobile || '',
        "contact": "",
        "rAadhaarId": this.ssoDetails?.aadhaarId || '',
        "rBhamashahId": this.ssoDetails?.bhamashahId || '',
        "rBhamashahMemberId": this.ssoDetails?.bhamashahMemberId || '',
        "rImage": this.ssoDetails?.jpegPhoto || "",
        "levelId": this.roleMappingForm.value.level,
        "roleId": this.roleMappingForm.value.role,
        "divisionId": this.roleMappingForm.value.division,
        "districtId": this.roleMappingForm.value.district,
        "officeId": this.roleMappingForm.value.office,
        "designationId": this.roleMappingForm.value.designation,
        "courtId": this.roleMappingForm.value.court,
        "isActive": true,
        "createdBy": 0,
        "approvedBy": 0,
        "updatedBy": 0,
        "deletedBy": 0
      }
    }
    this.api.post(this.url.addUserMappingReq() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        // this.mappingReqData = res.
      },
      error : (err : Error) => {
        console.error(err);
        this.notify.showNotification('error' , constants.apiError)
      }
    })
  }
  
  
  
  getDesignationDropdown(){
    this.api.get(this.url.getDesignationAuthDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.designationDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      }
    })
  }
  
  
  getCourtDropdown(){
    this.api.get(this.url.getCourtAuthDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.courtDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      }
    })
  }



  backToSso(){
    this.sToken = localStorage.getItem('stoken');
    this.redirectBackToSSO.nativeElement.action = constants?.backTOSSO
    localStorage.clear();
    this.redirectBackToSSO.nativeElement.submit();
  }

}
