import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import { XlsxService } from '../../shared/services/xlsx.service';
import constants from '../../shared/utils/constants';
import { ColDef, GridReadyEvent, ProvidedColumnGroup , Column } from 'ag-grid-community'
import { AgGridAngular } from 'ag-grid-angular';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [AgGridAngular, PaginationComponent, ButtonComponent],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css'
})
export class DesignationComponent {

   designationList : [] = [];
  pageSize : number = 10;
  currentPage : number = 1;
  totalRecords : number = 0;
  sortColumn : string | undefined = '';
  sortBy : string = '';
  permissionByRole : any;
  excel = inject(XlsxService)
  colDef : ColDef[] = [];


  constructor(  private dialog : MatDialog, private notify : NotificationService , private _router : Router , private api : ApiService , private url : UrlService, private datePipe: DatePipe){

  }

  ngOnInit(): void {
    // this.accessPermission.getCurrSelectedNav().subscribe({
    //   next : (res) => {
    //     this.permissionByRole = res;
    //   }
    // })
    this.createGrid();

    this.pageSize = history.state?.prevPageSize || 10;
    this.getDesignationList()
  }


  createGrid(){
    this.colDef = [
      { field: 'srNo', headerName: 'Sr No' , wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true ,  sortable : false , valueGetter: (e : any) => String((this.pageSize * (this.currentPage -1)) + (e.node.rowIndex + 1)), width:80 },
      { field: 'designationEng', headerName: 'Designation English Name' , wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , minWidth : 260 , flex : 1, filter : false},
      { field: 'designationHindi', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Designation Hindi Name', width : 300 , filter : false},
      { field: 'isActive', headerName: 'Action' , pinned : 'right', width : 110, 
        cellRenderer : GridActionButtonComponent,
        cellRendererParams : {
          edit : (field : any) => {
            this.editDesignation(field);
          },
          delete : (field: any) => {
            this.confirmActiveDeactiveDesignation(field)
          },
          permission : this.permissionByRole
        }
      },
    ]
  }



  // public defaultColDef: ColDef = {
  //   sortingOrder :  : constants.sortingOrder,
  // };
        
      
  onColumnHeaderClicked(event: { column: Column | ProvidedColumnGroup}): void { 
              
              // Check if the event.column is a Column instance
              if ('getSort' in event.column) { 
                const column = event.column as Column; 
                let sort = column.getSort();
                
                if (sort === 'asc') {
                  //console.log(`${column.getColDef().headerName} is sorted in ascending order.`);      
                  this.sortColumn = column.getColDef().field
                  this.sortBy = '0'
                  this.currentPage = 1
                  this.getDesignationList()
                } else if (sort === 'desc') {
        
                  this.sortColumn = column.getColDef().field
                  this.sortBy = '1'
                  this.currentPage = 1;
                  this.getDesignationList()
                } else {
                  //console.log(sort);
                  
                  //console.log(`${column.getColDef().headerName} is not sorted.`);
                }
              }
            }
  



  getDesignationList(){
    let reqParam = {
      // token : localStorage.getItem('token'),
      pageNo : this.currentPage , 
      pageSize : this.pageSize,
      sortBy: this.sortColumn,
      isSortByDesc: this.sortBy == '0' ? false : true,
    }

    this.api.post(this.url.getDesignationList() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        this.designationList = res.data
        this.totalRecords = res.pagination[0].totalRecords
      },
      error : (err) => {
        //console.log(err);
        
      }
    })
  }


  onGridReady(params: GridReadyEvent): void {
    // this.accessPermission.registerGrid(params.api);
  }
  
  
  
  excelExport(){
    let reqParam = {
      pageNo : 1 , 
      pageSize : 999999
    }

    this.api.post(this.url.getDesignationList() , reqParam).subscribe({
      next : (res : any) => {
        if(res.data?.length> 0){
          const columnHeaders: { [key: string]: string } = {
            rowID: 'Sr No',
            designationName: 'Designation Name',
            designationShortName: 'Designation Short Name',
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
    
          // this.excel.exportAgGridAsExcel(modifiedData, columnHeaders, 'Designation List');
          const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
          this.excel.exportAgGridAsExcelWithHeading(modifiedData, columnHeaders, 'Disgination List', ' \n ( As on ' + formattedDate + ')');

        }
          else this.notify.showNotification('info' , "No Record To Export")
      },
      error : (err) => {
        //console.log(err);
        
      }
    })
  }


  editDesignation(e : any){
    this._router.navigateByUrl("master/add-designation" , {state : {designation : e , pageSize : this.pageSize}})    
  }


  confirmActiveDeactiveDesignation(e : any){
    let dialogRef = this.dialog.open(ConfirmationPopUpComponent , {
      width : '350px',
      height : '170px',
      data : {
        msg : constants.confirmDelete
      }
    })

    dialogRef.afterClosed().subscribe({
      next : (res : boolean) => {
        if(res){
          this.activeDeactiveDesignation(e);
        }
      }
    })
  }



  activeDeactiveDesignation(e : any){
    //console.log(e);
    
    let reqParam = {
      tocken : localStorage.getItem('token'),
      designationId : e.designationId,
      active : !e.active,
      updatedBy : 0
    }

    this.api.post(this.url.activeDeactiveDesignation() , reqParam).subscribe({
      next : (res : any) => {
        //console.log(res);
        this.notify.showNotification('delete' , res.msg || res.message)
        window.scrollTo(0 , 0)
        this.getDesignationList();
      },
      error : (err) => {
        //console.log(err);
        this.notify.showNotification('error' , "Something Went Wrong")
        window.scrollTo(0 , 0)
      }
    })
  }



  addNewDesignation(){
    this._router.navigateByUrl('master/add-designation' , {state : {pageSize : this.pageSize}})
  }



  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
this.currentPage = 1;
    if(this.currentPage > this.totalRecords/this.pageSize){
      this.currentPage = Math.floor(this.totalRecords/this.pageSize) || 1;      
    } 
    this.getDesignationList()
  }

    // to handle pagination 
    changePage(page: number): void {
      //console.log(page);
      this.currentPage = page;
      this.getDesignationList()
    }

    
    exportPDF() {
      const currentDate: Date = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy hh:mm a');
      const headers = [
        'Government of Rajasthan',
        'Justice Department',
        '(Litigation Information Tracking & Evaluation System)',
        'Desgination List',
        '( As on ' + formattedDate + ')',
      ]

      const columns = [
        { header: 'Sr. No.', dataKey: 'rowID' },
        { header: 'Designation Name', dataKey: 'designationName' },
        { header: 'Designation Short Name', dataKey: 'designationShortName' }
      ];
  
      this.excel.exportAllJsonPDF(headers, columns, this.designationList, 'Desgination List', true);
    }

}
