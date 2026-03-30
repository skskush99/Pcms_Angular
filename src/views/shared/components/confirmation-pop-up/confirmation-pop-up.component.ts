// import { Component, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// @Component({
//   selector: 'app-confirmation-pop-up',
//   standalone: true,
//   imports: [],
//   templateUrl: './confirmation-pop-up.component.html',
//   styleUrl: './confirmation-pop-up.component.css'
// })
// export class ConfirmationPopUpComponent {


//   constructor(private dialogRef: MatDialogRef<ConfirmationPopUpComponent> , @Inject(MAT_DIALOG_DATA) public data:{msg : string , secondsLeft : string}){
    
//   }

//   onSelectNo(){
//     this.dialogRef.close(false)
//   }

//   onSelectYes(){
//     this.dialogRef.close(true)
//   }

// }


// import { Component, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-confirmation-pop-up',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './confirmation-pop-up.component.html',
// })
// export class ConfirmationPopUpComponent {

//   constructor(
//     private dialogRef: MatDialogRef<ConfirmationPopUpComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { msg: string; secondsLeft?: string }
//   ) {}

//   onSelectNo(): void {
//     this.dialogRef.close(false);
//   }

//   onSelectYes(): void {
//     this.dialogRef.close(true);
//   }
// }
import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-pop-up.component.html',
})
export class ConfirmationPopUpComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ConfirmationPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { msg: string; secondsLeft?: string },
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // ── Patch the CDK overlay pane (inline styles set by Material) ──
    // Walk up the DOM to find the .cdk-overlay-pane and strip its
    // max-height / overflow inline styles — the only reliable way.
    try {
      const pane = this.el.nativeElement.closest('.cdk-overlay-pane') as HTMLElement;
      if (pane) {
        pane.style.maxHeight  = 'none';
        pane.style.overflow   = 'visible';
        pane.style.width      = 'auto';
        pane.style.maxWidth   = '96vw';
      }

      // Also patch the mat-mdc-dialog-container sibling wrapper
      const container = this.el.nativeElement.closest(
        '.mat-mdc-dialog-container, .mat-dialog-container'
      ) as HTMLElement;
      if (container) {
        container.style.maxHeight   = 'none';
        container.style.overflow    = 'visible';
        container.style.background  = 'transparent';
        container.style.boxShadow   = 'none';
        container.style.padding     = '0';
      }

      // Patch the MDC surface
      const surface = this.el.nativeElement.closest(
        '.mdc-dialog__surface'
      ) as HTMLElement;
      if (surface) {
        surface.style.maxHeight  = 'none';
        surface.style.overflow   = 'visible';
        surface.style.background = 'transparent';
        surface.style.boxShadow  = 'none';
        surface.style.padding    = '0';
        surface.style.width      = 'auto';
      }
    } catch (_) {}
  }

  onSelectNo(): void  { this.dialogRef.close(false); }
  onSelectYes(): void { this.dialogRef.close(true);  }
}


