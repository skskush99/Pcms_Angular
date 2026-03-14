import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, Column, ProvidedColumnGroup } from 'ag-grid-community';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridActionButtonComponent } from '../../../shared/components/grid-action-button/grid-action-button.component';
import { DropdownListInterface } from '../../../shared/model/shared.model';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UrlService } from '../../../shared/services/url.service';
import constants from '../../../shared/utils/constants';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ConfirmationPopUpComponent } from '../../../shared/components/confirmation-pop-up/confirmation-pop-up.component';

@Component({
  selector: 'app-complain-register-details',
  standalone: true,
  imports: [
    AgGridAngular,
    CommonModule,
    PaginationComponent,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ButtonComponent
  ],
  templateUrl: './complain-register-details.component.html',
  styleUrls: ['./complain-register-details.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in',  style({ height: '*',    opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class ComplainRegisterDetailsComponent {

  // ===================== FILTER STATE =====================
  isFormCollapsed = true;
  buttonText = 'Show Filter';

  // ===================== GRID STATE =====================
  sortColumn: string | undefined = '';
  sortBy: string = '';
  caseList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;

  // ===================== DROPDOWNS =====================
  districtDropDown: DropdownListInterface[] = [];
  permissionByRole: any;
  colDef: ColDef[] = [];

  // ===================== FILTER FORM =====================
  caseFilterForm: FormGroup = new FormGroup({
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
    private datePipe: DatePipe
  ) {}

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {
    this.createGrid();

    const ifPrevSize = history.state?.prevPageSize;
    if (ifPrevSize) this.pageSize = ifPrevSize;

    this.getDistrictDropDown();
    this.GetComplaintList();   // ← call new function

    this.isFormCollapsed = true;
    this.updateButtonText(true);
  }

  // ===================== GRID SETUP =====================
  createGrid() {
    this.colDef = [

      // Sr No
      {
        field: 'RowID',
        headerName: 'Sr No',
        sortable: false,
        width: 70,
        pinned: 'left'
      },
 

      // Complaint No
      {
        field: 'ComplaintNo',
        headerName: 'Complaint No',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 130,
        filter: false
      },

      // Complaint Date
      {
        field: 'ComplaintDate',
        headerName: 'Complaint Date',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 130,
        filter: false,
        valueFormatter: (params: any) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString('en-IN');
        }
      },

      // Complaint Type
      {
        field: 'ComplaintTypeID',
        headerName: 'Complaint Type',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 130,
        filter: false,
        valueFormatter: (params: any) => {
          if (params.value === 0) return 'निजी परिवाद';
          if (params.value === 1) return 'सरकारी परिवाद';
          return params.value ?? '';
        }
      },

      // Department Name
      {
        field: 'AdmDeptName',
        headerName: 'Department',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },

      // Officer Name & Designation
      {
        field: 'DeptOfficerNameDesignation',
        headerName: 'Officer Name & Designation',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        width: 180,
        filter: false
      },

      // Offence Brief
      {
        field: 'OffenceBrief',
        headerName: 'Brief Description',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },

      // Date Filed in Court
      {
        field: 'DateFiledInCourt',
        headerName: 'Date Filed in Court',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 150,
        filter: false,
        valueFormatter: (params: any) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString('en-IN');
        }
      },

      // Action Column
      {
        field: 'IsActive',
        headerName: 'Action',
        pinned: 'right',
        width: 100,
        cellRenderer: GridActionButtonComponent,
        cellRendererParams: {
          edit:   (field: any) => { this.onEditComplaint(field); },
          delete: (field: any) => { this.confirmDelete(field); },
          permission: this.permissionByRole
        }
      }

    ];
  }

  // ===================== GET COMPLAINT LIST (NEW) =====================
  GetComplaintList() {
    const reqParam = {
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      // districtId:   this.caseFilterForm.value.DistrictId || 0,
      // isActive:     Number(this.caseFilterForm.value.ActiveFilter),
      sortBy:       this.sortColumn,
      isSortByDesc: this.sortBy === '0' ? false : true,
    };
   this.api.post(this.url.GetComplaintDetailsList(), reqParam).subscribe({   
      //this.api.post(this.url.GetComplaintDetailsList(reqParam), {}).subscribe({
      next: (res: any) => {
        this.caseList     = res.data;
        this.totalRecords = res.pagination[0].totalRecords;
      },
      error: (err: any) => {
        console.error('GetComplaintList Error:', err);
        this.notify.showNotification('error', 'Failed to load complaint list');
      }
    });
  }

  // ===================== ON EDIT CLICK =====================
  onEditComplaint(rowData: any) {
    // Navigate to complaint register form with full row data
    this._router.navigate(['/case/complaint-register'], {
      state: {
        editData:        rowData,              // full row object
        ComplaintRegNo:  rowData.ComplaintRegNo,
        ComplaintNo:     rowData.ComplaintNo,
        pageSize:        this.pageSize
      }
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
        this.GetComplaintList();
      } else if (sort === 'desc') {
        this.sortColumn  = column.getColDef().field;
        this.sortBy      = '1';
        this.currentPage = 1;
        this.GetComplaintList();
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
    this.GetComplaintList();
  }

  resetFilter(): void {
    this.caseFilterForm.reset();
    this.GetComplaintList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.GetComplaintList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.GetComplaintList();
  }

  // ===================== ADD NEW =====================
  addCase() {
    this._router.navigateByUrl('/case/complaint-register', {
      state: { pageSize: this.pageSize }
    });
  }

  // ===================== DELETE =====================
  confirmDelete(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width:  '350px',
      height: '170px',
      data:   { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: any) => { if (res) this.deleteComplaint(e); }
    });
  }

  deleteComplaint(e: any) {
    const reqParam = {
      complaintRegId: e?.ComplaintRegId,
      isActive:       !e?.IsActive,
      updatedBy:      0
    };

    this.api.post(this.url.activeDeactiveOffice(), reqParam).subscribe({
      next: (res: any) => {
        if (e.IsActive) {
          this.notify.showNotification('delete', res.msg || res.message);
        } else {
          this.notify.showNotification('success', 'Restored Successfully');
        }
        window.scrollTo(0, 0);
        this.GetComplaintList();
      },
      error: (err: any) => {
        console.log(err);
        this.notify.showNotification('error', 'Something Went Wrong');
        window.scrollTo(0, 0);
      }
    });
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