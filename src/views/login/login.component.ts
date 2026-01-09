import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  _router = inject(Router);

  loginForm = new FormGroup({
    userName : new FormControl(''),
    password : new FormControl('' , [Validators.required])
  })

  constructor(){

  }



  onSignIn(){
    console.log('1st');
    
    if(!this.loginForm.valid){
      this.loginForm.markAllAsTouched();
      return
    }
    console.log('2nd');
    
    if((this.loginForm.value.password === 'admin123' && this.loginForm.value.userName ==='admin')
      || (this.loginForm.value.password === 'user123' && this.loginForm.value.userName ==='user')
    ){
      console.log('hererer');
      this._router.navigateByUrl('dashboard');
    //   if(this.loginForm.value.userName === 'user')
    //   this._router.navigateByUrl('user-mapping');
    // else this._router.navigateByUrl('list-page');
    }else alert('Please Enter Valid Credentials')
  }



  


}
