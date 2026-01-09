import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { SidenavService } from '../shared/services/sidenav.service';
import { UrlService } from '../shared/services/url.service';
import { ColDef } from 'ag-grid-community';
import { SelecrRoleButtonComponent } from './selecr-role-button/selecr-role-button.component';
import { AgGridAngular } from 'ag-grid-angular';


@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.css'
})
export class RoleSelectionComponent {


  rowData : any[] = history.state?.userLists || [{roleName : 'SA'}];
  totalRecords : number = this.rowData?.length
  pageSize : number = 10
  currentPage : number = 1;
  ip : string = '';
  colDefs: ColDef[] = [
    { field: 'srNo', headerName: 'Sr No' ,  sortable : false , valueGetter: 'node.rowIndex + 1', width: 80},
    { field: '', headerName: 'Role Name' , autoHeight : true ,  width: 190 , filter : false , valueGetter : (e: any) => e.data?.loginUserData?.roleName},
    { field: '', headerName: 'Name' , width: 190 , autoHeight : true , filter : false , valueGetter : (e: any) => e.data?.loginUserData?.name},
    { field: '', headerName: 'Department Name', minWidth:190 , flex : 1 , autoHeight : true , filter : false , valueGetter : (e: any) => e.data?.loginUserData?.departmentName},
    { field: '', headerName: 'HoD/Unit Name', width: 180 , filter : false , autoHeight : true , valueGetter : (e: any) => e.data?.loginUserData?.unitName},
    { field: '', headerName: 'Office Name'  , autoHeight : true , filter : false , valueGetter : (e: any) => e.data?.loginUserData?.officeName
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 130,
      cellRenderer: SelecrRoleButtonComponent,
      cellRendererParams : {
        clicked : (field : any) => {
          this.loginLogs(field);
        },
      }
    },
  ];


  constructor( private sideNavService : SidenavService , private api : ApiService , private urls : UrlService , private router : Router ,){
    console.log(this.rowData);
    
    let roles  : any = localStorage.getItem('roles')
    this.ip = history.state?.ipaddress;
    
    // localStorage.setItem('ia' , JSON.stringify(ip));
      if (!this.rowData){         
        this.rowData = JSON.parse(roles)}
        //console.log(this.rowData);
        
        //console.log(this.rowData);
        if(!this.rowData?.length){
          //if no role is mapped with the current sso id
          localStorage.setItem('ifrnp' , JSON.stringify(true))
          // this.router.navigateByUrl('no-role-mapped' , {state : {req : history.state?.reqParam}});
          return
        }
        if(this.rowData.length == 1){
          this.loginLogs(this.rowData[0])
        }

        
  }








    loginLogs(e : any){  
      //console.log(e);
      this.api.setToken(e?.authToken);
    let token : any  = e?.authToken
    this.api.post(`${this.urls.getLoginLogs()}?Token=${encodeURIComponent(token)}`).subscribe({
      next : async (res : any) =>{
        //console.log(res);
        
        // this.getNavItems(e);
        
        localStorage.setItem('roleId' , JSON.stringify({roleId : e?.roleId , roleName : e?.loginUserData?.roleName}))
        localStorage.setItem("roles" , JSON.stringify(e));
        localStorage.setItem("ia" , JSON.stringify(this.ip))
        this.api.setToken(e?.authToken);
        this.sideNavService.setNavItems({roleId : e?.roleId , roleName : e?.loginUserData?.roleName})
        this.router.navigateByUrl('/')
      },
      error : (err : Error) =>{
        //console.log(err);
        // this.notify.showNotification('error' , 'Something Went Wrong')
      }
    })
  }

}
