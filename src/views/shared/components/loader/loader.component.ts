
// import { Component, inject, OnInit } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { LoaderService } from '../../services/loader.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-loader',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './loader.component.html',
//   // No styleUrl — styles are now in global styles.scss
// })
// export class LoaderComponent implements OnInit {

//   isLoading: Observable<boolean> | undefined;

//   private loader = inject(LoaderService);

//   // ✅ TEMPORARY PREVIEW FLAG — set true to always show loader
//   // ❌ Remove this line (or set false) when done testing
//   private readonly PREVIEW_MODE = true;

//   ngOnInit(): void {
//     if (this.PREVIEW_MODE) {
//       // Always show loader for preview/testing
//       this.isLoading = of(true);
//     } else {
//       // Normal behaviour — driven by HTTP interceptor / LoaderService
//       this.isLoading = this.loader.isLoadingSubject;
//     }
//   }
// }


import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
})
export class LoaderComponent implements OnInit {

  isLoading: Observable<boolean> | undefined;

  private loader = inject(LoaderService);

  ngOnInit(): void {
    this.isLoading = this.loader.isLoadingSubject;
  }
}