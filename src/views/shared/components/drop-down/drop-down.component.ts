import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-drop-down',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.css']
})
export class DropDownComponent {

  @Input() districts: any[] = [];
  @Input() control!: FormControl;
  @Input() placeholder: string = 'Select District';

  @Output() valueChange = new EventEmitter<any>();

  onChange(value: any) {
    this.valueChange.emit(value);
  }
}
