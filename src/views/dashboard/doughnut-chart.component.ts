import { Component, OnInit, ViewChild, ElementRef, Input, inject, SimpleChanges, OnChanges } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { registerables } from 'chart.js';
// import { MatDialog } from '@angular/material/dialog';
// import { PriorityWiseReportComponent } from './priority-wise-report/priority-wise-report.component';
Chart.register(...registerables);
// (click)="openFullscreen()"
@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<!-- Main Chart Container -->
  <div class="chart-container">
    <canvas #doughnutChart 
      class="cursor-pointer h-[70%]  duration-300 hover:scale-[1.02]" 
      >
    </canvas>
  </div>
  
  <!-- Modal with Overlay -->
  <div *ngIf="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
    (click)="closeModal()">
    
    <!-- Modal Content -->
    <div class="w-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-xl p-4 overflow-auto"
         (click)="$event.stopPropagation()">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-900">
          Case History Details
        </h3>
        <button 
          class="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
          (click)="closeModal()">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Modal Body -->
      <div class="w-[80%] h-[80%]">
        <canvas #fullscreenChart></canvas>
      </div>
    </div>
  </div>`
  })
  export class DoughnutChartComponent implements OnChanges{


    @ViewChild('doughnutChart') private chartRef!: ElementRef;
    @ViewChild('fullscreenChart') private fullscreenChartRef!: ElementRef;
    private chart: Chart | undefined;
    private fullscreenChart: Chart | undefined;
    isModalOpen = false;;
    updatedFilterFields : any;


    


    // dialog = inject(MatDialog);
    @Input() data : any;
    @Input() categoryWise : boolean = false;
    @Input() filter : any;
    @Input() dashboardSearched : boolean = false;

    dashboardFilterFields : any= {
      "adminDept": "0",
      "unitDept": "",
      "office": "",
      "mainPerforma": "Main_Party",
      "status": "0"
  }

    ngOnInit(): void {
      console.log(this.data);
      console.log(this.filter);
      
    }
  
    ngAfterViewInit(): void {
      this.chart = this.createChart(this.chartRef);
    }


    ngOnChanges(changes: SimpleChanges): void {

      console.log(changes);

      if(changes['filter']){
        this.updatedFilterFields = changes['filter'].currentValue
      }
      if(changes['dashboardSearched'])this.dashboardFilterFields = this.updatedFilterFields  
      if (changes['data']) {
        
        if (this.chart) {
          this.chart.destroy();
          this.chart = this.createChart(this.chartRef)

        } 
      }
        
      
    }










    private createChart(elementRef: ElementRef): Chart {
      let total = this.data?.Total;
      delete this.data?.Total
      let labels : string[] = Object.keys(this.data)
      // to show value infront of name 
      let labelArr = [];
      let dataArr : any = [];
     labelArr =  Object.entries(this.data).map(
        ([key, value]) => `${key} (${value})`
      );
     dataArr =  Object.entries(this.data).map(
        ([key, value]) => `${value} (${(((value as number) * 100) / total).toFixed(2)})`
      );
      let data : number[] = Object.values(this.data)
      
      const config: ChartConfiguration = {
        
        type: 'doughnut', // Set chart type to 'doughnut'
        
        data: {
          labels: labelArr, // Categories in the doughnut chart
          datasets: [{
            // label: 'My Doughnut Chart',
            // data: [this.data?.Red, this.data?.Orange, this.data?.Green], 
            data : data,
            backgroundColor: ['#FF0000', '#FFAC1C', '#228B22' , '#FFFF80' , '#C080FF' , '#17A2B8' , '#FF00BF' , '#b8d902' , '#af6b1c'], // Color for each section
            borderWidth: 2, // No border around each section
            
          }]
        },
        options: {
          onClick : (e , elements) => {
            // if(this.categoryWise)this.openDialog(labels[elements[0].index])
          },
          responsive: true,

          maintainAspectRatio: true, // Adjust this if you want the chart to scale correctly in the modal
          plugins: {
            title: {
              display: true,
              text: '' // Chart title
            },
            legend: {
              position: 'top' as const,
              align : 'start',
              labels: {
                boxWidth: 12,
                padding: 10,
                textAlign: 'left',
                color : 'black',
                usePointStyle: false, // Optional: use circular or square indicators
                font : {
                  size : 12,
                  
                }
              },
              
              
            },
            tooltip : {
              callbacks : {
                label : (context) => {
                  const value : any = context.raw;
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${value} (${percentage}%)`;
                }
              }
            },
            
            
          
            
          },
          
         aspectRatio : 1.1
        //   cutout: '70%', 
        //   rotation: 0, 
        //   circumference: 2 * Math.PI 
        },

        
      };
  
      return new Chart(
        elementRef.nativeElement,
        config
      );
    }
  
    openFullscreen(): void {
      this.isModalOpen = true;
      // Wait for the modal to be rendered
      setTimeout(() => {
        if (this.fullscreenChartRef) {
          this.fullscreenChart = this.createChart(this.fullscreenChartRef);
        }
      }, 100); // Added a longer timeout to ensure modal rendering
    }
  
    closeModal(): void {
      if (this.fullscreenChart) {
        this.fullscreenChart.destroy();
      }
      this.isModalOpen = false;
    }


    // openDialog(e : any) : any {
    //   this.dashboardFilterFields.priority = e
    //   this.dialog.open(PriorityWiseReportComponent , {
    //     height : 'auto',
    //     width : 'auto',
    //     data : this.dashboardFilterFields
    //   })
    // }
  
    ngOnDestroy(): void {
      if (this.chart) {
        this.chart.destroy();
      }
      if (this.fullscreenChart) {
        this.fullscreenChart.destroy();
      }
    }


    
  }

    
  
  





