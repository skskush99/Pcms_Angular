import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-format-a',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './format-a.component.html',
  styleUrls: ['./format-a.component.scss']
})
export class FormatAComponent {

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

      const closure = 5 + i;
      const pendingPolice = 10 + i;
      const chargesheet = 15 + i;
      const totalFIR = closure + pendingPolice + chargesheet;

      const judgement = Math.floor(chargesheet * 0.6);
      const pendingCourt = chargesheet - judgement;

      const conviction = Math.floor(judgement * 0.5);
      const acquitted = judgement - conviction;

      this.reportData.push([
        i,
        divisions[i % divisions.length],
        districts[i % districts.length],
        totalFIR,
        closure,
        pendingPolice,
        chargesheet,
        judgement,
        pendingCourt,
        conviction,
        acquitted
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


  downloadExcel() {
    let csvContent = "data:text/csv;charset=utf-8,";

    this.reportData.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "FormatA_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadPDF() {
    window.print();
  }


  updatePagedData() {

  if (this.pageSize === 'all') {
    this.pagedData = [...this.reportData];
    this.totalPages = 1;
    return;
  }

  const size = Number(this.pageSize);

  this.totalPages = Math.ceil(this.reportData.length / size);

  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages;
  }

  if (this.currentPage < 1) {
    this.currentPage = 1;
  }

  const start = (this.currentPage - 1) * size;
  const end = start + size;

  this.pagedData = this.reportData.slice(start, end);
}


changePageSize() {
  this.currentPage = 1;
  this.updatePagedData();
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
}
