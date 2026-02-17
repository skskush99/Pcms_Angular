import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mahila-atayachar-bns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mahila-atayachar-bns.component.html',
  styleUrls: ['./mahila-atayachar-bns.component.scss']
})
export class MahilaAtayacharBnsComponent {

  reportData: any[] = [];
  pagedData: any[] = [];

  currentPage = 1;
  pageSize: any = 10;
  totalPages = 1;

  constructor() {
    this.generateData();
  }

  generateData() {

    const divisions = ['जयपुर संभाग','जोधपुर संभाग','उदयपुर संभाग','कोटा संभाग'];
    const districts = ['जयपुर','जोधपुर','उदयपुर','कोटा'];
    const courts = ['मुख्य न्यायिक मजिस्ट्रेट','अतिरिक्त मुख्य न्यायिक मजिस्ट्रेट'];
    const crimeType = ['498A IPC','दहेज प्रकरण','घरेलू हिंसा','अन्य'];

    for (let i = 1; i <= 50; i++) {

      const previous = 10 + i;
      const filed = 5 + i;
      const transferred = 2 + i;
      const totalPending = previous + filed + transferred;

      const saza = 2 + i;
      const riha = 1 + i;
      const bari = 1;
      const commit = 0;
      const rajinama = 1;
      const transferOut = 1;

      const totalDecided = saza + riha + bari + commit + rajinama + transferOut;
      const endPending = totalPending - totalDecided;

      const convictionPercent = ((saza / totalDecided) * 100).toFixed(2) + '%';
      const disposalPercent = ((totalDecided / totalPending) * 100).toFixed(2) + '%';

      this.reportData.push([
        i,
        divisions[i % divisions.length],
        districts[i % districts.length],
        courts[i % courts.length],
        crimeType[i % crimeType.length],
        previous,
        filed,
        transferred,
        totalPending,
        saza,
        riha,
        bari,
        commit,
        rajinama,
        transferOut,
        totalDecided,
        endPending,
        convictionPercent,
        disposalPercent
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
    link.setAttribute("download", "Mahila_Atyachar_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadPDF() {
    window.print();
  }

}
