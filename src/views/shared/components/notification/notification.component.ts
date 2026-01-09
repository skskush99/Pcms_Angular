import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {



  notify = inject(NotificationService)


  type : any = 'success';
  msg : any = 'Something Went Wrong';
  big : boolean = true;
  show : any ;


  // show = new BehaviorSubject<boolean>(false);
  // type: any = ''; 
  // msg: any = '';

  constructor(){
    // //console.log(123);
    
    // this.show = this.notify.showNotification
    // //console.log(this.show);
    
    // this.type = this.notify.notificationType$;
    // this.msg = this.notify.notificationMsg$;

    // //console.log(this.type , this.msg);
    
  }


  ngOnInit() {
    this.notify.notification$.subscribe(notification => {
      if (notification) {        
        this.show = true;
        this.type = notification.type;
        this.msg = notification.msg;
        this.big = notification.largeSize
      } else {
        this.show = false;
      }
    });
  }


  getBackgroundColor(): any{    
    switch (this.type) {
      case 'delete':          
        return {
          bg : '#F8D7DA',
          text : '#A5545B',
          icon : 'fa-solid fa-trash'
        };
      case 'error':          
      return {
        // bg : '#F8D7DA',
        bg : '#CE1A2B',
        // text : '#A5545B',
        text : '#fff',
        icon : 'fa-solid fa-x'
      };
      case 'success':
        return {
          bg : '#D1E7DD',
          text : '#377156',
          icon: 'fa-solid fa-check'
        };
      case 'warning':
        return {
          bg : '#FFF3CD',
          text : '#917D3D',
          icon : 'fa-solid fa-triangle-exclamation'
        };
      case 'info':
        return {
          bg : '#CFF4FC',
          text : '#4A8A96',
          icon : 'fa-solid fa-info'
        };
      default:
        return 'transparent'; // fallback color
    }

    // return 'green'
  }




}
