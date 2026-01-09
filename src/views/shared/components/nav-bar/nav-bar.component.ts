import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output , ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SidenavService } from '../../services/sidenav.service';
import constants from '../../utils/constants';
import { trigger, transition, style, animate } from '@angular/animations';
import { WordsRestrictService } from '../../services/words-restrict.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  animations: [
   
      trigger('onOff' , [
      transition(':enter', [
        style({
          transform: 'translateY(-100%)', 
          opacity: 0, 
        }),
        animate('300ms ease-in', style({
          transform: 'translateY(25%)', 
          opacity: 1, 
        })),
        animate('300ms ease-out', style({
          transform: 'translateY(0%)', 
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
export class NavBarComponent implements OnInit{

  api = inject(ApiService);
  _router = inject(Router);
  _navToggle = inject(SidenavService);
  wordRestrict = inject(WordsRestrictService);
  common = inject(CommonService);
  showSearchCaseField : boolean = true;
  isOpen : boolean = true
  currentUser : any;
  sToken : any;
  openUserDetails : boolean = false;
  @Output() toggleSidebar = new EventEmitter<boolean>();
  @ViewChild('redirectBackToSSO', { static: false })
  redirectBackToSSO!: ElementRef<HTMLFormElement>;
  
  searchCaseForm : FormGroup = new FormGroup({

  })


  ngOnInit(): void {
    let loggedUser : any = localStorage.getItem('roles');
    this.currentUser = JSON.parse(loggedUser)

    

    this.trackRouteChanges();
  }


  @HostListener('window:click', ['$event'])
  closeDetails(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if(!target.closest('#userDetailDropdown') ){
      this.openUserDetails = false;
    }
  }


  // toggleSidebarVisibility(){
    
  // }


  toggleSidebarVisibility(isNewWindow?:string) {
    //console.log(isNewWindow);
    
    this.isOpen = isNewWindow ? false :  !this.isOpen;
    this._navToggle.setIsSideNavOpen(this.isOpen);
    this.toggleSidebar.emit(this.isOpen);
  }



  openDetailDropdown(){
    this.openUserDetails = !this.openUserDetails
  }



  logout(){

  }


  changeLang(lang : string){
    this.common.setLang(lang);
  }


  backToSso(){
    this.sToken = localStorage.getItem('stoken');
    this.redirectBackToSSO.nativeElement.action = constants?.backTOSSO
    localStorage.clear();
    this.redirectBackToSSO.nativeElement.submit();
  }


   private handleRouteChange(url: string): void {
    
    if(url == '/' || url == '/dashboard'){
      this.showSearchCaseField = true;
    }else this.showSearchCaseField = false;
    
  }



  private trackRouteChanges(): void {
    
    this._router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd) 
    ).subscribe((event: NavigationEnd) => {
        this.handleRouteChange(event.url);
    });
  }

}
