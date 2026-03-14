import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef, Column, GridReadyEvent, ProvidedColumnGroup } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { XlsxService } from '../../shared/services/xlsx.service';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import constants from '../../shared/utils/constants';

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [
    AgGridAngular,
    FormsModule,
    CommonModule
  ],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css'
})
export class DesignationComponent {

  // ===================== GRID STATE =====================
  designationList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string | undefined = '';
  sortBy: string = '';
  permissionByRole: any;
  colDef: ColDef[] = [];

  excel = inject(XlsxService);

  // ===================== COMPUTED =====================
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  // ===================== CONSTRUCTOR =====================
  constructor(
    private dialog: MatDialog,
    private notify: NotificationService,
    private _router: Router,
    private api: ApiService,
    private url: UrlService,
    private datePipe: DatePipe
  ) {}

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();
    this.pageSize = history.state?.prevPageSize || 10;
    this.getDesignationList();
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
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        valueGetter: (e: any) =>
          String(this.pageSize * (this.currentPage - 1) + (e.node.rowIndex + 1))
      },
      {
        field: 'designationEng',
        headerName: 'Designation English Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        minWidth: 260,
        flex: 1,
        filter: false
      },
      {
        field: 'designationHindi',
        headerName: 'Designation Hindi Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        width: 300,
        filter: false
      },
      {
        field: 'isActive',
        headerName: 'Action',
        pinned: 'right',
        width: 110,
        cellRenderer: GridActionButtonComponent,
        cellRendererParams: {
          edit:   (field: any) => { this.editDesignation(field); },
          delete: (field: any) => { this.confirmActiveDeactiveDesignation(field); },
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
        this.getDesignationList();
      } else if (sort === 'desc') {
        this.sortColumn  = column.getColDef().field;
        this.sortBy      = '1';
        this.currentPage = 1;
        this.getDesignationList();
      }
    }
  }

  // ===================== GET LIST =====================
  getDesignationList() {
    const reqParam = {
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      sortBy:       this.sortColumn,
      isSortByDesc: this.sortBy === '0' ? false : true
    };

    this.api.post(this.url.getDesignationList(), reqParam).subscribe({
      next: (res: any) => {
        this.designationList = res.data;
        this.totalRecords    = res.pagination[0].totalRecords;
      },
      error: (err: any) => { console.log(err); }
    });
  }

  // ===================== EDIT =====================
  editDesignation(e: any) {
    this._router.navigateByUrl('master/add-designation', {
      state: { designation: e, pageSize: this.pageSize }
    });
  }

  // ===================== ADD NEW =====================
  addNewDesignation() {
    this._router.navigateByUrl('master/add-designation', {
      state: { pageSize: this.pageSize }
    });
  }

  // ===================== DELETE =====================
  confirmActiveDeactiveDesignation(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width:  '350px',
      height: '170px',
      data:   { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: boolean) => {
        if (res) this.activeDeactiveDesignation(e);
      }
    });
  }

  activeDeactiveDesignation(e: any) {
    const reqParam = {
      designationId: e.designationId,
      active:        !e.active,
      updatedBy:     0
    };

    this.api.post(this.url.activeDeactiveDesignation(), reqParam).subscribe({
      next: (res: any) => {
        this.notify.showNotification('delete', res.msg || res.message);
        window.scrollTo(0, 0);
        this.getDesignationList();
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
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getDesignationList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getDesignationList();
  }

  // ===================== EXPORT EXCEL =====================
  excelExport() {
    const reqParam = {
      pageNo:   1,
      pageSize: 999999
    };

    this.api.post(this.url.getDesignationList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.data?.length > 0) {
          const columnHeaders: { [key: string]: string } = {
            rowID:                'Sr No',
            designationName:      'Designation Name',
            designationShortName: 'Designation Short Name'
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
            'Designation List',
            ' \n ( As on ' + formattedDate + ')'
          );
        } else {
          this.notify.showNotification('info', 'No Record To Export');
        }
      },
      error: (err: any) => { console.log(err); }
    });
  }

  // ===================== EXPORT PDF =====================
  exportPDF() {
    const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
    const headers = [
      'Government of Rajasthan',
      'Prosecution Department',
      '(Prosecution Case Management System)',
      'Designation List',
      '( As on ' + formattedDate + ')'
    ];

    const columns = [
      { header: 'Sr. No.',                  dataKey: 'rowID' },
      { header: 'Designation Name',         dataKey: 'designationName' },
      { header: 'Designation Short Name',   dataKey: 'designationShortName' }
    ];

    this.excel.exportAllJsonPDF(headers, columns, this.designationList, 'Designation List', true);
  }
}