import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AddModuleComponent } from './add-module/add-module.component';
import { AddTaskComponent } from '../../rpm-tasks/add-task/add-task.component';
import { AddphotoPopComponent } from '../../testing-projects/project-dashboard/project-photos/addphoto-pop/addphoto-pop.component';
import { ProcedurePopComponent } from './procedure-pop/procedure-pop.component';
import { StageGridcolumnComponent } from './procedure-pop/stage-gridcolumn/stage-gridcolumn.component';
import { Location } from '@angular/common';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-rpm-stages-wbs',
  templateUrl: './rpm-stages-wbs.component.html',
  styleUrls: ['./rpm-stages-wbs.component.scss']
})
export class RpmStagesWbsComponent implements OnInit {

  constructor(private dialog: MatDialog, private location: Location) { }

  goBack(): void {
    this.location.back();
  }

  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

  sidebarMenus = [
    { name: 'Project Initiation & Planning', count: 6, isOpen: true },
    { name: 'Execution, Monitoring & Control', count: 8, isOpen: false },
    { name: 'Delivery, Handover & Closeout', count: 5, isOpen: false }
  ];

  // Table Data 1 - Initiation & Planning
  tableData1 = [
    { task: 'Define Project Scope', taskCode: 'TC-101', jobCode: 'INIT1', effort: '10', duration: '2', description: 'Define initial parameters', procedure: 'Draft scope document', planned: '10.00', assignedTo: 'John Doe', assigned: '10.00', actual: '10.00', cost: '1000.00', worked: '10.00', remaining: '0.00', scheduled: '2021-04-20', date: '2021-04-20', status: 'Approved', submitted: '2021-04-25' },
    { task: 'Feasibility Study', taskCode: 'TC-102', jobCode: 'INIT2', effort: '15', duration: '3', description: 'Analyze constraints', procedure: 'Review requirements', planned: '15.00', assignedTo: 'Jane Smith', assigned: '15.00', actual: '10.00', cost: '1200.00', worked: '10.00', remaining: '5.00', scheduled: '2021-04-22', date: '2021-04-22', status: 'In Progress', submitted: '-' },
    { task: 'Budget Estimation', taskCode: 'TC-103', jobCode: 'INIT3', effort: '8', duration: '1', description: 'Calculate total costs', procedure: 'Financial modeling', planned: '8.00', assignedTo: 'Mike Ross', assigned: '8.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '8.00', scheduled: '2021-04-25', date: '-', status: 'Scheduled', submitted: '-' },
    { task: 'Risk Management Plan', taskCode: 'TC-104', jobCode: 'INIT4', effort: '12', duration: '2', description: 'Identify project risks', procedure: 'Risk assessment matrix', planned: '12.00', assignedTo: 'Sarah Lee', assigned: '12.00', actual: '2.00', cost: '220.00', worked: '2.00', remaining: '10.00', scheduled: '2021-04-26', date: '2021-04-26', status: 'In Progress', submitted: '-' },
    { task: 'Resource Allocation', taskCode: 'TC-105', jobCode: 'INIT5', effort: '6', duration: '1', description: 'Assign team members', procedure: 'Resource mapping', planned: '6.00', assignedTo: 'Tom Hanks', assigned: '6.00', actual: '6.00', cost: '570.00', worked: '6.00', remaining: '0.00', scheduled: '2021-04-28', date: '2021-04-28', status: 'Approved', submitted: '2021-04-30' },
    { task: 'Stakeholder Kick-off', taskCode: 'TC-106', jobCode: 'INIT6', effort: '4', duration: '1', description: 'Initial alignment meeting', procedure: 'Prepare slide deck', planned: '4.00', assignedTo: 'John Doe', assigned: '4.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '4.00', scheduled: '2021-05-02', date: '-', status: 'Pending PM Review', submitted: '-' }
  ];

  // Table Data 2 - Execution, Monitoring & Control
  tableData2 = [
    { task: 'Body Panel Fitment', taskCode: 'TC-201', jobCode: 'EXEC1', effort: '5', duration: '1', description: 'Assemble exterior panels', procedure: 'Standard assembly SOP', planned: '5.00', assignedTo: 'Sachin Patil', assigned: '5.00', actual: '5.00', cost: '500.00', worked: '5.00', remaining: '0.00', scheduled: '2021-05-12', date: '2021-05-12', status: 'Approved', submitted: '2021-05-24' },
    { task: 'Paint Finish Quality', taskCode: 'TC-202', jobCode: 'EXEC2', effort: '7', duration: '2', description: 'Inspect coat layers', procedure: 'Visual QA check', planned: '7.00', assignedTo: ' Avi Paul', assigned: '7.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '7.00', scheduled: '2021-05-12', date: '-', status: 'Scheduled', submitted: '-' },
    { task: 'Weld Joint Inspection', taskCode: 'TC-203', jobCode: 'EXEC3', effort: '2', duration: '1', description: 'Verify weld integrity', procedure: 'Ultrasonic testing', planned: '2.00', assignedTo: '  Mark Johnson', assigned: '2.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '2.00', scheduled: '2021-05-12', date: '2021-05-10', status: 'Pending PM Review', submitted: '2021-05-10' },
    { task: 'Door Alignment Check', taskCode: 'TC-204', jobCode: 'EXEC4', effort: '2', duration: '1', description: 'Ensure smooth closure', procedure: 'Gap and flush gauge', planned: '2.00', assignedTo: 'Bob Cormier', assigned: '2.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '2.00', scheduled: '2021-05-12', date: '-', status: 'Scheduled', submitted: '-' },
    { task: 'Engine Mount Verification', taskCode: 'TC-205', jobCode: 'EXEC5', effort: '10', duration: '2', description: 'Secure block alignment', procedure: 'Torque specification log', planned: '10.00', assignedTo: 'James Hooper', assigned: '10.00', actual: '6.00', cost: '720.00', worked: '6.00', remaining: '4.00', scheduled: '2021-05-20', date: '2021-05-20', status: 'In Progress', submitted: '-' },
    { task: 'Wiring Harness Routing', taskCode: 'TC-206', jobCode: 'EXEC6', effort: '8', duration: '2', description: 'Install main harness', procedure: 'Electrical schematic D1', planned: '8.00', assignedTo: 'Nina Patel', assigned: '8.00', actual: '3.00', cost: '255.00', worked: '3.00', remaining: '5.00', scheduled: '2021-05-22', date: '2021-05-22', status: 'In Progress', submitted: '2021-05-22' },
    { task: 'HVAC Performance Test', taskCode: 'TC-207', jobCode: 'EXEC7', effort: '6', duration: '1', description: 'Climate control check', procedure: 'Thermal mapping', planned: '6.00', assignedTo: 'Carlos Rivera', assigned: '6.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '6.00', scheduled: '2021-05-25', date: '-', status: 'Scheduled', submitted: '-' },
    { task: 'Chassis Dimension Audit', taskCode: 'TC-208', jobCode: 'EXEC8', effort: '4', duration: '1', description: 'Frame tolerance review', procedure: 'Laser measurement SOP', planned: '4.00', assignedTo: 'Laura Kim', assigned: '4.00', actual: '4.00', cost: '300.00', worked: '4.00', remaining: '0.00', scheduled: '2021-05-14', date: '2021-05-14', status: 'Approved', submitted: '2021-05-15' }
  ];

  // Table Data 3 - Delivery, Handover & Closeout
  tableData3 = [
    { task: 'Final Vehicle Inspection', taskCode: 'TC-301', jobCode: 'DELIV1', effort: '2', duration: '1', description: 'End of line QA', procedure: 'Release checklist', planned: '2.00', assignedTo: 'David Park', assigned: '2.00', actual: '2.00', cost: '160.00', worked: '2.00', remaining: '0.00', scheduled: '2021-06-20', date: '2021-06-20', status: 'Approved', submitted: '2021-06-21' },
    { task: 'Client UAT Sign-off', taskCode: 'TC-302', jobCode: 'DELIV2', effort: '5', duration: '1', description: 'Customer acceptance', procedure: 'Sign-off protocol', planned: '5.00', assignedTo: 'Jane Smith', assigned: '5.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '5.00', scheduled: '2021-06-23', date: '-', status: 'Scheduled', submitted: '-' },
    { task: 'Handover Documentation', taskCode: 'TC-303', jobCode: 'DELIV3', effort: '8', duration: '2', description: 'Compile service manuals', procedure: 'Documentation workflow', planned: '8.00', assignedTo: 'Rachel Wong', assigned: '8.00', actual: '4.00', cost: '300.00', worked: '4.00', remaining: '4.00', scheduled: '2021-06-24', date: '2021-06-24', status: 'In Progress', submitted: '-' },
    { task: 'Release Resources', taskCode: 'TC-304', jobCode: 'DELIV4', effort: '3', duration: '1', description: 'Reassign team', procedure: 'HR closeout form', planned: '3.00', assignedTo: 'Mike Adams', assigned: '3.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '3.00', scheduled: '2021-06-29', date: '-', status: 'Pending PM Review', submitted: '-' },
    { task: 'Project Retrospective', taskCode: 'TC-305', jobCode: 'DELIV5', effort: '6', duration: '1', description: 'Lessons learned meeting', procedure: 'Post-mortem template', planned: '6.00', assignedTo: 'John Doe', assigned: '6.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '6.00', scheduled: '2021-07-01', date: '-', status: 'Scheduled', submitted: '-' }
  ];

  // Active data arrays
  tableData: any[] = [];
  paginatedData: any[] = [];

  // Pagination properties
  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  ngOnInit(): void {
    // Sync counts
    this.sidebarMenus[0].count = this.tableData1.length;
    this.sidebarMenus[1].count = this.tableData2.length;
    this.sidebarMenus[2].count = this.tableData3.length;

    // Default to the first table array on load
    this.tableData = this.tableData1;
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  selectMenu(index: number) {
    // 1. Toggle accordion visibility
    this.sidebarMenus.forEach((menu, i) => {
      menu.isOpen = (i === index) ? !menu.isOpen : false;
    });

    // 2. Switch data based on the selected index
    if (index === 0) {
      this.tableData = this.tableData1;
    } else if (index === 1) {
      this.tableData = this.tableData2;
    } else if (index === 2) {
      this.tableData = this.tableData3;
    }

    // 3. Reset pagination to the first page
    this.pageIndex = 0;
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  // Handle page changes
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  // Slice the data array based on current page and page size
  updatePaginatedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.tableData.slice(startIndex, endIndex);
  }

  // --- Horizontal Scrolling Logic ---

  scrollLeft(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  addModule() {
    this.dialog.open(AddModuleComponent, {
      width: '600px',
      data: { title: 'Add Module' }
    });
  }

  gridview() {
    this.dialog.open(StageGridcolumnComponent, {
      width: '680px',
      data: {}
    });
  }

  addTask() {
    let dialogRef = this.dialog.open(AddTaskComponent, {
      width: '750px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nextId = this.tableData.length + 1;
        const newTask = {
          task: result.task,
          taskCode: 'TC-' + (100 + nextId),
          jobCode: 'INIT' + nextId,
          effort: '0',
          duration: '0',
          description: result.description,
          procedure: '',
          planned: '0.00',
          assignedTo: '',
          assigned: '0.00',
          actual: '0.00',
          cost: '0.00',
          worked: '0.00',
          remaining: '0.00',
          scheduled: '-',
          date: '-',
          status: 'Pending',
          submitted: '-'
        };
        this.tableData.push(newTask);
        this.totalItems = this.tableData.length;
        this.sidebarMenus[0].count = this.tableData1.length;
        this.sidebarMenus[1].count = this.tableData2.length;
        this.sidebarMenus[2].count = this.tableData3.length;
        this.updatePaginatedData();
      }
    });
  }

  editTask(row: any): void {
    let dialogRef = this.dialog.open(AddTaskComponent, {
      width: '750px',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        row.task = result.task;
        row.description = result.description;
        this.updatePaginatedData();
      }
    });
  }

  deleteTask(row: any): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.tableData.indexOf(row);
        if (index > -1) {
          this.tableData.splice(index, 1);
          this.sidebarMenus[0].count = this.tableData1.length;
          this.sidebarMenus[1].count = this.tableData2.length;
          this.sidebarMenus[2].count = this.tableData3.length;
          this.totalItems = this.tableData.length;
          this.updatePaginatedData();
        }
      }
    });
  }



  openfilepop() {
    // Opens the 'sop.pdf' file from the assets folder in a new tab
    window.open('assets/sop.pdf', '_blank');
  }
}