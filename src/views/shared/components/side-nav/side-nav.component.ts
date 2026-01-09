import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidenavService } from '../../services/sidenav.service';
import { ApiService } from '../../services/api.service';
import { UrlService } from '../../services/url.service';
import navData from './navItems/nav';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
  animations: [
 
    trigger('onOff' , [
    transition(':enter', [
      style({
        transform: 'translateX(100%)', 
        opacity: 0, 
      }),
      animate('300ms ease-in', style({
        transform: 'translateX(-25%)', 
        opacity: 1, 
      })),
      animate('300ms ease-out', style({
        transform: 'translateX(0%)', 
        opacity: 1, 
      }))
    ]),
    
    transition(':leave', [
      animate('500ms ease-out', style({
        transform: 'translateX(100%)', 
        opacity: 0, 
      }))
    ])
  ])

 
  ]
})
export class SideNavComponent {


  // roleName : string | null;
  _navToggle = inject(SidenavService)
  _api = inject(ApiService);
  // rolePermission = inject(RoleWisePermissionService)
  // isNavbarVisible: boolean = true;
  nav: any[] = [];
  currentSelectedMenu : string = '';
  activeIndex: number | null = null;
  activeSubIndex: number | null = null;
  @Input() isNavbarVisible: boolean = true; 
  @Output() toggle = new EventEmitter<boolean>();
  private subscription: Subscription = new Subscription();
  private navItemSubscription : Subscription = new Subscription();
  router = inject(Router)
  url = inject(UrlService)
  api = inject(ApiService)
  // accessPermission = inject(RoleWisePermissionService)
  // aes = inject(AesService)
  isSideNav : any
  constructor(){
    // this.navItems = navData   
    this.getNavItems();
  }

 

  // this.api.post(this.urls.getLoginUrl() , reqParams).subscribe({
  //   next : (res : any) => {
  //     //console.log(res);
  //     if (res.status){
  //       localStorage.setItem('token' , res.data[0]?.token)

  //       this.router.navigateByUrl('/')
  //     }else{
  //       this.loginForm.reset();
  //       // alert(res?.message)
  //       this.notify.show('error' ,'message from login')
  //     }
      
      
  //   },
  //   error : (error) => //console.log(error),
  //   complete : () => //console.log('request completed')
    
    
  // })

  ngOnInit() {
    this.subscription.add(
      this._navToggle.isSideNavOpen$.subscribe(value => {
        this.isSideNav = value;
        
      })

      
    );



    // this.navItemSubscription.add(
    //   this._navToggle.getNavItems().subscribe({
    //     next : (res : Role)=> {        
    //       //console.log(res);
    //       //console.log('$$$$$$$$$$$$$$$$$$$$$$');
          
    //       this.getNavItems()
          
    //     }
    //   })
    // )
    
    
    
  }


  getNavItems(){
    this.nav = navData
  }



  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeSideNav(){
    this.isSideNav = false;
  }

  toggleNavbar() {    
    this.isNavbarVisible = !this.isNavbarVisible;
    this.toggle.emit(this.isNavbarVisible); // Emit the visibility state
  }

  


  toggleChildren(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  toggleSubChildren(index: number): void {
    this.activeSubIndex = this.activeSubIndex === index ? null : index;
    //console.log(this.activeSubIndex);
    
  }

  onSubChildClick(link : string , e: Event){
    e.stopPropagation();
    this.currentSelectedMenu = link;
    this.router.navigateByUrl(link)
    
  }


  navigateToLink(link : any | null , obj : any){
    //console.log(link);
    //console.log(obj);

      
      // if (link){
      //   this.accessPermission.setCurrSelectedNav(obj)
      //   this.currentSelectedMenu = link
        this.router.navigateByUrl(link)
      // }
  }


  
}
