import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { XlsxService } from '../../shared/services/xlsx.service';
import constants from '../../shared/utils/constants';
import { AgGridAngular } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-court',
  standalone: true,
  imports: [
    AgGridAngular,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './court.component.html',
  styleUrl: './court.component.css',
  animations: [
    trigger('slideInOut', [
      state('in',  style({ height: '*',    opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class CourtComponent {

  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);
  excel  = inject(XlsxService);
  router = inject(Router);
  dialog = inject(MatDialog);

  // ===================== FILTER STATE =====================
  isFormCollapsed = true;
  buttonText = 'Show Filter';

  // ===================== GRID STATE =====================
  courtList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  colDef: ColDef[] = [];
  permissionByRole: any;

  // ===================== DROPDOWNS =====================
  divisionDropdown: DropdownListInterface[] = [];
  districtDropdown: DropdownListInterface[] = [];

  // ===================== FILTER FORM =====================
  courtFilterForm: FormGroup = new FormGroup({
    division: new FormControl(null),
    district: new FormControl(null)
  });

  constructor(private datePipe: DatePipe) {}

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
    this.getDivisionDropdown();
    this.getcourtList();

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
        field: 'JCourtEng',
        headerName: 'Court English Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'JCourtHindi',
        headerName: 'Court Hindi Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        minWidth: 150,
        flex: 1,
        filter: false
      },
      {
        field: 'DivisionName',
        headerName: 'Division Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        width: 150,
        filter: false
      },
      {
        field: 'DistrictName',
        headerName: 'District Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        width: 150,
        filter: false
      },
      {
        field: 'IsActive',
        headerName: 'Action',
        pinned: 'right',
        width: 100,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellRenderer: GridActionButtonComponent,
        cellRendererParams: {
          delete: (field: any) => { this.confirActiveDeactiveCourtName(field); },
          edit:   (field: any) => { this.editCourtType(field); },
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

  // ===================== GET COURT LIST =====================
  getcourtList() {
    const reqParam = {
      jCourtId:     0,
      divisionId:   this.courtFilterForm.value.division || 0,
      districtId:   this.courtFilterForm.value.district || 0,
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      sortBy:       '',
      isSortByDesc: true
    };

    this.api.post(this.url.getCourtsList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.courtList    = res.data;
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

  // ===================== DROPDOWNS =====================
  getDivisionDropdown() {
    this.api.post(this.url.getDivisionDropdown()).subscribe({
      next:  (res: any) => { this.divisionDropdown = res.data; },
      error: () => {}
    });
  }

  getDistrictDropdown() {
    this.courtFilterForm.controls['district'].reset();
    if (!this.courtFilterForm.value.division) {
      this.districtDropdown = [];
      return;
    }

    const reqParam = { DivisionId: this.courtFilterForm.value.division };
    this.api.get(this.url.getDistrictDropDown(), reqParam).subscribe({
      next:  (res: any) => { this.districtDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== FILTER ACTIONS =====================
  onSearch() {
    this.currentPage = 1;
    this.getcourtList();
  }

  resetFilter() {
    this.courtFilterForm.reset();
    this.getcourtList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getcourtList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getcourtList();
  }

  // ===================== ADD / EDIT =====================
  addCourt() {
    this.router.navigateByUrl('master/add-court');
  }

  editCourtType(e: any) {
    this.router.navigateByUrl('master/add-court', { state: { court: e } });
  }

  // ===================== DELETE =====================
  confirActiveDeactiveCourtName(e: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width:  '350px',
      height: '170px',
      data:   { msg: constants.confirmDelete }
    });

    dialogRef.afterClosed().subscribe({
      next: (res: boolean) => {
        if (res) this.activeDeactiveCourtName(e);
      }
    });
  }

  activeDeactiveCourtName(e: any) {
    const reqParam = {
      jCourtId:  e?.JCourtId,
      isActive:  !e?.IsActive,
      updatedBy: 0
    };

    this.api.post(this.url.activeDeactiveCourt(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notify.showNotification('delete', res.message);
          this.getcourtList();
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ===================== EXPORT EXCEL =====================
  exportExcel() {
    const reqParam = {
      divisionId:   this.courtFilterForm.value.division || 0,
      districtId:   this.courtFilterForm.value.district || 0,
      pageNo:       1,
      pageSize:     999999,
      sortBy:       '',
      isSortByDesc: true
    };

    this.api.post(this.url.getCourtsList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          if (res.data?.length) {
            const columnHeaders: { [key: string]: string } = {
              RowID:        'Sr No',
              JCourtEng:    'Court English Name',
              JCourtHindi:  'Court Hindi Name',
              DivisionName: 'Division Name',
              DistrictName: 'District Name'
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
              'Court List',
              ' \n ( As on ' + formattedDate + ')'
            );
          } else {
            this.notify.showNotification('info', 'No Record To Export');
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

  // ===================== EXPORT PDF =====================
  exportPDF() {
    const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
    const headers = [
      'Government of Rajasthan',
      'Prosecution Department',
      '(Prosecution Case Management System)',
      'Court List',
      '( As on ' + formattedDate + ')',
    ];

    const columns = [
      { header: 'Sr. No.',       dataKey: 'RowID' },
      { header: 'Court English', dataKey: 'JCourtEng' },
      { header: 'Court Hindi',   dataKey: 'JCourtHindi' },
      { header: 'Division',      dataKey: 'DivisionName' },
      { header: 'District',      dataKey: 'DistrictName' }
    ];

    this.excel.exportAllJsonPDF(headers, columns, this.courtList, 'Court List', true);
  }
}