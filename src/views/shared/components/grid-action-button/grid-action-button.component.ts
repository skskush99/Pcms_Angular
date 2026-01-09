import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-action-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid-action-button.component.html',
  styleUrl: './grid-action-button.component.css'
})
export class GridActionButtonComponent implements ICellRendererAngularComp{

  Type: any;
  params: any;
  // permission: any;
  // master : string = '';

   agInit(params: ICellRendererParams): void {
    this.params = params;
    this.Type = this.params.Type;
    // this.permission = this.params.permission;
    // this.master = this.params.master;
    // this.roleId = this.params.roleId;
    // this.loggedUser = this.params.loggedUser
    // this.isJrLawyerPayment = this.params.isJr;
  }

  
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }

  delete(){
    this.params.delete(this.params.data)
  }
  
  
  edit(){
    this.params.edit(this.params.data)
  }

  permissionMappingApprove(){
    this.params.permissionMappingApprove(this.params.data);
  }

}
