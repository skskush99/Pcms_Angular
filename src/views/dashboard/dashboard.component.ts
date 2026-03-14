import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../shared/services/notification.service';
import { DropdownListInterface } from '../shared/model/shared.model';
import { DoughnutChartComponent } from './doughnut-chart.component';
import constants from '../shared/utils/constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DoughnutChartComponent,
    TranslateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('onOff', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  // ===================== STATE =====================
  roleId:                number  = 0;
  mainPerformaSearchType: string = 'Main Party';
  isDashboardSearched:   boolean = false;
  selectedReport:        string | number = '';
  showDashboardFilters:  boolean = false;
  showCharts:            boolean = false;
  showPendingReports:    boolean = false;
  currentHearingTab:     number  = 0;

  // ===================== DROPDOWNS (mock data) =====================
  adminDropdown: DropdownListInterface[] = [
    { text: 'Agriculture Department',    value: '1' },
    { text: 'Finance Department',        value: '2' },
    { text: 'Public Health Department',  value: '3' },
    { text: 'School Education Department', value: '4' }
  ];

  officeDropdown: DropdownListInterface[] = [
    { text: 'Additional Director Agri. Extension Jodhpur Division', value: '1' },
    { text: 'Assistant Director Horticulture Ajmer',                 value: '2' },
    { text: 'ADDL COMM Jodhpur',                                     value: '3' },
    { text: 'HQ/MISC.',                                              value: '4' }
  ];

  // ===================== DASHBOARD DATA =====================
  dashboardDetails: any = {
    casePriorityWiseData: { Red: '40927', Orange: '90862', Green: '209784' },
    caseCourtWiseData:    { DIstrictCourt: '35475', NationalGreenTribunalCourt: 167, TribunalCourts: 4452, OtherThanDistrictCourts: 18644 }
  };

  // ===================== FILTER FORM =====================
  dashboardFilterForm: FormGroup = new FormGroup({
    adminDept:   new FormControl('', { nonNullable: true }),
    unitDept:    new FormControl('', { nonNullable: true }),
    office:      new FormControl('', { nonNullable: true }),
    mainPerforma: new FormControl('Main_Party', { nonNullable: true }),
    status:      new FormControl('0', { nonNullable: true })
  });

  notify = inject(NotificationService);

  // ===================== LIFECYCLE =====================
  ngOnInit(): void {}

  // ===================== FILTER TOGGLE =====================
  toggleDashFilters() {
    this.showDashboardFilters = !this.showDashboardFilters;
  }

  // ===================== REPORT =====================
  openReport() {
    if (!this.selectedReport) {
      this.notify.showNotification('info', constants.noReportSelected);
      return;
    }
  }

  // ===================== SEARCH =====================
  searchDashBoardDetails() {
    this.isDashboardSearched = true;
  }

  // ===================== CHARTS TOGGLE =====================
  toggleCharts() {
    this.showCharts = !this.showCharts;
    if (this.showCharts) {
      setTimeout(() => {
        const element = document.getElementById('charts');
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth', left: 0 });
    }
  }
}