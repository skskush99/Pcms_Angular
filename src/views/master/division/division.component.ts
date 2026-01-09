import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import constants from '../../shared/utils/constants';
import { XlsxService } from '../../shared/services/xlsx.service';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'app-division',
  standalone: true,
  imports: [AgGridAngular, PaginationComponent, ButtonComponent],
  templateUrl: './division.component.html',
  styleUrl: './division.component.css'
})
export class DivisionComponent {

   api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  excel = inject(XlsxService)
  divisionList : any[] = []
  pageSize : number = 10;
  currentPage : number = 1;
  totalRecords : number = 0;

  colDef : ColDef[] = []


  constructor( ){
  
    }

  ngOnInit(): void {
    this.createGrid()
    this.getDivisionList()
  }



  createGrid(){
      this.colDef = [
        { field: 'RowID', headerName: 'Sr No' ,  sortable : false , width:80 },
        { field: 'DivisionNameEng', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Division Name' , flex : 1 , filter : false},
        { field: 'CreatedDate', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Created Date',minWidth : 250 , flex : 1 , filter : false},
        // { field: 'unitShortName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'HoD/Unit Short Name', width:150 , filter : false},
        { field: 'isActive', headerName: 'Action' , pinned : 'right' , width : 100 , hide : true,
          cellRenderer : GridActionButtonComponent,
          cellRendererParams : {
            // edit : (field : any) => {
            //   this.editUser(field);
            // },
            // delete : (param : any) => {
            //   this.confirmDeleteUser(param)
            // },
            // permission : this.permissionByRole
          },
  
        },
      ]
    }



  getDivisionList(){
    let reqParam = {
      "pageNo": this.currentPage,
      "pageSize": this.pageSize,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getDivisionListRajMaster() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.divisionList = res.data;
          this.totalRecords = res.pagination[0].totalRecords
        }else this.notify.showNotification('error' , res.message)
      },
      error : (err : Error) => {
        //console.error(err);
        this.notify.showNotification('error' , constants.apiError)
      }
    })
  }

  exportExcel(){
    let reqParam = {
      DivisionId : 0,
      StateId : 0
    }
    this.api.post(this.url.getDivisionListRajMaster() , reqParam).subscribe({
      next : (res : any) => {
        //console.log(res);
        if(res.status){
          if(res.data?.length){
            const columnHeaders: { [key: string]: string } = {
              RowID: 'Sr No',
              DivisionNameEng: 'Division',
              CreatedDate: 'Create Date',
  
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
  
            // this.excel.exportAgGridAsExcel(modifiedData, columnHeaders, 'Division List');
            // const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
            this.excel.exportAgGridAsExcelWithHeading(modifiedData, columnHeaders, 'Division List', '');
  
          }else this.notify.showNotification('info' , 'No Data To Export')
        }else this.notify.showNotification('error' , res.message)
      },
      error : (err : Error) => {
        //console.error(err);
        this.notify.showNotification('error' , constants.apiError)
      }
    })
  }



  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
this.currentPage = 1;
    
    this.getDivisionList();
  }

    // to handle pagination
    changePage(page: number): void {
      //console.log(page);
      this.currentPage = page;
      this.getDivisionList();
    }

   

}
