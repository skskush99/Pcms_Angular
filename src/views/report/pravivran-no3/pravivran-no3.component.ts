import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pravivran-no3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pravivran-no3.component.html',
  styleUrl: './pravivran-no3.component.scss'
})
export class PravivranNo3Component {

  // ===== DATA (UNCHANGED) =====
  reportData = Array.from({ length: 100 }, (_, i) => ({

    serial: i + 1,
    division: ['जयपुर', 'जोधपुर', 'उदयपुर', 'कोटा', 'बीकानेर'][i % 5] + ' संभाग',
    district: ['जयपुर', 'जोधपुर', 'उदयपुर', 'कोटा', 'सीकर'][i % 5],
    officer: 'अभियोजन अधिकारी ' + (i + 1),
    court: ['जिला सत्र न्यायालय', 'विशेष न्यायालय', 'सीजेएम न्यायालय'][i % 3],

    recReview: ['उत्कृष्ट', 'संतोषजनक', 'उचित'][i % 3],
    recLogic: ['उचित', 'संतोषजनक', 'कमजोर'][i % 3],
    recVT: ['पूर्ण', 'आंशिक', 'अपूर्ण'][i % 3],

    levelAbove: (i % 5) + 1,
    levelAvgReview: (i % 4) + 1,
    levelAvgLogic: (i % 3) + 1,
    levelAvgVT: (i % 6) + 1,
    levelBelow: (i % 2) + 1,

    remarks: ['उत्कृष्ट कार्य', 'सामान्य प्रदर्शन', 'सुधार आवश्यक'][i % 3]

  }));


  // ===== PAGINATION =====
  currentPage = 1;
  pageSize: any = 10;
  totalPages = 1;
  pagedData: any[] = [];

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
    a.download = 'pravivran-no3.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  }


  // ===== PDF PRINT =====
  downloadPDF() {
    window.print();
  }

}
