import {
  Component, OnInit, ViewChild, ElementRef,
  Input, SimpleChanges, OnChanges, OnDestroy, AfterViewInit
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Main Chart Container -->
    <div class="chart-container">
      <canvas #doughnutChart class="cursor-pointer h-[70%] duration-300 hover:scale-[1.02]"></canvas>
    </div>

    <!-- Fullscreen Modal -->
    <div *ngIf="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
      (click)="closeModal()">
      <div class="w-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-xl p-4 overflow-auto"
        (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-gray-900">Case History Details</h3>
          <button class="p-2 text-gray-400 hover:text-gray-500" (click)="closeModal()">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="w-[80%] h-[80%]">
          <canvas #fullscreenChart></canvas>
        </div>
      </div>
    </div>
  `
})
export class DoughnutChartComponent implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('doughnutChart')    private chartRef!: ElementRef;
  @ViewChild('fullscreenChart')  private fullscreenChartRef!: ElementRef;

  private chart: Chart | undefined;
  private fullscreenChart: Chart | undefined;

  isModalOpen = false;
  updatedFilterFields: any;

  @Input() data:              any;
  @Input() categoryWise:      boolean = false;
  @Input() filter:            any;
  @Input() dashboardSearched: boolean = false;

  dashboardFilterFields: any = {
    adminDept:    '0',
    unitDept:     '',
    office:       '',
    mainPerforma: 'Main_Party',
    status:       '0'
  };

  // ===================== LIFECYCLE =====================
  ngAfterViewInit(): void {
    this.chart = this.createChart(this.chartRef);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.updatedFilterFields = changes['filter'].currentValue;
    }
    if (changes['dashboardSearched']) {
      this.dashboardFilterFields = this.updatedFilterFields;
    }
    if (changes['data'] && this.chart) {
      this.chart.destroy();
      this.chart = this.createChart(this.chartRef);
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.fullscreenChart?.destroy();
  }

  // ===================== CHART CREATION =====================
  private createChart(elementRef: ElementRef): Chart {
    const total = this.data?.Total;
    delete this.data?.Total;

    const labelArr: string[] = Object.entries(this.data).map(
      ([key, value]) => `${key} (${value})`
    );
    const data: number[] = Object.values(this.data);

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: labelArr,
        datasets: [{
          data,
          backgroundColor: [
            '#FF0000', '#FFAC1C', '#228B22', '#FFFF80',
            '#C080FF', '#17A2B8', '#FF00BF', '#b8d902', '#af6b1c'
          ],
          borderWidth: 2
        }]
      },
      options: {
        onClick: () => {},
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title:  { display: true, text: '' },
          legend: {
            position: 'top' as const,
            align: 'start',
            labels: {
              boxWidth: 12,
              padding: 10,
              textAlign: 'left',
              color: 'black',
              usePointStyle: false,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value: any = context.raw;
                const percentage = ((value / total) * 100).toFixed(2);
                return `${value} (${percentage}%)`;
              }
            }
          }
        },
        aspectRatio: 1.1
      }
    };

    return new Chart(elementRef.nativeElement, config);
  }

  // ===================== MODAL =====================
  openFullscreen(): void {
    this.isModalOpen = true;
    setTimeout(() => {
      if (this.fullscreenChartRef) {
        this.fullscreenChart = this.createChart(this.fullscreenChartRef);
      }
    }, 100);
  }

  closeModal(): void {
    this.fullscreenChart?.destroy();
    this.isModalOpen = false;
  }
}