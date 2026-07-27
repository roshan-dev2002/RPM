import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface GridColumn {
  key: string;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-freezepanes-dialog',
  templateUrl: './freezepanes-dialog.component.html',
  styleUrls: ['./freezepanes-dialog.component.scss']
})
export class FreezepanesDialogComponent implements OnInit {

  searchText: string = '';
  freezeCount: number = 0;

  allColumns: GridColumn[] = [
    { key: 'actions',     label: 'Actions',      visible: true },
    { key: 'status',      label: 'Status',        visible: true },
    { key: 'projectName', label: 'Project Name',  visible: true },
    { key: 'projectCode', label: 'Project Code',  visible: true },
    { key: 'projectLead', label: 'Project Lead',  visible: true },
    { key: 'section',     label: 'Section',       visible: true },
    { key: 'sectionLead', label: 'Section Lead',  visible: true },
  ];

  selectedColumns: GridColumn[] = [];

  freezeOptions: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<FreezepanesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.allColumns && this.data.allColumns.length > 0) {
      this.allColumns = this.data.allColumns.map((c: GridColumn) => ({ ...c }));
    }
    if (this.data && this.data.freezeCount !== undefined) {
      this.freezeCount = this.data.freezeCount;
    }
    // Initialize selected columns from visible ones
    this.selectedColumns = this.allColumns.filter(c => c.visible).map(c => ({ ...c }));
    this.updateFreezeOptions();
  }

  get filteredColumns(): GridColumn[] {
    const term = this.searchText.toLowerCase();
    return this.allColumns.filter(c => c.label.toLowerCase().includes(term));
  }

  isSelected(col: GridColumn): boolean {
    return this.selectedColumns.some(s => s.key === col.key);
  }

  toggleColumn(col: GridColumn): void {
    const idx = this.selectedColumns.findIndex(s => s.key === col.key);
    if (idx >= 0) {
      this.selectedColumns.splice(idx, 1);
    } else {
      this.selectedColumns.push({ ...col, visible: true });
    }
    // Clamp freezeCount
    if (this.freezeCount > this.selectedColumns.length) {
      this.freezeCount = this.selectedColumns.length;
    }
    this.updateFreezeOptions();
  }

  removeColumn(col: GridColumn): void {
    const idx = this.selectedColumns.findIndex(s => s.key === col.key);
    if (idx >= 0) {
      this.selectedColumns.splice(idx, 1);
    }
    // Uncheck in allColumns
    const orig = this.allColumns.find(c => c.key === col.key);
    if (orig) orig.visible = false;
    if (this.freezeCount > this.selectedColumns.length) {
      this.freezeCount = this.selectedColumns.length;
    }
    this.updateFreezeOptions();
  }

  drop(event: CdkDragDrop<GridColumn[]>): void {
    moveItemInArray(this.selectedColumns, event.previousIndex, event.currentIndex);
  }

  updateFreezeOptions(): void {
    this.freezeOptions = Array.from({ length: this.selectedColumns.length + 1 }, (_, i) => i);
  }

  getFrozenColumns(): GridColumn[] {
    return this.selectedColumns.slice(0, this.freezeCount);
  }

  applyChanges(): void {
    this.dialogRef.close({
      selectedColumns: this.selectedColumns,
      freezeCount: this.freezeCount
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}