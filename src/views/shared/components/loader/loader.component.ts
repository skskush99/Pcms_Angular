import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

  isLoading : Observable<boolean> | undefined ;


  loader = inject(LoaderService)

  ngOnInit() {
    this.isLoading = this.loader.isLoadingSubject;
    console.log(this.isLoading);
    
  }

}
