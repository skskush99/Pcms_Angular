import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

export const routes: Routes = [

  {
    path: 'case-list',
    loadComponent: () => import('../views/case/case-list/case-list.component').then(m => m.CaseListComponent)
  },
  {
    path: 'case-registration',
    loadComponent: () => import('../views/case/case-reg-stepper/case-reg-stepper.component').then(m => m.CaseRegStepperComponent)
  },
  {
    path: 'complaint-register',
    children: [

      {
        path: '',
        loadComponent: () =>
          import('../views/case/complain-register/complain-register.component')
            .then(m => m.ComplainRegisterComponent)
      },

      {
        path: 'complain-register-details',
        loadComponent: () =>
          import('../views/case/complain-register/complain-register-details/complain-register-details.component')
            .then(m => m.ComplainRegisterDetailsComponent)
      }

    ]
  },
  {
    path: 'cash-disposal',
    loadComponent: () => import('../views/case/cash-disposal/cash-disposal.component').then(m => m.CashDisposalComponent)
  },
  {
    path: 'cash-disposal-registration',
    loadComponent: () => import('../views/case/cash-disposal/cash-dis-stepper/cash-dis-stepper.component').then(m => m.CashDisStepperComponent)
  },

  //  {
  //     path : 'complaint-register',
  //     loadComponent : () => import('../views/case/complain-register/complain-register.component').then(m => m.ComplainRegisterComponent)
  //  },
  //   {
  //    path : 'complain-register-details',
  //     loadComponent : () => import('../views/case/complain-register/complain-register-details/complain-register-details.component').then(m => m.ComplainRegisterDetailsComponent)
  //  },


]




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseRoutingModule { }