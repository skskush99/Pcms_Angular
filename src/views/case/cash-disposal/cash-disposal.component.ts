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
    private dialog:   MatDialog,
    private notify:   NotificationService,
    private _router:  Router,
    private api:      ApiService,
    private url:      UrlService,
    private datePipe: DatePipe
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

      // DIER No
      {
        field:            'DierNo',
        headerName:       'DIER No',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        width:            130,
        filter:           false
      },

      // FR No
      {
        field:            'FRNo',
        headerName:       'FR No',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        width:            120,
        filter:           false,
        valueFormatter:   (params: any) => params.value ?? '-'
      },

      // District Name
      {
        field:            'DistrictNameEng',
        headerName:       'District',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        width:            130,
        filter:           false
      },

      // Office Name
      {
        field:            'OfficeEng',
        headerName:       'Office',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        cellStyle:        { whiteSpace: 'normal' },
        autoHeight:       true,
        flex:             1,
        filter:           false
      },

      // Court Name
      {
        field:            'JCourtEng',
        headerName:       'Court',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        cellStyle:        { whiteSpace: 'normal' },
        autoHeight:       true,
        flex:             1,
        filter:           false
      },

      // FIR Date
      {
        field:            'FIRDt',
        headerName:       'FIR Date',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        width:            120,
        filter:           false,
        valueFormatter:   (params: any) => {
          if (!params.value) return '-';
          const date = new Date(params.value);
          if (date.getFullYear() <= 1900) return '-';
          return date.toLocaleDateString('en-IN');
        }
      },

      // ===================== ACTION COLUMN =====================
      {
        field:      'action',
        headerName: 'Action',
        pinned:     'right',
        width:      150,
        cellRenderer: (params: ICellRendererParams) => {
          const btn = document.createElement('button');
          btn.innerHTML     = 'Case Disposal';
          btn.className     = 'btn-approve';
          btn.style.cssText = 'width:auto; padding:5px 12px; font-size:12px; white-space:nowrap;';
          btn.addEventListener('click', () => {
            // ✅ Pass the full row data as caseData so stepper can bind all fields
            this._router.navigateByUrl('case/cash-disposal-registration', {
              state: {
                caseData: params.data,   // full row object with DirRegId, Steps, etc.
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
      districtId:   this.caseFilterForm.value.DistrictId ?? 0,
      psName:       '',
      firNo:        '',
      firYear:      0,
      sortBy:       this.sortColumn,
      officeId:     0,
      registerType: -1,
      isSortByDesc: this.sortBy === '0' ? false : true,
      cnrNo:        '',
      jCourtId:     0
    };

    this.api.post(this.url.GetDisposalDetailsList(), reqParam).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.caseList     = res.data;
          this.totalRecords = res.pagination?.[0]?.totalRecords ?? res.data?.length ?? 0; 
        } else {
          this.caseList     = [];
          this.totalRecords = 0;
        }
      },
      error: (_err: any) => {
        this.notify.showNotification('error', 'Failed to load disposal list');
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
    this.caseFilterForm.reset({ DistrictId: null, ActiveFilter: '1' });
    this.currentPage = 1;
    this.GetComplaintList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any): void {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.GetComplaintList();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
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