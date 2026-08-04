import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface TimesheetRow {
  module: string;
  task: string;
  hours: number;
  description: string;
  searchText?: string;
}

@Component({
  selector: 'app-add-hours-pop',
  templateUrl: './add-hours-pop.component.html',
  styleUrls: ['./add-hours-pop.component.scss']
})
export class AddHoursPopComponent implements OnInit {

  isEditMode = false;
  dateStr = '';
  name: string | null = null;

  employeeOptions: string[] = [
    'Ravi Sharma',
    'Priya Singh',
    'Amit Kumar',
    'Neha Sharma',
    'Vikram Joshi'
  ];
  nameSearchTerm = '';

  get filteredEmployeeOptions(): string[] {
    if (!this.nameSearchTerm || !this.nameSearchTerm.trim()) {
      return this.employeeOptions;
    }
    const term = this.nameSearchTerm.toLowerCase().trim();
    return this.employeeOptions.filter(e => e.toLowerCase().includes(term));
  }

  rows: TimesheetRow[] = [];

  availableTasks = [
    'Define product & technical specifications',
    'Identify raw material requirements',
    'Estimate target production volume',
    'Initial BOM & labor cost estimation',
    'Assess existing factory floor capacity',
    'Regulatory and EHS compliance check',
    'Identify required new machinery (CAPEX)',
    'Preliminary supply chain & vendor assessment',
    'Draft initial project charter',
    'Schedule Gate 1 Review',
    'Analyze manufacturing process constraints',
    'Review machine cycle time vs. target output',
    'Assess facility tooling capabilities',
    'Determine automation feasibility index',
    'Model NPV and IRR for 5-year production run',
    'Calculate payback period options',
    'Forecast operational expenditures (OPEX)',
    'Review project charter document',
    'Verify initial business case & ROI feasibility',
    'Sign-off from executive sponsors'
  ];

  constructor(
    public dialogRef: MatDialogRef<AddHoursPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.name = this.data.name || null;
      if (this.data.dateObj) {
        const d = this.data.dateObj;
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const yyyy = d.getFullYear();
        this.dateStr = `${yyyy}-${mm}-${dd}`;
      }
      if (this.data.tasksList && this.data.tasksList.length > 0) {
        this.rows = this.data.tasksList.map((t: any) => ({
          module: t.module || '',
          task: t.task || null,
          hours: t.hours || 0,
          description: t.description || ''
        }));
      } else {
        this.rows = [
          {
            module: this.data.module || '',
            task: this.data.task || null,
            hours: this.data.hours || 0,
            description: this.data.description || ''
          }
        ];
      }
    } else {
      this.isEditMode = false;
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.dateStr = `${today.getFullYear()}-${mm}-${dd}`;
      this.rows = [
        { module: '', task: null, hours: 0, description: '' }
      ];
    }
  }

  addRow(): void {
    this.rows.push({ module: '', task: null as any, hours: 0, description: '' });
  }

  deleteRow(index: number): void {
    if (this.rows.length > 1) {
      this.rows.splice(index, 1);
    } else {
      this.rows[0] = { module: '', task: null as any, hours: 0, description: '' };
    }
  }

  getFilteredTasks(searchText?: string): string[] {
    if (!searchText) {
      return this.availableTasks;
    }
    const term = searchText.toLowerCase();
    return this.availableTasks.filter(t => t.toLowerCase().includes(term));
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      dateObj: this.dateStr ? new Date(this.dateStr) : new Date(),
      name: this.name,
      rows: this.rows
    });
  }
}
