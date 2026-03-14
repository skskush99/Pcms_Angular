import { Component, OnInit } from '@angular/core';
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
  selector: 'app-case-decision-reason',
  standalone: true,
  imports: [
    AgGridAngular,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './case-decision-reason.component.html',
  styleUrl: './case-decision-reason.component.css',
  animations: [
    trigger('slideInOut', [
      state('in',  style({ height: '*',    opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class CaseDecisionReasonComponent implements OnInit {

  // ===================== FILTER STATE =====================
  isFormCollapsed = true;
  buttonText      = 'Show Filter';

  // ===================== GRID STATE =====================
  sortColumn:   string | undefined = '';
  sortBy:       string             = '';
  caseReasonList: any[]            = [];
  pageSize:     number             = 10;
  currentPage:  number             = 1;
  totalRecords: number             = 0;

  // ===================== DROPDOWNS =====================
  decisionTypeDropdown: DropdownListInterface[] = [];
  permissionByRole: any;
  colDef: ColDef[] = [];

  // ===================== FILTER FORM =====================
  decisionReasonFilterForm: FormGroup = new FormGroup({
    decisionType: new FormControl(null)
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
    private excel:    XlsxService,
    private datePipe: DatePipe
  ) {}

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();

    const ifPrevSize = history.state?.prevPageSize;
    if (ifPrevSize) this.pageSize = ifPrevSize;

    this.getDecisionTypeDropdown();
    this.getGetReasonsList();

    this.isFormCollapsed = true;
    this.updateButtonText(true);
  }

  // ===================== GRID SETUP =====================
  createGrid(): void {
    this.colDef = [
      {
        field:      'RowID',
        headerName: 'Sr No',
        sortable:   false,
        width:      80,
        pinned:     'left'
      },
      {
        field:            'DecisionReasonEnglish',
        headerName:       'Decision Reason English',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        cellStyle:        { whiteSpace: 'normal' },
        autoHeight:       true,
        flex:             1,
        minWidth:         200,
        filter:           false
      },
      {
        field:            'DecisionReasonHindi',
        headerName:       'Decision Reason Hindi',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        cellStyle:        { whiteSpace: 'normal' },
        autoHeight:       true,
        flex:             1,
        minWidth:         200,
        filter:           false
      },
      {
        field:            'DecisionTypeEnglish',
        headerName:       'Decision Type',
        wrapHeaderText:   true,
        autoHeaderHeight: true,
        cellStyle:        { whiteSpace: 'normal' },
        autoHeight:       true,
        flex:             1,
        minWidth:         180,
        filter:           false
      },
      {
        field:       'IsActive',
        headerName:  'Action',
        pinned:      'right',
        width:       100,
        cellRenderer: GridActionButtonComponent,
        cellRendererParams: {
          edit:       (field: any) => { this.addEditReason(field); },
          delete:     (field: any) => { this.confirmActiveDeactiveOffice(field); },
          permission: this.permissionByRole
        }
      }
    ];
  }

  // ===================== GET LIST =====================
  getGetReasonsList(): void {
    const reqParam = {
      pageNo:         this.currentPage,
      pageSize:       this.pageSize,      
      decisionTypeId: this.decisionReasonFilterForm.value.decisionType || 0,
      sortBy:         this.sortColumn,
      isSortByDesc:   this.sortBy === '0' ? false : true,
    };

    this.api.post(this.url.getGetReasonList(), reqParam).subscribe({
      next: (res: any) => {
        this.caseReasonList = res.data;
        this.totalRecords   = res.pagination[0].totalRecords;
      },
      error: (_err: any) => {
        this.notify.showNotification('error', 'Failed to load list');
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
        this.getGetReasonsList();
      }
    }
  }

  // ===================== DROPDOWN =====================
  getDecisionTypeDropdown(): void {
    this.api.get(this.url.getDecisionTypeDropDownlist()).subscribe({
      next:  (res: any) => { this.decisionTypeDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== FILTER ACTIONS =====================
  onSearch(): void {
    this.currentPage = 1;
    this.getGetReasonsList();
  }

  resetFilter(): void {
    this.decisionReasonFilterForm.reset();
    this.getGetReasonsList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any): void {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getGetReasonsList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getGetReasonsList();
  }

  // ===================== ADD / EDIT =====================
  addcasereason(): void {
    this._router.navigateByUrl('master/add-case-decision-reason', {
      state: { pageSize: this.pageSize }
    });
  }

  addEditReason(e: any): void {
    this._router.navigateByUrl('master/add-case-decision-reason', {
      state: { office: e, pageSize: this.pageSize }
    });
  }

  // ===================== DELETE =====================
  confirmActiveDeactiveOffice(e: any): void {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width:  '350px',
      height: '170px',
      data:   { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: any) => { if (res) this.activeDeactivedecisionReason(e); }
    });
  }

  activeDeactivedecisionReason(e: any): void {
    const reqParam = {
      decisionReasonId: e?.DecisionReasonId,
      isActive:         !e?.IsActive,
      updatedBy:        0
    };

    this.api.post(this.url.activeDeactivedecisionReason(), reqParam).subscribe({
      next: (res: any) => {
        if (e.IsActive) {
          this.notify.showNotification('delete', res.msg || res.message);
        } else {
          this.notify.showNotification('success', 'Restore Successfully');
        }
        window.scrollTo(0, 0);
        this.getGetReasonsList();
      },
      error: (_err: any) => {
        this.notify.showNotification('error', 'Something Went Wrong');
        window.scrollTo(0, 0);
      }
    });
  }

  // ===================== EXPORT EXCEL =====================
  exportExcel(): void {
    const reqParam = {
      pageNo:         1,
      pageSize:       999999,
      decisionTypeId: this.decisionReasonFilterForm.value.decisionType || 0,
      sortBy:         '',
      isSortByDesc:   true
    };

    this.api.post(this.url.getGetReasonList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.data?.length > 0) {
          const columnHeaders: { [key: string]: string } = {
            RowID:                  'Sr No',
            DecisionReasonEnglish:  'Decision Reason English',
            DecisionReasonHindi:    'Decision Reason Hindi',
            DecisionTypeEnglish:    'Decision Type'
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
            'Case Decision Reason List',
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
  exportPDF(): void {
    const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
    const headers = [
      'Government of Rajasthan',
      'Prosecution Department',
      '(Prosecution Case Management System)',
      'Case Decision Reason List',
      '( As on ' + formattedDate + ')'
    ];

    const columns = [
      { header: 'Sr. No.',                    dataKey: 'RowID' },
      { header: 'Decision Reason English',    dataKey: 'DecisionReasonEnglish' },
      { header: 'Decision Reason Hindi',      dataKey: 'DecisionReasonHindi' },
      { header: 'Decision Type',              dataKey: 'DecisionTypeEnglish' }
    ];

    this.excel.exportAllJsonPDF(headers, columns, this.caseReasonList, 'Case Decision Reason List', true);
  }
}