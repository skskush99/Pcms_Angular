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
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { AgGridAngular } from 'ag-grid-angular';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-police-circle',
  standalone: true,
  imports: [ReactiveFormsModule , NgSelectModule , PaginationComponent , AgGridAngular , ButtonComponent],
  templateUrl: './police-circle.component.html',
  styleUrl: './police-circle.component.css',
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
export class PoliceCircleComponent {

  api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  excel = inject(XlsxService);
  router = inject(Router);
  
  policeCircleList : any[] = []
  pageSize : number = 10;
  currentPage : number = 1;
  totalRecords : number = 0;
  policeDistrictDropdown : DropdownListInterface[] = [];
  colDef : ColDef[] = []
  permissionByRole : any;

  policeDistrictFilterForm : FormGroup = new FormGroup({
    policeDist : new FormControl(null),
  })

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    // this.accessPermission.getCurrSelectedNav().subscribe({
    //   next : (res) => {
    //     this.permissionByRole = res;
    //   }
    // })
    this.createGrid();
    this.getPoliceDistrictDropdown();
    // this.getDistrictDropDown();
    this.getPoliceCircleList();
  }



  createGrid(){
      this.colDef = [
        { field: 'RowID', headerName: 'Sr No' ,  sortable : false , width:80 },
        { field: 'CircleNameEng', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Police Circle' , flex : 1 , filter : false},
        { field: 'PdNameEng', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Police District' , flex : 1 , filter : false},
        
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


  getPoliceDistrictDropdown(){
    this.api.get(this.url.getPoliceDistrictDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.policeDistrictDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      }
    })
  }






  getPoliceCircleList(){
    let reqParam = {
      "pdId": this.policeDistrictFilterForm.value.policeDist || 0,
      "pageNo": this.currentPage,
      "pageSize": this.pageSize,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getPoliceCircleList() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.policeCircleList = res.data;
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
      "pdId": this.policeDistrictFilterForm.value.policeDist || 0,
      "pageNo": 1,
      "pageSize": 999999,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getPoliceCircleList() , reqParam).subscribe({
      next : (res : any) => {
        //console.log(res);
        if(res.status){
          if(res.data?.length){
            const columnHeaders: { [key: string]: string } = {
              RowID: 'Sr No',
              RangeNameEng: 'Police Range',
              DistrictNameEng: 'District',
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
    this.getPoliceCircleList()
  }

  resetFilter(){
    this.policeDistrictFilterForm.reset();
    this.getPoliceCircleList();
  }


  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
this.currentPage = 1;
    
    this.getPoliceCircleList();
  }

    // to handle pagination
    changePage(page: number): void {
      //console.log(page);
      this.currentPage = page;
      this.getPoliceCircleList();
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
  
      this.excel.exportAllJsonPDF(headers, columns, this.policeCircleList, 'District List', true);
    }
}
