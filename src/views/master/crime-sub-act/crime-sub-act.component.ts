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
  selector: 'app-crime-sub-act',
  standalone: true,
  imports: [PaginationComponent, AgGridAngular, NgSelectModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './crime-sub-act.component.html',
  styleUrl: './crime-sub-act.component.css',
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
export class CrimeSubActComponent {

  isFormCollapsed = true;
  buttonText = 'Show Filter';
  // excel = inject(XlsxService);
  sortColumn: string | undefined = '';
  sortBy: string = '';

  get animationState() {
    return this.isFormCollapsed ? 'out' : 'in';
  }



  crimeSubActList : [] = [];
  pageSize : number = 10;
  currentPage : number = 1;
  totalRecords : number = 0;
  crimeClassificationDropdown : DropdownListInterface[] = [];
  crimeActDropdown : DropdownListInterface[] = [];
  permissionByRole : any;
  colDef : ColDef[] = []

  crimeSubActForm : FormGroup = new FormGroup({
    crimeClassification : new FormControl(null , {nonNullable : true}),
    crimeAct : new FormControl(null , {nonNullable : true}),
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
    this.getCrimeClassificationDropdown();
    this.getcrimeSubActList();
    const isHidden = localStorage.getItem('registrationFormHidden') === 'true';
    this.isFormCollapsed = false;
    this.updateButtonText(false);
  }



  createGrid(){
    this.colDef = [
      { field: 'RowID', headerName: 'Sr No' ,  sortable : false , width:80},
      { field: 'CrimeSubActNameEnglish', flex : 1 , wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Crime Sub Act Name'  , filter : false},
      { field: 'CrimeSubActNameHindi', flex : 1 , wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Crime Sub Act Hindi Name'  , filter : false},
      { field: 'CrimeSubActShortName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Sub Act Short Name' , filter : false },
      { field: 'CrimeSubActDescription', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Sub Act Description' , filter : false },
      { field: 'CrimeActNameEnglish', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Act Name' , filter : false },
      { field: 'CrimeClsNameEnglish', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Classification Name' , filter : false },
      // { field: 'officeName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Office (Case Count)', minWidth : 200 , flex : 1 , filter : false , cellRenderer: function(params : any) {
        // Concatenate officeName and caseCount, make the caseCount bold
      //   return `${params.data.officeName} <strong>(${params.data.caseCount})</strong>`;
      // } },
      // { field: 'districtName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'District' , filter : false},
      { field: 'isActive', headerName: 'Action' , pinned : 'right', width : 100 ,
        cellRenderer : GridActionButtonComponent,
        cellRendererParams : {
          edit : (field : any) => {
            this.editCrimeSubAct(field);
          },
          delete : (field : any) => {
            this.confirmActiveDeactiveCrimeSubAct(field)
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
          this.getcrimeSubActList();
        } else if (sort === 'desc') {
          this.sortColumn = column.getColDef().field;
          this.sortBy = '1';
          this.currentPage = 1;
          this.getcrimeSubActList();
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
  //   this.getcrimeSubActList();
  //   this.getAdminDeptDropdown();
  //   this.getDistrictDropDown();
  // }


  getcrimeSubActList(){
    let reqParam = {
      pageNo : this.currentPage,
      pageSize : this.pageSize,
      sortBy: this.sortColumn,
      isSortByDesc: this.sortBy == '0' ? false : true,
      crimeClsId: this.crimeSubActForm.value.crimeClassification || 0,
      crimeActId : this.crimeSubActForm.value.crimeAct || 0
    }

    this.api.post(this.url.getCrimeSubActList() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        this.crimeSubActList = res.data;
        this.totalRecords = res.pagination[0].totalRecords;
      },
      error : (err) => {
        console.log(err);
      }
    })
  }


  onSearch(){
    this.currentPage = 1;
    this.getcrimeSubActList();
  }


  // exportExcel(){
  //   let reqParam = {
  //     pageNo : 1,
  //     pageSize : 999999,
  //     AdmDeptId : this.crimeSubActForm.value.AdmDeptId ? this.crimeSubActForm.value.AdmDeptId : 0,
  //     UnitId : this.crimeSubActForm.value.UnitId ? this.crimeSubActForm.value.UnitId : 0,
  //     DistrictId : this.crimeSubActForm.value.DistrictId ? this.crimeSubActForm.value.DistrictId : 0,
  //     ActiveFilter : Number(this.crimeSubActForm.value.ActiveFilter)
  //   }

  //   this.api.post(this.url.getcrimeSubActList() , reqParam).subscribe({
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


  addSubCrimeAct(){
    this._router.navigateByUrl('master/add-crime-sub-act' , {state : {pageSize : this.pageSize}})
  }


  resetFilter() : void {
    this.crimeSubActForm.reset();
    this.getcrimeSubActList();
  }


  confirmActiveDeactiveCrimeSubAct(e : any){
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
          this.activeDeactiveCrimeSubAct(e)
        }
      }
    })
  }




  getCrimeClassificationDropdown(){
    
    this.api.get(this.url.getCrimeClassificationDropdown()).subscribe({
      next : (res : any) => {
        console.log(res);
        this.crimeClassificationDropdown = res.data;
      },
      error : (err) => {
        console.log(err);

      }
    })
  }


  getCrimeActDropdown(){
    this.crimeSubActForm.controls['crimeAct'].reset();
    if(!this.crimeSubActForm.value.crimeClassification){
      this.crimeActDropdown = [];
      return
    }

    let reqParam = {
      CrimeClsId : this.crimeSubActForm.value.crimeClassification || 0
    }

    this.api.get(this.url.getCrimeActDropdown() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        this.crimeActDropdown = res.data;
      },
      error : (err : Error) => {
        console.error(err);
        
      }
    })
  }



  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
    this.currentPage = 1;

    this.getcrimeSubActList();
  }

    // to handle pagination
    changePage(page: number): void {
      console.log(page);
      this.currentPage = page;
      this.getcrimeSubActList();
    }


    editCrimeSubAct(e : any){
      this._router.navigateByUrl('master/add-crime-sub-act' , {state : {editCrimeSubActData : e , pageSize : this.pageSize}})

    }

  activeDeactiveCrimeSubAct(e : any) {
      let reqParam = {
        "crimeSubActId": e?.CrimeSubActId,
        "isActive": !e?.IsActive,
        "updatedBy": 0
      }

      this.api.post(this.url.activeDeactiveSubCrimeAct() , reqParam).subscribe({
        next : (res: any) => {
          console.log(res);
          if(res.status){
            if(e.IsActive) {
              this.notify.showNotification( 'delete' , res.msg || res.message);
            }else {
              this.notify.showNotification('success' , 'Restore Successfully');
            }
            
            this.getcrimeSubActList();
          }else this.notify.showNotification('error' , res.message);
        },
        error : (err) => {
          console.log(err);
          this.notify.showNotification('error' , constants.apiError)
        },
        complete() {
          window.scrollTo(0 , 0)
        },
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

    // this.excel.exportAllJsonPDF(headers, columns, this.crimeSubActList, 'crimeSubActList', true);
  }
}
