import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../shared/services/notification.service';
import { DropdownListInterface } from '../shared/model/shared.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import constants from '../shared/utils/constants';
import { DoughnutChartComponent } from "./doughnut-chart.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, DoughnutChartComponent , TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
   
      trigger('onOff' , [
      transition(':enter', [
        style({
          transform: 'translateY(-100%)', 
          opacity: 0, 
          // height : '0px'
        }),

        animate('500ms ease-out', style({
          transform: 'translateY(0%)', 
          opacity: 1, 
          // height : '*'
        }))
      ]),
      
      transition(':leave', [
        animate('500ms ease-out', style({
          transform: 'translateY(-100%)', 
          opacity: 0, 
        }))
      ])
    ])


    // trigger('onOff', [
    //   transition(':enter', [
    //     style({
    //       transform: 'translateY(-100%)',
    //       opacity: 0,
    //       height: '0px',  // Start with zero height
    //       // overflow: 'hidden',
    //     }),
    //     animate('500ms ease-out', style({
    //       transform: 'translateY(0%)',
    //       opacity: 1,
    //       height: '*',  // Animate to its natural height
    //     }))
    //   ]),
    
    //   transition(':leave', [
    //     animate('500ms ease-out', style({
    //       transform: 'translateY(-100%)',
    //       opacity: 0,
    //       height: '0px',  // Animate the height to zero as it disappears
    //     }))
    //   ])
    // ])
  
   
    ]
})
export class DashboardComponent implements OnInit{

  currentTable: string = 'Court Wise';
  pendingReportDateWise: any;
  pendingDistrictWiseReport: any;
  pendingDepartmentWiseReport: any;
  pendingOfficeWiseReport: any;
  // dashboardDetails: any;
  // hearingLast7DaysList : any[] = [];
  // hearingNextMonthList : any[] = [];
  // hearingCourtWiseList : any[] = [];
  // hearingDistrictWiseList : any[] = [];
  // hearingOfficeWiseList : any[] = [];
  roleId : number = 0;
  mainPerformaSearchType : string = 'Main Party';
  isDashboardSearched : boolean = false;
  selectedReport : string | number = '';
  showDashboardFilters : boolean = false;
  showCharts : boolean = false;
  adminDropdown : DropdownListInterface[] = [
    // {text : '--All-' , value : ''},
    {text : 'Agriculture Department' , value : '1'},
    {text : 'Finance Department ' , value : '2'},
    {text : 'Public Health Department' , value : '3'},
    {text : 'School Education Department' , value : '4'},
  ];
  unitDropdown : DropdownListInterface[] = [
    // {text : '--All-' , value : ''},
    {text : 'Agriculture Department , Jaipur' , value : '1'},
    {text : 'Horticulture Department' , value : '2'},
    {text : 'Excise Department , Udaipur' , value : '3'},
    {text : 'Physical Education' , value : '4'},
  ];
  officeDropdown : DropdownListInterface[] = [
    // {text : '--All-' , value : ''},
    {text : 'Additional Director Agri. Extension Jodhpur Division' , value : '1'},
    {text : 'Assistant Director Horticulture Ajmer' , value : '1'},
    {text : 'ADDL COMM Jodhpur' , value : '1'},
    {text : 'HQ/MISC.' , value : '1'},
  ];
  // adminDropdown : DropdownListInterface[] = [];
  showPendingReports : boolean = false;
  dashBoardDropdownLink : any[] =  [];
  currentHearingTab : number = 0;

  notify = inject(NotificationService);



  dashboardDetails : any = {
    casePriorityWiseData : {Red : '40927' , Orange : '90862', Green: '209784' ,
  },
    caseCourtWiseData : {DIstrictCourt : '35475' , NationalGreenTribunalCourt : 167 , TribunalCourts : 4452 , OtherThanDistrictCourts : 18644}
  }

  dashboardFilterForm : FormGroup = new FormGroup({
    adminDept : new FormControl('' , {nonNullable : true}),
    unitDept : new FormControl('' , {nonNullable : true}),
    office : new FormControl('' , {nonNullable : true}),
    mainPerforma : new FormControl('Main_Party' , {nonNullable : true}),
    status : new FormControl('0' , {nonNullable : true}),
  })


  ngOnInit(): void {
  }




  toggleDashFilters(){
    this.showDashboardFilters = !this.showDashboardFilters
  }


  openReport(){
    if(!this.selectedReport){
      this.notify.showNotification('info' , constants.noReportSelected);
      return
    }

  }



  searchDashBoardDetails(){

  }


  toggleCharts(){
    this.showCharts = !this.showCharts
    if(this.showCharts){
      setTimeout(() => {
        const element = document.getElementById('charts');
        element?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 0);
    }else {
      window.scrollTo({
          top : 0 , behavior : 'smooth' , left : 0
        })
    }
  }



}
