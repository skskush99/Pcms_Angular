import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CaseIdentificationComponent } from "../case-identification/case-identification.component";
import { FirChargesSheetComponent } from "../fir-charges-sheet/fir-charges-sheet.component";
import { CasePartiesComponent } from "../case-parties/case-parties.component";
import { CaseReviewSubmitComponent } from "../case-review-submit/case-review-submit.component";

@Component({
  selector: 'app-case-reg-stepper',
  standalone: true,
  imports: [CommonModule, CaseIdentificationComponent, FirChargesSheetComponent, CasePartiesComponent, CaseReviewSubmitComponent],
  templateUrl: './case-reg-stepper.component.html',
  styleUrl: './case-reg-stepper.component.css'
})
export class CaseRegStepperComponent {

  currentForm : number = 1;
  caseData : any;
  ifCaseRegisterd : boolean = false;
  withoutCaseNoReg: boolean = false;
  ifDecidedFirstHearing : boolean = false;
  prevRoute : string = '';
  ifUpdateAddDecision : boolean = false;
  formsName : string[] = ['Case Identification' , 'FIR & Charge Sheet' , 'Parties' , 'Review & Submit'];
  firstHearing : boolean = false
  firstHearingCaseEntered : boolean = false;
  ngOnInit(): void {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    this.caseData = history.state?.caseData;
    this.withoutCaseNoReg = history.state?.withoutCaseNoReg;
    this.ifDecidedFirstHearing =  history.state?.ifDecidedFirstHearing;
    this.prevRoute = history.state?.prevRoute;
    this.ifUpdateAddDecision = history.state?.addEditDecision;
    this.firstHearing = history.state?.firstHearing;
    // if(this.ifUpdateAddDecision)this.currentForm = 5;
    if(this.ifUpdateAddDecision)this.firstHearingCaseEntered = true;

    //console.log(this.withoutCaseNoReg);
    
    
  }


  caseRegistered(caseId : void){
    //console.log(caseId);
    if(!this.caseData) this.caseData = {CaseId : caseId}
    this.ifCaseRegisterd = !this.ifCaseRegisterd
    this.currentForm = 6;
  }



  saveAndNext(type : string){
    if(this.firstHearingCaseEntered && type == 'lawyer'){
      this.currentForm = 5;
      return
    }
    switch (type) {
      case 'appalent':
        this.currentForm = 7
        break;
      case 'respondent':
        //console.log('-----erererer respondednt');
        
        if(this.firstHearingCaseEntered)this.currentForm = 4
        else this.currentForm = 2  
        break;
      case 'lawyer' :
        this.currentForm = 3;
        break;
      case 'oic' :
        this.currentForm = 4
        break;
      case 'hearing':
        this.currentForm = 5
        break;      
      default:
        break;
    }
  }

  backToStep(type : string){
    if(this.firstHearingCaseEntered && type == 'lawyer'){
      this.currentForm = 5;
      return
    }
    switch (type) {
      case 'appalent':
        this.currentForm = 1
        break;
      case 'respondent':        
        if(this.firstHearingCaseEntered)this.currentForm = 4
        else this.currentForm = 6
        break;
      case 'lawyer' :
        this.currentForm = 7;
        break;
      case 'oic' :
        this.currentForm = 2
        break;
      case 'hearing':
        this.currentForm = 3
        break;      
      default:
        break;
    }
  }


  decision1stHearingEntered(if1stHearing : boolean){
    this.firstHearingCaseEntered = if1stHearing
  }



  toggleForm(formNo : number){
    this.currentForm = formNo;
  }


  withouCaseNoRegistered(params : boolean){
    this.withoutCaseNoReg = true
  }

  formPrev(){
   this.currentForm -= 1;
  }
  
  
  formNext(){
   this.currentForm += 1;
  }
}
