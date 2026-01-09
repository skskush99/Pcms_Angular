import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  @Input() currentPage: number = 1;
  @Input() total: number = 0;
  @Input() limit: number = 20;
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];
  totalPages: number = 0;
  maxVisiblePages: number = 5;


  range(start: number, end: number): number[] {
    // return [...Array(end).keys()].map((el) => el + start);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);

  }

  ngOnChanges(): void {    
    this.updatePages();
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.currentPage) {
      this.changePage.emit(page);
    }
  }


  updatePages(): void {
    this.totalPages = Math.ceil(this.total / this.limit);
    const halfVisible = Math.floor(this.maxVisiblePages / 2);

    let startPage: number;
    let endPage: number;

    if (this.totalPages <= this.maxVisiblePages) {
      // Show all pages if the total number of pages is less than or equal to maxVisiblePages
      startPage = 1;
      endPage = this.totalPages;
    } else {
      // Calculate start and end pages based on the current page
      if (this.currentPage <= halfVisible + 1) {
        startPage = 1;
        endPage = this.maxVisiblePages;
      } else if (this.currentPage + halfVisible >= this.totalPages) {
        startPage = this.totalPages - this.maxVisiblePages + 1;
        endPage = this.totalPages;
      } else {
        startPage = this.currentPage - halfVisible;
        endPage = this.currentPage + halfVisible;
      }
    }

    this.pages = this.range(startPage, endPage);
  }

}
