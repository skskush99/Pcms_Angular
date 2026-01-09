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
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AgGridAngular } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GridActionButtonComponent } from '../../shared/components/grid-action-button/grid-action-button.component';
import { ConfirmationPopUpComponent } from '../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-court',
  standalone: true,
  imports: [ReactiveFormsModule , PaginationComponent , ButtonComponent , AgGridAngular , NgSelectModule],
  templateUrl: './court.component.html',
  styleUrl: './court.component.css',
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
export class CourtComponent {

  
  api = inject(ApiService);
  url = inject(UrlService);
  notify = inject(NotificationService);
  excel = inject(XlsxService);
  router = inject(Router);
  dialog = inject(MatDialog);
  
  courtList : any[] = []
  pageSize : number = 10;
  currentPage : number = 1;
  totalRecords : number = 0;
  divisionDropdown : DropdownListInterface[] = [];
  districtDropdown : DropdownListInterface[] = [];
  colDef : ColDef[] = []
  permissionByRole : any;

  courtFilterForm : FormGroup = new FormGroup({
    division : new FormControl(null ),
    district : new FormControl(null)
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
    this.getcourtList();
  }



  createGrid(){
      this.colDef = [
        { field: 'RowID', headerName: 'Sr No' ,  sortable : false , width:80 },
        { field: 'JCourtEng', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Court English Name' , flex : 1 , filter : false},
        { field: 'JCourtHindi', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Court Hindi Name',minWidth : 150 , flex : 1 , filter : false},
        { field: 'DivisionName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'Division Name', width:150 , filter : false},
        { field: 'DistrictName', wrapHeaderText: true, autoHeaderHeight: true , cellStyle : {whiteSpace: 'normal'} , autoHeight : true , headerName: 'District Name', width:150 , filter : false},
        {
                      field: 'IsActive',
                      headerName: 'Action',
                      //hide : !this.permissionByRole?.isEditPermission && !this.permissionByRole?.isDeletePermission ,
                      wrapHeaderText: true, 
                      autoHeaderHeight: true, width : 100 ,
                      cellRenderer: GridActionButtonComponent,
                      cellRendererParams: {
                        delete: (field: any) => {
                          this.confirActiveDeactiveCourtName(field);
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


  
  toggleForm() {
    this.isFormCollapsed = !this.isFormCollapsed;
    this.updateButtonText(this.isFormCollapsed);
    localStorage.setItem('registrationFormHidden', this.isFormCollapsed.toString());
  }

  private updateButtonText(isCollapsed: boolean) {
    this.buttonText = isCollapsed ? 'Show Filter' : 'Hide Filter';
  }




  getcourtList(){
    let reqParam = {
      jCourtId : 0,
      "divisionId": this.courtFilterForm.value.division || 0,
      "districtId": this.courtFilterForm.value.district || 0,
      "pageNo": this.currentPage,
      "pageSize": this.pageSize,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getCourtsList() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.courtList = res.data;
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


   getDistrictDropdown(){
    console.log('runnn');
    
    this.courtFilterForm.controls['district'].reset();
    if(!this.courtFilterForm.value.division){
      this.districtDropdown = [];
      // console.log('inside');
      
      return
    }
    let reqParam = {
      DivisionId : this.courtFilterForm.value.division
    }
    this.api.get(this.url.getDistrictDropDown() , reqParam).subscribe({
      next: (res : any) => {
        console.log(res);
        this.districtDropdown = res.data;
      },
      error : (err : Error) => {
        //console.error(err);
        
      }
    })
  }


  confirActiveDeactiveCourtName(e : any){
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
          this.activeDeactiveCourtName(e);
        }
      }
    })
  }


  activeDeactiveCourtName(e : any){
    let reqParam = {
      "jCourtId": e?.JCourtId,
      "isActive": !e?.IsActive,
      "updatedBy": 0
    }
    this.api.post(this.url.activeDeactiveCourt() , reqParam).subscribe({
      next : (res : any) => {
        console.log(res);
        if(res.status){
          this.notify.showNotification('delete' , res.message);
          this.getcourtList();
        }else this.notify.showNotification('error' , res.message);
      },
      error : (err : Error) => {
        console.error(err);
        this.notify.showNotification('error' , constants.apiError)
      }
    })
  }


  exportExcel(){
    let reqParam = {
      "divisionId": 0,
      "stateId": this.courtFilterForm.value.state || 0,
      "pageNo": 1,
      "pageSize": 999999,
      "sortBy": "",
      "isSortByDesc": true
    }
    this.api.post(this.url.getCourtsList() , reqParam).subscribe({
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

  addCourt(){
    this.router.navigateByUrl('master/add-court')
  }
  
  
  editCourtType(e : any){
    this.router.navigateByUrl('master/add-court' , {state : {court : e}})
  }



  onSearch(){
    this.currentPage = 1;
    this.getcourtList()
  }

  resetFilter(){
    this.courtFilterForm.reset();
    this.getcourtList();
  }


  onPageSizeChanged(event: any) {
    this.pageSize = Number(event.target.value);
    this.currentPage = 1;
    this.getcourtList();
  }

    // to handle pagination
  changePage(page: number): void {
    //console.log(page);
    this.currentPage = page;
    this.getcourtList();
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
  
      this.excel.exportAllJsonPDF(headers, columns, this.courtList, 'Court List', true);
    }

}
