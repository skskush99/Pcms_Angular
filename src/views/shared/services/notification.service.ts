import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }


  private notificationSubject = new BehaviorSubject<{ type: string, msg: string , largeSize : boolean } | null>(null);
  notification$ = this.notificationSubject.asObservable();

  showNotification(type: string, msg: string , time : number = 5000 , largeSize : boolean = true) {
    this.notificationSubject.next({ type, msg , largeSize });
    
    // Auto-hide after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      this.notificationSubject.next(null);
    }, time);
  }


  
}
