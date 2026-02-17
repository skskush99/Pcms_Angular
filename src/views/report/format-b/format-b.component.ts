import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-format-b',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './format-b.component.html',
  styleUrls: ['./format-b.component.scss']
})
export class FormatBComponent {

  reportData: any[] = [];
  pagedData: any[] = [];

  currentPage = 1;
  pageSize: any = 10;
  totalPages = 1;

  constructor() {
    this.loadData();
  }

  loadData() {
    const divisions = ['जयपुर संभाग', 'जोधपुर संभाग', 'उदयपुर संभाग', 'कोटा संभाग'];
    const districts = ['जयपुर', 'जोधपुर', 'उदयपुर', 'कोटा', 'बीकानेर', 'अलवर'];

    for (let i = 1; i <= 40; i++) {
      this.reportData.push([
        i,
        divisions[i % divisions.length],
        districts[i % districts.length],
        'Model Code of Conduct Violation',
        'IPC 171B, 188 IPC',
        '3 Accused',
        'Under Investigation (Col 4)',
        'Charge-sheet Pending'
      ]);
    }

    this.calculatePagination();
  }

  calculatePagination() {
    if (this.pageSize === 'all') {
      this.totalPages = 1;
      this.currentPage = 1;
      this.pagedData = [...this.reportData];
    } else {
      this.totalPages = Math.ceil(this.reportData.length / Number(this.pageSize));
      this.currentPage = 1;
      this.updatePagedData();
    }
  }

  updatePagedData() {
    if (this.pageSize === 'all') {
      this.pagedData = [...this.reportData];
      return;
    }

    const start = (this.currentPage - 1) * Number(this.pageSize);
    const end = start + Number(this.pageSize);
    this.pagedData = this.reportData.slice(start, end);
  }

  changePageSize() {
    this.calculatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

  downloadExcel() {
    let csvContent = "data:text/csv;charset=utf-8,";

    this.reportData.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "FormatB_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadPDF() {
    window.print();
  }
}
