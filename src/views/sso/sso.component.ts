import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { UrlService } from '../shared/services/url.service';
import { NotificationService } from '../shared/services/notification.service';
import constants from '../shared/utils/constants';

@Component({
  selector: 'app-sso',
  standalone: true,
  imports: [],
  templateUrl: './sso.component.html',
  styleUrl: './sso.component.css'
})
export class SsoComponent {

   _router = inject(ActivatedRoute);
  notify = inject(NotificationService);
  localIpAddresses: string[] = [];
  constructor(private router: Router, private route: ActivatedRoute, 
    private urls: UrlService, private api: ApiService,) {
  }


  ngOnInit() {
    // this.loaderService.show();
    // localStorage.removeItem('ssoid');
    // localStorage.removeItem('currentUser');
    // localStorage.clear();
    let param = this._router.snapshot.queryParams;
    //console.log(param['token']);
    localStorage.setItem('stoken' , param['token'])
    // localStorage.setItem('ia2' , param['ia'])
    // get ip
    try {
      let ssotoken: any;

      // Listen for a POST request with FormData
      const form = new FormData();
      // Extract the token from FormData
      //console.log(form);
      ssotoken = form.get('userdetails') as string;
      // let ip = param['ia'].replaceAll('IA' , '.')
      let reqParams = {
        userName : '',
        password : '',
        userDetails : '',
        ssoToken : param['token'],
        isSSOLogin: true,
        ipAddress: '123.123.12'
      }
      
      
      // localStorage.setItem('ia' , JSON.stringify(param['ia']))

      this.api.post(this.urls.getSSOLoginUrl(), reqParams ).subscribe({
        next: (res: any) => {
          sessionStorage.removeItem('loggedOut');
          console.log(res);
          console.log(res?.userMappingReq);
          
          if(!res.status){
            this.router.navigateByUrl('user-mapping' , {state : {ssoId : res.data[0]?.ssoid , userMappedRequest : res?.userMappingReq , mappingReqData : res?.userMappingReq ?  res?.data : null}});
            return
          }
          
          // if (res.status) {
            // localStorage.setItem("roles", JSON.stringify(res.data));
            localStorage.setItem('stoken' , param['token'])
            this.router.navigateByUrl('role-selection', { state: { userLists: res.data , reqParam : reqParams} })
            // this.router.navigateByUrl('under-maintaince')
          // } else {
          //   this.notify.showNotification('error', res.message)
          // }
        },
        error: (error : Error) => {
          console.error(error)
          this.notify.showNotification('error' , constants.apiError)
          // this.notify.showNotification('error', "Something Went Wrong")
        },
        complete: () => console.log('request completed')
      })
    } catch (e) {
      //console.log('Function- ssologin;Error -' + e);
    }
  }
}
