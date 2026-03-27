import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { NotificationService } from '../shared/services/notification.service';
import { SidenavService } from '../shared/services/sidenav.service';
import { UrlService } from '../shared/services/url.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-menu-mapping',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './user-menu-mapping.component.html',
  styleUrl: './user-menu-mapping.component.css'
})
export class UserMenuMappingComponent {

  menuMappingOption : any;
  roleId : string = '';
  ifview : boolean = false;
  app : boolean = false;
  userId : number = 0;
  notify = inject(NotificationService)
  currClickedSubMenu : number | null = null ;
  showSubMenuPermission : boolean = false;
  selectedOptions : any[] = []


  constructor(private api : ApiService , private url : UrlService , private router : Router , private _sideNavService : SidenavService){
    //console.log(this.menuMappingOption);
    //console.log(this.roleId);
    
  }


  ngOnInit(): void {
    this.menuMappingOption = history.state.mappingData;    
    this.app = history.state.app;
    this.roleId = history.state.roleId;
    this.ifview = this.menuMappingOption?.view;
    this.userId = history.state?.userId || 0;
    this.getMappingMenu();
    // console.log(this.app);
    
  }


  getMappingMenu(){
    let reqParam = {
      // Token : localStorage.getItem("token"),
      RoleId : 2
    }

    this.api.get(this.url.getMenuMapping() , reqParam).subscribe({
      next : (res : any) =>{
        this.menuMappingOption = res?.data;
        console.log(res);
        // this.router.navigateByUrl("user/edit-menu-mapping" , {state : {mappingData : res.data , roleId : param.roleId , pageSize : this.pageSize}})
      },
      error : (err) => {
        //console.log(err);
        
      }
    })
  }

  updateSubMenus(menu: any) {
    if (menu.subMenus) {
      menu.subMenus.forEach((sub: any) => {
        sub.isSelected = menu.isSelected;
      });
    }
  }
  
  updateParentMenu(menu: any) {
    // Check if any submenu is selected
    menu.isSelected = menu.subMenus.some((sub: any) => sub.isSelected);
  }

  onSubmit(formValue: any): void {
    let updatedMenuMappingOption = JSON.parse(JSON.stringify(this.menuMappingOption));
    const selectedItems = updatedMenuMappingOption
      .filter((menu: { isSelected: any; subMenus: any[]; }) => menu.isSelected || menu.subMenus.some((sub: { isSelected: any; }) => sub.isSelected))
      .map((menu: { subMenus: any[]; }) => ({
        menu,
        subMenus: menu.subMenus.filter((sub: { isSelected: any; }) => sub.isSelected)
      }));

    selectedItems.map((item : any) => {
      item.menu.subMenus = item.subMenus
      this.selectedOptions.push(item.menu)
    })    

    //console.log(this.selectedOptions);
    
    
    if(this.selectedOptions.length > 0) this.editMenuMapping()
      else this.notify.showNotification('warning' , "Please Select At Lease 1 Menu Option")
  }

  editMenuMapping(){
    console.log(this.selectedOptions);
    // return;
    let reqParam : any
    this.roleId = '2';
    if(!this.userId){
    reqParam = {
      tocken : localStorage.getItem("token"),
      roleId : this.roleId,
      data : this.selectedOptions
    }
  }else{
    reqParam = {
      tocken : localStorage.getItem("token"),
      roleId : this.roleId,
      userId : this.userId,
      data : this.selectedOptions
    }
  }
  // console.log(reqParam);return
  

    this.api.post( this.userId ? this.url.addEditUserWiseMenuMapping() :this.url.editMenuMapping() , reqParam).subscribe({
      next : (res : any) => {
        if(res.status){
          this.notify.showNotification('success' , res.message);
          this._sideNavService.setNavItems({roleId : 0 , roleName : ''})
          this.router.navigateByUrl(this.userId ? "user/user-registration" : this.app ? 'user/app-menu-mapping' : 'user/menu-mapping' , {state : {prevPageSize : history.state?.pageSize}})
        }else this.notify.showNotification('error' , res.message)        
      },
      error : (err) => {
        this.notify.showNotification('error' , "Something Went Wrong")
      }
    })
  }

  onCancel(){
    //console.log(history.state?.pageSize);
    
    this.router.navigateByUrl(this.userId ? 'user/user-registration' : this.app ? 'user/app-menu-mapping' : 'user/menu-mapping' , {state : {prevPageSize : history.state?.pageSize}})
  }


  
  subMenuStatus(status : any) {
    //console.log(status);
    
    if(status?.id == this.currClickedSubMenu){
      this.showSubMenuPermission = false;
      this.currClickedSubMenu = null;
    }else{
      this.currClickedSubMenu = status?.id
      this.showSubMenuPermission = true;
    }

  }

}
