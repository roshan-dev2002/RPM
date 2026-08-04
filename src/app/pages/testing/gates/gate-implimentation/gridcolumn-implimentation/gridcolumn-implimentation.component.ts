import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-gridcolumn-implimentation',
  templateUrl: './gridcolumn-implimentation.component.html',
  styleUrls: ['./gridcolumn-implimentation.component.scss']
})
export class GridcolumnImplimentationComponent implements OnInit {

  allColumns: string[] = [
    'Move',
    'Actions',
    'Status',
    'Subject',
    'Description',
    'Guidelines',
    'Priority',
    'Mandatory'
  ];

  availableColumns: string[] = [];
  selectedColumns: string[] = [];
  searchQuery: string = '';
  freezeCount: number = 0;

  constructor(
    public dialogRef: MatDialogRef<GridcolumnImplimentationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.selectedColumns && this.data.selectedColumns.length > 0) {
      this.selectedColumns = [...this.data.selectedColumns];
      this.availableColumns = this.allColumns.filter(c => !this.selectedColumns.includes(c));
    } else {
      this.selectedColumns = [...this.allColumns];
      this.availableColumns = [];
    }

    if (this.data && this.data.freezeCount !== undefined) {
      this.freezeCount = this.data.freezeCount;
    }
  }

  get filteredAvailableColumns(): string[] {
    if (!this.searchQuery) {
      return this.availableColumns;
    }
    return this.availableColumns.filter(col =>
      col.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  selectColumn(col: string): void {
    const index = this.availableColumns.indexOf(col);
    if (index > -1) {
      this.availableColumns.splice(index, 1);
      this.selectedColumns.push(col);
    }
  }

  removeColumn(col: string): void {
    const index = this.selectedColumns.indexOf(col);
    if (index > -1) {
      this.selectedColumns.splice(index, 1);
      this.availableColumns.push(col);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onApply(): void {
    this.dialogRef.close({
      selectedColumns: this.selectedColumns,
      freezeCount: this.freezeCount
    });
  }

}
