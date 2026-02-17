import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prosecution-return-no1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prosecution-return-no1.component.html',
  styleUrls: ['./prosecution-return-no1.component.scss']
})
export class ProsecutionReturnNo1Component {

  reportData: any[] = [];

  // ===== PAGINATION =====
  currentPage = 1;
  pageSize: any = 10;
  totalPages = 1;
  pagedData: any[] = [];

  constructor() {

    for (let i = 1; i <= 100; i++) {

      const previous = 100 + i * 5;
      const newCases = 40 + i * 2;
      const transferred = 10 + i;

      const privateComp = 5 + i;
      const govtComp = 8 + i;
      const complaintTotal = privateComp + govtComp;

      const frFiled = 12 + i;
      const frAccepted = 10 + i;

      const released = 6 + i;
      const commit = 4 + i;

      const sentence = 3 + i;
      const probation = 2 + i;

      const acquitted = 5 + i;
      const compromise = 2;
      const withdrawn = 1;
      const sec299 = 0;
      const others = 1;
      const transferOut = 2;

      const disposalTotal =
        released + commit + sentence + probation +
        acquitted + compromise + withdrawn +
        sec299 + others + transferOut;

      const pendingEnd =
        previous + newCases - disposalTotal;

      this.reportData.push([
        i,
        'जयपुर संभाग',
        'जयपुर',
        'अभियोजन अधिकारी',
        'मुख्य न्यायिक मजिस्ट्रेट',
        'संज्ञेय अपराध',

        previous,
        newCases,
        transferred,

        privateComp,
        govtComp,
        complaintTotal,

        frFiled,
        frAccepted,

        released,
        commit,

        sentence,
        probation,

        acquitted,
        compromise,
        withdrawn,
        sec299,
        others,
        transferOut,

        disposalTotal,

        20, 15, 10, 5,
        pendingEnd,
        100,
        65,
        75
      ]);
    }

    this.updatePagedData();
  }

  updatePagedData() {

    if (this.pageSize === 'all') {
      this.pagedData = this.reportData;
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

  changePageSize() {
    this.currentPage = 1;
    this.updatePagedData();
  }

  // ===== EXCEL EXPORT =====
  downloadExcel() {

    let csvContent = '';

    this.reportData.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'prosecution-return-no1.csv';
    link.click();

    URL.revokeObjectURL(url);
  }

  // ===== PDF (Print View) =====
  downloadPDF() {
    window.print();
  }

}
