import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReportRow {
  serial: number;
  division: string;
  district: string;
  crimeType: string;
  r1: number; r2: number; r3: number; r4: number; r5: number;
  r6: number; r7: number; r8: number; r9: number; r10: number;
  r11: number; r12: number;
  review: number;
  total: number;
}

@Component({
  selector: 'app-pravivran-no2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pravivran-no2.component.html',
  styleUrls: ['./pravivran-no2.component.scss']
})
export class PravivranNo2Component {

  reportData: ReportRow[] = Array.from({ length: 100 }, (_, i) => {

    const r1 = (i % 3) + 1;
    const r2 = (i % 4) + 1;
    const r3 = (i % 5) + 1;
    const r4 = (i % 2) + 1;
    const r5 = (i % 3) + 2;
    const r6 = (i % 4) + 1;
    const r7 = (i % 5) + 1;
    const r8 = (i % 3) + 1;
    const r9 = (i % 2) + 1;
    const r10 = (i % 4) + 1;
    const r11 = (i % 3) + 1;
    const r12 = (i % 2) + 1;
    const review = (i % 2);

    const total =
      r1+r2+r3+r4+r5+r6+r7+r8+r9+r10+r11+r12+review;

    return {
      serial: i + 1,
      division: ['अजमेर', 'जयपुर द्वितीय', 'उदयपुर', 'कोटा', 'जोधपुर'][i % 5],
      district: ['अजमेर', 'अलवर', 'बांसवाड़ा', 'बाराँ', 'बाड़मेर'][i % 5],
      crimeType: ['संज्ञेय अपराध', 'महिला अपराध', 'सामान्य अपराध', 'आर्थिक अपराध'][i % 4],
      r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,
      review,
      total
    };
  });

  // ===== PAGINATION =====
  currentPage = 1;
  pageSize: any = 10;
  totalPages = 1;
  pagedData: ReportRow[] = [];

  constructor() {
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

  // ===== EXCEL DOWNLOAD =====
  downloadExcel() {
    let csv = '';
    this.reportData.forEach(row => {
      csv += Object.values(row).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'pravivran-no2.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  // ===== PDF =====
  downloadPDF() {
    window.print();
  }

}
