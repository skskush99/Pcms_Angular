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
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, Column, ProvidedColumnGroup } from 'ag-grid-community';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'app-office',
  standalone: true,
  imports: [PaginationComponent, AgGridAngular, NgSelectModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './office.component.html',
  styleUrl: './office.component.css',
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
export class OfficeComponent {

  isFormCollapsed = true;
  buttonText = 'Show Filter';
  // excel = inject(XlsxService);
  sortColumn: string | undefined = '';
  sortBy: string = '';

  get animationState() {
    return this.isFormCollapsed ? 'out' : 'in';
  }



  officeList : [] = [];
  pageSize : number = 10;
  currentPage : number = 1;
  totalRecords : number = 0;
  adminDeptDropDown : DropdownListInterface[] = [];
  unitDeptDropDown : DropdownListInterface[] = [];
  districtDropDown : DropdownListInterface[] = [];
  permissionByRole : any;
  colDef : ColDef[] = []

  officeFilterForm : FormGroup = new FormGroup({
    DistrictId : new FormControl(null , {nonNullable : true}),
    ActiveFilter : new FormControl("1" , {nonNullable : true}),
  })


  constructor(  private dialog : MatDialog , private notify : NotificationService , private _router : Router , private api : ApiService , private url : UrlService, private datePipe: DatePipe){

  }



  ngOnInit() : void {

    // this.accessPermission.getCurrSelectedNav().subscribe({
    //   next : (res :any) => {
    //     this.permissionByRole = res;
    //   }
    // })
    console.log((this.permissionByRole));
    this.createGrid();

    let ifPrevSize = history.state?.prevPageSize;
    console.log(ifPrevSize)
    if(ifPrevSize)this.pageSize = ifPrevSize
    this.getDistrictDropDown();
    this.getOfficeList();
    const isHidden = localStorage.getItem('registrationFormHidden') === 'true';
    this.isFormCollapsed = false;
    this.updateButtonText(false);
  }



  createGrid(){
    this.colDef = [
      { field: 'RowID', headerName: 'Sr No' ,  sortable : false , width:80},
      { field: 'OfficeEng', flex : 1 , wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Office Name'  , filter : false},
      { field: 'DistrictName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'District' , filter : false },
      // { field: 'officeName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Office (Case Count)', minWidth : 200 , flex : 1 , filter : false , cellRenderer: function(params : any) {
        // Concatenate officeName and caseCount, make the caseCount bold
      //   return `${params.data.officeName} <strong>(${params.data.caseCount})</strong>`;
      // } },
      // { field: 'districtName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'District' , filter : false},
      { field: 'isActive', headerName: 'Action' , pinned : 'right', width : 100 ,
        cellRenderer : GridActionButtonComponent,
        cellRendererParams : {
          edit : (field : any) => {
            this.addEditOffice(field);
          },
          delete : (field : any) => {
            this.confirmActiveDeactiveOffice(field)
          },
          permission : this.permissionByRole
        }
      },
    ]
  }


  // public defaultColDef: ColDef = {
  //     sortingOrder: constants.sortingOrder,
  //   };

    onColumnHeaderClicked(event: { column: Column | ProvidedColumnGroup }): void {
      // Check if the event.column is a Column instance
      if ('getSort' in event.column) {
        const column = event.column as Column;
        let sort = column.getSort();

        if (sort === 'asc') {
          console.log(
            `${column.getColDef().headerName} is sorted in ascending order.`
          );
          this.sortColumn = column.getColDef().field;
          this.sortBy = '0';
          this.currentPage = 1;
          this.getOfficeList();
        } else if (sort === 'desc') {
          this.sortColumn = column.getColDef().field;
          this.sortBy = '1';
          this.currentPage = 1;
          this.getOfficeList();
        } else {
          console.log(sort);

          console.log(`${column.getColDef().headerName} is not sorted.`);
        }
      }
    }

  toggleForm() {
    this.isFormCollapsed = !this.isFormCollapsed;
    this.updateButtonText(this.isFormCollapsed);
    localStorage.setItem('registrationFormHidden', this.isFormCollapsed.toString());
  }

  private updateButtonText(isCollapsed: boolean) {
    this.buttonText = isCollapsed ? 'Show Filter' : 'Hide Filter';
  }


  // ngOnInit(): void {
  //   this.getOfficeList();
  //   this.getAdminDeptDropdown();
  //   this.getDistrictDropDown();
  // }


  getOfficeList(){
    let reqParam = {
      pageNo : this.currentPage,
      pageSize : this.pageSize,
      districtId : this.officeFilterForm.value.DistrictId || 0,
      isActive : Number(this.officeFilterForm.value.ActiveFilter) ,
      sortBy: this.sortColumn,
      officeId : 0,
      isSortByDesc: this.sortBy == '0' ? false : true,
    }

    this.api.post(this.url.getOfficeList() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        this.officeList = res.data;
        this.totalRecords = res.pagination[0].totalRecords;
      },
      error : (err) => {
        console.log(err);

      }
    })
  }


  onSearch(){
    this.currentPage = 1;
    this.getOfficeList();
  }


  // exportExcel(){
  //   let reqParam = {
  //     pageNo : 1,
  //     pageSize : 999999,
  //     AdmDeptId : this.officeFilterForm.value.AdmDeptId ? this.officeFilterForm.value.AdmDeptId : 0,
  //     UnitId : this.officeFilterForm.value.UnitId ? this.officeFilterForm.value.UnitId : 0,
  //     DistrictId : this.officeFilterForm.value.DistrictId ? this.officeFilterForm.value.DistrictId : 0,
  //     ActiveFilter : Number(this.officeFilterForm.value.ActiveFilter)
  //   }

  //   this.api.post(this.url.getOfficeList() , reqParam).subscribe({
  //     next : (res : any) => {
  //       if(res.data?.length > 0){
  //         const columnHeaders: { [key: string]: string } = {
  //           RowID: 'Sr No',
  //           admDepttName: 'Administrative Department',
  //           unitName: 'HoD/Unit Department',
  //           officeName: 'Office',
  //           districtName: 'District',
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

  //         // this.excel.exportAgGridAsExcel(modifiedData, columnHeaders, 'Office List');
  //         const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm a');
  //         this.excel.exportAgGridAsExcelWithHeading(modifiedData, columnHeaders, 'Office List', ' \n ( As on ' + formattedDate + ')');

  //       }else this.notify.showNotification('info' , "No Record To Export")
  //     },
  //     error : (err) => {
  //       console.log(err);

  //     }
  //   })
  // }


  addOffice(){
    this._router.navigateByUrl('master/add-office' , {state : {pageSize : this.pageSize}})
  }


  resetFilter() : void {
    this.officeFilterForm.reset();
    this.getOfficeList();
  }


  confirmActiveDeactiveOffice(e : any){
    // if(e?.caseCount){
    //   this.notify.showNotification('error' , constants.officeHasPendingCases);
    //   return
    // }
    let dialogRef : any = this.dialog.open(ConfirmationPopUpComponent , {
      width : '350px',
      height : '170px',
      data : {
        // msg : e.active ? constants.confirmDelete : constants.confirmRestore
        msg : constants.confirmDelete
      }
    })

    dialogRef.afterClosed().subscribe({
      next : (res : any) => {
        if(res){
          this.activeDeactiveOffice(e)
        }
      }
    })
  }




  getDistrictDropDown(){
    
    this.api.get(this.url.getDistrictDropDown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.districtDropDown = res.data;
      },
      error : (err) => {
        console.log(err);

      }
    })
  }



  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
    this.currentPage = 1;

    this.getOfficeList();
  }

    // to handle pagination
    changePage(page: number): void {
      console.log(page);
      this.currentPage = page;
      this.getOfficeList();
    }


    addEditOffice(e : any){
      this._router.navigateByUrl('master/add-office' , {state : {office : e , pageSize : this.pageSize}})

    }

  activeDeactiveOffice(e : any) {
      let reqParam = {
        "officeId": e?.OfficeId,
        "isActive": !e?.IsActive,
        "updatedBy": 0
      }

      this.api.post(this.url.activeDeactiveOffice() , reqParam).subscribe({
        next : (res: any) => {
          console.log(res);
          if(e.IsActive) {
            this.notify.showNotification( 'delete' , res.msg || res.message);
          }else {
            this.notify.showNotification('success' , 'Restore Successfully');
          }
          window.scrollTo(0 , 0)
          this.getOfficeList();
        },
        error : (err) => {
          console.log(err);
          this.notify.showNotification('error' , "Something Went Wrong")
          window.scrollTo(0 , 0)
        }
      })
    }

  exportPDF() {
    const currentDate: Date = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy hh:mm a');
    const headers = [
      'Government of Rajasthan',
      'Justice Department',
      '(Litigation Information Tracking & Evaluation System)',
      'Office List',
      '( As on ' + formattedDate + ')',
    ]

    const columns = [
      { header: 'Sr. No.', dataKey: 'RowID' },
      { header: 'Administrative Department', dataKey: 'admDepttName' },
      { header: 'HoD/Unit Department', dataKey: 'unitName' },
      { header: 'Office', dataKey: 'officeName' },
      { header: 'District', dataKey: 'districtName' }
    ];

    // this.excel.exportAllJsonPDF(headers, columns, this.officeList, 'officeList', true);
  }
}
