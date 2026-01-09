import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  currentLang = new BehaviorSubject<string>('en');

  detailPopUpHide = new BehaviorSubject<boolean>(false);

  constructor() { }



  setLang(lang : string){
    this.currentLang.next(lang);
  }

  getLang(){
    return this.currentLang.asObservable();
  }
  
  
  setHideDetailPopup(state : boolean){
    this.detailPopUpHide.next(state);
  }

  getHideDetailPopup(){
    return this.detailPopUpHide.asObservable();
  }


}  