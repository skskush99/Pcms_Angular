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
  selector: 'app-crime-sub-act',
  standalone: true,
  imports: [
    AgGridAngular,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './crime-sub-act.component.html',
  styleUrl: './crime-sub-act.component.css',
  animations: [
    trigger('slideInOut', [
      state('in',  style({ height: '*',    opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class CrimeSubActComponent {

  // ===================== FILTER STATE =====================
  isFormCollapsed = true;
  buttonText = 'Show Filter';

  // ===================== GRID STATE =====================
  crimeSubActList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string | undefined = '';
  sortBy: string = '';
  colDef: ColDef[] = [];
  permissionByRole: any;

  // ===================== DROPDOWNS =====================
  crimeClassificationDropdown: DropdownListInterface[] = [];
  crimeActDropdown: DropdownListInterface[] = [];

  // ===================== FILTER FORM =====================
  crimeSubActForm: FormGroup = new FormGroup({
    crimeClassification: new FormControl(null, { nonNullable: true }),
    crimeAct:            new FormControl(null, { nonNullable: true })
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

    this.getCrimeClassificationDropdown();
    this.getcrimeSubActList();

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
        field: 'CrimeSubActNameEnglish',
        headerName: 'Crime Sub Act Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'CrimeSubActNameHindi',
        headerName: 'Crime Sub Act Hindi Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'CrimeSubActShortName',
        headerName: 'Sub Act Short Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        filter: false
      },
      {
        field: 'CrimeSubActDescription',
        headerName: 'Sub Act Description',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        filter: false
      },
      {
        field: 'CrimeActNameEnglish',
        headerName: 'Act Name',
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
          edit:       (field: any) => { this.editCrimeSubAct(field); },
          delete:     (field: any) => { this.confirmActiveDeactiveCrimeSubAct(field); },
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
        this.getcrimeSubActList();
      } else if (sort === 'desc') {
        this.sortColumn  = column.getColDef().field;
        this.sortBy      = '1';
        this.currentPage = 1;
        this.getcrimeSubActList();
      }
    }
  }

  // ===================== DROPDOWNS =====================
  getCrimeClassificationDropdown() {
    this.api.get(this.url.getCrimeClassificationDropdown()).subscribe({
      next:  (res: any) => { this.crimeClassificationDropdown = res.data; },
      error: () => {}
    });
  }

  getCrimeActDropdown() {
    this.crimeSubActForm.controls['crimeAct'].reset();
    if (!this.crimeSubActForm.value.crimeClassification) {
      this.crimeActDropdown = [];
      return;
    }

    const reqParam = {
      CrimeClsId: this.crimeSubActForm.value.crimeClassification || 0
    };

    this.api.get(this.url.getCrimeActDropdown(), reqParam).subscribe({
      next:  (res: any) => { this.crimeActDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== GET LIST =====================
  getcrimeSubActList() {
    const reqParam = {
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      sortBy:       this.sortColumn,
      isSortByDesc: this.sortBy === '0' ? false : true,
      crimeClsId:   this.crimeSubActForm.value.crimeClassification || 0,
      crimeActId:   this.crimeSubActForm.value.crimeAct            || 0
    };

    this.api.post(this.url.getCrimeSubActList(), reqParam).subscribe({
      next: (res: any) => {
        this.crimeSubActList = res.data;
        this.totalRecords    = res.pagination[0].totalRecords;
      },
      error: () => {}
    });
  }

  // ===================== FILTER ACTIONS =====================
  onSearch() {
    this.currentPage = 1;
    this.getcrimeSubActList();
  }

  resetFilter(): void {
    this.crimeSubActForm.reset();
    this.crimeActDropdown = [];
    this.getcrimeSubActList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getcrimeSubActList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getcrimeSubActList();
  }

  // ===================== ADD / EDIT =====================
  addSubCrimeAct() {
    this._router.navigateByUrl('master/add-crime-sub-act', { state: { pageSize: this.pageSize } });
  }

  editCrimeSubAct(e: any) {
    this._router.navigateByUrl('master/add-crime-sub-act', {
      state: { editCrimeSubActData: e, pageSize: this.pageSize }
    });
  }

  // ===================== DELETE =====================
  confirmActiveDeactiveCrimeSubAct(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width:  '350px',
      height: '170px',
      data:   { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: any) => {
        if (res) this.activeDeactiveCrimeSubAct(e);
      }
    });
  }

  activeDeactiveCrimeSubAct(e: any) {
    const reqParam = {
      crimeSubActId: e?.CrimeSubActId,
      isActive:      !e?.IsActive,
      updatedBy:     0
    };

    this.api.post(this.url.activeDeactiveSubCrimeAct(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          const msg  = e.IsActive ? (res.msg || res.message) : 'Restore Successfully';
          const type = e.IsActive ? 'delete' : 'success';
          this.notify.showNotification(type, msg);
          this.getcrimeSubActList();
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
      'Crime Sub Act List',
      '( As on ' + formattedDate + ')'
    ];

    const columns = [
      { header: 'Sr. No.',                dataKey: 'RowID' },
      { header: 'Crime Sub Act Name',     dataKey: 'CrimeSubActNameEnglish' },
      { header: 'Sub Act Hindi Name',     dataKey: 'CrimeSubActNameHindi' },
      { header: 'Sub Act Short Name',     dataKey: 'CrimeSubActShortName' },
      { header: 'Act Name',               dataKey: 'CrimeActNameEnglish' },
      { header: 'Classification Name',    dataKey: 'CrimeClsNameEnglish' }
    ];

    // this.excel.exportAllJsonPDF(headers, columns, this.crimeSubActList, 'Crime Sub Act List', true);
  }
}