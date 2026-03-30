import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UrlService } from '../shared/services/url.service';
import { ApiService } from '../shared/services/api.service';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  _router = inject(Router);
  router = inject(Router)

  loginForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl('', [Validators.required])
  })



  constructor(
    private notify: NotificationService,
    // private _router: Router,
    private api: ApiService,
    // private dialog: MatDialog,
    private url: UrlService,
    // private excel: XlsxService,
    // private datePipe: DatePipe
  ) { }


  // onSignIn(){
  //   console.log('1st');

  //   if(!this.loginForm.valid){
  //     this.loginForm.markAllAsTouched();
  //     return
  //   }
  //   console.log('2nd');

  //   if((this.loginForm.value.password === 'admin@123' && this.loginForm.value.userName ==='admin')
  //     || (this.loginForm.value.password === 'user@123' && this.loginForm.value.userName ==='user')
  //   ){
  //     console.log('hererer');
  //     this._router.navigateByUrl('dashboard');
  //   //   if(this.loginForm.value.userName === 'user')
  //   //   this._router.navigateByUrl('user-mapping');
  //   // else this._router.navigateByUrl('list-page');
  //   }else alert('Please Enter Valid Credentials')
  // }


  onSignIn() {
    let reqParams = {
      ...this.loginForm.value,
      isSSOLogin: false,
      ipAddress: '10.70.234.9',
      userDetails: '',
      ssoToken: ''
    }
    this.api.post(this.url.getSSOLoginUrl(), reqParams).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.status) {
          console.log(typeof (res.data[0]?.token))
          console.log(res.data);
           this.router.navigateByUrl('role-selection', { state: { userLists: res } })
          //this._router.navigateByUrl('dashboard');
        } else {
          this.loginForm.reset();
          this.notify.showNotification('error', res.message)
        }
      },
      error: (error) => {
        console.log(error)
        this.notify.showNotification('error', "Something Went Wrong")
      },
      complete: () => console.log('request completed')
    })

  }






}
