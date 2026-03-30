import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    selector: 'app-raj-master-data',
  standalone: true,
  imports: [
    AgGridAngular,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
 templateUrl: './raj-master-data.component.html',
  styleUrl: './raj-master-data.component.css',
  animations: [
    trigger('slideInOut', [
      state('in',  style({ height: '*',    opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in')])
    ])
  ]
})
export class RajMasterDataComponent {

  api    = inject(ApiService);
  url    = inject(UrlService);
  notify = inject(NotificationService);
  excel  = inject(XlsxService);
  router = inject(Router);

  // ===================== FILTER STATE =====================
  isFormCollapsed = true;
  buttonText = 'Show Filter';

  // ===================== GRID STATE =====================
  districtList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  colDef: ColDef[] = [];
  permissionByRole: any;

  // ✅ UPDATED: Master Data dropdown options
  masterDataDropdown: DropdownListInterface[] = [
    { value: '1', text: 'Division' },
    { value: '2', text: 'District' },
    { value: '3', text: 'Police Range' },
    { value: '4', text: 'Police District' },
    { value: '5', text: 'Police Circle' },
    { value: '6', text: 'Police Station' }
  ];

  // ===================== FILTER FORM =====================
  // ✅ UPDATED: Changed from "division" to "masterData"
  districtFilterForm: FormGroup = new FormGroup({
    masterData: new FormControl(null, { nonNullable: true })
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
    this.getDistrictList();

    this.isFormCollapsed = false;
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
        field: '',
        headerName: 'Name',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        flex: 1,
        filter: false
      },
      {
        field: '',
        headerName: 'Updated Date',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellStyle: { whiteSpace: 'normal' },
        autoHeight: true,
        minWidth: 250,
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

  // ===================== GET LIST =====================
  getDistrictList() {
    // ✅ UPDATED: Use masterData instead of division
    const reqParam = {
      masterData:   this.districtFilterForm.value.masterData || '',
      stateId:      0,
      pageNo:       this.currentPage,
      pageSize:     this.pageSize,
      sortBy:       '',
      isSortByDesc: true
    };

    this.api.post(this.url.getDistrictListRajMaster(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.districtList = res.data;
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

  // ===================== FILTER ACTIONS =====================
  onSearch() {
    this.currentPage = 1;
    this.getDistrictList();
  }

  resetFilter() {
    this.districtFilterForm.reset();
    this.getDistrictList();
  }

  // ===================== PAGINATION =====================
  onPageSizeChanged(event: any) {
    this.pageSize    = Number(event.target.value);
    this.currentPage = 1;
    this.getDistrictList();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getDistrictList();
  }

  // ===================== ADD NEW =====================
  addDistrict() {
    this.router.navigateByUrl('master/add-other-state-district');
  }

  // ===================== EXPORT EXCEL =====================
  exportExcel() {
    // ✅ UPDATED: Use masterData instead of division
    const reqParam = {
      masterData:   this.districtFilterForm.value.masterData || '',
      stateId:      0,
      pageNo:       1,
      pageSize:     999999,
      sortBy:       '',
      isSortByDesc: true
    };

    this.api.post(this.url.getDistrictListRajMaster(), reqParam).subscribe({
      next: (res: any) => {
        if (res.status) {
          if (res.data?.length) {
            const columnHeaders: { [key: string]: string } = {
              RowID:           'Sr No',
              DistrictNameEng: 'District Name',
              StateName:       'State'
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
              'Master Data List',
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
      'Master Data List',
      '( As on ' + formattedDate + ')'
    ];

    const columns = [
      { header: 'Sr. No.',      dataKey: 'RowID' },
      { header: 'Master Data Name', dataKey: 'DistrictNameEng' },
      { header: 'State',         dataKey: 'StateName' }
    ];

    this.excel.exportAllJsonPDF(headers, columns, this.districtList, 'Master Data List', true);
  }
}