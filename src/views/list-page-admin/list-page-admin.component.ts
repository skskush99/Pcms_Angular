import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DropdownListInterface } from '../shared/model/shared.model';
import { ApiService } from '../shared/services/api.service';
import { UrlService } from '../shared/services/url.service';
import { NotificationService } from '../shared/services/notification.service';
import { GridActionButtonComponent } from '../shared/components/grid-action-button/grid-action-button.component';
import { ConfirmationPopUpComponent } from '../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import constants from '../shared/utils/constants';

@Component({
  selector: 'app-list-page-admin',
  standalone: true,
  imports: [
    AgGridAngular,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    CommonModule
  ],
  templateUrl: './list-page-admin.component.html',
  styleUrl: './list-page-admin.component.css',
  animations: [
    trigger('slideInOut', [
      state('in',  style({ height: '*',    opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class ListPageAdminComponent implements OnInit {

  // ===================== GRID =====================
  colDef: ColDef[] = [];
  permissionMappingRequestList: any[] = [];

  // ===================== PAGINATION =====================
  pageSize:     number = 10;
  currentPage:  number = 1;
  totalRecords: number = 0;

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  // ===================== SERVICES =====================
  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);
  router = inject(Router);
  dialog = inject(MatDialog);

  // ===================== DROPDOWNS =====================
  districtDropdown: DropdownListInterface[] = [];
  officeDropdown:   DropdownListInterface[] = [];
  levelDropdown:    DropdownListInterface[] = [];
  deptDropdown:     DropdownListInterface[] = [];
  roleDropdown:     DropdownListInterface[] = [];

  // ===================== FILTER FORM =====================
  permissionMappingFilterForm: FormGroup = new FormGroup({
    role:     new FormControl(null),
    dept:     new FormControl(null),
    level:    new FormControl(null),
    office:   new FormControl(null),
    sso:      new FormControl(null),
    district: new FormControl(null),
    userName: new FormControl(null)
  });

  // ===================== FILTER TOGGLE =====================
  isFormCollapsed = true;
  buttonText      = 'Show Filter';

  get animationState() {
    return this.isFormCollapsed ? 'out' : 'in';
  }

  toggleForm() {
    this.isFormCollapsed = !this.isFormCollapsed;
    this.buttonText = this.isFormCollapsed ? 'Show Filter' : 'Hide Filter';
    localStorage.setItem('registrationFormHidden', this.isFormCollapsed.toString());
  }

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();
    this.getPermissionMappingList();
    this.getDeptDropdown();
    this.getOfficeDropdown();
    this.getDistrictDropdown();
    this.getLevelDropdown();
    this.getRolesDropdown();
  }

  // ===================== GRID SETUP =====================
  createGrid() {
    this.colDef = [
      { headerName: 'Sr. No', field: 'RowID', width: 80 },
      {
        field: 'RUserName', headerName: 'Name/Role', flex: 1, filter: false,
        wrapHeaderText: true, autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' }, autoHeight: true,
        cellRenderer: (e: any) =>
          `<div class="flex flex-col gap-0.5 justify-center" style="line-height:1.5;">
            <p style="margin:0;padding:0;" class="font-semibold text-base">${e.data?.RUserName || '-'}</p>
            <p class="mb-2 text-sm text-gray-600">(${e.data?.RoleName || '-'})</p>
          </div>`
      },
      {
        field: 'DivisionName', headerName: 'Division/District', flex: 1, filter: false,
        wrapHeaderText: true, autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' }, autoHeight: true,
        cellRenderer: (e: any) =>
          `<div class="flex flex-col gap-0.5 justify-center" style="line-height:1.5;">
            <p style="margin:0;padding:0;" class="font-semibold text-base">${e.data?.DivisionName || '-'}</p>
            <p class="mb-2 text-gray-600">(${e.data?.DistrictName || '-'})</p>
          </div>`
      },
      { field: 'OfficeName', headerName: 'Office', flex: 1, filter: false, wrapHeaderText: true, autoHeaderHeight: true, cellStyle: { whiteSpace: 'normal' }, autoHeight: true },
      { field: 'CourtName',  headerName: 'Court',  flex: 1, filter: false, wrapHeaderText: true, autoHeaderHeight: true, cellStyle: { whiteSpace: 'normal' }, autoHeight: true },
      {
        field: 'UserMapped', headerName: 'Status', width: 120, filter: false,
        wrapHeaderText: true, autoHeaderHeight: true, cellStyle: { whiteSpace: 'normal' },
        cellRenderer: (e: any) => {
          if (e.value === 0) return `<div class="flex justify-start items-center h-full"><p class="bg-amber-100 text-amber-800 rounded-lg w-24 text-center py-1.5 m-0 text-sm font-medium">Pending</p></div>`;
          if (e.value === 1) return `<div class="flex justify-start items-center h-full"><p class="bg-[#DCFCE7] text-[#166534] rounded-lg w-24 text-center py-1.5 m-0 text-sm font-medium">Approved</p></div>`;
          if (e.value === 2) return `<div class="flex justify-start items-center h-full"><p class="bg-[#d35d65] text-[#611629] rounded-lg w-24 text-center py-1.5 m-0 text-sm font-medium">Rejected</p></div>`;
          return '-';
        }
      },
      {
        field: 'action', headerName: 'Action', width: 130, filter: false,
        wrapHeaderText: true, autoHeaderHeight: true, cellStyle: { whiteSpace: 'normal' }, autoHeight: true,
        cellRenderer: GridActionButtonComponent,
        cellRendererParams: {
          Type: 'permissionMappingApprove',
          permissionMappingApprove: (field: any) => this.confirmPermissionMappingApprove(field)
        }
      }
    ];
  }

  // ===================== DROPDOWNS =====================
  getDistrictDropdown() {
    this.api.get(this.url.getDistrictDropDown()).subscribe({
      next:  (res: any) => { this.districtDropdown = res.data; },
      error: () => {}
    });
  }

  getDeptDropdown() {
    this.api.get(this.url.getAdminDeptDropdown()).subscribe({
      next:  (res: any) => { this.deptDropdown = res.data; },
      error: () => {}
    });
  }

  getOfficeDropdown() {
    this.api.get(this.url.getOfficeDropdown()).subscribe({
      next:  (res: any) => { this.officeDropdown = res.data; },
      error: () => {}
    });
  }

  getLevelDropdown() {
    this.api.get(this.url.getLevelDropdown()).subscribe({
      next:  (res: any) => { this.levelDropdown = res.data; },
      error: () => {}
    });
  }

  getRolesDropdown() {
    this.api.get(this.url.getRolesDropdown()).subscribe({
      next:  (res: any) => { this.roleDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== LIST =====================
  getPermissionMappingList() {
    const reqParam = {
      levelId:      this.permissionMappingFilterForm.value.level    || 0,
      roleId:       this.permissionMappingFilterForm.value.role     || 0,
      departmentId: this.permissionMappingFilterForm.value.dept     || 0,
      officeId:     this.permissionMappingFilterForm.value.office   || 0,
      ssoid:        this.permissionMappingFilterForm.value.sso      || '',
      districtId:   this.permissionMappingFilterForm.value.district || 0,
      userName:     this.permissionMappingFilterForm.value.userName || '',
      isActive:     1,
      sortBy:       '',
      isSortByDesc: true,
      pageNo:       this.currentPage,
      pageSize:     this.pageSize
    };

    this.api.post(this.url.getPermissionMappingList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.permissionMappingRequestList = res.data;
          this.totalRecords = res.pagination[0]?.totalRecords;
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ===================== APPROVE =====================
  confirmPermissionMappingApprove(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      height: '170px',
      width:  '350px',
      data:   { msg: constants.confirmPermissionMap }
    });
    dialogRef.afterClosed().subscribe({
      next: (res: boolean) => { if (res) this.permissionMappingApprove(e); }
    });
  }

  permissionMappingApprove(e: any) {
    if (!e?.RId) {
      this.notify.showNotification('error', constants.apiError);
      return;
    }

    const reqParam = {
      tocken:       this.api.token,
      rId:          e?.RId,
      departmentId: 0
    };

    this.api.post(this.url.mapUserBySa(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('success', res.message);
          this.getPermissionMappingList();
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ===================== SEARCH / RESET =====================
  onSearch() {
    this.currentPage = 1;
    this.getPermissionMappingList();
  }

  resetFilter() {
    this.permissionMappingFilterForm.reset();
    this.currentPage = 1;
    this.getPermissionMappingList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getPermissionMappingList();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getPermissionMappingList();
  }

  // ===================== EXPORT =====================
  exportExcel() {
    this.notify.showNotification('info', 'Excel export coming soon');
  }

  exportPDF() {
    const columns = ['Sr. No', 'Name', 'Role', 'Division', 'District', 'Office', 'Court', 'Status'];
    // PDF export implementation here
  }
}