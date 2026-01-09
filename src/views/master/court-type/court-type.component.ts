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
import { AgGridAngular } from 'ag-grid-angular';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-court-type',
  standalone: true,
  imports: [ReactiveFormsModule , AgGridAngular , PaginationComponent , ButtonComponent],
  templateUrl: './court-type.component.html',
  styleUrl: './court-type.component.css'
})
export class CourtTypeComponent {

   api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  excel = inject(XlsxService);
  router = inject(Router);
  dialog = inject(MatDialog);
  
  courtTypeList : any[] = []
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
    this.getcourtTypeList();
  }



  createGrid(){
      this.colDef = [
        { field: 'rowID', headerName: 'Sr No' ,  sortable : false , width:80 },
        { field: 'courtTypeName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Court Type Name' , flex : 1 , filter : false},
        { field: 'courtTypeShortName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Court Type Short Name',minWidth : 250 , flex : 1 , filter : false},
        // { field: 'unitShortName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'HoD/Unit Short Name', width:150 , filter : false},
        {
              field: 'IsActive',
              headerName: 'Action',
              //hide : !this.permissionByRole?.isEditPermission && !this.permissionByRole?.isDeletePermission ,
              wrapHeaderText: true, 
              autoHeaderHeight: true, width : 100 ,
              cellRenderer: GridActionButtonComponent,
              cellRendererParams: {
                delete: (field: any) => {
                  this.confirActiveDeactiveCourtType(field);
                },
                edit: (field: any) => {
                  this.editCourtType(field);
                },
                permission : this.permissionByRole
              },
            },
      ]
    }


    
  isFormCollapsed = true;
  buttonText = 'Show Filter';

  get animationState() {
    return this.isFormCollapsed ? 'out' : 'in';
  }


 

    confirActiveDeactiveCourtType(e : any){
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
          this.activeDeactiveCourtType(e);
        }
      }
    })
  }



  activeDeactiveCourtType(e : any){
    let reqParam = {
      "courtTypeId": e?.courtTypeId,
      "active": !e?.active,
      "updatedBy": 0
    }
    this.api.post(this.url.activeDeactiveCourtType() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('delete' , res?.message);
          this.getcourtTypeList();
        }else this.notify.showNotification('error' , constants.apiError)
      },
      error : (err : Error) => {
        console.error(err);
        this.notify.showNotification('error' , constants.apiError);
      }
    })
  }


  editCourtType(e : any){
    this.router.navigateByUrl('master/add-court-type' , {state : {courtType : e}})
  }



  getcourtTypeList(){
    let reqParam = {
      "pageNo": this.currentPage,
      "pageSize": this.pageSize,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getCourtTypesList() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.courtTypeList = res.data;
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
      "pageNo": 1,
      "pageSize": 999999,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getCourtTypesList() , reqParam).subscribe({
      next : (res : any) => {
        //console.log(res);
        if(res.status){
          if(res.data?.length){
            const columnHeaders: { [key: string]: string } = {
              rowID: 'Sr No',
              courtTypeName: 'District Name',
              courtTypeShortName: 'State',
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

  addCourtType(){
    this.router.navigateByUrl('master/add-court-type')
  }



  onSearch(){
    this.currentPage = 1;
    this.getcourtTypeList()
  }

  resetFilter(){
    this.districtFilterForm.reset();
    this.getcourtTypeList();
  }


  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
this.currentPage = 1;
    
    this.getcourtTypeList();
  }

    // to handle pagination
    changePage(page: number): void {
      //console.log(page);
      this.currentPage = page;
      this.getcourtTypeList();
    }


    exportPDF() {
      const currentDate: Date = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy hh:mm a');
      const headers = [
        'Government of Rajasthan',
        'Justice Department',
        '(Litigation Information Tracking & Evaluation System)',
        'District List',
        '( As on ' + formattedDate + ')',
      ]

      const columns = [
        { header: 'Sr. No.', dataKey: 'RowID' },
        { header: 'District Name', dataKey: 'DistrictNameEng' },
        { header: 'State', dataKey: 'StateName' }
      ];
  
      this.excel.exportAllJsonPDF(headers, columns, this.courtTypeList, 'Court Type List', true);
    }
}
