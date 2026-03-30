import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, Column, ProvidedColumnGroup } from 'ag-grid-community';
import { NgSelectModule } from '@ng-select/ng-select';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { createYearList } from '../../shared/utils/utils';          // ← same util used in CaseIdentificationComponent
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import constants from '../../shared/utils/constants';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [
    AgGridAngular,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './case-list.component.html',
  styleUrl: './case-list.component.css',
  providers: [DatePipe],
  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class CaseListComponent implements OnInit {

  // ===================== GRID =====================
  colDef: ColDef[] = [];
  caseList: any[] = [];

  // ===================== PAGINATION =====================
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  // ===================== SORTING =====================
  sortColumn: string | undefined = '';
  sortBy: string = '';

  // ===================== DROPDOWNS =====================
  districtDropDown: DropdownListInterface[] = [];
  firYearDropdown: DropdownListInterface[] = [];   // ← FIR Year list (same as CaseIdentificationComponent)
  thanaDropdown: DropdownListInterface[] = [];   // ← Police Station dropdown with code
  permissionByRole: any;

  // ===================== FILTER FORM =====================
  // Removed : ActiveFilter
  // Added   : PSName, FIRNo, FIRYear
  caseFilterForm: FormGroup = new FormGroup({
    DistrictId: new FormControl(null, { nonNullable: true }),
    PSName: new FormControl(null, { nonNullable: true }),   // ng-select — stores value (station code)
    FIRNo: new FormControl('', { nonNullable: true }),
    FIRYear: new FormControl(null, { nonNullable: true }),
  });

  // ===================== FILTER TOGGLE =====================
  isFormCollapsed = true;
  buttonText = 'Show Filter';

  get animationState() {
    return this.isFormCollapsed ? 'out' : 'in';
  }

  toggleForm() {
    this.isFormCollapsed = !this.isFormCollapsed;
    this.buttonText = this.isFormCollapsed ? 'Show Filter' : 'Hide Filter';
    localStorage.setItem('registrationFormHidden', this.isFormCollapsed.toString());
  }

  constructor(
    private dialog: MatDialog,
    private notify: NotificationService,
    private _router: Router,
    private api: ApiService,
    private url: UrlService,
    private datePipe: DatePipe
  ) { }

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();

    const ifPrevSize = history.state?.prevPageSize;
    if (ifPrevSize) this.pageSize = ifPrevSize;

    this.firYearDropdown = createYearList(1950);
    this.getDistrictDropDown();
    this.getPoliceStationDropdown();
    this.getCaseList();
  }

  // ===================== GRID SETUP =====================
  createGrid() {
    this.colDef = [
      {
        field: 'RowID',
        headerName: 'Sr No',
        sortable: false,
        width: 70,
        pinned: 'left'
      },
      // {
      //   field: 'DirRegId',
      //   headerName: 'Dir Register Number',
      //   filter: false,
      //   width: 160,
      //   wrapHeaderText: true,
      //   autoHeaderHeight: true,
      //   cellStyle: { whiteSpace: 'normal' },
      //   autoHeight: true
      // },
      {
        field: 'FIRNo',
        headerName: 'FIR No',
        filter: false,
        width: 110,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true
      },
      {
        field: 'FIRYear',
        headerName: 'FIR Year',
        filter: false,
        width: 100,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true
      },
       {
        field: 'PSName',
        headerName: 'Police Station Name',
        filter: false,
        flex: 1,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true
      },
      {
        field: 'DistrictNameEng',
        headerName: 'District Name',
        filter: false,
        flex: 1,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true
      },
      {
        field: 'OfficeEng',
        headerName: 'Office Name',
        filter: false,
        flex: 1,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true
      },
      {
        field: 'JCourtEng',
        headerName: 'Court Name',
        filter: false,
        flex: 1,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true
      },
     
      {
        field: 'TitleOfCase',
        headerName: 'Case Of Title',
        filter: false,
        flex: 1,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true
      },
      {
        field: 'isActive',
        headerName: 'Action',
        pinned: 'right',
        width: 100,
        sortable: false,
        filter: false,
        cellRenderer: GridActionButtonComponent,
        cellRendererParams: {
          edit: (field: any) => this.addEditCase(field),
          delete: (field: any) => this.confirmActiveDeactiveOffice(field),
          permission: this.permissionByRole
        }
      }
    ];
  }

  // ===================== SORT =====================
  onColumnHeaderClicked(event: { column: Column | ProvidedColumnGroup }): void {
    if ('getSort' in event.column) {
      const column = event.column as Column;
      const sort = column.getSort();

      if (sort === 'asc') {
        this.sortColumn = column.getColDef().field;
        this.sortBy = '0';
        this.currentPage = 1;
        this.getCaseList();
      } else if (sort === 'desc') {
        this.sortColumn = column.getColDef().field;
        this.sortBy = '1';
        this.currentPage = 1;
        this.getCaseList();
      }
    }
  }

  // ===================== LIST =====================
  getCaseList() {
    const f = this.caseFilterForm.value;

    const reqParam = {
      pageNo: this.currentPage,
      pageSize: this.pageSize,
      districtId: f.DistrictId || 0,
      psName: f.PSName || '',
      firNo: f.FIRNo || '',
      firYear: f.FIRYear || 0,
      sortBy: this.sortColumn,
      officeId: 0,
      registerType: -1,
      isSortByDesc: this.sortBy === '0' ? false : true,
      cnrNo: '',
      jCourtId: 0
    };

    this.api.post(this.url.getCaseList(), reqParam).subscribe({
      next: (res: any) => {
        this.caseList = res.data;
        this.totalRecords = res.pagination[0].totalRecords;
      },
      error: () => { }
    });
  }

  // ===================== DROPDOWN =====================
  getDistrictDropDown() {
    this.api.get(this.url.getDistrictDropDown()).subscribe({
      next: (res: any) => { this.districtDropDown = res.data; },
      error: () => { }
    });
  }

  /** Same pattern as CaseIdentificationComponent — label: "NAME (code)" */
  getPoliceStationDropdown(): void {
    this.api.get(this.url.getPoliceStationDropdownall()).subscribe({
      next: (res: any) => {
        this.thanaDropdown = (res.data || []).map((item: any) => ({
          ...item,
          text: `${item.text} (${item.value})`
        }));
      },
      error: (err: Error) => { throw new Error(err?.message); }
    });
  }

  // ===================== SEARCH / RESET =====================
  onSearch() {
    this.currentPage = 1;
    this.getCaseList();
  }

  resetFilter(): void {
    this.caseFilterForm.reset();
    this.currentPage = 1;
    this.getCaseList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
    this.currentPage = 1;
    this.getCaseList();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getCaseList();
  }

  // ===================== NAVIGATE =====================
  addCase() {
    this._router.navigateByUrl('case/case-registration', { state: { pageSize: this.pageSize } });
  }

  addEditCase(e: any) {
    this._router.navigateByUrl('case/case-registration', { state: { caseData: e, pageSize: this.pageSize } });
  }

  // ===================== ACTIVE / DEACTIVE =====================
  confirmActiveDeactiveOffice(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      panelClass: 'confirm-dialog-panel',
      disableClose: true,
      width: 'auto',
      height: 'auto',
      maxWidth: '96vw',
      maxHeight: 'none',
      data: { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: any) => { if (res) this.activeDeactiveOffice(e); }
    });
  }

  activeDeactiveOffice(e: any) {
    const reqParam = {
      officeId: e?.OfficeId,
      isActive: !e?.IsActive,
      updatedBy: 0
    };

    this.api.post(this.url.activeDeactiveOffice(), reqParam).subscribe({
      next: (res: any) => {
        const msg = e.IsActive
          ? (res.msg || res.message)
          : 'Restore Successfully';
        this.notify.showNotification(e.IsActive ? 'delete' : 'success', msg);
        window.scrollTo(0, 0);
        this.getCaseList();
      },
      error: () => {
        this.notify.showNotification('error', 'Something Went Wrong');
        window.scrollTo(0, 0);
      }
    });
  }

  // ===================== EXPORT =====================
  exportExcel() {
    this.notify.showNotification('info', 'Excel export coming soon');
  }

  exportPDF() {
    const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
    const headers = [
      'Government of Rajasthan',
      'Prosecution Department',
      '(Prosecution Case Management System)',
      'Case List',
      '( As on ' + formattedDate + ')'
    ];
    const columns = [
      { header: 'Sr. No.', dataKey: 'RowID' },
      { header: 'Dir Register Number', dataKey: 'DirRegId' },
      { header: 'FIR No', dataKey: 'FIRNo' },
      { header: 'FIR Year', dataKey: 'FIRYear' },
      { header: 'District Name', dataKey: 'DistrictNameEng' },
      { header: 'Office Name', dataKey: 'OfficeEng' },
      { header: 'Court Name', dataKey: 'JCourtEng' },
      { header: 'Police Station', dataKey: 'PSName' },
      { header: 'Case Title', dataKey: 'TitleOfCase' },
    ];
  }
}