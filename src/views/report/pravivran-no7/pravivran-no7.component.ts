import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pravivran-no7',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pravivran-no7.component.html',
  styleUrl: './pravivran-no7.component.css'
})
export class PravivranNo7Component {

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
    const districts = ['जयपुर', 'जोधपुर', 'उदयपुर', 'कोटा', 'बीकानेर'];
    const courts = ['मुख्य न्यायिक मजिस्ट्रेट', 'अतिरिक्त मुख्य न्यायिक मजिस्ट्रेट'];
    const reasons = ['साक्ष्य अनुपलब्ध', 'गवाह अनुपस्थित', 'अन्य कारण'];

    for (let i = 1; i <= 50; i++) {

      const summoned = 15 + i;
      const present = 12 + i;
      const examined = 8 + i;
      const vcWitness = 2 + i;
      const total = examined + vcWitness;
      const released = 1 + (i % 3);
      const bound = 1 + (i % 2);

      this.reportData.push([
        i,
        divisions[i % divisions.length],
        districts[i % districts.length],
        'अभियोजन अधिकारी ' + i,
        courts[i % courts.length],
        summoned,
        present,
        examined,
        vcWitness,
        total,
        released,
        bound,
        reasons[i % reasons.length],
        'विशेष विवरण ' + i
      ]);
    }

    this.updatePagedData();
  }

  updatePagedData() {

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

  downloadExcel() {
    let csvContent = "data:text/csv;charset=utf-8,";
    this.reportData.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "Pravivran_No7_Report.csv";
    link.click();
  }

  downloadPDF() {
    window.print();
  }
}
