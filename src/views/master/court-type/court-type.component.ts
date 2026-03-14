import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
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
  selector: 'app-court-type',
  standalone: true,
  imports: [
    AgGridAngular,
    FormsModule,
    CommonModule
  ],
  templateUrl: './court-type.component.html',
  styleUrl: './court-type.component.css'
})
export class CourtTypeComponent {

  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);
  excel  = inject(XlsxService);
  router = inject(Router);
  dialog = inject(MatDialog);

  // ===================== GRID STATE =====================
  courtTypeList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  colDef: ColDef[] = [];
  permissionByRole: any;

  constructor(private datePipe: DatePipe) {}

  // ===================== COMPUTED =====================
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();
    this.getcourtTypeList();
  }

  // ===================== GRID SETUP =====================
  createGrid() {
    this.colDef = [
      {
        field: 'rowID',
        headerName: 'Sr No',
        sortable: false,
        width: 80,
        pinned: 'left'
      },
      {
        field: 'courtTypeName',
        headerName: 'Court Type Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'courtTypeShortName',
        headerName: 'Court Type Short Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        minWidth: 250,
        flex: 1,
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
          delete: (field: any) => { this.confirActiveDeactiveCourtType(field); },
          edit:   (field: any) => { this.editCourtType(field); },
          permission: this.permissionByRole
        }
      }
    ];
  }

  // ===================== GET LIST =====================
  getcourtTypeList() {
    const reqParam = {
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      sortBy:       '',
      isSortByDesc: true
    };

    this.api.post(this.url.getCourtTypesList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.courtTypeList = res.data;
          this.totalRecords  = res.pagination[0].totalRecords;
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ===================== DELETE =====================
  confirActiveDeactiveCourtType(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width:  '350px',
      height: '170px',
      data:   { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: boolean) => {
        if (res) this.activeDeactiveCourtType(e);
      }
    });
  }

  activeDeactiveCourtType(e: any) {
    const reqParam = {
      courtTypeId: e?.courtTypeId,
      active:      !e?.active,
      updatedBy:   0
    };

    this.api.post(this.url.activeDeactiveCourtType(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('delete', res?.message);
          this.getcourtTypeList();
        } else {
          this.notify.showNotification('error', constants.apiError);
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ===================== EDIT / ADD =====================
  editCourtType(e: any) {
    this.router.navigateByUrl('master/add-court-type', { state: { courtType: e } });
  }

  addCourtType() {
    this.router.navigateByUrl('master/add-court-type');
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getcourtTypeList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getcourtTypeList();
  }

  // ===================== EXPORT EXCEL =====================
  exportExcel() {
    const reqParam = {
      pageNo:       1,
      pageSize:     999999,
      sortBy:       '',
      isSortByDesc: true
    };

    this.api.post(this.url.getCourtTypesList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          if (res.data?.length) {
            const columnHeaders: { [key: string]: string } = {
              rowID:              'Sr No',
              courtTypeName:      'Court Type Name',
              courtTypeShortName: 'Court Type Short Name'
            };

            const modifiedData = res.data.map((row: any) => {
              const modifiedRow: { [key: string]: any } = {};
              Object.keys(columnHeaders).forEach((key: string) => {
                if (row[key] !== undefined) {
                  modifiedRow[columnHeaders[key]] = row[key];
                }
              });
              return modifiedRow;
            });

            const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
            this.excel.exportAgGridAsExcelWithHeading(
              modifiedData,
              columnHeaders,
              'Court Type List',
              ' \n ( As on ' + formattedDate + ')'
            );
          } else {
            this.notify.showNotification('info', 'No Record To Export');
          }
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ===================== EXPORT PDF =====================
  exportPDF() {
    const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
    const headers = [
      'Government of Rajasthan',
      'Prosecution Department',
      '(Prosecution Case Management System)',
      'Court Type List',
      '( As on ' + formattedDate + ')'
    ];

    const columns = [
      { header: 'Sr. No.',               dataKey: 'rowID' },
      { header: 'Court Type Name',        dataKey: 'courtTypeName' },
      { header: 'Court Type Short Name',  dataKey: 'courtTypeShortName' }
    ];

    this.excel.exportAllJsonPDF(headers, columns, this.courtTypeList, 'Court Type List', true);
  }
}