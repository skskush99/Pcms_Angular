import { Component, inject } from '@angular/core';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DropdownListInterface } from '../../shared/model/shared.model';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UrlService } from '../../shared/services/url.service';
import constants from '../../shared/utils/constants';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, Column, GridReadyEvent, ProvidedColumnGroup } from 'ag-grid-community';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';

@Component({
  selector: 'app-fir-status',
  standalone: true,
  imports: [PaginationComponent, AgGridAngular, NgSelectModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './fir-status.component.html',
  styleUrl: './fir-status.component.css'
})
export class FirStatusComponent {

  firStatusList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn : string | undefined = '';
  sortBy : string = '';
  colDef : ColDef[] = [];
  permissionByRole : any;
  currentDate: Date = new Date();
  

  




  constructor(
    private notify: NotificationService,
    private _router: Router,
    private api: ApiService,
    private dialog : MatDialog,
    private url: UrlService,
  ) {}

  ngOnInit(): void {
    // this.accessPermission.getCurrSelectedNav().subscribe({
    //   next : (res : any) => {
    //     this.permissionByRole = res;
    //   }
    // })
    //console.log(this.permissionByRole);
    this.createGrid();
    this.getFirStatusList();
  }




  createGrid(){
    this.colDef =  [
    {
      field: 'srNo',
      headerName: 'Sr No' ,  sortable : false ,
      valueGetter: (e : any) => String((this.pageSize * (this.currentPage -1)) + (e.node.rowIndex + 1)),
      width: 80,
    },
    {
      field: 'FirStatusNameEnglish',
      headerName: 'FIR Status English Name ',
      width: 260,
      autoHeight: true,
      wrapHeaderText: true, 
      autoHeaderHeight: true,
      flex : 1,
      cellStyle: { whiteSpace: 'normal' },
      filter : false
      
    },
    {
      field: 'FirStatusNameHindi',
      headerName: 'FIR Status Hindi Name',
      width: 300,
      filter : false,
      wrapHeaderText: true, 
      autoHeaderHeight: true,
    },
    {
      field: 'IsActive',
      headerName: 'Action',
      //hide : !this.permissionByRole?.isEditPermission && !this.permissionByRole?.isDeletePermission ,
      wrapHeaderText: true, 
      autoHeaderHeight: true, width : 100 ,
      cellRenderer: GridActionButtonComponent,
      cellRendererParams: {
        delete: (field: any) => {
          this.confirActiveDeactiveFirStatus(field);
        },
        edit: (field: any) => {
          this.editFirStatus(field);
        },
        permission : this.permissionByRole
      },
    },
  ];

  }

  
  

  // public defaultColDef: ColDef = {
  //   sortingOrder: constants.sortingOrder,
  // };

  onGridReady(params: GridReadyEvent): void {
    // this.accessPermission.registerGrid(params.api);
  }

  getFirStatusList() {
    let reqParam = {
      pageNo: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortColumn,
      isSortByDesc: this.sortBy == '0' ? false : true
    };

    this.api.post(this.url.getFirStatusList(), reqParam).subscribe({
      next: (res: any) => {
        console.log(res);
        this.firStatusList = res.data;
        this.totalRecords = res.pagination[0].totalRecords;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }





  editFirStatus(e: any) {
    this._router.navigateByUrl('master/add-fir-status', {
      state: { addEditFirStatus: e },
    });
  }



  confirActiveDeactiveFirStatus(e : any){
    let dialogRef : any = this.dialog.open(ConfirmationPopUpComponent , {
      width : '350px',
      height : '170px',
      data : {
        msg : constants.confirmDelete
      }
    })
    dialogRef.afterClosed().subscribe({
      next : (res : any) => {
        if(res){
          this.activeDeactiveFirStatus(e)
        }
      }
    })
  }


   activeDeactiveFirStatus(e: any) {
    console.log(e);

    let reqParam = {
      firStatusId: e?.FirStatusId,
      isActive: !e.IsActive,
      updatedBy: 0,
    };
    

    this.api.post(this.url.activeDeactiveFirStatus(), reqParam).subscribe({
      next: (res: any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('delete', res.msg || res.message);
          
          this.getFirStatusList();
        }else this.notify.showNotification('error' , res.message)
      },
      error: (err) => {
        console.log(err);
        this.notify.showNotification('error', constants.apiError);
      },
      complete() {
        window.scrollTo(0, 0);
      },
    });
  }





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
          this.getFirStatusList()
        } else if (sort === 'desc') {

          this.sortColumn = column.getColDef().field
          this.sortBy = '1'
          this.currentPage = 1;
          this.getFirStatusList()
        } else {
          //console.log(sort);
          
          //console.log(`${column.getColDef().headerName} is not sorted.`);
        }
      }
    }

  



  // exportExcel(){
  //   let reqParam = {
  //     pageNo: 1,
  //     pageSize: 99999,
  //     majorMinor : this.crimeClassificationForm.value.majorMinor,
  //     sortBy: this.sortColumn,
  //     isSortByDesc: this.sortBy == '0' ? false : true
  //   };

  //   this.api.post(this.url.getFirStatusList(), reqParam).subscribe({
  //     next: (res: any) => {
  //       if(res.data?.length){
  //         const columnHeaders: { [key: string]: string } = {
  //           rowID: 'Sr No',
  //           admDeptName: 'Administrative Dept Name',
  //           admDeptShortName: 'Administrative Short Name',
  //           majorMinor: 'Major Minor',
  //         };
  
  //         // Create the modified data with only the required fields and custom headers
  //         const modifiedData = res.data.map((row: { [key: string]: any }) => {
  //           const modifiedRow: { [key: string]: any } = {};
  
  //           // Only include the necessary fields from the row
  //           Object.keys(columnHeaders).forEach((key: string) => {
  //             if (row[key] !== undefined) {
  //               modifiedRow[columnHeaders[key]] = row[key]; // Map to custom headers
  //             }
  //           });
  
  //           return modifiedRow;
  //         });

  //         //  this.excelService.exportAgGridAsExcel(modifiedData, columnHeaders, 'Admin Dept List')
  //         const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
  //         this.excelService.exportAgGridAsExcelWithHeading(modifiedData, columnHeaders, 'Admin Dept List', ' \n ( As on ' + formattedDate + ')');
  //       }else this.notify.showNotification('info' , 'No Data To Export')
       
  //     },
  //     error: (err) => {
  //       //console.log(err);
  //     },
  //   });
  // }



  // activeDeactiveFirStatus(e: any) {
  //   //console.log(e);

  //   let reqParam = {
  //     admDeptId: e.admDeptId,
  //     active: !e.active,
  //     updatedBy: 0,
  //   };

  //   this.api.post(this.url.activeDeaciveAdminDept(), reqParam).subscribe({
  //     next: (res: any) => {
  //       //console.log(res);
  //       this.notify.showNotification('delete', res.msg || res.message);
  //       window.scrollTo(0, 0);
  //       this.getFirStatusList();
  //     },
  //     error: (err) => {
  //       //console.log(err);
  //       this.notify.showNotification('error', 'Something Went Wrong');
  //       window.scrollTo(0, 0);
  //     },
  //   });
  // }


  // confirActiveDeactiveFirStatus(e : any){
  //   let dialogRef : any = this.dialog.open(ConfirmationPopupComponent , {
  //     width : '350px',
  //     height : '170px',
  //     data : {
  //       msg : constants.confirmDelete
  //     }
  //   })





  //   dialogRef.afterClosed().subscribe({
  //     next : (res : any) => {
  //       if(res){
  //         this.activeDeactiveFirStatus(e)
  //       }
  //     }
  //   })
  // }

  addNewFirStatus() {
    this._router.navigateByUrl('master/add-fir-status');
  }

  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
this.currentPage = 1;
    if (this.currentPage > this.totalRecords / this.pageSize) {
      this.currentPage = Math.floor(this.totalRecords / this.pageSize) || 1;
    }
    this.getFirStatusList();
  }

  // to handle pagination
  changePage(page: number): void {
    //console.log(page);
    this.currentPage = page;
    this.getFirStatusList();
  }

  // exportPDF() {
  //   const formattedDate = this.datePipe.transform(this.currentDate, 'dd/MM/yyyy hh:mm a');
  //   const headers = [
  //     'Government of Rajasthan',
  //     'Justice Department',
  //     '(Litigation Information Tracking & Evaluation System)',
  //     'Admin Dept List',
  //     '( As on ' + formattedDate + ')',
  //   ]

  //   const columns = [
  //     { header: 'Sr. No.', dataKey: 'rowID' },
  //     { header: 'Administrative Dept Name', dataKey: 'admDeptName' },
  //     { header: 'Administrative Short Name', dataKey: 'admDeptShortName' },
  //     { header: 'Major Minor', dataKey: 'majorMinor' }
  //   ];

  //   this.excelService.exportAllJsonPDF(headers, columns, this.firStatusList, 'firStatusList',true);
  // }
}
