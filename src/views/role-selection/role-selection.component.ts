///// SSO use Start  ////// 
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ApiService } from '../shared/services/api.service';
import { SidenavService } from '../shared/services/sidenav.service';
import { UrlService } from '../shared/services/url.service';
import { SelecrRoleButtonComponent } from './selecr-role-button/selecr-role-button.component';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.css'
})
export class RoleSelectionComponent {

  // ===================== STATE =====================
  rowData:      any[]  = history.state?.userLists || [{ roleName: 'SA' }];
  totalRecords: number = this.rowData?.length;
  pageSize:     number = 10;
  currentPage:  number = 1;
  ip:           string = '';

  // ===================== GRID COLUMNS =====================
  colDefs: ColDef[] = [
    {
      field:       'srNo',
      headerName:  'Sr No',
      sortable:    false,
      valueGetter: 'node.rowIndex + 1',
      width:       80
    },
    {
      field:       '',
      headerName:  'Role Name',
      autoHeight:  true,
      width:       190,
      filter:      false,
      valueGetter: (e: any) => e.data?.loginUserData?.roleName
    },
    {
      field:       '',
      headerName:  'Name',
      width:       190,
      autoHeight:  true,
      filter:      false,
      valueGetter: (e: any) => e.data?.loginUserData?.name
    },
    {
      field:       '',
      headerName:  'Department Name',
      minWidth:    190,
      flex:        1,
      autoHeight:  true,
      filter:      false,
      valueGetter: (e: any) => e.data?.loginUserData?.departmentName
    },
    {
      field:       '',
      headerName:  'HoD/Unit Name',
      width:       180,
      filter:      false,
      autoHeight:  true,
      valueGetter: (e: any) => e.data?.loginUserData?.unitName
    },
    {
      field:       '',
      headerName:  'Office Name',
      autoHeight:  true,
      filter:      false,
      valueGetter: (e: any) => e.data?.loginUserData?.officeName
    },
    {
      field:              'action',
      headerName:         'Action',
      width:              130,
      cellRenderer:       SelecrRoleButtonComponent,
      cellRendererParams: {
        clicked: (field: any) => { this.loginLogs(field); }
      }
    },
  ];

  // ===================== CONSTRUCTOR =====================
  constructor(
    private sideNavService: SidenavService,
    private api:            ApiService,
    private urls:           UrlService,
    private router:         Router
  ) {
    const roles: any = localStorage.getItem('roles');
    this.ip = history.state?.ipaddress;

    if (!this.rowData) {
      this.rowData = JSON.parse(roles);
    }

    if (!this.rowData?.length) {
      localStorage.setItem('ifrnp', JSON.stringify(true));
      return;
    }

    if (this.rowData.length === 1) {
      this.loginLogs(this.rowData[0]);
    }
  }

  // ===================== ACTIONS =====================
  loginLogs(e: any): void {
    this.api.setToken(e?.authToken);
    const token: any = e?.authToken;
    this.api.post(`${this.urls.getLoginLogs()}?Token=${encodeURIComponent(token)}`).subscribe({
      next: (_res: any) => {
        localStorage.setItem('roleId', JSON.stringify({ roleId: e?.roleId, roleName: e?.loginUserData?.roleName }));
        localStorage.setItem('roles', JSON.stringify(e));
        localStorage.setItem('ia',    JSON.stringify(this.ip));
        this.api.setToken(e?.authToken);
        this.sideNavService.setNavItems({ roleId: e?.roleId, roleName: e?.loginUserData?.roleName });
        this.router.navigateByUrl('/');
      },
      error: (_err: Error) => { /* handled by interceptor */ }
    });
  }
}

    ///// SSO use End  ////// 

  ///// Audit use Start  ////// 


// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { ColDef } from 'ag-grid-community';
// import { AgGridAngular } from 'ag-grid-angular';
// import { ApiService } from '../shared/services/api.service';
// import { SidenavService } from '../shared/services/sidenav.service';
// import { UrlService } from '../shared/services/url.service';
// import { SelecrRoleButtonComponent } from './selecr-role-button/selecr-role-button.component';

// @Component({
//   selector: 'app-role-selection',
//   standalone: true,
//   imports: [AgGridAngular],
//   templateUrl: './role-selection.component.html',
//   styleUrl: './role-selection.component.css'
// })
// export class RoleSelectionComponent {

//   // ===================== STATE =====================

//   rowData:      any[]  = [];
//   totalRecords: number = 0;
//   pageSize:     number = 10;
//   currentPage:  number = 1;
//   ip:           string = '';

//   // ===================== GRID COLUMNS =====================
//   colDefs: ColDef[] = [
//     {
//       field:       'srNo',
//       headerName:  'Sr No',
//       sortable:    false,
//       valueGetter: 'node.rowIndex + 1',
//       width:       80
//     },
//     {
//       field:       '',
//       headerName:  'Role Name',
//       autoHeight:  true,
//       width:       190,
//       filter:      false,
//       valueGetter: (e: any) => e.data?.loginUserData?.roleName
//     },
//     {
//       field:       '',
//       headerName:  'Name',
//       width:       190,
//       autoHeight:  true,
//       filter:      false,
//       valueGetter: (e: any) => e.data?.loginUserData?.name
//     },
//     {
//       field:       '',
//       headerName:  'Department Name',
//       minWidth:    190,
//       flex:        1,
//       autoHeight:  true,
//       filter:      false,
//       valueGetter: (e: any) => e.data?.loginUserData?.departmentName
//     },
//     {
//       field:       '',
//       headerName:  'HoD/Unit Name',
//       width:       180,
//       filter:      false,
//       autoHeight:  true,
//       valueGetter: (e: any) => e.data?.loginUserData?.unitName
//     },
//     {
//       field:       '',
//       headerName:  'Office Name',
//       autoHeight:  true,
//       filter:      false,
//       valueGetter: (e: any) => e.data?.loginUserData?.officeName
//     },
//     {
//       field:              'action',
//       headerName:         'Action',
//       width:              130,
//       cellRenderer:       SelecrRoleButtonComponent,
//       cellRendererParams: {
//         clicked: (field: any) => { this.loginLogs(field); }
//       }
//     },
//   ];

//   // ===================== CONSTRUCTOR =====================
//   constructor(
//     private sideNavService: SidenavService,
//     private api:            ApiService,
//     private urls:           UrlService,
//     private router:         Router
//   ) {
//     const stateData = history.state?.userLists;
//     this.ip         = history.state?.ipaddress;    
//     // Login se aata hai: { status: true, data: [ { authToken, roleId, loginUserData, ... } ] }
//     // Pehle: history.state?.userLists  →  poora response object (WRONG)
//     // Ab:    history.state?.userLists?.data  →  actual array (CORRECT)
//     if (stateData?.data?.length) {
//       this.rowData = stateData.data;
//     } else {
//       // Fallback: localStorage se try karo
//       const roles: any = localStorage.getItem('roles');
//       this.rowData = roles ? JSON.parse(roles) : [];
//     }

//     this.totalRecords = this.rowData?.length || 0;

//     if (!this.rowData?.length) {
//       localStorage.setItem('ifrnp', JSON.stringify(true));
//       return;
//     }

//     // Agar sirf ek role hai toh seedha login kar do
//     if (this.rowData.length === 1) {
//       this.loginLogs(this.rowData[0]);
//     }
//   }

//   // ===================== ACTIONS =====================
//   loginLogs(e: any): void {
//     // e = { authToken, roleId, userName, loginUserData: { roleName, name, ... } }
//     this.api.setToken(e?.authToken);
//     const token: any = e?.authToken;

//     this.api.post(`${this.urls.getLoginLogs()}?Token=${encodeURIComponent(token)}`).subscribe({
//       next: (_res: any) => {
//         localStorage.setItem('roleId', JSON.stringify({
//           roleId:   e?.roleId,
//           roleName: e?.loginUserData?.roleName
//         }));
//         localStorage.setItem('roles', JSON.stringify(e));
//         localStorage.setItem('ia',    JSON.stringify(this.ip));
//         localStorage.setItem('token', e?.authToken);  

//         this.api.setToken(e?.authToken);
//         this.sideNavService.setNavItems({
//           roleId:   e?.roleId,
//           roleName: e?.loginUserData?.roleName
//         });

//         this.router.navigateByUrl('/dashboard');
//       },
//       error: (_err: Error) => { /* handled by interceptor */ }
//     });
//   }
// }

 ///// Audit use End  ////// 