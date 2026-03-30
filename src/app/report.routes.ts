import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

export const routes: Routes = [

    {
    path: 'prosecution-return-no1',
    loadComponent: () => import('../views/report/prosecution-return-no1/prosecution-return-no1.component').then(m => m.ProsecutionReturnNo1Component),
    canActivate: []
    },
    {
    path: 'pravivran-no2',
    loadComponent: () => import('../views/report/pravivran-no2/pravivran-no2.component').then(m => m.PravivranNo2Component),
    canActivate: []   
    },{
    path: 'pravivran-no3',
    loadComponent: () => import('../views/report/pravivran-no3/pravivran-no3.component').then(m => m.PravivranNo3Component),
    canActivate: []    
    },{
    path: 'pravivran-no3-k',
    loadComponent: () => import('../views/report/pravivran-no3-k/pravivran-no3-k.component').then(m => m.PravivranNo3KComponent),
    canActivate: []   
    },{
    path: 'pravivran-no3-kha',
    loadComponent: () => import('../views/report/pravivran-no3-kha/pravivran-no3-kha.component').then(m => m.PravivranNo3KhaComponent),    
    },{
    path: 'pravivran-no7',  
    loadComponent: () => import('../views/report/pravivran-no7/pravivran-no7.component').then(m => m.PravivranNo7Component),
    canActivate: []
    },{
    path: 'mahila-atayachar-bns',
    loadComponent: () => import('../views/report/mahila-atayachar-bns/mahila-atayachar-bns.component').then(m => m.MahilaAtayacharBnsComponent),
    canActivate: []
    },{
    path: 'return-4',   
    loadComponent: () => import('../views/report/return-4/return-4.component').then(m => m.Return4Component),
    canActivate: []
    },{
    path: 'format-a',
    loadComponent: () => import('../views/report/format-a/format-a.component').then(m => m.FormatAComponent),
    canActivate: []
    },{
    path: 'format-b',
    loadComponent: () => import('../views/report/format-b/format-b.component').then(m => m.FormatBComponent),
    canActivate: []
    },     
    
    
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }



