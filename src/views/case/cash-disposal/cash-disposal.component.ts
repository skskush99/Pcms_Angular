import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, Column, ICellRendererParams, ProvidedColumnGroup } from 'ag-grid-community';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotificationService } from '../../shared/services/notification.service';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import constants from '../../shared/utils/constants';
import { ApiService } from '../../shared/services/api.service';
import { UrlService } from '../../shared/services/url.service';

@Component({
  selector: 'app-cash-disposal',
  standalone: true,
  imports: [
    AgGridAngular,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  templateUrl: './cash-disposal.component.html',
  styleUrls: ['./cash-disposal.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in',  style({ height: '*',    opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class CashDisposalComponent implements OnInit {

  // ===================== FILTER STATE =====================
  isFormCollapsed = true;
  buttonText      = 'Show Filter';

  // ===================== GRID STATE =====================
  sortColumn:   string | undefined = '';
  sortBy:       string             = '';
  caseList:     any[]              = [];
  pageSize:     number             = 10;
  currentPage:  number             = 1;
  totalRecords: number             = 0;

  // ===================== DROPDOWNS =====================
  districtDropDown: DropdownListInterface[] = [];
  colDef:           ColDef[]               = [];

  // ===================== FILTER FORM =====================
  caseFilterForm: FormGroup = new FormGroup({
    DistrictId:   new FormControl(null, { nonNullable: true }),
    ActiveFilter: new FormControl('1',  { nonNullable: true }),
  });

  // ===================== COMPUTED =====================
  get animationState(): string {
    return this.isFormCollapsed ? 'out' : 'in';
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  // ===================== CONSTRUCTOR =====================
  constructor(
    private dialog:    MatDialog,
    private notify:    NotificationService,
    private _router:   Router,
    private api:       ApiService,
    private url:       UrlService,
    private datePipe:  DatePipe
  ) {}

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();

    const ifPrevSize = history.state?.prevPageSize;
    if (ifPrevSize) this.pageSize = ifPrevSize;

    this.getDistrictDropDown();
    this.GetComplaintList();

    this.isFormCollapsed = true;
    this.updateButtonText(true);
  }

  // ===================== GRID SETUP =====================
  createGrid(): void {
    this.colDef = [

      // Sr No
      {
        field:      'RowID',
        headerName: 'Sr No',
        sortable:   false,
        width:      70,
        pinned:     'left'
      },

      // Complaint No
      {
        field:            'ComplaintNo',
        headerName:       'Complaint No',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        width:            130,
        filter:           false
      },

      // Complaint Date
      {
        field:            'ComplaintDate',
        headerName:       'Complaint Date',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        width:            130,
        filter:           false,
        valueFormatter:   (params: any) => params.value ? new Date(params.value).toLocaleDateString('en-IN') : ''
      },

      // Complaint Type
      {
        field:            'ComplaintTypeID',
        headerName:       'Complaint Type',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        width:            130,
        filter:           false,
        valueFormatter:   (params: any) => {
          if (params.value === 0) return 'निजी परिवाद';
          if (params.value === 1) return 'सरकारी परिवाद';
          return params.value ?? '';
        }
      },

      // Department Name
      {
        field:            'AdmDeptName',
        headerName:       'Department',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        cellStyle:        { whiteSpace: 'normal' },
        autoHeight:       true,
        flex:             1,
        filter:           false
      },

      // Officer Name & Designation
      {
        field:            'DeptOfficerNameDesignation',
        headerName:       'Officer Name & Designation',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        cellStyle:        { whiteSpace: 'normal' },
        autoHeight:       true,
        width:            180,
        filter:           false
      },

      // Offence Brief
      {
        field:            'OffenceBrief',
        headerName:       'Brief Description',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        cellStyle:        { whiteSpace: 'normal' },
        autoHeight:       true,
        flex:             1,
        filter:           false
      },

      // Date Filed in Court
      {
        field:            'DateFiledInCourt',
        headerName:       'Date Filed in Court',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        width:            150,
        filter:           false,
        valueFormatter:   (params: any) => params.value ? new Date(params.value).toLocaleDateString('en-IN') : ''
      },

      // ===================== ACTION COLUMN =====================
      // Single "Cash Disposal" button — sends cashId, navigates to registration page
      {
        field:      'action',
        headerName: 'Action',
        pinned:     'right',
        width:      150,
        cellRenderer: (params: ICellRendererParams) => {
          const btn = document.createElement('button');
          btn.innerHTML   = 'Case Disposal';
          btn.className   = 'btn-approve';
          btn.style.cssText = 'width:auto; padding:5px 12px; font-size:12px; white-space:nowrap;';
          btn.addEventListener('click', () => {
            this._router.navigateByUrl('case/cash-disposal-registration', {
              state: {
                cashId:   params.data?.CashId ?? params.data?.cashId ?? params.data?.id,
                pageSize: this.pageSize
              }
            });
          });
          return btn;
        }
      }

    ];
  }

  // ===================== GET LIST =====================
  GetComplaintList(): void {
    const reqParam = {
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      sortBy:       this.sortColumn,
      isSortByDesc: this.sortBy === '0' ? false : true,
    };

    this.api.post(this.url.GetComplaintDetailsList(), reqParam).subscribe({
      next: (res: any) => {
        this.caseList     = res.data;
        this.totalRecords = res.pagination[0].totalRecords;
      },
      error: (_err: any) => {
        this.notify.showNotification('error', 'Failed to load complaint list');
      }
    });
  }

  // ===================== FILTER TOGGLE =====================
  toggleForm(): void {
    this.isFormCollapsed = !this.isFormCollapsed;
    this.updateButtonText(this.isFormCollapsed);
    localStorage.setItem('registrationFormHidden', this.isFormCollapsed.toString());
  }

  private updateButtonText(isCollapsed: boolean): void {
    this.buttonText = isCollapsed ? 'Show Filter' : 'Hide Filter';
  }

  // ===================== SORTING =====================
  onColumnHeaderClicked(event: { column: Column | ProvidedColumnGroup }): void {
    if ('getSort' in event.column) {
      const column = event.column as Column;
      const sort   = column.getSort();

      if (sort === 'asc' || sort === 'desc') {
        this.sortColumn  = column.getColDef().field;
        this.sortBy      = sort === 'asc' ? '0' : '1';
        this.currentPage = 1;
        this.GetComplaintList();
      }
    }
  }

  // ===================== DROPDOWN =====================
  getDistrictDropDown(): void {
    this.api.get(this.url.getDistrictDropDown()).subscribe({
      next:  (res: any) => { this.districtDropDown = res.data; },
      error: (_err: any) => {}
    });
  }

  // ===================== FILTER ACTIONS =====================
  onSearch(): void {
    this.currentPage = 1;
    this.GetComplaintList();
  }

  resetFilter(): void {
    this.caseFilterForm.reset();
    this.GetComplaintList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any): void {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.GetComplaintList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.GetComplaintList();
  }

  // ===================== EXPORT =====================
  downloadExcel(): void {
    this.notify.showNotification('info', 'Excel export coming soon');
  }

  downloadPDF(): void {
    const currentDate   = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy hh:mm a');
    // TODO: hook PDF library
  }
}