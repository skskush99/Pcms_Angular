import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ColDef, Column, GridReadyEvent, ProvidedColumnGroup } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { XlsxService } from '../../shared/services/xlsx.service';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import constants from '../../shared/utils/constants';

@Component({
  selector: 'app-admin-department',
  standalone: true,
  imports: [AgGridAngular, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-department.component.html',
  styleUrl: './admin-department.component.css'
})
export class AdminDepartmentComponent {

  // ===================== GRID STATE =====================
  adminDeptList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string | undefined = '';
  sortBy: string = '';
  colDef: ColDef[] = [];
  permissionByRole: any;
  currentDate: Date = new Date();

  // ===================== COMPUTED =====================
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  // ===================== CONSTRUCTOR =====================
  constructor(
    private notify: NotificationService,
    private _router: Router,
    private api: ApiService,
    private dialog: MatDialog,
    private url: UrlService,
    private excel: XlsxService,
    private datePipe: DatePipe
  ) {}

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();
    this.getAdminDeptList();
  }

  // ===================== GRID SETUP =====================
  createGrid() {
    this.colDef = [
      {
        field: 'RowID',
        headerName: 'Sr No',
        sortable: false,
        width: 80,
        pinned: 'left',
        valueGetter: (e: any) =>
          String(this.pageSize * (this.currentPage - 1) + (e.node.rowIndex + 1))
      },
      {
        field: 'AdmDeptName',
        headerName: 'Department Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        flex: 1,
        autoHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        filter: false
      },
      {
        field: 'AdmDeptShortName',
        headerName: 'Department Short Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 220,
        filter: false
      },
      {
        field: 'IsActive',
        headerName: 'Action',
        pinned: 'right',
        width: 120,
        cellRenderer: GridActionButtonComponent,
        cellRendererParams: {
          edit:   (field: any) => { this.editAdminDept(field); },
          delete: (field: any) => { this.confirActiveDeactiveAdminDept(field); },
          permission: this.permissionByRole
        }
      }
    ];
  }

  // ===================== GRID READY =====================
  onGridReady(params: GridReadyEvent): void {}

  // ===================== GET LIST =====================
  getAdminDeptList() {
    const reqParam = {
      pageNo: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortColumn,
      isSortByDesc: this.sortBy === '0' ? false : true
    };

    this.api.post(this.url.getadminDeptList(), reqParam).subscribe({
      next: (res: any) => {
        if (res?.data) {

          // ✅ Normalize ID (IMPORTANT FIX)
          this.adminDeptList = res.data.map((x: any) => ({
            ...x,
            admDeptId: x.AdmDeptId
          }));

          this.totalRecords = res.pagination?.[0]?.totalRecords || 0;

        } else {
          this.adminDeptList = [];
          this.totalRecords = 0;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.notify.showNotification('error', 'Failed to load data');
      }
    });
  }

  // ===================== SORTING =====================
  onColumnHeaderClicked(event: { column: Column | ProvidedColumnGroup }): void {
    if ('getSort' in event.column) {
      const column = event.column as Column;
      const sort = column.getSort();

      if (sort === 'asc') {
        this.sortColumn = column.getColDef().field;
        this.sortBy = '0';
        this.currentPage = 1;
        this.getAdminDeptList();
      } else if (sort === 'desc') {
        this.sortColumn = column.getColDef().field;
        this.sortBy = '1';
        this.currentPage = 1;
        this.getAdminDeptList();
      }
    }
  }

  // ===================== EDIT =====================
  editAdminDept(e: any) {

    // ✅ FIX: ensure correct ID mapping
    const payload = {
      ...e,
      admDeptId: e.admDeptId || e.AdmDeptId
    };

    this._router.navigateByUrl('master/add-admin-dept', {
      state: { addEditAdminDept: payload }
    });
  }

  // ===================== DELETE / RESTORE =====================
  confirActiveDeactiveAdminDept(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width: '350px',
      height: '170px',
      data: { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: any) => {
        if (res) this.activeDeactiveAdminDept(e);
      }
    });
  }

  activeDeactiveAdminDept(e: any) {
    const reqParam = {
      admDeptId: e.admDeptId || e.AdmDeptId,
      active: !e.IsActive,
      updatedBy: 0
    };

    this.api.post(this.url.activeDeaciveAdminDept(), reqParam).subscribe({
      next: (res: any) => {
        this.notify.showNotification('delete', res.msg || res.message);
        window.scrollTo(0, 0);
        this.getAdminDeptList();
      },
      error: (err: any) => {
        console.log(err);
        this.notify.showNotification('error', 'Something Went Wrong');
        window.scrollTo(0, 0);
      }
    });
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
    this.currentPage = 1;
    this.getAdminDeptList();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getAdminDeptList();
  }

  // ===================== ADD NEW =====================
  addNewAdminDept() {
    this._router.navigateByUrl('master/add-admin-dept');
  }

  // ===================== EXPORT EXCEL =====================
  exportExcel() {
    const reqParam = {
      admDeptId: 0,
      pageNo: 1,
      pageSize: 999999,
      sortBy: '',
      isSortByDesc: true
    };

    this.api.post(this.url.getadminDeptList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status && res.data?.length) {

          const columnHeaders: { [key: string]: string } = {
            RowID: 'Sr No',
            AdmDeptName: 'Department Name',
            AdmDeptShortName: 'Department Short Name'
          };

          const modifiedData = res.data.map((row: any) => {
            const obj: any = {};
            Object.keys(columnHeaders).forEach(key => {
              if (row[key] !== undefined) {
                obj[columnHeaders[key]] = row[key];
              }
            });
            return obj;
          });

          const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');

          this.excel.exportAgGridAsExcelWithHeading(
            modifiedData,
            columnHeaders,
            'Admin Department List',
            ' \n ( As on ' + formattedDate + ')'
          );

        } else {
          this.notify.showNotification('info', 'No Record To Export');
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ===================== EXPORT PDF =====================
  exportPDF(): void {
    this.notify.showNotification('info', 'PDF export coming soon');
  }
}