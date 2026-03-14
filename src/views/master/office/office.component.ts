import { Component } from '@angular/core';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { XlsxService } from '../../shared/services/xlsx.service';
import constants from '../../shared/utils/constants';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, Column, ProvidedColumnGroup } from 'ag-grid-community';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';

@Component({
  selector: 'app-office',
  standalone: true,
  imports: [
    AgGridAngular,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './office.component.html',
  styleUrl: './office.component.css',
  animations: [
    trigger('slideInOut', [
      state('in',  style({ height: '*',    opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class OfficeComponent {

  // ===================== FILTER STATE =====================
  isFormCollapsed = true;
  buttonText = 'Show Filter';

  // ===================== GRID STATE =====================
  sortColumn: string | undefined = '';
  sortBy: string = '';
  officeList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;

  // ===================== DROPDOWNS =====================
  districtDropDown: DropdownListInterface[] = [];
  permissionByRole: any;
  colDef: ColDef[] = [];

  // ===================== FILTER FORM =====================
  officeFilterForm: FormGroup = new FormGroup({
    DistrictId:   new FormControl(null, { nonNullable: true }),
    ActiveFilter: new FormControl('1',  { nonNullable: true }),
  });

  // ===================== COMPUTED =====================
  get animationState() {
    return this.isFormCollapsed ? 'out' : 'in';
  }

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
    private excel: XlsxService,
    private datePipe: DatePipe
  ) {}

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();

    const ifPrevSize = history.state?.prevPageSize;
    if (ifPrevSize) this.pageSize = ifPrevSize;

    this.getDistrictDropDown();
    this.getOfficeList();

    this.isFormCollapsed = true;
    this.updateButtonText(true);
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
        field: 'OfficeEng',
        headerName: 'Office Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'DistrictName',
        headerName: 'District',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        filter: false
      },
      {
        field: 'IsActive',
        headerName: 'Action',
        pinned: 'right',
        width: 100,
        cellRenderer: GridActionButtonComponent,
        cellRendererParams: {
          edit:   (field: any) => { this.addEditOffice(field); },
          delete: (field: any) => { this.confirmActiveDeactiveOffice(field); },
          permission: this.permissionByRole
        }
      }
    ];
  }

  // ===================== GET OFFICE LIST =====================
  getOfficeList() {
    const reqParam = {
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      districtId:   this.officeFilterForm.value.DistrictId || 0,
      isActive:     Number(this.officeFilterForm.value.ActiveFilter),
      officeId:     0,
      sortBy:       this.sortColumn,
      isSortByDesc: this.sortBy === '0' ? false : true,
    };

    this.api.post(this.url.getOfficeList(), reqParam).subscribe({
      next: (res: any) => {
        this.officeList   = res.data;
        this.totalRecords = res.pagination[0].totalRecords;
      },
      error: (err: any) => { console.log(err); }
    });
  }

  // ===================== FILTER TOGGLE =====================
  toggleForm() {
    this.isFormCollapsed = !this.isFormCollapsed;
    this.updateButtonText(this.isFormCollapsed);
    localStorage.setItem('registrationFormHidden', this.isFormCollapsed.toString());
  }

  private updateButtonText(isCollapsed: boolean) {
    this.buttonText = isCollapsed ? 'Show Filter' : 'Hide Filter';
  }

  // ===================== SORTING =====================
  onColumnHeaderClicked(event: { column: Column | ProvidedColumnGroup }): void {
    if ('getSort' in event.column) {
      const column = event.column as Column;
      const sort   = column.getSort();

      if (sort === 'asc') {
        this.sortColumn  = column.getColDef().field;
        this.sortBy      = '0';
        this.currentPage = 1;
        this.getOfficeList();
      } else if (sort === 'desc') {
        this.sortColumn  = column.getColDef().field;
        this.sortBy      = '1';
        this.currentPage = 1;
        this.getOfficeList();
      }
    }
  }

  // ===================== DROPDOWN =====================
  getDistrictDropDown() {
    this.api.get(this.url.getDistrictDropDown()).subscribe({
      next:  (res: any) => { this.districtDropDown = res.data; },
      error: (err: any) => { console.log(err); }
    });
  }

  // ===================== FILTER ACTIONS =====================
  onSearch() {
    this.currentPage = 1;
    this.getOfficeList();
  }

  resetFilter(): void {
    this.officeFilterForm.reset();
    this.getOfficeList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getOfficeList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getOfficeList();
  }

  // ===================== ADD / EDIT =====================
  addOffice() {
    this._router.navigateByUrl('master/add-office', {
      state: { pageSize: this.pageSize }
    });
  }

  addEditOffice(e: any) {
    this._router.navigateByUrl('master/add-office', {
      state: { office: e, pageSize: this.pageSize }
    });
  }

  // ===================== DELETE =====================
  confirmActiveDeactiveOffice(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width:  '350px',
      height: '170px',
      data:   { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: any) => { if (res) this.activeDeactiveOffice(e); }
    });
  }

  activeDeactiveOffice(e: any) {
    const reqParam = {
      officeId:  e?.OfficeId,
      isActive:  !e?.IsActive,
      updatedBy: 0
    };

    this.api.post(this.url.activeDeactiveOffice(), reqParam).subscribe({
      next: (res: any) => {
        if (e.IsActive) {
          this.notify.showNotification('delete', res.msg || res.message);
        } else {
          this.notify.showNotification('success', 'Restore Successfully');
        }
        window.scrollTo(0, 0);
        this.getOfficeList();
      },
      error: (err: any) => {
        console.log(err);
        this.notify.showNotification('error', 'Something Went Wrong');
        window.scrollTo(0, 0);
      }
    });
  }

  // ===================== EXPORT EXCEL =====================
  exportExcel() {
    const reqParam = {
      pageNo:       1,
      pageSize:     999999,
      districtId:   this.officeFilterForm.value.DistrictId || 0,
      isActive:     Number(this.officeFilterForm.value.ActiveFilter),
      officeId:     0,
      sortBy:       '',
      isSortByDesc: true
    };

    this.api.post(this.url.getOfficeList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.data?.length > 0) {
          const columnHeaders: { [key: string]: string } = {
            RowID:       'Sr No',
            OfficeEng:   'Office Name',
            DistrictName:'District'
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
            'Office List',
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
  exportPDF() {
    const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
    // TODO: hook PDF library
    this.notify.showNotification('info', 'PDF export coming soon');
  }
}