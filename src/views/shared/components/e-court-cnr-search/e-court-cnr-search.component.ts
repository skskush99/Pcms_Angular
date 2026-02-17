import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-e-court-cnr-search',
  standalone: true,
  imports: [DatePipe , CommonModule],
  templateUrl: './e-court-cnr-search.component.html',
  styleUrl: './e-court-cnr-search.component.css'
})
export class ECourtCnrSearchComponent implements OnInit{

  cnrSearchResult : any
  acts : any[] = [];
  historyOfCaseHearing : any[] = [];
  constructor(private dialogRef: MatDialogRef<ECourtCnrSearchComponent> ,@Inject(MAT_DIALOG_DATA) public data:any){ }


  ngOnInit(): void {
    this.cnrSearchResult = this.data;
          if(this.cnrSearchResult?.acts)this.acts = Object.keys(this.cnrSearchResult.acts).map(key => this.cnrSearchResult.acts[key]);

          if(this.cnrSearchResult?.historyofcasehearing)this.historyOfCaseHearing = Object.keys(this.cnrSearchResult.historyofcasehearing).map(key => this.cnrSearchResult.historyofcasehearing[key])
  }

}
