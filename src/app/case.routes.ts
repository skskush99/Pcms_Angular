import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

export const routes: Routes = [

    {
       path : 'case-registration',
       loadComponent : () => import('../views/case/case-reg-stepper/case-reg-stepper.component').then(m => m.CaseRegStepperComponent)
    },
    {
       path : 'complaint-register',
       loadComponent : () => import('../views/case/complain-register/complain-register.component').then(m => m.ComplainRegisterComponent)
    }


]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseRoutingModule { }