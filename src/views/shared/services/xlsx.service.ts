import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';

interface ColumnStyle {
  halign: 'left' | 'right' | 'center';
}



@Injectable({
  providedIn: 'root'
})
export class XlsxService {

  constructor() { }
  
   public ExportExcel(json: any[], excelFileName: string): void {

    let cleanDate = json.map((i: any) => {
      let { orderNo, active, createdBy, createdOn, updatedBy, updatedOn, deleteBy, deleteOn, tehsilId, districtId, courtId, stateId, ...cleanData } = i
      return cleanData
    })

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cleanDate);
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //this.saveAsExcelFile(excelBuffer, excelFileName);
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, excelFileName + new Date().getTime() + EXCEL_EXTENSION);
  }

  public exportAgGridAsExcel(json: any[], columnHeaders: any, worksheetName: string) {
    // Create the Excel sheet with the modified data and custom headers
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {
      header: Object.values(columnHeaders) // Set the custom headers in the sheet
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, worksheetName);

    // Export to Excel file
    XLSX.writeFile(wb, worksheetName + '.xlsx');
  }

  public async exportAgGridAsExcelWithHeading(json: any[], columnHeaders: any, worksheetName: string, formattedDate: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(worksheetName);
  
    // Headings
    const headings = [
      "Government of Rajasthan",
      "Prosecution Department",
      "(Prosecution Case Management System)",
      worksheetName + ' ' + formattedDate
    ];
    const headerKeys = Object.keys(columnHeaders);
    const lastColumnLetter = getExcelAlpha(headerKeys.length); // E.g., H
  
    headings.forEach((text, idx) => {
      const row = worksheet.addRow([text]);
      worksheet.mergeCells(`A${idx + 1}:${lastColumnLetter}${idx + 1}`);
      row.getCell(1).font = {
        name: 'Calibri',
        bold: true,
        color: { argb: 'FF9C0006' },
        size: 12
      };
      row.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE8EEF5' }
      };
      row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    });
  
    // Column Headers
    const headerRow = worksheet.addRow(Object.values(columnHeaders));
    headerRow.font = { name: 'Calibri', bold: true };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  
    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCE5FF' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  
    // Data rows
    json.forEach((item, index) => {
      const row = worksheet.addRow(Object.values(item));
      row.alignment = { vertical: 'top' };
      row.eachCell((cell, colNumber) => {
        const value = cell.value;

        // Check for integer
        const isInteger = typeof value === 'number' && Number.isInteger(value);
        cell.alignment = {
          vertical: 'top',
          horizontal: isInteger ? 'right' : 'left',
          wrapText: true
        };

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });


    // Auto width
    // worksheet.columns.forEach((column: any) => {
    //   let maxLength = 10;
    //   column.eachCell({ includeEmpty: true }, (cell: any) => {
    //     const val = cell.value ? cell.value.toString() : '';
    //     maxLength = Math.max(maxLength, val.length);
    //   });
    //   column.width = maxLength + 2;
    // });

    worksheet.columns.forEach((column: any) => {
      let maxLength = 10; // base min width for safety
    
      column.eachCell({ includeEmpty: true }, (cell: any) => {
        const cellValue = cell.value;
        const text = cellValue ? cellValue.toString() : '';
        maxLength = Math.max(maxLength, text.length);
      });
    
      // Set width with a reasonable max limit to avoid extra space
      column.width = Math.min(maxLength + 2, 30); // max width capped at 30
    });
    
  
    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `${worksheetName}.xlsx`);
  }
  
  
  exportTableToExcelWithoutHeader(tableId: string, fileName: string): void {
    const table = document.getElementById(tableId);
    if (!table) {
      //console.error('Table not found!');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, `${fileName}.xlsx`);
  }

  async exportTableToExcel(tableId: string, fileName: string, reportTitle: string): Promise<void> {
    const table = document.getElementById(tableId);
    if (!table) {
      //console.error('Table not found!');
      return;
    }

    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    if (!thead || !tbody) {
      //console.error('Table must have both <thead> and <tbody> elements.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // ✅ Header: Merge & Style
    const headerText = 'Government of Rajasthan \n Prosecution Department \n (Prosecution Case Management System) \n ' + reportTitle;
    const columnCount = table.querySelectorAll('thead tr th').length || 8; // Default to 8 if uncertain

    // ✅ Merge Header Cells Correctly
    worksheet.mergeCells(`A1:${String.fromCharCode(64 + columnCount)}1`);
    const headerRow = worksheet.getCell('A1');
    headerRow.value = headerText;

    // ✅ Apply Styling
    headerRow.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
    headerRow.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true // ✅ Enable text wrapping
    };

    // ✅ Set Row Height Manually for Better Readability
    worksheet.getRow(1).height = 100; // Adjust as needed

    // ✅ Extract Table Headers
    const headers = Array.from(thead.querySelectorAll('tr th')).map(th => th.textContent?.trim() || '');
    const addedRow = worksheet.addRow(headers);
    addedRow.eachCell((cell: any) => {
      cell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
    });


    // ✅ Style Header Row
    const excelHeaderRow = worksheet.getRow(2);
    excelHeaderRow.font = { bold: true, size: 12, color: { argb: '' } };
    excelHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '' } };
    excelHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };

    let firstDataRow = true;

    // ✅ Extract Table Data
    tbody.querySelectorAll('tr').forEach(row => {
      const rowData = Array.from(row.children).map(td => {
        const text = td.textContent?.trim() || '';

        // Convert to number if applicable
        return !isNaN(Number(text)) && text !== '' ? Number(text) : text;
      });

      worksheet.addRow(rowData);
    });

    // ✅ Auto-Adjust Column Widths
    worksheet.columns.forEach((column: any) => {
      if (column && column.eachCell) {
        let maxLength = 10; // Set a minimum width
        column.eachCell({ includeEmpty: true }, (cell: any) => {
          maxLength = Math.max(maxLength, cell.value ? cell.value.toString().length : 10);
        });
        //column.width = maxLength + 2;
      }
    });

    // ✅ Apply Number Formatting Dynamically
    worksheet.columns.forEach((column: any) => {
      if (column && column.eachCell) {
        let containsDecimals = false;

        column.eachCell((cell: any, rowNumber: any) => {
          if (rowNumber > 2 && typeof cell.value === 'number') {
            if (!Number.isInteger(cell.value)) {
              containsDecimals = true;
            }
          }
        });

        column.eachCell((cell: any, rowNumber: any) => {
          if (rowNumber > 2 && typeof cell.value === 'number') {
            cell.numFmt = containsDecimals ? '#,##0.00' : '#,##0';
          }
        });
      }
    });

    // ✅ Save the File
    const buffer = await workbook.xlsx.writeBuffer();
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(data, `${fileName}_${timestamp}.xlsx`);
  }

async exportTableToExcelColSpan(tableId: string, fileName: string, reportTitle: string): Promise<void> {
    const table = document.getElementById(tableId);
    if (!table) {
      //console.error('Table not found!');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    
    // ✅ Add the Main Header (Title)
    const headerText = 'Government of Rajasthan \n Prosecution Department \n (Prosecution Case Management System) \n ' + reportTitle;
    const theadFirstRow = table.querySelector('thead tr');
    let columnCount = 0;

    if (theadFirstRow) {
      theadFirstRow.querySelectorAll('th').forEach(th => {
        columnCount += parseInt(th.getAttribute('colspan') || '1', 10);
      });
    } else {
      columnCount = 10; // Default value if <thead> or <th> elements are missing
    }

    worksheet.mergeCells(`A1:${String.fromCharCode(64 + columnCount)}1`);
    const headerRow = worksheet.getCell('A1');
    headerRow.value = headerText;

    // ✅ Style the Main Header
    headerRow.font = { bold: true, size: 12, color: { argb: 'B5251F' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'e8f4f8' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    worksheet.getRow(1).height = 180;

    // ✅ Create a mapping of cell positions
    const cellMap = new Map();
    let currentRow = 2; // Start after the header

    // First pass: analyze the table structure
    const rows = Array.from(table.querySelectorAll('tr'));
    
    // Track header text and width requirements
    const columnWidths = new Map();
    const serialNumberPatterns = /^(S\.No|Sr\.No|#|No\.|SNo)$/i;
    
    rows.forEach((row, rowIndex) => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      let currentCol = 1;
      
      cells.forEach((cell) => {
        // Skip cells that are part of a rowspan from a previous row
        while (cellMap.has(`${currentRow}:${currentCol}`)) {
          currentCol++;
        }
        
        const rowSpan = parseInt(cell.getAttribute('rowspan') || '1', 10);
        const colSpan = parseInt(cell.getAttribute('colspan') || '1', 10);
        const content = cell.textContent?.trim() || '';
        
        // Store header text for width calculation
        if (cell.tagName === 'TH') {
          // Determine column type based on header text
          let columnType = 'normal';
          if (serialNumberPatterns.test(content)) {
            columnType = 'serial';
          } else if (/^date|time|day/i.test(content)) {
            columnType = 'date';
          } else if (/^amount|total|sum|rs\.|₹/i.test(content)) {
            columnType = 'amount';
          }
          
          columnWidths.set(currentCol, {
            text: content,
            length: content.length,
            type: columnType,
            colSpan: colSpan
          });
        }
        
        // Mark all cells that this cell spans
        for (let r = 0; r < rowSpan; r++) {
          for (let c = 0; c < colSpan; c++) {
            cellMap.set(`${currentRow + r}:${currentCol + c}`, {
              originalCell: cell,
              isMainCell: r === 0 && c === 0,
              rowSpan,
              colSpan,
              content: content,
              startRow: currentRow,
              startCol: currentCol,
              endRow: currentRow + rowSpan - 1,
              endCol: currentCol + colSpan - 1
            });
          }
        }
        
        currentCol += colSpan;
      });
      
      currentRow++;
    });

    // Second pass: create Excel cells and merge them
    currentRow = 2; // Reset to start after header
    const processedMerges = new Set();
    
    rows.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow);
      const cells = Array.from(row.querySelectorAll('th, td'));
      let currentCol = 1;
      
      cells.forEach((cell) => {
        // Skip cells that are part of a rowspan from a previous row
        while (cellMap.has(`${currentRow}:${currentCol}`) && 
               !cellMap.get(`${currentRow}:${currentCol}`).isMainCell) {
          currentCol++;
        }
        
        const cellInfo = cellMap.get(`${currentRow}:${currentCol}`);
        if (cellInfo && cellInfo.isMainCell) {
          // Add content to the cell
          const excelCell = excelRow.getCell(currentCol);
          const content = cellInfo.content;
          
          // Convert numeric strings to actual numbers
          if (content && !isNaN(Number(content)) && content !== '') {
            excelCell.value = Number(content);
          } else {
            excelCell.value = content;
          }
          
          // Style the cell
          excelCell.font = { 
            bold: cell.tagName === 'TH',
            size: 10
          };
          
          // Set alignment and text wrapping
          if (cell.tagName === 'TH') {
            // Header cells: centered with no wrapping
            excelCell.alignment = { 
              vertical: 'middle', 
              horizontal: 'center',
              wrapText: false
            };
          } else {
            // Data cells: wrapped based on column width
            excelCell.alignment = { 
              vertical: 'middle', 
              horizontal: typeof excelCell.value === 'number' ? 'right' : 'left',
              wrapText: true // Enable wrapping for data cells
            };
          }
          
          excelCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          // Merge cells if needed
          if (cellInfo.rowSpan > 1 || cellInfo.colSpan > 1) {
            const mergeKey = `${cellInfo.startRow}:${cellInfo.startCol}:${cellInfo.endRow}:${cellInfo.endCol}`;
            if (!processedMerges.has(mergeKey)) {
              const startCell = `${String.fromCharCode(64 + cellInfo.startCol)}${cellInfo.startRow}`;
              const endCell = `${String.fromCharCode(64 + cellInfo.endCol)}${cellInfo.endRow}`;
              worksheet.mergeCells(`${startCell}:${endCell}`);
              processedMerges.add(mergeKey);
            }
          }
          
          currentCol += cellInfo.colSpan;
        } else {
          currentCol++;
        }
      });
      
      currentRow++;
    });

    // ✅ Set column widths based on header text
    for (let i = 1; i <= columnCount; i++) {
      const headerInfo = columnWidths.get(i);
      
      if (headerInfo) {
        let width;
        
        // Set width based on column type
        switch (headerInfo.type) {
          case 'serial':
            // Narrow width for serial numbers
            width = Math.min(Math.max(headerInfo.length * 1.2, 6), 8);
            break;
          case 'date':
            // Fixed width for dates
            width = 12;
            break;
          case 'amount':
            // Slightly wider for amounts
            width = Math.min(Math.max(headerInfo.length * 1.4, 10), 18);
            break;
          default:
            // Regular columns - base width on header text
            width = Math.min(Math.max(headerInfo.length * 1.2, 10), 30);
        }
        
        // Apply width to column
        worksheet.getColumn(i).width = width;
        
        // If this header spans multiple columns, apply the same width to all spanned columns
        if (headerInfo.colSpan > 1) {
          const widthPerColumn = width / headerInfo.colSpan;
          for (let j = 0; j < headerInfo.colSpan; j++) {
            worksheet.getColumn(i + j).width = widthPerColumn;
          }
        }
      } else {
        // Default width for columns without header info
        worksheet.getColumn(i).width = 12;
      }
    }

    // ✅ Save the File
    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
}






  //exportTableToPDF(tableId: string, headerId: string, fileName: string): void {
  //  const doc = new jsPDF();
  //  const table = document.getElementById(tableId);
  //  const header = document.getElementById(headerId);

  //  if (!table) {
  //    //console.error('Table not found!');
  //    return;
  //  }

  //  // Extract header text from HTML (if available)
  //  let headerText = header ? header.innerText.trim() : 'Report';

  //  // Get Page Width for Center Alignment
  //  const pageWidth = doc.internal.pageSize.getWidth();
  //  const textWidth = doc.getTextWidth(headerText);
  //  const textX = (pageWidth - textWidth) / 2; // Center align header

  //  // Add Header Text at the Top
  //  doc.setFont('helvetica', 'bold');
  //  doc.setFontSize(16);
  //  doc.text(headerText, textX, 15); // Positioned at Y = 15

  //  // Add Date Below Header
  //  doc.setFontSize(10);
  //  doc.setFont('helvetica', 'normal');
  //  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 22);

  //  // Add Table Below Header (startY: 30 to avoid overlap)
  //  autoTable(doc, {
  //    html: `#${tableId}`,
  //    theme: 'grid',
  //    startY: 30, // Ensure table starts below the header
  //    styles: { fontSize: 10, cellPadding: 2 },
  //  });

  //  // Save the PDF
  //  doc.save(`${fileName}_${new Date().getTime()}.pdf`);
  //}


  exportTableToPDF(tableId: string, headingLines: string[], fileName: string, isPrint: boolean = false) {
    const table = document.getElementById(tableId);
    if (!table) {
      //console.error('Table not found!');
      return;
    }

    // Determine orientation
    let isLandscape = false;
    const collen = this.getFirstRowColumnCount(tableId);
    if (collen > 2) {
      isLandscape = true;
    }
    const orientation = fileName == 'TalkingPoint' ? 'portrait' : isLandscape ? 'landscape' : 'portrait';
    const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

    // Page width for centering
    const pageWidth = doc.internal.pageSize.getWidth();
    // Calculate the maximum width needed for the heading text
    let maxWidth = 0;
    headingLines.forEach((line: string) => {
      if (line !== '') {
        const textWidth = doc.getStringUnitWidth(line) * 8 * 0.352778; // Convert to mm (8 is font size)
        maxWidth = Math.max(maxWidth, textWidth);
      }
    });
    // Add Header with Multi-line and Styling
    let yPosition = 15; // Initial Y position
    const startY = yPosition - 5; // Start a bit higher for the border
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(181, 37, 31); // Red color for header

    // Define border dimensions
    const margin = 14; // Margin from page edges in mm
    const borderWidth = pageWidth - (margin * 2); // Full page width minus margins
    const borderX = margin; // Start at left margin
    let borderHeight = 0;

    // Draw the text
    headingLines.forEach((line: string) => {
      if (line !== '') {
        doc.setFontSize(10); // Set uniform font size
        doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 4; // Move down for next line
        borderHeight += 4; // Add to border height
      }
    });
    // Add some padding to the bottom
    borderHeight += 5;

    // Draw the border around the heading text
    doc.setDrawColor(0); // Black border
    doc.setLineWidth(0.3); // Thin line
    doc.rect(borderX, startY, borderWidth, borderHeight);

    // Update yPosition for the table to start below the border
    yPosition += 0;



    // Get column alignment styles
    const columnStyles = this.getColumnAlignmentStyles(table as HTMLTableElement, fileName);
    // Define a type alias for better readability
    type RGBColor = [number, number, number];
    // Define custom styles with proper typing
    const tableStyles = {
      headerBackground: [232, 244, 248] as RGBColor,
      headerText: [0, 0, 0] as RGBColor,
      bodyText: [0, 0, 0] as RGBColor,
      alternateRowBackground: [255, 255, 255] as RGBColor,
      borderColor: [0, 0, 0] as RGBColor
    };

    // Add Table with enhanced styling
    autoTable(doc, {
      pageBreak: 'auto',
      rowPageBreak: 'avoid',
      html: `#${tableId}`,
      theme: 'grid',
      startY: yPosition,

      // Global styles
      styles: {
        fontSize: 8,
        cellPadding: 1,
        overflow: 'linebreak',
        font: 'helvetica',
        textColor: tableStyles.bodyText,
        lineColor: tableStyles.borderColor,
        lineWidth: 0.3
      },

      // Header styles
      headStyles: {
        fontSize: 8,
        fillColor: tableStyles.headerBackground,
        textColor: tableStyles.headerText,
        fontStyle: 'bold',
        lineWidth: 0.3,
        halign: 'center',
      },

      // Column-specific styles (alignment, etc.)
      columnStyles: columnStyles,


      // Alternate row styling
      alternateRowStyles: {
        fillColor: tableStyles.alternateRowBackground
      },

      // Custom cell styling
      didParseCell: function (data : any) {
        // Highlight total rows
        if (data.section === 'body' &&
          data.cell.text &&
          data.cell.text[0] &&
          (data.cell.text[0].includes('Total') || data.cell.text[0].includes('Sum'))) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [255, 245, 245] as RGBColor; // Fixed inline color
        }

        const cellContent: any = data.cell.text[0]?.trim();
        // Check if numeric
        const isNumeric = !isNaN(cellContent);
        // Check if valid date format (like DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, etc.)
        const isDate = /^\d{2}-\d{2}-\d{4}$/.test(cellContent) || /^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(cellContent) ||
          /^\d{4}[\/\-]\d{2}[\/\-]\d{2}$/.test(cellContent) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(cellContent) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(cellContent) ||
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/.test(cellContent)

        if (isNumeric || isDate || cellContent.includes('%')) {
          data.cell.styles.halign = 'right';
        } else {
          data.cell.styles.halign = 'left';
        }

        const cell = data.cell;

        // Get actual HTML <tr> and <td> elements
        const td = data.cell.raw as HTMLTableCellElement;
        const tr = td?.parentElement as HTMLTableRowElement;

        // Count number of <td> in the row
        const tdCount = tr?.querySelectorAll('td').length || 0;
        // Header styles in center
        if (data.section === 'head') {
          data.cell.styles.halign = 'center';
        }
        // If this row has only 1 cell and it's in the body → force left-align
        if (data.section === 'body' && tdCount === 1) {
          cell.styles.halign = 'left';
        }

      },

      // Page numbering
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          doc.internal.pageSize.getWidth() - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    // Safe File Name
    const safeFileName = fileName.replace(/[^\w\-]/g, '_');
    if (!isPrint) {
      doc.save(`${safeFileName}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      const hiddFrame = document.createElement('iframe');
      hiddFrame.style.position = 'fixed';
      hiddFrame.style.width = '1px';
      hiddFrame.style.height = '1px';
      hiddFrame.style.opacity = '0.01';
      hiddFrame.src = doc.output('bloburl').toString();
      document.body.appendChild(hiddFrame);
    }
  }

  getFirstRowColumnCount(tableId: string): number {
    const table = document.getElementById(tableId) as HTMLTableElement;
    if (!table || table.rows.length === 0) {
      //console.error('Table not found or empty!');
      return 0;
    }

    let columnCount = 0;
    const firstRow = table.rows[0]; // Get the first row

    Array.from(firstRow.cells).forEach((cell) => {
      const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
      columnCount += colspan;
    });

    return columnCount;
  }

  
getColumnAlignmentStyles(table: HTMLTableElement,fileName:any): Record<number, ColumnStyle> {
  // Define an interface for better type safety
  interface ColumnStyle {
    halign: 'left' | 'right' | 'center';
  }

  const columnStyles: Record<number, ColumnStyle> = {};
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const sampleSize = Math.min(rows.length);

  const columnData: string[][] = [];

  let processedRows = 0;
  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll('td'));

    // Skip this row if it contains any colspan > 1
    if (cells.some(cell => parseInt(cell.getAttribute('colspan') || '1', 10) > 1)) {
      continue;
    }

    let colIndex = 0;
    cells.forEach(cell => {
      const val = cell.textContent?.trim() || '';
      const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);

      for (let i = 0; i < colspan; i++) {
        if (!columnData[colIndex]) columnData[colIndex] = [];
        columnData[colIndex].push(val);
        colIndex++;
      }
    });

    processedRows++;
    if (processedRows >= sampleSize) break;
  }

  columnData.forEach((col, index) => {
    const numericCount = col.filter(val => /^-?\d+(\.\d+)?$/.test(val)).length;
    const isMostlyNumeric = numericCount >= Math.ceil(col.length / 2);
    columnStyles[index] = fileName == 'TalkingPoint' ? { halign: isMostlyNumeric ? 'left' : 'right' } : { halign: isMostlyNumeric ? 'right' : 'left' };
  });

  return columnStyles;
}



printComponent(tableId: string) {
  const elementToPrint = document.getElementById(tableId);

  if (elementToPrint) {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.open();

      // Clone with correct formatting
      const tableHtml = elementToPrint.cloneNode(true) as HTMLElement;
      
      // Get column alignments - make sure this doesn't cause recursion
      const columnStyles = this.getColumnAlignmentStyles(elementToPrint as HTMLTableElement, '');
      
      // Generate CSS for column alignments
      let columnCss = '';
      Object.entries(columnStyles).forEach(([colIndex, style]) => {
        // Use type assertion to access the halign property
        const alignValue = (style as { halign: string }).halign;
        columnCss += `
          table td:nth-child(${parseInt(colIndex) + 1}) {
            text-align: ${alignValue};
          }
        `;
      });

      printWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            table, th, td {
              border: 1px solid #000;
              padding: 8px;
              vertical-align: top;
            }
            
            /* Default alignment for headers */
            th {
              text-align: center;
            }
            
            /* Column-specific alignments */
            ${columnCss}

            thead {
              background-color: #f0f0f0;
            }

            tr {
              page-break-inside: avoid;
            }
            .border-2.border-black{
              border: 2px solid #000;
            }
          </style>
        </head>
        <body>
          ${tableHtml.outerHTML}
          <script>
            window.onload = function () {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);

        printWindow.document.close();
      }
    }
  }


  exportAllJsonPDF(headers: any[], columnHeading: any[], data: any[], fileName: any,isPrint: boolean = false) {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let y = 15;
    // Add heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(200, 0, 0); // red

    // Add custom heading
    const headingLines = headers;
    const rectY = y - 5;
    const headingHeight = headingLines.length * 6;
    const rectHeight = headingHeight + 10;
    // ➤ Draw red border rectangle around the heading
    doc.setDrawColor(0, 0, 0); // red
    doc.setLineWidth(0.2);
    doc.rect(margin, rectY, pageWidth - margin * 2, rectHeight);




    const tableStartY = y + headingHeight + 5;

    const columns = columnHeading
    headingLines.forEach((line, i) => {
      doc.text(line, pageWidth / 2, y + (i * 7), { align: 'center' });
    });
    autoTable(doc, {
      startY: tableStartY,
      head: [columns.map(col => col.header)],
      body: data.map(row => columns.map(col => row[col.dataKey])),
      // showHead: 'firstPage',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        halign: 'left',
        valign: 'middle',
        cellPadding: 0.6,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [217, 234, 245],
        textColor: 0,
        fontStyle: 'bold',
        halign: 'center',
        lineWidth: 0.2,
        lineColor: 0
      },
      bodyStyles: {
        lineColor: 0,
        lineWidth: 0.2
      },
      tableLineColor: 0,
      tableLineWidth: 0.2,
      theme: 'grid',

      didParseCell: function (data) {
        if (data.section === 'body') {
          const cellContent:any = data.cell.text[0]?.trim();
    
          // Check if numeric
          const isNumeric = !isNaN(cellContent);

          // Check if valid date format (like DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, etc.)
          const isDate = /^\d{2}-\d{2}-\d{4}$/.test(cellContent) || /^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(cellContent) ||
            /^\d{4}[\/\-]\d{2}[\/\-]\d{2}$/.test(cellContent) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(cellContent) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(cellContent) ||
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/.test(cellContent)

          if (isNumeric || isDate) {
            data.cell.styles.halign = 'right';
          } else {
            data.cell.styles.halign = 'left';
          }
        }
      },
      columnStyles: {
        0: { halign: 'right', cellWidth: 16 },
        '*': { cellWidth: 'auto'  }
      }
    });
    
    const safeFileName = fileName.replace(/[^\w\-]/g, '_');
    if (!isPrint) {
      doc.save(`${safeFileName}_${new Date().getTime()}.pdf`);
    } else {
      // Print record 
      doc.autoPrint();
      const hiddFrame = document.createElement('iframe');
      hiddFrame.style.position = 'fixed';
      hiddFrame.style.width = '1px';
      hiddFrame.style.height = '1px';
      hiddFrame.style.opacity = '0.01';
      hiddFrame.src = doc.output('bloburl').toString();
      document.body.appendChild(hiddFrame);
    }
  }

  exportAsExcelFile(json: any[], fileName: string): void {
  const worksheet = XLSX.utils.json_to_sheet(json);
  const workbook = {
    Sheets: { 'Sheet1': worksheet },
    SheetNames: ['Sheet1']
  };
  XLSX.writeFile(workbook, fileName + '.xlsx');
}


}

function getExcelAlpha(colNum: number): string {
  let column = '';
  while (colNum > 0) {
    const remainder = (colNum - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    colNum = Math.floor((colNum - 1) / 26);
  }
  return column;
}
