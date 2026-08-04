import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddcriteriaComponent } from '../addcriteria/addcriteria.component';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { StatusConfirmationDialogComponent } from '../../testing-projects/add-projects/status-confirmation-dialog/status-confirmation-dialog.component';
import { GridcolumnLaunchComponent } from './gridcolumn-launch/gridcolumn-launch.component';

@Component({
  selector: 'app-gate-launch',
  templateUrl: './gate-launch.component.html',
  styleUrls: ['./gate-launch.component.scss']
})
export class GateLaunchComponent implements OnInit, OnDestroy {
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
      name: 'Production & Quality Readiness',
      criteria: [
        { id: 2, status: true, question: 'Are manufacturing processes fully validated and ready for production scale-up?', description: 'Production processes are validated and ready for full-scale output.', answer: null, priority: 'High', mandatory: true },
        { id: 3, status: true, question: 'Have all quality control and inspection procedures been established?', description: 'QC procedures and inspection checkpoints are defined and in place.', answer: null, priority: 'High', mandatory: true },
        { id: 7, status: false, question: 'Has production staff and operational teams been trained for product rollout?', description: 'All teams are trained and ready to execute the product rollout.', answer: null, priority: 'Medium', mandatory: false }
      ]
    },
    {
      id: 2,
      name: 'Supply Chain & Support',
      criteria: [
        { id: 4, status: true, question: 'Are supply chain, procurement, and inventory plans in place for launch?', description: 'Supply chain and inventory are ready to support the launch demand.', answer: null, priority: 'High', mandatory: true },
        { id: 5, status: true, question: 'Have packaging, labeling, and product documentation been finalized and approved?', description: 'All packaging, labels, and documents are approved and print-ready.', answer: null, priority: 'High', mandatory: true },
        { id: 8, status: false, question: 'Has a customer support, service, or maintenance plan been prepared?', description: 'Support and service plans are documented and teams are briefed.', answer: null, priority: 'Medium', mandatory: false }
      ]
    },
    {
      id: 3,
      name: 'Final Approvals & Compliance',
      criteria: [
        { id: 1, status: true, question: 'Has final product approval been obtained from all required stakeholders?', description: 'All stakeholders have reviewed and signed off on the final product.', answer: null, priority: 'High', mandatory: true },
        { id: 6, status: true, question: 'Have regulatory certifications and compliance approvals been completed?', description: 'All required certifications and regulatory approvals are obtained.', answer: null, priority: 'High', mandatory: true },
        { id: 9, status: false, question: 'Have launch risks, contingency plans, and escalation procedures been reviewed?', description: 'Risks and contingency plans are reviewed and escalation paths set.', answer: null, priority: 'Medium', mandatory: false },
        { id: 10, status: false, question: 'Has management provided final authorization for commercial launch or deployment?', description: 'Final management approval to proceed with commercial launch is confirmed.', answer: null, priority: 'High', mandatory: true }
      ]
    }
  ];

  constructor(private dragulaService: DragulaService, private dialog: MatDialog, private location: Location) {
    if (this.dragulaService.find('LAUNCH_ROWS')) {
      this.dragulaService.destroy('LAUNCH_ROWS');
    }

    this.dragulaService.createGroup('LAUNCH_ROWS', {
      revertOnSpill: true,
    });

    this.subs.add(
      this.dragulaService.dropModel('LAUNCH_ROWS').subscribe(({ targetModel }) => {
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
    this.dragulaService.destroy('LAUNCH_ROWS');
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
    this.dialog.open(GridcolumnLaunchComponent, {
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