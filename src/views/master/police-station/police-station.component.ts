import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { XlsxService } from '../../shared/services/xlsx.service';
import constants from '../../shared/utils/constants';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AgGridAngular } from 'ag-grid-angular';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-police-station',
  standalone: true,
  imports: [ReactiveFormsModule , ButtonComponent , AgGridAngular , PaginationComponent , NgSelectModule],
  templateUrl: './police-station.component.html',
  styleUrl: './police-station.component.css',
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
export class PoliceStationComponent {


   api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  excel = inject(XlsxService);
  router = inject(Router);
  
  policeStationList : any[] = []
  pageSize : number = 10;
  currentPage : number = 1;
  totalRecords : number = 0;
  policeCircleDropdown : DropdownListInterface[] = [];
  colDef : ColDef[] = []
  permissionByRole : any;

  policeDistrictFilterForm : FormGroup = new FormGroup({
    policeCircle : new FormControl(null),
  })

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    // this.accessPermission.getCurrSelectedNav().subscribe({
    //   next : (res) => {
    //     this.permissionByRole = res;
    //   }
    // })
    this.createGrid();
    this.getPoliceCircleDropdown();
    this.getPoliceStationList();
  }



  createGrid(){
      this.colDef = [
        { field: 'RowID', headerName: 'Sr No' ,  sortable : false , width:80 },
        { field: 'StationNameEng', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Police Station' , flex : 1 , filter : false},
        { field: 'CircleNameEng', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Police Circle' , flex : 1 , filter : false},
        
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


  getPoliceCircleDropdown(){
    this.api.get(this.url.getPoliceCircleDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.policeCircleDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      }
    })
  }



  getPoliceStationList(){
    let reqParam = {
      "pcId": this.policeDistrictFilterForm.value.policeCircle || 0,
      "pageNo": this.currentPage,
      "pageSize": this.pageSize,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getPoliceStationList() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.policeStationList = res.data;
          this.totalRecords = res.pagination[0]?.totalRecords
        }
        else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        console.error(err);
        this.notify.showNotification('error' , constants.apiError)
      }
    })
  }



  exportExcel(){
     let reqParam = {
      "pcId": this.policeDistrictFilterForm.value.policeCircle || 0,
      "pageNo": 1,
      "pageSize": 999999,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getPoliceStationList() , reqParam).subscribe({
      next : (res : any) => {
        //console.log(res);
        if(res.status){
          if(res.data?.length){
            const columnHeaders: { [key: string]: string } = {
              RowID: 'Sr No',
              StationNameEng: 'Police Station',
              RangeNameEng: 'Police Range',
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
            this.excel.exportAgGridAsExcelWithHeading(modifiedData, columnHeaders, 'Police Range List', ' \n ( As on ' + formattedDate + ')');
  
           
          } else this.notify.showNotification('info' , "No Record To Export")
        }else this.notify.showNotification('error' , res.message)
      },
      error : (err : Error) => {
        //console.error(err);
        this.notify.showNotification('error' , constants.apiError)
      }
    })
  }




  onSearch(){
    this.currentPage = 1;
    this.getPoliceStationList()
  }

  resetFilter(){
    this.policeDistrictFilterForm.reset();
    this.getPoliceStationList();
  }


  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
this.currentPage = 1;
    
    this.getPoliceStationList();
  }

    // to handle pagination
    changePage(page: number): void {
      //console.log(page);
      this.currentPage = page;
      this.getPoliceStationList();
    }


    exportPDF() {
      const currentDate: Date = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy hh:mm a');
      const headers = [
        // 'Government of Rajasthan',
        // 'Justice Department',
        // '(Litigation Information Tracking & Evaluation System)',
        // 'District List',
        '( As on ' + formattedDate + ')',
      ]

      const columns = [
        { header: 'Sr. No.', dataKey: 'RowID' },
        { header: 'District Name', dataKey: 'DistrictNameEng' },
        { header: 'State', dataKey: 'StateName' }
      ];
  
      this.excel.exportAllJsonPDF(headers, columns, this.policeStationList, 'District List', true);
    }
}
