import { Routes } from '@angular/router';
import { LoginComponent } from '../views/login/login.component';
import { UserMappingComponent } from '../views/user-mapping/user-mapping.component';
import { ListPageAdminComponent } from '../views/list-page-admin/list-page-admin.component';
import { SsoComponent } from '../views/sso/sso.component';
import { RoleSelectionComponent } from '../views/role-selection/role-selection.component';
import { DashboardComponent } from '../views/dashboard/dashboard.component';
import { HomeComponent } from '../views/home/home.component';

export const routes: Routes = [


    {
        path : 'dashboard',
        component : DashboardComponent
    },
    {
        path : '',
        redirectTo : 'dashboard',
        pathMatch : 'full'
    },
     {
        path : 'home',
        component : HomeComponent
    },
    {
        path : 'login',
        component : LoginComponent
    },
    {
        path : 'user-mapping',
        component : UserMappingComponent
    },
    {
        path : 'login-sso',
        component : SsoComponent
    },
    {
        path : 'role-selection',
        component : RoleSelectionComponent
    },
    {
      path : 'master',
      loadChildren : () => import('./master.routes').then(m => m.MastersRoutingModule),
    //   canActivate: [authGuard , noRoleFoundGuard]
    },
    {
      path : 'user',
      loadChildren : () => import('./user.routes').then(m => m.UserRoutingModule),
    //   canActivate: [authGuard , noRoleFoundGuard]
    },
    {
      path : 'case',
      loadChildren : () => import('./case.routes').then(m => m.CaseRoutingModule),
    //   canActivate: [authGuard , noRoleFoundGuard]
    },
     {
      path : 'report',
      loadChildren : () => import('./report.routes').then(m => m.ReportRoutingModule),
    
    },
];
