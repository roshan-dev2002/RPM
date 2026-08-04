import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddcriteriaComponent } from '../addcriteria/addcriteria.component';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { StatusConfirmationDialogComponent } from '../../testing-projects/add-projects/status-confirmation-dialog/status-confirmation-dialog.component';
import { GridcolumnTestingComponent } from './gridcolumn-testing/gridcolumn-testing.component';

@Component({
  selector: 'app-gate-testing',
  templateUrl: './gate-testing.component.html',
  styleUrls: ['./gate-testing.component.scss']
})
export class GateTestingComponent implements OnInit, OnDestroy {
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
      name: 'Test Planning & Execution',
      criteria: [
        { id: 1, status: true, question: 'Has a detailed testing and validation plan been prepared and approved?', description: 'Testing plan is documented, reviewed, and formally approved.', answer: null, priority: 'High', mandatory: true },
        { id: 2, status: true, question: 'Have all functional, performance, and reliability tests been completed?', description: 'All planned tests are executed and results are recorded.', answer: null, priority: 'High', mandatory: true },
        { id: 3, status: false, question: 'Has the product been tested under real-world operating conditions?', description: 'Product performance is validated in actual use environments.', answer: null, priority: 'Medium', mandatory: false }
      ]
    },
    {
      id: 2,
      name: 'Defect Management & Fixes',
      criteria: [
        { id: 4, status: true, question: 'Have all identified defects, failures, and deviations been documented?', description: 'All issues found during testing are logged and tracked.', answer: null, priority: 'High', mandatory: true },
        { id: 5, status: false, question: 'Have corrective actions been implemented and re-tested successfully?', description: 'Fixes are applied and verified through successful re-testing.', answer: null, priority: 'Medium', mandatory: false }
      ]
    },
    {
      id: 3,
      name: 'Validation & Approval',
      criteria: [
        { id: 6, status: true, question: 'Has the product met all defined quality and acceptance criteria?', description: 'Product results are confirmed against all acceptance benchmarks.', answer: null, priority: 'High', mandatory: true },
        { id: 7, status: true, question: 'Have regulatory, safety, and compliance validation tests been completed?', description: 'All mandatory regulatory and safety tests are passed and recorded.', answer: null, priority: 'High', mandatory: true },
        { id: 8, status: false, question: 'Has manufacturing process validation or pilot production testing been conducted?', description: 'Pilot production runs are completed and process is validated.', answer: null, priority: 'Medium', mandatory: false },
        { id: 9, status: true, question: 'Have test reports, results, and approvals been formally documented?', description: 'All test reports and sign-offs are finalized and stored.', answer: null, priority: 'High', mandatory: true },
        { id: 10, status: false, question: 'Has management approval been obtained to proceed to production or launch stage?', description: 'Formal management sign-off to move to production is confirmed.', answer: null, priority: 'High', mandatory: true }
      ]
    }
  ];

  constructor(private dragulaService: DragulaService, private dialog: MatDialog, private location: Location) { 
    // Clean up previous registration of this group name if it exists
    if (this.dragulaService.find('TESTING_ROWS')) {
      this.dragulaService.destroy('TESTING_ROWS');
    }

    // Set up the drag group configuration
    this.dragulaService.createGroup('TESTING_ROWS', {
      revertOnSpill: true,
    });

    // Handle data model synchronization when a drop event completes
    this.subs.add(
      this.dragulaService.dropModel('TESTING_ROWS').subscribe(({ targetModel }) => {
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
    // Prevent memory leaks and registration clashes
    this.dragulaService.destroy('TESTING_ROWS');
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
    this.dialog.open(GridcolumnTestingComponent, {
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
    
  }
}