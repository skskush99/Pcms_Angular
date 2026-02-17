import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pravivran-no3-kha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pravivran-no3-kha.component.html',
  styleUrl: './pravivran-no3-kha.component.css'
})
export class PravivranNo3KhaComponent {

  /* ================= PAGINATION VARIABLES ================= */

  currentPage: number = 1;
  pageSize: any = 10;
  totalPages: number = 1;
  pagedData: any[] = [];

  constructor() {
    this.updatePagination();
  }

  /* ================= PAGINATION LOGIC ================= */

  updatePagination() {

    if (this.pageSize === 'all') {
      this.pagedData = [...this.reportData];
      this.totalPages = 1;
      return;
    }

    const size = Number(this.pageSize);
    this.totalPages = Math.ceil(this.reportData.length / size);

    const startIndex = (this.currentPage - 1) * size;
    const endIndex = startIndex + size;

    this.pagedData = this.reportData.slice(startIndex, endIndex);
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

  /* ================= EXCEL DOWNLOAD ================= */

  downloadExcel() {

    const headers = [
      'क्रम संख्या',
      'संभाग का नाम',
      'जिले का नाम',
      'अभियोजन अधिकारी का नाम',
      'न्यायालय का नाम',
      'थाना, अभियोग संख्या व धारायें',
      'निर्णय की दिनांक',
      'अपील अनुशंषा दिनांक',
      'अपील का आधार',
      'विशेष विवरण'
    ];

    const rows = this.reportData.map(row => [
      row.serial,
      row.division,
      row.district,
      row.officer,
      row.court,
      row.caseDetails,
      row.judgementDate,
      row.appealDate,
      row.appealGround,
      row.remarks
    ].join(','));

    const csvContent =
      '\uFEFF' +
      headers.join(',') + '\n' +
      rows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Pravivran_No3_Kha.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ================= PDF DOWNLOAD ================= */

  downloadPDF() {
    window.print();
  }

  /* ================= FULL DATA ================= */

  reportData = [
    {
      serial: 1,
      division: 'जयपुर संभाग',
      district: 'जयपुर',
      officer: 'श्री राजेश शर्मा',
      court: 'जिला एवं सत्र न्यायालय जयपुर',
      caseDetails: 'थाना मानसरोवर, अपराध संख्या 45/2024, धारा 420 IPC',
      judgementDate: '12-01-2025',
      appealDate: '25-01-2025',
      appealGround: 'साक्ष्य के गलत मूल्यांकन के आधार पर',
      remarks: 'राज्य स्तर पर स्वीकृति हेतु भेजा गया'
    },
    {
      serial: 2,
      division: 'जोधपुर संभाग',
      district: 'जोधपुर',
      officer: 'श्रीमती कविता सिंह',
      court: 'विशेष न्यायालय, जोधपुर',
      caseDetails: 'थाना रतनाडा, अपराध संख्या 78/2024, धारा 376 IPC',
      judgementDate: '05-02-2025',
      appealDate: '18-02-2025',
      appealGround: 'साक्षियों के प्रतिकूल हो जाने पर',
      remarks: 'शीघ्र अपील प्रस्तावित'
    },
    {
      serial: 3,
      division: 'उदयपुर संभाग',
      district: 'उदयपुर',
      officer: 'श्री अरविंद जोशी',
      court: 'मुख्य न्यायिक मजिस्ट्रेट उदयपुर',
      caseDetails: 'थाना सूरजपोल, अपराध संख्या 22/2024, धारा 379 IPC',
      judgementDate: '20-01-2025',
      appealDate: '02-02-2025',
      appealGround: 'अभिलेख साक्ष्य का समुचित विचार नहीं',
      remarks: 'अधिवक्ता राय प्राप्त'
    },
    {
      serial: 4,
      division: 'कोटा संभाग',
      district: 'कोटा',
      officer: 'श्री मनोज वर्मा',
      court: 'अपर जिला सत्र न्यायालय कोटा',
      caseDetails: 'थाना महावीर नगर, अपराध संख्या 90/2024, धारा 307 IPC',
      judgementDate: '15-01-2025',
      appealDate: '28-01-2025',
      appealGround: 'दोष सिद्धि हेतु पर्याप्त साक्ष्य उपलब्ध',
      remarks: 'राज्य शासन को संदर्भित'
    },
    {
      serial: 5,
      division: 'जयपुर संभाग',
      district: 'सीकर',
      officer: 'श्रीमती अंजली गुप्ता',
      court: 'विशेष एससी/एसटी न्यायालय सीकर',
      caseDetails: 'थाना उद्योग नगर, अपराध संख्या 12/2024, SC/ST Act',
      judgementDate: '10-02-2025',
      appealDate: '22-02-2025',
      appealGround: 'कानूनी बिंदुओं की त्रुटिपूर्ण व्याख्या',
      remarks: 'अपील मसौदा तैयार'
    },
    {
      serial: 6,
      division: 'जयपुर संभाग',
      district: 'जयपुर',
      officer: 'श्री राजेश शर्मा',
      court: 'जिला एवं सत्र न्यायालय जयपुर',
      caseDetails: 'थाना मानसरोवर, अपराध संख्या 45/2024, धारा 420 IPC',
      judgementDate: '12-01-2025',
      appealDate: '25-01-2025',
      appealGround: 'साक्ष्य के गलत मूल्यांकन के आधार पर',
      remarks: 'राज्य स्तर पर स्वीकृति हेतु भेजा गया'
    },
    {
      serial: 7,
      division: 'जोधपुर संभाग',
      district: 'जोधपुर',
      officer: 'श्रीमती कविता सिंह',
      court: 'विशेष न्यायालय, जोधपुर',
      caseDetails: 'थाना रतनाडा, अपराध संख्या 78/2024, धारा 376 IPC',
      judgementDate: '05-02-2025',
      appealDate: '18-02-2025',
      appealGround: 'साक्षियों के प्रतिकूल हो जाने पर',
      remarks: 'शीघ्र अपील प्रस्तावित'
    },
    {
      serial: 8,
      division: 'उदयपुर संभाग',
      district: 'उदयपुर',
      officer: 'श्री अरविंद जोशी',
      court: 'मुख्य न्यायिक मजिस्ट्रेट उदयपुर',
      caseDetails: 'थाना सूरजपोल, अपराध संख्या 22/2024, धारा 379 IPC',
      judgementDate: '20-01-2025',
      appealDate: '02-02-2025',
      appealGround: 'अभिलेख साक्ष्य का समुचित विचार नहीं',
      remarks: 'अधिवक्ता राय प्राप्त'
    },
    {
      serial: 9,
      division: 'कोटा संभाग',
      district: 'कोटा',
      officer: 'श्री मनोज वर्मा',
      court: 'अपर जिला सत्र न्यायालय कोटा',
      caseDetails: 'थाना महावीर नगर, अपराध संख्या 90/2024, धारा 307 IPC',
      judgementDate: '15-01-2025',
      appealDate: '28-01-2025',
      appealGround: 'दोष सिद्धि हेतु पर्याप्त साक्ष्य उपलब्ध',
      remarks: 'राज्य शासन को संदर्भित'
    },
    {
      serial: 10,
      division: 'जयपुर संभाग',
      district: 'सीकर',
      officer: 'श्रीमती अंजली गुप्ता',
      court: 'विशेष एससी/एसटी न्यायालय सीकर',
      caseDetails: 'थाना उद्योग नगर, अपराध संख्या 12/2024, SC/ST Act',
      judgementDate: '10-02-2025',
      appealDate: '22-02-2025',
      appealGround: 'कानूनी बिंदुओं की त्रुटिपूर्ण व्याख्या',
      remarks: 'अपील मसौदा तैयार'
    },
    {
      serial: 11,
      division: 'जयपुर संभाग',
      district: 'जयपुर',
      officer: 'श्री राजेश शर्मा',
      court: 'जिला एवं सत्र न्यायालय जयपुर',
      caseDetails: 'थाना मानसरोवर, अपराध संख्या 45/2024, धारा 420 IPC',
      judgementDate: '12-01-2025',
      appealDate: '25-01-2025',
      appealGround: 'साक्ष्य के गलत मूल्यांकन के आधार पर',
      remarks: 'राज्य स्तर पर स्वीकृति हेतु भेजा गया'
    },
    {
      serial: 12,
      division: 'जोधपुर संभाग',
      district: 'जोधपुर',
      officer: 'श्रीमती कविता सिंह',
      court: 'विशेष न्यायालय, जोधपुर',
      caseDetails: 'थाना रतनाडा, अपराध संख्या 78/2024, धारा 376 IPC',
      judgementDate: '05-02-2025',
      appealDate: '18-02-2025',
      appealGround: 'साक्षियों के प्रतिकूल हो जाने पर',
      remarks: 'शीघ्र अपील प्रस्तावित'
    },
    {
      serial: 13,
      division: 'उदयपुर संभाग',
      district: 'उदयपुर',
      officer: 'श्री अरविंद जोशी',
      court: 'मुख्य न्यायिक मजिस्ट्रेट उदयपुर',
      caseDetails: 'थाना सूरजपोल, अपराध संख्या 22/2024, धारा 379 IPC',
      judgementDate: '20-01-2025',
      appealDate: '02-02-2025',
      appealGround: 'अभिलेख साक्ष्य का समुचित विचार नहीं',
      remarks: 'अधिवक्ता राय प्राप्त'
    },
    {
      serial: 14,
      division: 'कोटा संभाग',
      district: 'कोटा',
      officer: 'श्री मनोज वर्मा',
      court: 'अपर जिला सत्र न्यायालय कोटा',
      caseDetails: 'थाना महावीर नगर, अपराध संख्या 90/2024, धारा 307 IPC',
      judgementDate: '15-01-2025',
      appealDate: '28-01-2025',
      appealGround: 'दोष सिद्धि हेतु पर्याप्त साक्ष्य उपलब्ध',
      remarks: 'राज्य शासन को संदर्भित'
    },
    {
      serial: 15,
      division: 'जयपुर संभाग',
      district: 'सीकर',
      officer: 'श्रीमती अंजली गुप्ता',
      court: 'विशेष एससी/एसटी न्यायालय सीकर',
      caseDetails: 'थाना उद्योग नगर, अपराध संख्या 12/2024, SC/ST Act',
      judgementDate: '10-02-2025',
      appealDate: '22-02-2025',
      appealGround: 'कानूनी बिंदुओं की त्रुटिपूर्ण व्याख्या',
      remarks: 'अपील मसौदा तैयार'
    },
    {
      serial: 16,
      division: 'जयपुर संभाग',
      district: 'जयपुर',
      officer: 'श्री राजेश शर्मा',
      court: 'जिला एवं सत्र न्यायालय जयपुर',
      caseDetails: 'थाना मानसरोवर, अपराध संख्या 45/2024, धारा 420 IPC',
      judgementDate: '12-01-2025',
      appealDate: '25-01-2025',
      appealGround: 'साक्ष्य के गलत मूल्यांकन के आधार पर',
      remarks: 'राज्य स्तर पर स्वीकृति हेतु भेजा गया'
    },
    {
      serial: 17,
      division: 'जोधपुर संभाग',
      district: 'जोधपुर',
      officer: 'श्रीमती कविता सिंह',
      court: 'विशेष न्यायालय, जोधपुर',
      caseDetails: 'थाना रतनाडा, अपराध संख्या 78/2024, धारा 376 IPC',
      judgementDate: '05-02-2025',
      appealDate: '18-02-2025',
      appealGround: 'साक्षियों के प्रतिकूल हो जाने पर',
      remarks: 'शीघ्र अपील प्रस्तावित'
    },
    {
      serial: 18,
      division: 'उदयपुर संभाग',
      district: 'उदयपुर',
      officer: 'श्री अरविंद जोशी',
      court: 'मुख्य न्यायिक मजिस्ट्रेट उदयपुर',
      caseDetails: 'थाना सूरजपोल, अपराध संख्या 22/2024, धारा 379 IPC',
      judgementDate: '20-01-2025',
      appealDate: '02-02-2025',
      appealGround: 'अभिलेख साक्ष्य का समुचित विचार नहीं',
      remarks: 'अधिवक्ता राय प्राप्त'
    },
    {
      serial: 19,
      division: 'कोटा संभाग',
      district: 'कोटा',
      officer: 'श्री मनोज वर्मा',
      court: 'अपर जिला सत्र न्यायालय कोटा',
      caseDetails: 'थाना महावीर नगर, अपराध संख्या 90/2024, धारा 307 IPC',
      judgementDate: '15-01-2025',
      appealDate: '28-01-2025',
      appealGround: 'दोष सिद्धि हेतु पर्याप्त साक्ष्य उपलब्ध',
      remarks: 'राज्य शासन को संदर्भित'
    },
    {
      serial: 20,
      division: 'जयपुर संभाग',
      district: 'सीकर',
      officer: 'श्रीमती अंजली गुप्ता',
      court: 'विशेष एससी/एसटी न्यायालय सीकर',
      caseDetails: 'थाना उद्योग नगर, अपराध संख्या 12/2024, SC/ST Act',
      judgementDate: '10-02-2025',
      appealDate: '22-02-2025',
      appealGround: 'कानूनी बिंदुओं की त्रुटिपूर्ण व्याख्या',
      remarks: 'अपील मसौदा तैयार'
    }
  ];

}
