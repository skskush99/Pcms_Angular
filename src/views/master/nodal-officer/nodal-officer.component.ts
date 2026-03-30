import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef, Column, ProvidedColumnGroup } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import constants from '../../shared/utils/constants';

@Component({
  selector: 'app-nodal-officer',
  standalone: true,
  imports: [
    AgGridAngular,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './nodal-officer.component.html',
  styleUrl: './nodal-officer.component.css',
  animations: [
    trigger('slideInOut', [
      state('in',  style({ height: '*',    opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class NodalOfficerComponent {

  // ===================== FILTER STATE =====================
  isFormCollapsed = true;
  buttonText = 'Show Filter';

  // ===================== GRID STATE =====================
  nodalofficerpicList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string | undefined = '';
  sortBy: string = '';
  colDef: ColDef[] = [];
  permissionByRole: any;

  // ===================== DROPDOWNS =====================
  NodalOfficersDropdown: DropdownListInterface[] = [];

  // ===================== FILTER FORM =====================
  NodalOfficerListForm: FormGroup = new FormGroup({
    NodalOfficerClassification: new FormControl(null, { nonNullable: true })
  });

  constructor(
    private dialog:   MatDialog,
    private notify:   NotificationService,
    private _router:  Router,
    private api:      ApiService,
    private url:      UrlService,
    private datePipe: DatePipe
  ) {}

  // ===================== COMPUTED =====================
  get animationState() {
    return this.isFormCollapsed ? 'out' : 'in';
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();

    const ifPrevSize = history.state?.prevPageSize;
    if (ifPrevSize) this.pageSize = ifPrevSize;

    this.getNodalOfficersDropdown();
    this.getNodalOfficer();

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
        field: 'CrimeActNameEnglish',
        headerName: 'Crime Act Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'CrimeActNameHindi',
        headerName: 'Crime Act Hindi Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'CrimeActShortName',
        headerName: 'Short Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        filter: false
      },
      {
        field: 'CrimeActDescription',
        headerName: 'Description',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        filter: false
      },
      {
        field: 'CrimeClsNameEnglish',
        headerName: 'Classification Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        filter: false
      },
      {
        field: 'isActive',
        headerName: 'Action',
        pinned: 'right',
        width: 100,
        cellRenderer: GridActionButtonComponent,
        cellRendererParams: {
          edit:       (field: any) => { this.editNodalOfficer(field); },
          delete:     (field: any) => { this.confirmActiveDeactiveNodalOfficer(field); },
          permission: this.permissionByRole
        }
      }
    ];
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
        this.getNodalOfficer();
      } else if (sort === 'desc') {
        this.sortColumn  = column.getColDef().field;
        this.sortBy      = '1';
        this.currentPage = 1;
        this.getNodalOfficer();
      }
    }
  }

  // ===================== DROPDOWN =====================
  getNodalOfficersDropdown() {
    this.api.get(this.url.getNodalOfficerDropdown()).subscribe({
      next:  (res: any) => { this.NodalOfficersDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== GET LIST =====================
  getNodalOfficer() {
    const reqParam = {
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      sortBy:       this.sortColumn,
      isSortByDesc: this.sortBy === '0' ? false : true,
      crimeClsId:   this.NodalOfficerListForm.value.NodalOfficerClassification || 0
    };

    this.api.post(this.url.getNodalOfficer(), reqParam).subscribe({
      next: (res: any) => {
        this.nodalofficerpicList = res.data;
        this.totalRecords        = res.pagination[0].totalRecords;
      },
      error: () => {}
    });
  }

  // ===================== FILTER ACTIONS =====================
  onSearch() {
    this.currentPage = 1;
    this.getNodalOfficer();
  }

  resetFilter(): void {
    this.NodalOfficerListForm.reset();
    this.getNodalOfficer();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getNodalOfficer();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getNodalOfficer();
  }

  // ===================== ADD / EDIT =====================
  addNodalOfficer() {
    this._router.navigateByUrl('master/add-nodal-officer', { state: { pageSize: this.pageSize } });
  }

  editNodalOfficer(e: any) {
    this._router.navigateByUrl('master/add-nodal-officer', {
      state: { editCrimeActData: e, pageSize: this.pageSize }
    });
  }

  // ===================== DELETE =====================
  confirmActiveDeactiveNodalOfficer(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width:  '350px',
      height: '170px',
      data:   { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: any) => {
        if (res) this.activeDeactiveNodalOfficer(e);
      }
    });
  }

  activeDeactiveNodalOfficer(e: any) {
    const reqParam = {
      crimeActId: e?.CrimeActId,
      isActive:   !e?.IsActive,
      updatedBy:  0
    };

    this.api.post(this.url.activeDeactiveNodalOfficer(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          const msg  = e.IsActive ? (res.msg || res.message) : 'Restore Successfully';
          const type = e.IsActive ? 'delete' : 'success';
          this.notify.showNotification(type, msg);
          this.getNodalOfficer();
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

  // ===================== EXPORT EXCEL (stub) =====================
  exportExcel() {
    this.notify.showNotification('info', 'Excel export coming soon');
  }

  // ===================== EXPORT PDF (stub) =====================
  exportPDF() {
    const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
    const headers = [
      'Government of Rajasthan',
      'Prosecution Department',
      '(Prosecution Case Management System)',
      'Nodal Officer List',
      '( As on ' + formattedDate + ')'
    ];

    const columns = [
      { header: 'Sr. No.',            dataKey: 'RowID' },
      { header: 'Crime Act Name',      dataKey: 'CrimeActNameEnglish' },
      { header: 'Crime Act Hindi Name', dataKey: 'CrimeActNameHindi' },
      { header: 'Short Name',          dataKey: 'CrimeActShortName' },
      { header: 'Classification Name', dataKey: 'CrimeClsNameEnglish' }
    ];

    // this.excel.exportAllJsonPDF(headers, columns, this.nodalofficerpicList, 'Nodal Officer List', true);
  }
}