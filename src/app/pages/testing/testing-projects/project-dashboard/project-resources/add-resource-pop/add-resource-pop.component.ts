import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-resource-pop',
  templateUrl: './add-resource-pop.component.html',
  styleUrls: ['./add-resource-pop.component.scss']
})
export class AddResourcePopComponent implements OnInit {

  isEditMode: boolean = false;

  resource: string = '';
  stage: string = '';
  module: string = '';
  task: string = '';
  fromDate: string = '';
  toDate: string = '';
  fromTime: string = '';
  toTime: string = '';
  planDuration: string = '';
  actualDuration: string = '';
  status: string = 'Active';

  stages: string[] = ['Feasibility', 'Design', 'Prototyping', 'Testing', 'Development', 'Deployment', 'Review'];
  statuses: string[] = ['Active', 'Completed', 'Pending'];

  constructor(
    public dialogRef: MatDialogRef<AddResourcePopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.resource = this.data.resource || this.data.name || '';
      this.stage = this.data.stage || '';
      this.module = this.data.module || '';
      this.task = this.data.task || '';
      this.fromDate = this.data.fromDate || '';
      this.toDate = this.data.toDate || '';
      this.fromTime = this.data.fromTime || '';
      this.toTime = this.data.toTime || '';
      this.planDuration = this.data.planDuration || '';
      this.actualDuration = this.data.actualDuration || '';
      this.status = this.data.status || 'Active';
    }
  }

  save(): void {
    if (!this.resource || !this.resource.trim()) {
      alert('Please enter a Resource Name.');
      return;
    }
    const initials = this.resource.trim().split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'RS';
    this.dialogRef.close({
      code: this.data?.code || 'RES' + Math.floor(100 + Math.random() * 900),
      name: this.resource.trim(),
      resource: this.resource.trim(),
      initials: initials,
      stage: this.stage || 'General',
      module: this.module || 'General',
      task: this.task || 'Task',
      fromDate: this.fromDate || new Date().toISOString().split('T')[0],
      toDate: this.toDate || new Date().toISOString().split('T')[0],
      fromTime: this.fromTime || '09:00 AM',
      toTime: this.toTime || '05:00 PM',
      planDuration: this.planDuration || '8 hours',
      actualDuration: this.actualDuration || 'N/A',
      status: this.status || 'Active',
      color: this.status === 'Completed' ? '#e0f2fe' : (this.status === 'Active' ? '#dcfce7' : '#f3e8ff'),
      dayPlacement: 'Monday'
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
