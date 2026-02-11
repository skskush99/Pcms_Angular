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
    {
    path: 'crime-classification',
    loadComponent: () => import('../views/master/crime-classification/crime-classification.component').then(m => m.CrimeClassificationComponent),
    canActivate: []
    },
    {
    path: 'add-crime-classification',
    loadComponent: () => import('../views/master/crime-classification/add-crime-classification/add-crime-classification.component').then(m => m.AddCrimeClassificationComponent),
    canActivate: []
    },
    {
    path: 'crime-act',
    loadComponent: () => import('../views/master/crime-act/crime-act.component').then(m => m.CrimeActComponent),
    canActivate: []
    },
    {
    path: 'add-crime-act',
    loadComponent: () => import('../views/master/crime-act/add-crime-act/add-crime-act.component').then(m => m.AddCrimeActComponent),
    canActivate: []
    },
    {
    path: 'crime-sub-act',
    loadComponent: () => import('../views/master/crime-sub-act/crime-sub-act.component').then(m => m.CrimeSubActComponent),
    canActivate: []
    },
    {
    path: 'add-crime-sub-act',
    loadComponent: () => import('../views/master/crime-sub-act/add-crime-sub-act/add-crime-sub-act.component').then(m => m.AddCrimeSubActComponent),
    canActivate: []
    },
    {
    path: 'fir-status',
    loadComponent: () => import('../views/master/fir-status/fir-status.component').then(m => m.FirStatusComponent),
    canActivate: []
    },
    {
    path: 'add-fir-status',
    loadComponent: () => import('../views/master/fir-status/add-fir-status/add-fir-status.component').then(m => m.AddFirStatusComponent),
    canActivate: []
    },
    {
    path: 'nodal-officer',
    loadComponent: () => import('../views/master/nodal-officer/nodal-officer.component').then(m => m.NodalOfficerComponent),
   
    canActivate: []
    },
    {
    path: 'add-nodal-officer',
    loadComponent: () => import('../views/master/nodal-officer/add-nodal-officer/add-nodal-officer.component').then(m => m.AddNodalOfficerComponent),
    canActivate: []
    },
    
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
