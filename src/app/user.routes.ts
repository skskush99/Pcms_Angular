import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

export const routes: Routes = [

    {
        path : 'permission-mapping-list',
        loadComponent : () => import('../views/list-page-admin/list-page-admin.component').then(m => m.ListPageAdminComponent),
        canActivate : []
    },
    {
        path : 'user-menu-permissiong',
        loadComponent : () => import('../views/user-menu-mapping/user-menu-mapping.component').then(m => m.UserMenuMappingComponent),
        canActivate : []
    },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }