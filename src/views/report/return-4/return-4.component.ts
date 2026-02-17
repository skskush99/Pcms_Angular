import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-return-4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './return-4.component.html',
  styleUrls: ['./return-4.component.scss']
})
export class Return4Component {

  reportData: any[] = [];
  pagedData: any[] = [];

  currentPage = 1;
  pageSize: any = 10;
  totalPages = 1;

  constructor() {
    this.generateData();
  }

  generateData() {

    const divisions = ['जयपुर संभाग', 'जोधपुर संभाग', 'उदयपुर संभाग', 'कोटा संभाग'];
    const districts = ['जयपुर', 'जोधपुर', 'उदयपुर', 'कोटा', 'बीकानेर', 'अलवर'];

    for (let i = 1; i <= 50; i++) {

      const disposed = 20 + i;
      const conviction = Math.floor(disposed * 0.55);
      const percentage = ((conviction / disposed) * 100).toFixed(2) + ' %';

      this.reportData.push([
        i,
        divisions[i % divisions.length],
        districts[i % districts.length],
        'अधिकारी ' + i,
        'जिला अभियोजन कार्यालय',
        disposed,
        conviction,
        percentage,
        5 + i,
        2 + i
      ]);
    }

    this.calculatePagination();
  }

  downloadExcel() {
    let csvContent = "data:text/csv;charset=utf-8,";
    this.reportData.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Return4_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadPDF() {
    window.print();
  }


  calculatePagination() {

    if (this.pageSize === 'all') {
      this.totalPages = 1;
      this.currentPage = 1;
      this.pagedData = [...this.reportData];
      return;
    }

    const size = Number(this.pageSize);
    this.totalPages = Math.ceil(this.reportData.length / size);

    // Safety check
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    this.updatePagedData();
  }


  updatePagedData() {

    if (this.pageSize === 'all') {
      this.pagedData = [...this.reportData];
      return;
    }

    const size = Number(this.pageSize);
    const start = (this.currentPage - 1) * size;
    const end = start + size;

    this.pagedData = this.reportData.slice(start, end);
  }


  changePageSize() {
    this.currentPage = 1;
    this.calculatePagination();
  }


  nextPage() {

    if (this.pageSize === 'all') return;

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }


  prevPage() {

    if (this.pageSize === 'all') return;

    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

}
