import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addstagesmodule',
  templateUrl: './addstagesmodule.component.html',
  styleUrls: ['./addstagesmodule.component.scss']
})
export class AddstagesmoduleComponent implements OnInit {

  moduleForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddstagesmoduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.moduleForm = this.fb.group({
      moduleName: ['', [Validators.required]],
      planStart: [''],
      planEnd: [''],
      planEffort: [''],
      description: ['']
    });

    if (this.data) {
      this.isEditMode = true;
      this.moduleForm.patchValue(this.data);
    }
  }

  ngOnInit(): void {
  }

  onSave(): void {
    if (this.moduleForm.valid) {
      this.dialogRef.close(this.moduleForm.value);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
