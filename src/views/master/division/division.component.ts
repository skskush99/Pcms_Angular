import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { XlsxService } from '../../shared/services/xlsx.service';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import constants from '../../shared/utils/constants';

@Component({
  selector: 'app-division',
  standalone: true,
  imports: [
    AgGridAngular,
    FormsModule,
    CommonModule
  ],
  templateUrl: './division.component.html',
  styleUrl: './division.component.css'
})
export class DivisionComponent {

  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);
  excel  = inject(XlsxService);

  // ===================== GRID STATE =====================
  divisionList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  colDef: ColDef[] = [];

  // ===================== COMPUTED =====================
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();
    this.getDivisionList();
  }

  // ===================== GRID SETUP =====================
  createGrid() {
    this.colDef = [
      {
        field: 'RowID',
        headerName: 'Sr No',
        sortable: false,
        width: 80,
        pinned: 'left'
      },
      {
        field: 'DivisionNameEng',
        headerName: 'Division Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'CreatedDate',
        headerName: 'Created Date',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        minWidth: 250,
        flex: 1,
        filter: false
      }
    ];
  }

  // ===================== GET LIST =====================
  getDivisionList() {
    const reqParam = {
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      sortBy:       '',
      isSortByDesc: true
    };

    this.api.post(this.url.getDivisionListRajMaster(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.divisionList = res.data;
          this.totalRecords = res.pagination[0].totalRecords;
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getDivisionList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getDivisionList();
  }

  // ===================== EXPORT EXCEL =====================
  exportExcel() {
    const reqParam = {
      DivisionId: 0,
      StateId:    0
    };

    this.api.post(this.url.getDivisionListRajMaster(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          if (res.data?.length) {
            const columnHeaders: { [key: string]: string } = {
              RowID:           'Sr No',
              DivisionNameEng: 'Division',
              CreatedDate:     'Created Date'
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

            this.excel.exportAgGridAsExcelWithHeading(
              modifiedData,
              columnHeaders,
              'Division List',
              ''
            );
          } else {
            this.notify.showNotification('info', 'No Data To Export');
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
}