import { Component } from '@angular/core';
import { DatePickerComponent } from "../../shared/components/date-picker/date-picker.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownListInterface } from '../../shared/model/shared.model';

@Component({
  selector: 'app-fir-charges-sheet',
  standalone: true,
  imports: [DatePickerComponent , NgSelectModule , ReactiveFormsModule],
  templateUrl: './fir-charges-sheet.component.html',
  styleUrl: './fir-charges-sheet.component.css'
})
export class FirChargesSheetComponent {


  sectionsDropdown : DropdownListInterface[] = [];
  actsDropdown : DropdownListInterface[] = [];
  classificationDropdown : DropdownListInterface[] = [];
}
