import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { XlsxService } from '../../shared/services/xlsx.service';
import constants from '../../shared/utils/constants';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'app-district',
  standalone: true,
  imports: [AgGridAngular, PaginationComponent, NgSelectModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './district.component.html',
  styleUrl: './district.component.css',
  animations: [
        trigger('slideInOut', [
          state('in', style({
            height: '*',
            opacity: 1
          })),
          state('out', style({
            height: '0px',
            opacity: 0
          })),
          transition('in => out', [
            animate('200ms ease-in-out')
          ]),
          transition('out => in', [
            animate('200ms ease-in')
          ])
        ])
      ]
})
export class DistrictComponent {


  api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  excel = inject(XlsxService);
  router = inject(Router);
  
  districtList : any[] = []
  pageSize : number = 10;
  currentPage : number = 1;
  totalRecords : number = 0;
  divisionDropdown : DropdownListInterface[] = [];
  colDef : ColDef[] = []
  permissionByRole : any;

  districtFilterForm : FormGroup = new FormGroup({
    division : new FormControl(null )
  })

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    // this.accessPermission.getCurrSelectedNav().subscribe({
    //   next : (res) => {
    //     this.permissionByRole = res;
    //   }
    // })
    this.createGrid();
    this.getDivisionDropdown();
    this.getDistrictList();
  }



  createGrid(){
      this.colDef = [
        { field: 'RowID', headerName: 'Sr No' ,  sortable : false , width:80 },
        { field: 'DistrictNameEng', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'District Name' , flex : 1 , filter : false},
        { field: 'StateName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'State',minWidth : 250 , flex : 1 , filter : false},
        // { field: 'unitShortName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'HoD/Unit Short Name', width:150 , filter : false},
        
      ]
    }


    
  isFormCollapsed = true;
  buttonText = 'Show Filter';

  get animationState() {
    return this.isFormCollapsed ? 'out' : 'in';
  }


  
  toggleForm() {
    this.isFormCollapsed = !this.isFormCollapsed;
    this.updateButtonText(this.isFormCollapsed);
    localStorage.setItem('registrationFormHidden', this.isFormCollapsed.toString());
  }

  private updateButtonText(isCollapsed: boolean) {
    this.buttonText = isCollapsed ? 'Show Filter' : 'Hide Filter';
  }




  getDistrictList(){
    let reqParam = {
      "divisionId": this.districtFilterForm.value.division || 0,
      "stateId": 0,
      "pageNo": this.currentPage,
      "pageSize": this.pageSize,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getDistrictListRajMaster() , reqParam).subscribe({
      next : (res : any) => {
        //console.log(res);
        if(res.status){
          this.districtList = res.data;
          this.totalRecords = res.pagination[0].totalRecords
        }else this.notify.showNotification('error' , res.message)
      },
      error : (err : Error) => {
        //console.error(err);
        this.notify.showNotification('error' , constants.apiError)
      }
    })
  }




  getDivisionDropdown(){
    this.api.post(this.url.getDivisionDropdown()).subscribe({
      next: (res : any) => {
        //console.log(res);
        this.divisionDropdown = res.data;
      },
      error : (err : Error) => {
        //console.error(err);
        
      }
    })
  }


  exportExcel(){
    let reqParam = {
      "divisionId": 0,
      "stateId": this.districtFilterForm.value.state || 0,
      "pageNo": 1,
      "pageSize": 999999,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getDistrictListRajMaster() , reqParam).subscribe({
      next : (res : any) => {
        //console.log(res);
        if(res.status){
          if(res.data?.length){
            const columnHeaders: { [key: string]: string } = {
              RowID: 'Sr No',
              DistrictNameEng: 'District Name',
              StateName: 'State',
            };
      
            // Create the modified data with only the required fields and custom headers
            const modifiedData = res.data.map((row: { [key: string]: any }) => {
              const modifiedRow: { [key: string]: any } = {};
      
              // Only include the necessary fields from the row
              Object.keys(columnHeaders).forEach((key: string) => {
                if (row[key] !== undefined) {
                  modifiedRow[columnHeaders[key]] = row[key]; // Map to custom headers
                }
              });
      
              return modifiedRow;
            });
      
            // this.excel.exportAgGridAsExcel(modifiedData, columnHeaders, 'District List');
            const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
            this.excel.exportAgGridAsExcelWithHeading(modifiedData, columnHeaders, 'District List', ' \n ( As on ' + formattedDate + ')');
  
           
          } else this.notify.showNotification('info' , "No Record To Export")
        }else this.notify.showNotification('error' , res.message)
      },
      error : (err : Error) => {
        //console.error(err);
        this.notify.showNotification('error' , constants.apiError)
      }
    })
  }

  addDistrict(){
    this.router.navigateByUrl('master/add-other-state-district')
  }



  onSearch(){
    this.currentPage = 1;
    this.getDistrictList()
  }

  resetFilter(){
    this.districtFilterForm.reset();
    this.getDistrictList();
  }


  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
this.currentPage = 1;
    
    this.getDistrictList();
  }

    // to handle pagination
    changePage(page: number): void {
      //console.log(page);
      this.currentPage = page;
      this.getDistrictList();
    }


    exportPDF() {
      const currentDate: Date = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy hh:mm a');
      const headers = [
        'Government of Rajasthan',
        'Prosecution Department',
        '(Prosecution Case Management System)',
        'District List',
        '( As on ' + formattedDate + ')',
      ]

      const columns = [
        { header: 'Sr. No.', dataKey: 'RowID' },
        { header: 'District Name', dataKey: 'DistrictNameEng' },
        { header: 'State', dataKey: 'StateName' }
      ];
  
      this.excel.exportAllJsonPDF(headers, columns, this.districtList, 'District List', true);
    }

}
