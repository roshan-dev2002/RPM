import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { FreezepanesDialogComponent } from '../testing-projects/freezepanes-dialog/freezepanes-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { StatusConfirmationDialogComponent } from '../testing-projects/add-projects/status-confirmation-dialog/status-confirmation-dialog.component';
import { AddTaskComponent } from './add-task/add-task.component';

@Component({
  selector: 'app-rpm-tasks',
  templateUrl: './rpm-tasks.component.html',
  styleUrls: ['./rpm-tasks.component.scss']
})
export class RpmTasksComponent implements OnInit {

  showFilter: boolean = false;
  showTimelineModal: boolean = false;
  selectedTimelineTask: any = null;
  isNavOpen: boolean | undefined;
  excludeCompleted: boolean = false;
  rawProjects: any[] = [];
  allProjects: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;
  canUpdate = true;
  canDelete = true;

  // View States
  isCalendarView: boolean = false;
  showWeekend: boolean = false; // Tracks weekend toggle state
  displayDays: number[] = [1, 2, 3, 4, 5]; // Defaults to Monday - Friday

  selectedIcon: number | null = 3;
  currentView: "Mega" | "Mini" | "Micro" = "Mega";
  isExpandeded: boolean = true;
  IsShow: boolean = false;
  currentTime: string = "";
  selectedTab1: string = "All";
  selectedTab2: number | null = null;
  FilterForm: FormGroup;

  // Dropdown Master Collections
  providers = ["Chris Waller", "Chunck James", "Bennett Pugh", "Catherina Jefferson", "William C.Bomer", "John Russell"];
  locations = ["Texas", "Dallas", "Houston", "Hyderabad", "Kondapur"];
  hoursList = ["1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

  // Dynamic Array holding calendar format of the grid data
  calendarCards: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.FilterForm = this.fb.group({ KeyWord: null });
  }

  ngOnInit(): void {
    this.getAllProjects();
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);
  }

  getSliderColor(percent: number): string {
    if (percent <= 30) return '#0000ff';
    if (percent > 30 && percent <= 80) return '#ffb300';
    if (percent === 100) return '#ff0000';
    return '#008000';
  }

  getAllProjects(): void {
    const mockData = [
      {
        IsActive: true,
        ProjectName: 'Portal Upgrade',
        ProjectCode: '202605/Engg/001',
        PercentCompletion: 100,
        TaskName: 'UI Design Implementation',
        TaskType: 'Development',
        Responsibility: 'Alice Johnson',
        Duration: '5 days',
        Effort: '20',
        Description: 'Implement the new dashboard UI layout.',
        PlanStart: '2025-01-01',
        PlanEnd: '2025-01-05',
        ActualStart: '2025-01-01',
        ActualEnd: '2025-01-06',
        ETA: '2025-01-06',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Dev Template v1'
      },
      {
        IsActive: false,
        ProjectName: 'DB Migration',
        ProjectCode: '202605/Engg/002',
        PercentCompletion: 45,
        TaskName: 'Database Optimization',
        TaskType: 'Maintenance',
        Responsibility: 'Robert Smith',
        Duration: '3 days',
        Effort: '12',
        Description: 'Optimize slow running queries in production.',
        PlanStart: '2025-01-07',
        PlanEnd: '2025-01-09',
        ActualStart: '2025-01-08',
        ActualEnd: '',
        ETA: '2025-01-10',
        Status: 'Progress',
        Priority: 'Medium',
        Complexity: 'High',
        Template: 'DB Task Template'
      },
      {
        IsActive: true,
        ProjectName: 'User Docs v2',
        ProjectCode: '202605/Tech/003',
        PercentCompletion: 10,
        TaskName: 'Update User Manual',
        TaskType: 'Documentation',
        Responsibility: 'Clara Davis',
        Duration: '2 days',
        Effort: '8',
        Description: 'Draft new sections for the v2.0 release features.',
        PlanStart: '2025-01-10',
        PlanEnd: '2025-01-11',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2025-01-12',
        Status: 'Hold',
        Priority: 'Low',
        Complexity: 'Low',
        Template: 'Doc Template Standard'
      },
      {
        IsActive: true,
        ProjectName: 'Integration Tests',
        ProjectCode: '202605/QA/004',
        PercentCompletion: 60,
        TaskName: 'API Integration Testing',
        TaskType: 'Testing',
        Responsibility: 'Daniel Martinez',
        Duration: '4 days',
        Effort: '16',
        Description: 'Test all third-party API integrations for the new release.',
        PlanStart: '2025-01-13',
        PlanEnd: '2025-01-16',
        ActualStart: '2025-01-13',
        ActualEnd: '',
        ETA: '2025-01-17',
        Status: 'Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'QA Template v2'
      },
      {
        IsActive: false,
        ProjectName: 'Security Overhaul',
        ProjectCode: '202606/Sec/001',
        PercentCompletion: 0,
        TaskName: 'Security Audit',
        TaskType: 'Compliance',
        Responsibility: 'Evelyn Wright',
        Duration: '6 days',
        Effort: '24',
        Description: 'Conduct a full security audit on the production environment.',
        PlanStart: '2025-01-18',
        PlanEnd: '2025-01-23',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2025-01-24',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Security Audit Template'
      },
      {
        IsActive: true,
        ProjectName: 'Customer Portal Revamp',
        ProjectCode: '202606/CPR/002',
        PercentCompletion: 45,
        TaskName: 'UI Design',
        TaskType: 'Design',
        Responsibility: 'Sophia Carter',
        Duration: '8 days',
        Effort: '40',
        Description: 'Design responsive user interface for the customer portal.',
        PlanStart: '2025-02-01',
        PlanEnd: '2025-02-08',
        ActualStart: '2025-02-01',
        ActualEnd: '',
        ETA: '2025-02-10',
        Status: 'In Progress',
        Priority: 'Medium',
        Complexity: 'Medium',
        Template: 'UI Design Template'
      },
      {
        IsActive: false,
        ProjectName: 'Inventory Management System',
        ProjectCode: '202606/IMS/003',
        PercentCompletion: 100,
        TaskName: 'Database Setup',
        TaskType: 'Development',
        Responsibility: 'Michael Johnson',
        Duration: '5 days',
        Effort: '30',
        Description: 'Create database schema and optimize indexes.',
        PlanStart: '2025-02-10',
        PlanEnd: '2025-02-14',
        ActualStart: '2025-02-10',
        ActualEnd: '2025-02-14',
        ETA: '2025-02-14',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Database Setup Template'
      },
      {
        IsActive: true,
        ProjectName: 'HR Management Platform',
        ProjectCode: '202606/HRM/004',
        PercentCompletion: 20,
        TaskName: 'Employee Login Module',
        TaskType: 'Development',
        Responsibility: 'Daniel Wilson',
        Duration: '10 days',
        Effort: '60',
        Description: 'Develop secure employee authentication and authorization.',
        PlanStart: '2025-02-15',
        PlanEnd: '2025-02-24',
        ActualStart: '2025-02-16',
        ActualEnd: '',
        ETA: '2025-02-26',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Authentication Module Template'
      },
      {
        IsActive: false,
        ProjectName: 'Mobile Banking App',
        ProjectCode: '202606/MBA/005',
        PercentCompletion: 75,
        TaskName: 'API Integration',
        TaskType: 'Integration',
        Responsibility: 'Emma Thompson',
        Duration: '7 days',
        Effort: '42',
        Description: 'Integrate payment gateway and account services APIs.',
        PlanStart: '2025-03-01',
        PlanEnd: '2025-03-07',
        ActualStart: '2025-03-01',
        ActualEnd: '',
        ETA: '2025-03-09',
        Status: 'Testing',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'API Integration Template'
      },
      {
        IsActive: true,
        ProjectName: 'E-Commerce Website',
        ProjectCode: '202606/ECW/006',
        PercentCompletion: 10,
        TaskName: 'Product Catalog',
        TaskType: 'Development',
        Responsibility: 'Olivia Martinez',
        Duration: '9 days',
        Effort: '36',
        Description: 'Develop product listing and filtering functionality.',
        PlanStart: '2025-03-05',
        PlanEnd: '2025-03-13',
        ActualStart: '2025-03-05',
        ActualEnd: '',
        ETA: '2025-03-15',
        Status: 'In Progress',
        Priority: 'Medium',
        Complexity: 'Medium',
        Template: 'Catalog Module Template'
      },
      {
        IsActive: false,
        ProjectName: 'Cloud Migration',
        ProjectCode: '202606/CLD/007',
        PercentCompletion: 90,
        TaskName: 'Server Migration',
        TaskType: 'Infrastructure',
        Responsibility: 'James Anderson',
        Duration: '12 days',
        Effort: '72',
        Description: 'Migrate application servers to cloud infrastructure.',
        PlanStart: '2025-03-10',
        PlanEnd: '2025-03-21',
        ActualStart: '2025-03-10',
        ActualEnd: '',
        ETA: '2025-03-23',
        Status: 'Review',
        Priority: 'Critical',
        Complexity: 'Very High',
        Template: 'Cloud Migration Template'
      },
      {
        IsActive: true,
        ProjectName: 'AI Chatbot',
        ProjectCode: '202606/AIB/008',
        PercentCompletion: 55,
        TaskName: 'Intent Recognition',
        TaskType: 'AI Development',
        Responsibility: 'Lucas Brown',
        Duration: '14 days',
        Effort: '84',
        Description: 'Implement NLP-based intent recognition for chatbot.',
        PlanStart: '2025-03-15',
        PlanEnd: '2025-03-28',
        ActualStart: '2025-03-15',
        ActualEnd: '',
        ETA: '2025-03-30',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Very High',
        Template: 'AI Module Template'
      },
      {
        IsActive: false,
        ProjectName: 'Payroll Automation',
        ProjectCode: '202606/PAY/009',
        PercentCompletion: 100,
        TaskName: 'Salary Calculation',
        TaskType: 'Development',
        Responsibility: 'Ava Davis',
        Duration: '6 days',
        Effort: '32',
        Description: 'Implement automated salary and tax calculations.',
        PlanStart: '2025-04-01',
        PlanEnd: '2025-04-06',
        ActualStart: '2025-04-01',
        ActualEnd: '2025-04-06',
        ETA: '2025-04-06',
        Status: 'Completed',
        Priority: 'Medium',
        Complexity: 'Medium',
        Template: 'Payroll Template'
      }
    ];

    this.rawProjects = mockData;
    this.applyFilter();
  }

  onExcludeCompletedChange(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = this.rawProjects;
    if (this.excludeCompleted) {
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100);
    }
    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.allProjects = filtered.slice(start, end);
    this.generateCalendarData();
  }

  // Maps allProjects data to the calendarCards structure
  generateCalendarData(): void {
    const statusColors: any = {
      'Completed': '#a0e4ff',
      'Progress': '#ffea9f',
      'Hold': '#ffcdd2',
      'Pending': '#e3b2ff'
    };

    // Determine if we distribute cards across 5 days or 7 days
    const daysToDistribute = this.showWeekend ? 7 : 5;

    this.calendarCards = this.allProjects.map((project, i) => {
      return {
        hour: this.hoursList[i % this.hoursList.length],
        user: project.Responsibility,
        dayPlacement: (i % daysToDistribute) + 1, // Dynamically maps to 1-5 or 1-7
        taskName: project.TaskName,
        projectName: project.ProjectName,
        status: project.Status,
        planStart: project.PlanStart,
        color: statusColors[project.Status] || '#90ee90',
        pInitials: project.TaskName.substring(0, 2).toUpperCase()
      };
    });
  }

  updateTime(): void {
    const now = new Date();
    const formattedHours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    this.currentTime = `${formattedHours}:${minutes} ${now.getHours() >= 12 ? "PM" : "AM"}`;
  }

  showCalendarView(): void {
    this.isCalendarView = true;
  }

  showGridView(): void {
    this.isCalendarView = false;
  }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    // Update the array to loop 5 days or 7 days based on the toggle
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    // Regenerate data so tasks dynamically span across the weekends too
    this.generateCalendarData();
  }

  setView(view: "Mega" | "Mini" | "Micro") {
    this.currentView = view;
    this.isExpandeded = view !== "Micro";
  }

  toggleExpand() {
    if (this.currentView === "Mega") this.setView("Mini");
    else if (this.currentView === "Mini") this.setView("Micro");
    else this.setView("Mega");
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }

  openEditDialog(item: any): void {
    let dialogRef = this.dialog.open(AddTaskComponent, {
      width: '750px',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.TaskName = result.TaskName;
        item.Description = result.Description;
        item.Stage = result.Stage;
        item.Module = result.Module;
        this.generateCalendarData();
      }
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
        this.allProjects = this.allProjects.filter(p => p !== item);
        this.totalSize = this.allProjects.length;
        this.generateCalendarData();
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
        // Status is already toggled by mat-checkbox binding [(ngModel)]
        this.generateCalendarData();
      } else {
        // Revert since user cancelled
        item.IsActive = !item.IsActive;
        this.generateCalendarData();
      }
    });
  }

  openProject(item: any): void {
    this.router.navigate(['/app/testing/projects/dashboard']);
  }

  fnHandlePage(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  scrollRight() {
    const container = document.getElementById('grid-table-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollLeft() {
    const container = document.getElementById('grid-table-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  addTask() {
    this.dialog.open(AddTasksComponent, {
      width: '1000px',
      data: {}
    });
  }

  openPdf(fileName: string): void {
    const pdfUrl = `assets/${fileName}`;
    window.open(pdfUrl, '_blank');
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  gridview() {
    this.dialog.open(FreezepanesDialogComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  setSelectedTab1(tab: string) { this.selectedTab1 = tab; }
  setSelectedTab2(index: number) { this.selectedTab2 = index; }
  clearFilter() { }
  go() { }

  openTimelineModal(task: any): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }
}