import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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

  currentForm : number = 4;
  caseData : any;
  ifCaseRegisterd : boolean = false;
  withoutCaseNoReg: boolean = false;
  ifDecidedFirstHearing : boolean = false;
  prevRoute : string = '';
  ifUpdateAddDecision : boolean = false;
  formsName : string[] = ['Case Identification' , 'FIR & Charge Sheet' , 'Parties' , 'Review & Submit'];
  firstHearing : boolean = false
  firstHearingCaseEntered : boolean = false;
  submitFormClicked : number = 0;
  caseId : number = 0;


  @ViewChild(CaseIdentificationComponent)caseIdentification!: CaseIdentificationComponent;
  @ViewChild(FirChargesSheetComponent)firChargeSheet!: FirChargesSheetComponent;
  @ViewChild(CasePartiesComponent)caseParties!: CasePartiesComponent;
  @ViewChild(CaseReviewSubmitComponent)reviewSubmit!: CaseReviewSubmitComponent;



  
  ngOnInit(): void {



    this.caseData = history.state?.caseData;
    this.prevRoute = history.state?.prevRoute;

    console.log(this.caseData);
    if(this.caseData)this.caseId = this.caseData?.DirRegId;
    
  }


  caseRegistered(caseId : void){
    //console.log(caseId);
    if(!this.caseData) this.caseData = {CaseId : caseId}
    this.ifCaseRegisterd = !this.ifCaseRegisterd
    this.currentForm = 6;
  }



  saveAndNext(caseId ?: any){
    console.log(caseId);
    if(!this.caseId)this.caseId = caseId
    this.currentForm += 1;
    return
    switch (caseId) {
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
    // this.submitFormClicked = 1
    switch (this.currentForm) {
      case 1:
        this.caseIdentification.regCaseIdentification();
        break;
      case 2:
        this.firChargeSheet.addEditChargeSheet();  
        break;
      case 3:
        this.caseParties.regCaseParties();  
        break;
      case 4:
        this.reviewSubmit.submitCaseForm();  
        break;
      default:
        break;  

    }
    // this.currentForm += 1;
  }
}
