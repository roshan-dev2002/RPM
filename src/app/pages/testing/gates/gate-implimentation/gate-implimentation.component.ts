import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddcriteriaComponent } from '../addcriteria/addcriteria.component';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { StatusConfirmationDialogComponent } from '../../testing-projects/add-projects/status-confirmation-dialog/status-confirmation-dialog.component';
import { GridcolumnImplimentationComponent } from './gridcolumn-implimentation/gridcolumn-implimentation.component';

@Component({
  selector: 'app-gate-implimentation',
  templateUrl: './gate-implimentation.component.html',
  styleUrls: ['./gate-implimentation.component.scss']
})
export class GateImplimentationComponent implements OnInit, OnDestroy {
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
      name: 'Production Rollout',
      criteria: [
        { id: 1, status: true, question: 'Has full-scale production been successfully initiated according to the approved plan?', description: 'Production has started and is running as per the approved plan.', answer: null, priority: 'High', mandatory: true },
        { id: 2, status: true, question: 'Are production outputs meeting the defined quality standards and specifications?', description: 'Output quality is verified against defined standards and specs.', answer: null, priority: 'High', mandatory: true },
        { id: 3, status: false, question: 'Have all operational teams been trained and aligned with standard operating procedures (SOPs)?', description: 'All teams are trained and following the required SOPs.', answer: null, priority: 'Medium', mandatory: false },
        { id: 4, status: true, question: 'Are manufacturing equipment, tools, and systems operating without major issues?', description: 'Equipment and systems are stable with no critical issues.', answer: null, priority: 'High', mandatory: true }
      ]
    },
    {
      id: 2,
      name: 'Field Performance & Support',
      criteria: [
        { id: 5, status: true, question: 'Has the supply chain demonstrated stable material availability and delivery performance?', description: 'Materials are available and delivered consistently on time.', answer: null, priority: 'High', mandatory: true },
        { id: 6, status: true, question: 'Have initial customer deliveries or deployments been completed successfully?', description: 'First customer deliveries are completed without major issues.', answer: null, priority: 'High', mandatory: true },
        { id: 7, status: false, question: 'Are customer feedback, field issues, and product performance being actively monitored?', description: 'Feedback and field data are being tracked and reviewed regularly.', answer: null, priority: 'Medium', mandatory: false },
        { id: 8, status: false, question: 'Have corrective and preventive actions (CAPA) been implemented for identified issues?', description: 'All identified issues have CAPA plans in place and actioned.', answer: null, priority: 'High', mandatory: true }
      ]
    },
    {
      id: 3,
      name: 'Handover & Closure',
      criteria: [
        { id: 9, status: false, question: 'Has project documentation, lessons learned, and knowledge transfer been completed?', description: 'All docs, learnings, and handover materials are finalized.', answer: null, priority: 'Medium', mandatory: false },
        { id: 10, status: false, question: 'Has the project been formally reviewed and approved for operational handover or closure?', description: 'Formal sign-off for project handover or closure has been obtained.', answer: null, priority: 'High', mandatory: true }
      ]
    }
  ];

  constructor(private dragulaService: DragulaService, private dialog: MatDialog, private location: Location) {
    if (this.dragulaService.find('IMPLEMENTATION_ROWS')) {
      this.dragulaService.destroy('IMPLEMENTATION_ROWS');
    }

    this.dragulaService.createGroup('IMPLEMENTATION_ROWS', {
      revertOnSpill: true,
    });

    this.subs.add(
      this.dragulaService.dropModel('IMPLEMENTATION_ROWS').subscribe(({ targetModel }) => {
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
    this.dragulaService.destroy('IMPLEMENTATION_ROWS');
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
    this.dialog.open(GridcolumnImplimentationComponent, {
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