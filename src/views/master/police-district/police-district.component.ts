import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { XlsxService } from '../../shared/services/xlsx.service';
import constants from '../../shared/utils/constants';

@Component({
  selector: 'app-police-district',
  standalone: true,
  imports: [
    AgGridAngular,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './police-district.component.html',
  styleUrl: './police-district.component.css',
  animations: [
    trigger('slideInOut', [
      state('in',  style({ height: '*',    opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class PoliceDistrictComponent {

  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);
  excel  = inject(XlsxService);
  router = inject(Router);

  // ===================== FILTER STATE =====================
  isFormCollapsed = true;
  buttonText = 'Show Filter';

  // ===================== GRID STATE =====================
  policeDistrictList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  colDef: ColDef[] = [];
  permissionByRole: any;

  // ===================== DROPDOWNS =====================
  districtDropdown: DropdownListInterface[] = [];
  policeRangeDropdown: DropdownListInterface[] = [];

  // ===================== FILTER FORM =====================
  policeDistrictFilterForm: FormGroup = new FormGroup({
    district: new FormControl(null),
    range:    new FormControl(null)
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
    this.getPoliceRangeDropdown();
    this.getDistrictDropDown();
    this.getPoliceDistrictList();

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
        field: 'PdNameEng',
        headerName: 'Police District',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'RangeNameEng',
        headerName: 'Police Range',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: 'DistrictNameEng',
        headerName: 'District Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        minWidth: 150,
        flex: 1,
        filter: false
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

  // ===================== DROPDOWNS =====================
  getPoliceRangeDropdown() {
    this.api.get(this.url.getPoliceRangeDropdown()).subscribe({
      next:  (res: any) => { this.policeRangeDropdown = res.data; },
      error: () => {}
    });
  }

  getDistrictDropDown() {
    this.api.get(this.url.getDistrictDropDown()).subscribe({
      next:  (res: any) => { this.districtDropdown = res.data; },
      error: () => {}
    });
  }

  // ===================== GET LIST =====================
  getPoliceDistrictList() {
    const reqParam = {
      districtId:   this.policeDistrictFilterForm.value.district || 0,
      rangeId:      this.policeDistrictFilterForm.value.range    || 0,
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      sortBy:       '',
      isSortByDesc: true
    };

    this.api.post(this.url.getPoliceDistrictList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.policeDistrictList = res.data;
          this.totalRecords       = res.pagination[0]?.totalRecords;
        } else {
          this.notify.showNotification('error', res.message);
        }
      },
      error: () => {
        this.notify.showNotification('error', constants.apiError);
      }
    });
  }

  // ===================== FILTER ACTIONS =====================
  onSearch() {
    this.currentPage = 1;
    this.getPoliceDistrictList();
  }

  resetFilter() {
    this.policeDistrictFilterForm.reset();
    this.getPoliceDistrictList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getPoliceDistrictList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getPoliceDistrictList();
  }

  // ===================== EXPORT EXCEL =====================
  exportExcel() {
    const reqParam = {
      districtId:   this.policeDistrictFilterForm.value.district || 0,
      rangeId:      this.policeDistrictFilterForm.value.range    || 0,
      pageNo:       1,
      pageSize:     999999,
      sortBy:       '',
      isSortByDesc: true
    };

    this.api.post(this.url.getPoliceDistrictList(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          if (res.data?.length) {
            const columnHeaders: { [key: string]: string } = {
              RowID:           'Sr No',
              PdNameEng:       'Police District',
              RangeNameEng:    'Police Range',
              DistrictNameEng: 'District'
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
              'Police District List',
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
      'Police District List',
      '( As on ' + formattedDate + ')'
    ];

    const columns = [
      { header: 'Sr. No.',        dataKey: 'RowID' },
      { header: 'Police District', dataKey: 'PdNameEng' },
      { header: 'Police Range',    dataKey: 'RangeNameEng' },
      { header: 'District',        dataKey: 'DistrictNameEng' }
    ];

    this.excel.exportAllJsonPDF(headers, columns, this.policeDistrictList, 'Police District List', true);
  }
}