import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  constructor() { }

  private  navItems = new BehaviorSubject<Role>({roleId : 0 , roleName : ''});
  navItems$: Observable<Role> = this.navItems.asObservable();

  
  private sideNavOpenSubject = new BehaviorSubject<boolean>(true); // Initial state
  isSideNavOpen$: Observable<boolean> = this.sideNavOpenSubject.asObservable();


  private dropdownState = new BehaviorSubject<boolean>(false); // default is closed
  dropdownState$ = this.dropdownState.asObservable();
  
  
  private userDetails = new BehaviorSubject<boolean>(false); // default is closed
  userDetails$ = this.userDetails.asObservable();


  setIsSideNavOpen(val: boolean): void {
    this.sideNavOpenSubject.next(val);
  }

  getIsSideNavOpen(){
    return this.isSideNavOpen$
  }



  setNavItems(val: Role): void {
    this.navItems.next(val);
  }

  getNavItems(){
    return this.navItems$
  }
  
  
  setNavDropdownOpen(): void {
    this.dropdownState.next(false);
  }

  getNavDropdownOpen(){
    return this.dropdownState$
  }
  
  
  
  setUserDetails(val : boolean): void {
    this.userDetails.next(val);
  }

  getUserDetails(){
    return this.userDetails$
  }



  
}

interface Role{
  roleId : number,
  roleName : string,
  switchRole ?: boolean
}