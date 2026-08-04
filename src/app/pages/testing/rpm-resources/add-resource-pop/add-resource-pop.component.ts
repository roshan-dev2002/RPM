import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-resource-pop',
  templateUrl: './add-resource-pop.component.html',
  styleUrls: ['./add-resource-pop.component.scss']
})
export class AddResourcePopComponent implements OnInit {

  resourceCode = '';
  resourceName = '';
  fromDate = '';
  toDate = '';
  fromTime = '';
  toTime = '';

  constructor(
    public dialogRef: MatDialogRef<AddResourcePopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      code: this.resourceCode.trim() || 'RES' + Math.floor(100 + Math.random() * 900),
      name: this.resourceName.trim() || 'New Resource',
      fromDate: this.fromDate,
      toDate: this.toDate,
      fromTime: this.fromTime,
      toTime: this.toTime
    });
  }

}
