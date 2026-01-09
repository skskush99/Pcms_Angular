import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, forwardRef, inject, Input, NgZone, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject, fromEvent, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent {

@ViewChild('hiddenDateInput') hiddenDateInput!: ElementRef<HTMLInputElement>;
  @Input() max: string | null = '';
  @Input() min: string | null = '';
  @Input() disable: boolean | null = false;
  @Input() required: boolean = false;
  
  datePipe = inject(DatePipe);
  private zone = inject(NgZone);
  formattedDate: string = '';
  value: string | null = null;
  private _onChange = (value: any) => {};
  private _onTouched = () => {};
  private destroy$ = new Subject<void>();
  private previousValue: string = '';
  private pickerOpen = false;
  
  // Add touched state tracking
  private _touched = false;

  ngAfterViewInit() {
    // Listen for the cancel or ESC key events
    fromEvent(document, 'keydown').pipe(
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      if (this.pickerOpen && (event.key === 'Escape' || event.key === 'Cancel')) {
        this.zone.run(() => {
          this.markAsTouched();
          this.checkForClear();
        });
      }
    });

    // Listen for focus out events on the window
    fromEvent(window, 'blur').pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.pickerOpen) {
        setTimeout(() => {
          this.zone.run(() => {
            this.markAsTouched();
            this.checkForClear();
          });
        }, 150);
      }
    });

    // Listen for window resize which can indicate picker closing
    fromEvent(window, 'resize').pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.pickerOpen) {
        setTimeout(() => {
          this.zone.run(() => {
            this.markAsTouched();
            this.checkForClear();
          });
        }, 150);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDatePicker() {
    if (this.disable) return;
    
    const hiddenInput = this.hiddenDateInput.nativeElement;
    
    // Store the current value for comparison later
    this.previousValue = hiddenInput.value;
    
    // Set the current value if available
    if (this.formattedDate) {
      const [day, month, year] = this.formattedDate.split('-');
      hiddenInput.value = `${year}-${month}-${day}`;
      this.previousValue = hiddenInput.value;
    } else {
      hiddenInput.value = '';
      this.previousValue = '';
    }
    
    // Set picker as open
    this.pickerOpen = true;

    // Focus and show the date picker
    setTimeout(() => {
      hiddenInput.focus();
      if (hiddenInput.showPicker) {
        hiddenInput.showPicker();
      }
      
      // Set up polling to check for changes
      this.startPollingForClear();
    }, 0);
  }

  startPollingForClear() {
    const pollingInterval = timer(200, 200).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const hiddenInput = this.hiddenDateInput.nativeElement;
      
      // Check if the picker dialog is still open
      if (document.activeElement !== hiddenInput && this.pickerOpen) {
        this.zone.run(() => {
          this.markAsTouched();
          this.checkForClear();
          pollingInterval.unsubscribe();
        });
      }
    });
  }

  checkForClear() {
    if (!this.pickerOpen) return;
    
    const hiddenInput = this.hiddenDateInput.nativeElement;
    const currentValue = hiddenInput.value;
    
    // Mark as touched when picker closes
    this.markAsTouched();
    
    // If the value is empty and there was a previous value, the clear button was clicked
    if (!currentValue && this.previousValue) {
      this.clearDate();
    } else if (currentValue && currentValue !== this.previousValue) {
      // If the value changed but isn't empty, a date was selected
      this.updateDate(currentValue);
    }
    
    this.pickerOpen = false;
  }

  onDateSelected(event: Event) {
    const input = (event.target as HTMLInputElement);
    const value = input.value;
    
    this.markAsTouched();
    
    if (value) {
      this.updateDate(value);
    } else if (this.formattedDate) {
      // If the input is now empty but we had a value before
      this.clearDate();
    }
  }

  updateDate(value: string) {
    this.markAsTouched();
    
    if (!value) {
      this.clearDate();
      return;
    }
    
    const [year, month, day] = value.split('-');
    this.formattedDate = `${day}-${month}-${year}`;
    const dateObj = this.datePipe.transform(new Date(+year, (+month) - 1, +day), 'yyyy-MM-dd');
    this.value = dateObj;
    this._onChange(dateObj);
    
    this.pickerOpen = false;
  }

  clearDate() {
    //console.log('Clearing date');
    this.formattedDate = '';
    this.value = null;
    this.hiddenDateInput.nativeElement.value = '';
    this._onChange(null);
    this.markAsTouched();
  }

  // Add method to mark as touched
  private markAsTouched() {
    if (!this._touched) {
      this._touched = true;
      this._onTouched();
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value;
    if (value) {
      if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const dd = String(date.getDate()).padStart(2, '0');
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const yyyy = date.getFullYear();
          this.formattedDate = `${dd}-${mm}-${yyyy}`;
          
          if (this.hiddenDateInput && this.hiddenDateInput.nativeElement) {
            this.hiddenDateInput.nativeElement.value = `${yyyy}-${mm}-${dd}`;
          }
        }
      } else if (value instanceof Date) {
        const dd = String(value.getDate()).padStart(2, '0');
        const mm = String(value.getMonth() + 1).padStart(2, '0');
        const yyyy = value.getFullYear();
        this.formattedDate = `${dd}-${mm}-${yyyy}`;
        
        if (this.hiddenDateInput && this.hiddenDateInput.nativeElement) {
          this.hiddenDateInput.nativeElement.value = `${yyyy}-${mm}-${dd}`;
        }
      }
    } else {
      this.formattedDate = '';
      if (this.hiddenDateInput && this.hiddenDateInput.nativeElement) {
        this.hiddenDateInput.nativeElement.value = '';
      }
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  // Validator implementation
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && (!control.value || control.value === '')) {
      return { required: true };
    }
    return null;
  }


}
