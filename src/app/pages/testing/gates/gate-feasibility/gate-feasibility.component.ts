import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddcriteriaComponent } from '../addcriteria/addcriteria.component';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { StatusConfirmationDialogComponent } from '../../testing-projects/add-projects/status-confirmation-dialog/status-confirmation-dialog.component';
import { GridcolumnFeasibilityComponent } from './gridcolumn-feasibility/gridcolumn-feasibility.component';

@Component({
  selector: 'app-gate-feasibility',
  templateUrl: './gate-feasibility.component.html',
  styleUrls: ['./gate-feasibility.component.scss']
})
export class GateFeasibilityComponent implements OnInit, OnDestroy {
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
      name: 'Project Initiation & Planning',
      criteria: [
        { id: 1, status: true, question: 'Has the customer/business requirement been clearly defined and documented?', description: 'Customer needs and business goals are captured and agreed upon.', answer: null, priority: 'High', mandatory: true },
        { id: 2, status: true, question: 'Is the proposed product or solution technically achievable?', description: 'Technical feasibility is confirmed within existing capabilities.', answer: null, priority: 'Medium', mandatory: false },
        { id: 3, status: false, question: 'Has a preliminary market or customer demand analysis been completed?', description: 'Market demand and target customer segments have been evaluated.', answer: null, priority: 'High', mandatory: true }
      ]
    },
    {
      id: 2,
      name: 'Execution, Monitoring & Control',
      criteria: [
        { id: 4, status: true, question: 'Are the estimated development costs within the approved budget range?', description: 'Cost estimates are reviewed and aligned with the approved budget.', answer: null, priority: 'High', mandatory: true },
        { id: 5, status: false, question: 'Have key manufacturing constraints and production limitations been identified?', description: 'Production bottlenecks and capacity limits are known.', answer: null, priority: 'Medium', mandatory: false },
        { id: 6, status: true, question: 'Are the required raw materials, components, or technologies available?', description: 'All necessary materials and technologies are sourced and available.', answer: null, priority: 'High', mandatory: true },
        { id: 7, status: true, question: 'Have major technical, operational, and supply chain risks been assessed?', description: 'Key risks are identified with mitigation plans in place.', answer: null, priority: 'High', mandatory: true }
      ]
    },
    {
      id: 3,
      name: 'Delivery, Handover & Closeout',
      criteria: [
        { id: 8, status: true, question: 'Does the project comply with applicable regulatory, safety, and quality standards?', description: 'Compliance with relevant regulations and quality standards is confirmed.', answer: null, priority: 'High', mandatory: true },
        { id: 9, status: false, question: 'Has an initial project timeline and resource plan been prepared?', description: 'A high-level schedule and resource allocation plan has been drafted.', answer: null, priority: 'Medium', mandatory: false },
        { id: 10, status: false, question: 'Has management/stakeholder approval been obtained to proceed?', description: 'Formal sign-off from management to move forward has been received.', answer: null, priority: 'High', mandatory: true }
      ]
    }
  ];

  constructor(private dragulaService: DragulaService, private dialog: MatDialog, private location: Location) {
    if (this.dragulaService.find('CRITERIA_ROWS')) {
      this.dragulaService.destroy('CRITERIA_ROWS');
    }

    this.dragulaService.createGroup('CRITERIA_ROWS', {
      revertOnSpill: true,
    });

    // The Dragula model updates automatically via HTML two-way binding:
    // (dragulaModelChange)="selectedModule.criteria = $event"
    this.subs.add(
      this.dragulaService.dropModel('CRITERIA_ROWS').subscribe(({ targetModel }) => {
        // Safe check to ensure we map array re-orders back to the current module
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
    this.dragulaService.destroy('CRITERIA_ROWS');
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
      data: { moduleId: this.selectedModule.id } // Pass active module context to dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Criteria added:', result);
        // Push the returned item into the actively selected module
        this.selectedModule.criteria.push(result);
      }
    });
  }

  // --- Stubs for table actions ---

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
    this.dialog.open(GridcolumnFeasibilityComponent, {
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

  uploadGuidelines(item: any): void {
    console.log('Download Guidelines clicked for', item);
    // Add download logic here
  }
}