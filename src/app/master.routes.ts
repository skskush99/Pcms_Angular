import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

export const routes: Routes = [

    {
    path: 'admin-dept',
    loadComponent: () => import('../views/master/admin-department/admin-department.component').then(m => m.AdminDepartmentComponent),
    canActivate: []
    },
    {
    path: 'add-admin-dept',
    loadComponent: () => import('../views/master/admin-department/add-depatment/add-depatment.component').then(m => m.AddDepatmentComponent),
    canActivate: []
    },
    {
    path: 'office',
    loadComponent: () => import('../views/master/office/office.component').then(m => m.OfficeComponent),
    canActivate: []
    },
    {
    path: 'add-office',
    loadComponent: () => import('../views/master/office/add-office/add-office.component').then(m => m.AddOfficeComponent),
    canActivate: []
    },
    {
    path: 'division',
    loadComponent: () => import('../views/master/division/division.component').then(m => m.DivisionComponent),
    canActivate: []
    },
    {
    path: 'designation',
    loadComponent: () => import('../views/master/designation/designation.component').then(m => m.DesignationComponent),
    canActivate: []
    },
    {
    path: 'add-designation',
    loadComponent: () => import('../views/master/designation/add-designation/add-designation.component').then(m => m.AddDesignationComponent),
    canActivate: []
    },
    {
    path: 'district',
    loadComponent: () => import('../views/master/district/district.component').then(m => m.DistrictComponent),
    canActivate: []
    },
    {
    path: 'district',
    loadComponent: () => import('../views/master/district/district.component').then(m => m.DistrictComponent),
    canActivate: []
    },
    {
    path: 'court-type',
    loadComponent: () => import('../views/master/court-type/court-type.component').then(m => m.CourtTypeComponent),
    canActivate: []
    },
    {
    path: 'add-court-type',
    loadComponent: () => import('../views/master/court-type/add-court-type/add-court-type.component').then(m => m.AddCourtTypeComponent),
    canActivate: []
    },
    {
    path: 'court',
    loadComponent: () => import('../views/master/court/court.component').then(m => m.CourtComponent),
    canActivate: []
    },
    {
    path: 'add-court',
    loadComponent: () => import('../views/master/court/add-court/add-court.component').then(m => m.AddCourtComponent),
    canActivate: []
    },
    {
    path: 'police-range',
    loadComponent: () => import('../views/master/police-range/police-range.component').then(m => m.PoliceRangeComponent),
    canActivate: []
    },
    {
    path: 'police-district',
    loadComponent: () => import('../views/master/police-district/police-district.component').then(m => m.PoliceDistrictComponent),
    canActivate: []
    },
    {
    path: 'police-circle',
    loadComponent: () => import('../views/master/police-circle/police-circle.component').then(m => m.PoliceCircleComponent),
    canActivate: []
    },
    {
    path: 'police-station',
    loadComponent: () => import('../views/master/police-station/police-station.component').then(m => m.PoliceStationComponent),
    canActivate: []
    },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
