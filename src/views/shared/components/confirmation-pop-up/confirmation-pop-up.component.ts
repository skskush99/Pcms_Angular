import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-pop-up',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-pop-up.component.html',
  styleUrl: './confirmation-pop-up.component.css'
})
export class ConfirmationPopUpComponent {


  constructor(private dialogRef: MatDialogRef<ConfirmationPopUpComponent> , @Inject(MAT_DIALOG_DATA) public data:{msg : string , secondsLeft : string}){
    
  }

  onSelectNo(){
    this.dialogRef.close(false)
  }

  onSelectYes(){
    this.dialogRef.close(true)
  }

}
