import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }


  isLoadingSubject = new BehaviorSubject<boolean>(false);
  // isLoading$ = this.isLoadingSubject.asObservable();

  show() {
    // console.log(this.isLoading$);
    
    this.isLoadingSubject.next(true);
  }

  hide() {
    this.isLoadingSubject.next(false);
  }
}
