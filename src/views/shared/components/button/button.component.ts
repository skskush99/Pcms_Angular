// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';

// @Component({
//   selector: 'app-button',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './button.component.html',
//   styleUrl: './button.component.css'
// })
// export class ButtonComponent implements OnInit{

//   @Input() label: string = 'Button';
//   @Input() type: 'button' | 'submit' | 'reset' = 'button';
//   @Input() look : string = '';
//   @Input() disabled: boolean = false;
//   @Input() bgType : any = 0
//   @Output() clicked = new EventEmitter<void>();

//   ngOnInit(): void {
// //     switch (this.bgType) {
// //   case 1: // submit
// //     this.bgType = 'bg-green-500';
// //     break;
// //   case 2: // cancel
// //     this.bgType = 'bg-red-500';
// //     break;
// //   case 3: // add new
// //     this.bgType = 'bg-orange-500';
// //     break;
// //   case 4: // search
// //     this.bgType = 'bg-teal-400';
// //     break;
// //   case 5://reset
// //     this.bgType = 'bg-teal-500';
// //     break;
// //   default:
// //     this.bgType = ''; // optional fallback
// // }

//   const bgMap: Record<number, string> = {
//     1: 'bg-green-500 hover:bg-green-600',//submit
//     2: 'bg-red-500 hover:bg-red-600',//cancel
//     3: 'px-5 py-2.5 bg-gradient-to-r from-[#4CAF50] to-[#229726] hover:from-[#45a049] hover:to-[#1e8521] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm flex items-center gap-2',//add new
//     4: 'px-8 py-3 bg-gradient-to-r from-[#496D7E] to-[#5a7f92] hover:from-[#3d5a6a] hover:to-[#496D7E] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2',//search
//     5: 'px-8 py-3 bg-gradient-to-r from-[#2f3842] to-[#26313c] hover:from-[#1f2529] hover:to-[#1a1f24] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2',//reset
//     6: 'bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white px-6 py-2.5 rounded-lg hover:bg-white/30 hover:border-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2',//toggle Filter,
//     7: 'px-5 py-2.5 border-0 bg-green-900 hover:bg-green-900 text-dark font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm flex items-center gap-2'
//   };
//   this.bgType = bgMap[this.bgType] || '';
//   // console.log(this.bgType);
  
//   }

//   get buttonClasses(): string {
//   const baseClasses =
//     'px-6 py-2.5 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors duration-200 shadow-sm';

//   // parent classes LAST → override base
//   return `${baseClasses} ${this.bgType} ${this.look}`.trim();
// }


//   onClick() {
//     if (!this.disabled) {
//       this.clicked.emit();
//     }
//   }

// }




// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

// @Component({
//   selector: 'app-button',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './button.component.html',
//   styleUrls: ['./button.component.css'],
//   encapsulation: ViewEncapsulation.None,
//    host: {                              
//     '[style.display]': '"contents"',
//     '[style.background]': '"none"',
//     '[style.border]': '"none"',
//     '[style.padding]': '"0"',
//   }
// })
// export class ButtonComponent {

//   @Input() label: string = '';
//   @Input() type: 'button' | 'submit' | 'reset' = 'button';
//   @Input() look: string = '';
//   @Input() disabled: boolean = false;
//   @Input() bgType: number = 0;
//   @Input() icon: string = '';  // ← NEW

//   @Output() clicked = new EventEmitter<void>();

//   private bgMap: Record<number, string> = {
//     1: 'btn-type-1',
//     2: 'btn-type-2',
//     3: 'btn-type-3',
//     4: 'btn-type-4',
//     5: 'btn-type-5',
//     6: 'btn-type-6',
//     7: 'btn-type-7',
//   };

//   private iconMap: Record<string, string> = {  // ← NEW
//     'edit'   : 'fa-solid fa-pen-to-square tbl-icon-edit',
//     'delete' : 'fa-solid fa-trash tbl-icon-delete',
//     'add'    : 'fa-solid fa-plus',
//     'search' : 'fa-solid fa-magnifying-glass',
//     'reset'  : 'fa-solid fa-rotate-left',
//     'filter' : 'fa-solid fa-sliders',
//     'excel'  : 'fa-solid fa-file-excel',
//     'pdf'    : 'fa-solid fa-file-pdf',
//   };

//   get iconClass(): string {  
//     return this.iconMap[this.icon] || this.icon;
//   }

//   get isIconOnly(): boolean { 
//     return (this.icon === 'edit' || this.icon === 'delete') && !this.label;
//   }

//   get buttonClasses(): string {
//     if (this.isIconOnly) return '';
//     const bgClass = this.bgMap[this.bgType] || '';
//     return `app-btn ${bgClass} ${this.look}`.trim();
//   }

//   onClick() {
//     if (!this.disabled) {
//       this.clicked.emit();
//     }
 
//   }
// }



import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.display]': '"contents"',
    '[style.background]': '"none"',
    '[style.border]': '"none"',
    '[style.padding]': '"0"',
  }
})
export class ButtonComponent {

  @Input() label: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() look: string = '';
  @Input() disabled: boolean = false;
  @Input() bgType: number = 0;
  @Input() icon: string = '';

  @Output() clicked = new EventEmitter<void>();

  private bgMap: Record<number, string> = {
    1: 'btn-type-1',
    2: 'btn-type-2',
    3: 'btn-type-3',
    4: 'btn-type-4',
    5: 'btn-type-5',
    6: 'btn-type-6',
    7: 'btn-type-7',
  };

  private iconMap: Record<string, string> = {
    'edit'   : 'fa-solid fa-pen-to-square',
    'delete' : 'fa-solid fa-trash',
    'add'    : 'fa-solid fa-plus',
    'search' : 'fa-solid fa-magnifying-glass',
    'reset'  : 'fa-solid fa-rotate-left',
    'filter' : 'fa-solid fa-sliders',
    'excel'  : 'fa-solid fa-file-excel',
    'pdf'    : 'fa-solid fa-file-pdf',
  };

  get iconClass(): string {
    return this.iconMap[this.icon] || this.icon;
  }

  get isIconOnly(): boolean {
    return (this.icon === 'edit' || this.icon === 'delete') && !this.label;
  }

  // edit → 'btn-file-action preview'  (blue)
  // delete → 'btn-file-action delete' (red)
  get fileActionClass(): string {
    if (this.icon === 'edit')   return 'btn-file-action preview';
    if (this.icon === 'delete') return 'btn-file-action delete';
    return '';
  }

  get buttonClasses(): string {
    if (this.isIconOnly) return this.fileActionClass;
    const bgClass = this.bgMap[this.bgType] || '';
    return `app-btn ${bgClass} ${this.look}`.trim();
  }

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}