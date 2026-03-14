import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef, Column, GridReadyEvent, ProvidedColumnGroup } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import constants from '../../shared/utils/constants';

@Component({
  selector: 'app-fir-status',
  standalone: true,
  imports: [
    AgGridAngular,
    FormsModule,
    CommonModule
  ],
  templateUrl: './fir-status.component.html',
  styleUrl: './fir-status.component.css'
})
export class FirStatusComponent {

  // ===================== GRID STATE =====================
  firStatusList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string | undefined = '';
  sortBy: string = '';
  colDef: ColDef[] = [];
  permissionByRole: any;

  // ===================== COMPUTED =====================
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  // ===================== CONSTRUCTOR =====================
  constructor(
    private notify:  NotificationService,
    private _router: Router,
    private api:     ApiService,
    private dialog:  MatDialog,
    private url:     UrlService
  ) {}

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();
    this.getFirStatusList();
  }

  // ===================== GRID SETUP =====================
  createGrid() {
    this.colDef = [
      {
        field: 'srNo',
        headerName: 'Sr No',
        sortable: false,
        width: 80,
        pinned: 'left',
        valueGetter: (e: any) =>
          String(this.pageSize * (this.currentPage - 1) + (e.node.rowIndex + 1))
      },
      {
        field: 'FirStatusNameEnglish',
        headerName: 'FIR Status English Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'FirStatusNameHindi',
        headerName: 'FIR Status Hindi Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 300,
        filter: false
      },
      {
        field: 'IsActive',
        headerName: 'Action',
        pinned: 'right',
        width: 100,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellRenderer: GridActionButtonComponent,
        cellRendererParams: {
          delete:     (field: any) => { this.confirActiveDeactiveFirStatus(field); },
          edit:       (field: any) => { this.editFirStatus(field); },
          permission: this.permissionByRole
        }
      }
    ];
  }

  // ===================== GRID READY =====================
  onGridReady(params: GridReadyEvent): void {}

  // ===================== SORTING =====================
  onColumnHeaderClicked(event: { column: Column | ProvidedColumnGroup }): void {
    if ('getSort' in event.column) {
      const column = event.column as Column;
      const sort   = column.getSort();

      if (sort === 'asc') {
        this.sortColumn  = column.getColDef().field;
        this.sortBy      = '0';
        this.currentPage = 1;
        this.getFirStatusList();
      } else if (sort === 'desc') {
        this.sortColumn  = column.getColDef().field;
        this.sortBy      = '1';
        this.currentPage = 1;
        this.getFirStatusList();
      }
    }
  }

  // ===================== GET LIST =====================
  getFirStatusList() {
    const reqParam = {
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      sortBy:       this.sortColumn,
      isSortByDesc: this.sortBy === '0' ? false : true
    };

    this.api.post(this.url.getFirStatusList(), reqParam).subscribe({
      next: (res: any) => {
        this.firStatusList = res.data;
        this.totalRecords  = res.pagination[0].totalRecords;
      },
      error: () => {}
    });
  }

  // ===================== EDIT / ADD =====================
  editFirStatus(e: any) {
    this._router.navigateByUrl('master/add-fir-status', {
      state: { addEditFirStatus: e }
    });
  }

  addNewFirStatus() {
    this._router.navigateByUrl('master/add-fir-status');
  }

  // ===================== DELETE =====================
  confirActiveDeactiveFirStatus(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width:  '350px',
      height: '170px',
      data:   { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: any) => {
        if (res) this.activeDeactiveFirStatus(e);
      }
    });
  }

  activeDeactiveFirStatus(e: any) {
    const reqParam = {
      firStatusId: e?.FirStatusId,
      isActive:    !e.IsActive,
      updatedBy:   0
    };

    this.api.post(this.url.activeDeactiveFirStatus(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('delete', res.msg || res.message);
          this.getFirStatusList();
        } else {
          this.notify.showNotification('error', res.message);
        }
        window.scrollTo(0, 0);
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
        window.scrollTo(0, 0);
      }
    });
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getFirStatusList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getFirStatusList();
  }
}