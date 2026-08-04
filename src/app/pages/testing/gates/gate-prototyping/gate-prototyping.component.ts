import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddcriteriaComponent } from '../addcriteria/addcriteria.component';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { StatusConfirmationDialogComponent } from '../../testing-projects/add-projects/status-confirmation-dialog/status-confirmation-dialog.component';
import { GridcolumnPrototypingComponent } from './gridcolumn-prototyping/gridcolumn-prototyping.component';

@Component({
  selector: 'app-gate-prototyping',
  templateUrl: './gate-prototyping.component.html',
  styleUrls: ['./gate-prototyping.component.scss']
})
export class GatePrototypingComponent implements OnInit, OnDestroy {
  goBack(): void {
    this.location.back();
  }


  private subs = new Subscription();

  // Role Checks
  canDelete = true;
  canUpdate = true;

  // Track the currently viewed module
  selectedModule: any;

  // Data grouped by modules 
  modules = [
    {
      id: 1,
      name: 'Build Planning & Resources',
      criteria: [
        { id: 1, status: true, question: 'Has the prototype build plan been approved and documented?', description: 'Build plan is reviewed, approved, and formally documented.', answer: null, priority: 'High', mandatory: true },
        { id: 2, status: true, question: 'Are all required materials, components, and tools available for prototype development?', description: 'All materials and tools needed for the prototype are sourced.', answer: null, priority: 'High', mandatory: true },
        { id: 3, status: false, question: 'Has the prototype been developed according to the approved design specifications?', description: 'Prototype is built in line with the approved design specs.', answer: null, priority: 'Medium', mandatory: false }
      ]
    },
    {
      id: 2,
      name: 'Assembly & Functional Testing',
      criteria: [
        { id: 4, status: true, question: 'Have prototype assembly and manufacturing processes been validated?', description: 'Assembly and manufacturing steps are tested and confirmed.', answer: null, priority: 'High', mandatory: true },
        { id: 5, status: false, question: 'Have functional tests been conducted on the prototype?', description: 'Core functionality of the prototype has been tested and verified.', answer: null, priority: 'Medium', mandatory: false },
        { id: 6, status: false, question: 'Have design issues, defects, or performance gaps been identified and recorded?', description: 'All defects and gaps are logged and assigned for resolution.', answer: null, priority: 'High', mandatory: true },
        { id: 7, status: true, question: 'Has the prototype met the defined performance and quality criteria?', description: 'Prototype results are measured against set quality benchmarks.', answer: null, priority: 'High', mandatory: true }
      ]
    },
    {
      id: 3,
      name: 'Review & Next Steps Approval',
      criteria: [
        { id: 8, status: true, question: 'Have safety, usability, and reliability checks been completed on the prototype?', description: 'Safety and reliability evaluations are completed and passed.', answer: null, priority: 'High', mandatory: true },
        { id: 9, status: false, question: 'Has feedback from engineering, manufacturing, and stakeholders been collected and reviewed?', description: 'All stakeholder feedback is gathered and actioned appropriately.', answer: null, priority: 'Medium', mandatory: false },
        { id: 10, status: false, question: 'Has approval been obtained to move the prototype into formal testing or pilot production?', description: 'Formal sign-off to proceed to testing or pilot production received.', answer: null, priority: 'High', mandatory: true }
      ]
    }
  ];

  constructor(private dragulaService: DragulaService, private dialog: MatDialog, private location: Location) {
    if (this.dragulaService.find('PROTOTYPING_ROWS')) {
      this.dragulaService.destroy('PROTOTYPING_ROWS');
    }

    this.dragulaService.createGroup('PROTOTYPING_ROWS', {
      revertOnSpill: true,
    });

    this.subs.add(
      this.dragulaService.dropModel('PROTOTYPING_ROWS').subscribe(({ targetModel }) => {
        this.selectedModule.criteria = [...targetModel];
      })
    );
  }

  ngOnInit(): void {
    // Select the first module by default on load
    if (this.modules && this.modules.length > 0) {
      this.selectedModule = this.modules[0];
    }
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('PROTOTYPING_ROWS');
    this.subs.unsubscribe();
  }

  // Handle clicking a module in the sidebar
  selectModule(mod: any): void {
    this.selectedModule = mod;
  }

  addCriteria(): void {
    const dialogRef = this.dialog.open(AddcriteriaComponent, {
      width: '850px',
      height: 'auto',
      disableClose: false,
      data: { moduleId: this.selectedModule.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Criteria added:', result);
        this.selectedModule.criteria.push(result);
      }
    });
  }

  // --- HTML Binding Methods ---
  
  addmodule(item: any): void {
    let dialogRef = this.dialog.open(AddcriteriaComponent, {
      width: '850px',
      height: 'auto',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.question = result.question;
        item.description = result.description;
        item.priority = result.priority;
        item.mandatory = result.mandatory;
      }
    });
  }

  gridview(): void {
    this.dialog.open(GridcolumnPrototypingComponent, {
      width: '680px',
      data: {}
    });
  }

  deleteConfirmation(item: any): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedModule.criteria = this.selectedModule.criteria.filter((c: any) => c !== item);
      }
    });
  }

  Confirmation(item: any): void {
    let dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: 'Are you sure you want to Change the Status ?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.status = !item.status;
      }
    });
  }

  uploadGuidelines(){
    // Logic to handle guideline upload or download can be implemented here
  }
}