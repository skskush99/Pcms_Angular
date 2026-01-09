import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-selecr-role-button',
  standalone: true,
  imports: [],
  templateUrl: './selecr-role-button.component.html',
  styleUrl: './selecr-role-button.component.css'
})
export class SelecrRoleButtonComponent {

  params : any;



  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params    
  }

  loginUser(){
    this.params.clicked(this.params.data)
  }



  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }
}
