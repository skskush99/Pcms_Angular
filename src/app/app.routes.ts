import { Routes } from '@angular/router';
import { LoginComponent } from '../views/login/login.component';
import { UserMappingComponent } from '../views/user-mapping/user-mapping.component';
import { ListPageAdminComponent } from '../views/list-page-admin/list-page-admin.component';
import { SsoComponent } from '../views/sso/sso.component';
import { RoleSelectionComponent } from '../views/role-selection/role-selection.component';
import { DashboardComponent } from '../views/dashboard/dashboard.component';
import { HomeComponent } from '../views/home/home.component';

export const routes: Routes = [ 

  ///// SSO use Start  ////// 
     {
        path : '',
        redirectTo : 'dashboard',
        pathMatch : 'full'
    },
    ///// SSO use End  ////// 

  ///// Audit use Start  ////// 
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  ///// Audit use End  ////// 



  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user-mapping',
    component: UserMappingComponent
  },
  {
    path: 'login-sso',
    component: SsoComponent
  },
  {
    path: 'role-selection',
    component: RoleSelectionComponent
  },
  {
    path: 'master',
    loadChildren: () => import('./master.routes').then(m => m.MastersRoutingModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user.routes').then(m => m.UserRoutingModule),
  },
  {
    path: 'case',
    loadChildren: () => import('./case.routes').then(m => m.CaseRoutingModule),
  },
  {
    path: 'report',
    loadChildren: () => import('./report.routes').then(m => m.ReportRoutingModule),
  },
];