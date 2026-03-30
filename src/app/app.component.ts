///// SSO USE Start  ////// 

import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SideNavComponent } from "../views/shared/components/side-nav/side-nav.component";
import { NavBarComponent } from "../views/shared/components/nav-bar/nav-bar.component";
import { CommonModule } from '@angular/common';
import { SidenavService } from '../views/shared/services/sidenav.service';
import { filter } from 'rxjs';
import { NotificationComponent } from "../views/shared/components/notification/notification.component";
import { LoaderComponent } from "../views/shared/components/loader/loader.component";
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../views/shared/services/common.service';
import { TranslateModule  } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent, NavBarComponent, CommonModule, NotificationComponent, LoaderComponent , TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{


  sideNav = inject(SidenavService);
  _router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  common = inject(CommonService);
  showNav : boolean = true
  title = 'pcms';
  isNavbarVisible: any;
  // showNav: any;
  sToken: any;

  constructor(private translate: TranslateService){

    this.translate.setDefaultLang('en');

    // load saved language or fallback
    const lang = localStorage.getItem('lang') || 'en';
    this.translate.use(lang);
  }


  ngOnInit(): void {
    this.common.getLang().subscribe({
      next : (res : string) => {
        this.translate.use(res);
      }
    })
    this.trackRouteChanges();
    this.sideNav.setUserDetails(true);
  }
  switchLanguage(lang: 'en' | 'hi') {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }
  handleToggleSidebar(isVisible : any){
    this.isNavbarVisible = isVisible;
  }


  private trackRouteChanges(): void {
      this._router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd) // Type guard
      ).subscribe((event: NavigationEnd) => {
        window.scrollTo({
          top : 0 , behavior : 'smooth' , left : 0
        })
        //console.log(event.url);
        let isNewWindow : any = localStorage.getItem('hideSideNav') || sessionStorage.getItem('sessionNewWindow');
        let isNewWindowParsed = JSON.parse(isNewWindow)
        //console.log(isNewWindowParsed);
  
        let param = this.activeRoute.snapshot.queryParams;
        if (sessionStorage.getItem('loggedOut') === 'true' && !param['token'] && event.url !== '/ssologin' && event.urlAfterRedirects !== '/ssologin' && event.url !== '/developer-login-page') {
    // Redirect back to SSO immediately
    
      // window.location.replace(constants.logoutToSSO);
  }

  // Prevent back button after logout
  window.addEventListener('popstate', () => {
    if (sessionStorage.getItem('loggedOut') === 'true' && !param['token'] && event.url !== '/ssologin' && event.urlAfterRedirects !== '/ssologin' && event.url !== '/developer-login-page') {
      // Push forward and redirect to SSO
    // console.log('2nd apptempt');
      window.history.forward();
      // window.location.replace(constants.logoutToSSO);
    }
  });
       
        if(event.url === '/developer-login-page' 
          || event.url === '/login'
          || event.url == '/user-mapping'
          || event.url === '/under-maintaince'
          || event.url =='/case-management/lawyer-appointment-request/letter' 
          || event.url === '/no-role-mapped' 
          || event.url === '/role-selection' 
          || event.url === '/home' 
          || event.url === '/home/cause-list' 
          || event.url === '/home/case-list' 
          || event.url ==='/home/website-policies'
          || event.urlAfterRedirects === '/404' 
          || event.url === '/access-denied' 
          || isNewWindowParsed ){
          this.showNav = false;
          this.sideNav.setIsSideNavOpen(false);
          this.handleToggleSidebar(false)
          sessionStorage.setItem('sessionNewWindow' , isNewWindow)
        }else {
          this.showNav = true;
          this.sideNav.setIsSideNavOpen(true);
          this.handleToggleSidebar(true)
        }

        // if(event.url == '/index')this._idle.stop();
        // else this._idle.watch();
        //console.log(this.showNav);
        localStorage.removeItem('hideSideNav')
      });
    }
  ngOnDestroy(): void {
    // window.removeEventListener('beforeunload', this.handleBeforeUnload);
    // this.tabHeartBeat?.cleanup();
    localStorage.clear();
    localStorage.removeItem('roleId')
  }
}

///// SSO End  ////// 
///// Audit use Start  ////// 


// import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
// import { SideNavComponent } from "../views/shared/components/side-nav/side-nav.component";
// import { NavBarComponent } from "../views/shared/components/nav-bar/nav-bar.component";
// import { CommonModule } from '@angular/common';
// import { SidenavService } from '../views/shared/services/sidenav.service';
// import { filter } from 'rxjs';
// import { NotificationComponent } from "../views/shared/components/notification/notification.component";
// import { LoaderComponent } from "../views/shared/components/loader/loader.component";
// import { TranslateService } from '@ngx-translate/core';
// import { CommonService } from '../views/shared/services/common.service';
// import { TranslateModule } from '@ngx-translate/core';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, SideNavComponent, NavBarComponent, CommonModule, NotificationComponent, LoaderComponent, TranslateModule],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent implements OnInit {

//   sideNav     = inject(SidenavService);
//   _router     = inject(Router);
//   activeRoute = inject(ActivatedRoute);
//   common      = inject(CommonService);
//   cdr         = inject(ChangeDetectorRef);  // ✅ Added

//   // ✅ Default FALSE — jab tak confirm na ho ki private page hai, nav mat dikhao
//   showNav: boolean = false;
//   title = 'pcms';
//   isNavbarVisible: any = false;
//   sToken: any;

//   private readonly NO_NAV_URLS = [
//     '/developer-login-page',
//     '/login',
//     '/user-mapping',
//     '/under-maintaince',
//     '/case-management/lawyer-appointment-request/letter',
//     '/no-role-mapped',
//     '/role-selection',
//     '/home',
//     '/home/cause-list',
//     '/home/case-list',
//     '/home/website-policies',
//     '/404',
//     '/access-denied',
//     '/',
//     ''
//   ];

//   constructor(private translate: TranslateService) {
//     this.translate.setDefaultLang('en');
//     const lang = localStorage.getItem('lang') || 'en';
//     this.translate.use(lang);
//   }

//   ngOnInit(): void {
//     this.common.getLang().subscribe({
//       next: (res: string) => this.translate.use(res)
//     });

//     this.trackRouteChanges();
//     this.sideNav.setUserDetails(true);
//   }

//   switchLanguage(lang: 'en' | 'hi') {
//     localStorage.setItem('lang', lang);
//     this.translate.use(lang);
//   }

//   handleToggleSidebar(isVisible: any) {
//     this.isNavbarVisible = isVisible;
//   }

//   // ✅ Central method — decides show/hide and forces change detection
//   private applyNavVisibility(url: string): void {
//     const isNewWindow: any = localStorage.getItem('hideSideNav') || sessionStorage.getItem('sessionNewWindow');
//     const isNewWindowParsed = isNewWindow ? JSON.parse(isNewWindow) : false;

//     // Strip query params and hash before checking
//     const cleanUrl = url.split('?')[0].split('#')[0];

//     const isPublic = this.NO_NAV_URLS.includes(cleanUrl) || isNewWindowParsed;

//     if (isPublic) {
//       this.showNav = false;
//       this.isNavbarVisible = false;
//       this.sideNav.setIsSideNavOpen(false);
//     } else {
//       this.showNav = true;
//       this.isNavbarVisible = true;
//       this.sideNav.setIsSideNavOpen(true);
//     }

//     // ✅ Force Angular to re-render immediately — fixes timing issue
//     this.cdr.detectChanges();
//   }

//   private trackRouteChanges(): void {
//     this._router.events.pipe(
//       filter((event): event is NavigationEnd => event instanceof NavigationEnd)
//     ).subscribe((event: NavigationEnd) => {

//       window.scrollTo({ top: 0, behavior: 'smooth', left: 0 });

//       const isNewWindow: any = localStorage.getItem('hideSideNav') || sessionStorage.getItem('sessionNewWindow');
//       const isNewWindowParsed = isNewWindow ? JSON.parse(isNewWindow) : false;
//       const param = this.activeRoute.snapshot.queryParams;

//       if (
//         sessionStorage.getItem('loggedOut') === 'true' &&
//         !param['token'] &&
//         event.url !== '/ssologin' &&
//         event.urlAfterRedirects !== '/ssologin' &&
//         event.url !== '/developer-login-page'
//       ) {
//         // window.location.replace(constants.logoutToSSO);
//       }

//       window.addEventListener('popstate', () => {
//         if (
//           sessionStorage.getItem('loggedOut') === 'true' &&
//           !param['token'] &&
//           event.url !== '/ssologin' &&
//           event.urlAfterRedirects !== '/ssologin' &&
//           event.url !== '/developer-login-page'
//         ) {
//           window.history.forward();
//           // window.location.replace(constants.logoutToSSO);
//         }
//       });

//       // ✅ Apply on every navigation
//       this.applyNavVisibility(event.urlAfterRedirects || event.url);

//       if (isNewWindowParsed) {
//         sessionStorage.setItem('sessionNewWindow', isNewWindow);
//       }
//       localStorage.removeItem('hideSideNav');
//     });
//   }

//   ngOnDestroy(): void {
//     localStorage.clear();
//     localStorage.removeItem('roleId');
//   }
// }


///// Audit End  ////// 