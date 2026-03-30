// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-pravivran-no3-k',
//   standalone: true,
//    imports: [CommonModule],
//   templateUrl: './pravivran-no3-k.component.html',
//   styleUrl: './pravivran-no3-k.component.css'
// })

// export class PravivranNo3KComponent {

//   reportData: any[] = [];

//   constructor() {
//     this.generateData();
//   }

//   generateData() {
//     for (let i = 1; i <= 50; i++) {

//       this.reportData.push([
//         i,
//         'जयपुर संभाग',
//         'जयपुर',
//         'श्री अधिकारी नाम',
//         'जिला सत्र न्यायालय',
//         25,
//         10,
//         15,
//         '123/2024 IPC 302',
//         'दोषसिद्धि',
//         '01-01-2024',
//         '15-02-2024',
//         5,
//         4,
//         3,
//         2,
//         'सजा'
//       ]);
//     }
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pravivran-no3-k',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pravivran-no3-k.component.html',
  styleUrls: ['./pravivran-no3-k.component.scss']
})
export class PravivranNo3KComponent {

  reportData: any[] = [];
  pagedData: any[] = [];

  currentPage = 1;
  pageSize: any = 10;
  totalPages = 1;

  constructor() {
    this.generateData();
    this.updatePagination();
  }

  generateData() {
    for (let i = 1; i <= 50; i++) {
      this.reportData.push([
        i,
        'जयपुर संभाग',
        'जयपुर',
        'श्री अधिकारी नाम',
        'जिला सत्र न्यायालय',
        25,
        10,
        15,
        '123/2024 IPC 302',
        'दोषसिद्धि',
        '01-01-2024',
        '15-02-2024',
        5,
        4,
        3,
        2,
        'सजा'
      ]);
    }
  }

  updatePagination() {

    if (this.pageSize === 'all') {
      this.pagedData = [...this.reportData];
      this.totalPages = 1;
      this.currentPage = 1;
      return;
    }

    const size = Number(this.pageSize);
    this.totalPages = Math.ceil(this.reportData.length / size);

    const start = (this.currentPage - 1) * size;
    const end = start + size;

    this.pagedData = this.reportData.slice(start, end);
  }

  changePageSize() {
    this.currentPage = 1;
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  downloadExcel() {
    const headers = [
      'क्रम संख्या','संभाग','जिला','अधिकारी','न्यायालय',
      'कथित मुकदमे','निष्पादित','लम्बित',
      'मुकदमा नं','निर्णय प्रकार','प्रभार तिथि','आरोप तिथि',
      'अभि.गवाह कुल','अभि.गवाह बयान','बचाव गवाह कुल','बचाव जिरह','परिणाम'
    ];

    let csv = '\uFEFF' + headers.join(',') + '\n';

    this.reportData.forEach(row => {
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Pravivran_No3_K_Report.csv';
    link.click();
  }

  downloadPDF() {
    window.print();
  }
}
