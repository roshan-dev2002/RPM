import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddResourcePopComponent } from './add-resource-pop/add-resource-pop.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

export interface ResourceItem {
  code: string;
  name: string;
  selected: boolean;
}

export interface ResourceScheduleItem {
  resource: string;
  initials: string;
  stage: string;
  module: string;
  task: string;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  planDuration: string;
  actualDuration: string;
  status: string;
  dayPlacement: string;
  color: string;
}

@Component({
  selector: 'app-project-resources',
  templateUrl: './project-resources.component.html',
  styleUrls: ['./project-resources.component.scss']
})
export class ProjectResourcesComponent implements OnInit {

  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

  activeTab: 'Scheduling' | 'Allocation' = 'Scheduling';
  isCalendarView: boolean = false;
  showWeekend: boolean = false;

  // Timeline modal
  showTimelineModal: boolean = false;
  selectedScheduleItem: ResourceScheduleItem | null = null;

  availableResources: ResourceItem[] = [];
  allocatedResources: ResourceItem[] = [];
  schedules: ResourceScheduleItem[] = [];
  paginatedSchedules: ResourceScheduleItem[] = [];

  // Pagination for Scheduling table
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeData();
    this.updatePagination();
  }

  initializeData(): void {
    this.availableResources = [
      { code: 'RES001', name: 'Ravi Sharma', selected: false },
      { code: 'RES002', name: 'Priya Singh', selected: false },
      { code: 'RES003', name: 'Amit Kumar', selected: false },
      { code: 'RES004', name: 'Neha Sharma', selected: false },
      { code: 'RES005', name: 'Vikram Joshi', selected: false },
      { code: 'RES006', name: 'Sneha Kapoor', selected: false },
      { code: 'RES007', name: 'Manish Jain', selected: false },
      { code: 'RES008', name: 'Anjali Patel', selected: false }
    ];

    this.allocatedResources = [
      { code: 'RES009', name: 'Liam White', selected: false },
      { code: 'RES010', name: 'Emma Harris', selected: false },
      { code: 'RES011', name: 'Noah Martin', selected: false },
      { code: 'RES012', name: 'Ava Jackson', selected: false },
      { code: 'RES013', name: 'Ethan Moore', selected: false }
    ];

    this.schedules = [
      {
        resource: 'Ravi Sharma', initials: 'RS', stage: 'Feasibility', module: 'Project Management',
        task: 'Client Meeting', fromDate: '2026-06-02', fromTime: '09:00 AM', toDate: '2026-06-02',
        toTime: '11:00 AM', planDuration: '2 hours', actualDuration: '2 hours',
        status: 'Completed', dayPlacement: 'Monday', color: '#e0f2fe'
      },
      {
        resource: 'Priya Singh', initials: 'PS', stage: 'Design', module: 'Design',
        task: 'UI Design Implementation', fromDate: '2026-06-03', fromTime: '10:00 AM', toDate: '2026-06-03',
        toTime: '01:00 PM', planDuration: '3 hours', actualDuration: '3 hours',
        status: 'Active', dayPlacement: 'Tuesday', color: '#dcfce7'
      },
      {
        resource: 'Amit Kumar', initials: 'AK', stage: 'Testing', module: 'Quality Assurance',
        task: 'Integration Testing', fromDate: '2026-06-04', fromTime: '11:00 AM', toDate: '2026-06-04',
        toTime: '03:00 PM', planDuration: '4 hours', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Wednesday', color: '#f3e8ff'
      },
      {
        resource: 'Neha Sharma', initials: 'NS', stage: 'Testing', module: 'Tool & Software',
        task: 'Database Setup', fromDate: '2026-06-05', fromTime: '01:00 PM', toDate: '2026-06-05',
        toTime: '04:00 PM', planDuration: '3 hours', actualDuration: '3 hours',
        status: 'Completed', dayPlacement: 'Thursday', color: '#fef08a'
      },
      {
        resource: 'Vikram Joshi', initials: 'VJ', stage: 'Review', module: 'Administration',
        task: 'Budget Review Q3', fromDate: '2026-06-06', fromTime: '02:00 PM', toDate: '2026-06-06',
        toTime: '04:00 PM', planDuration: '2 hours', actualDuration: 'N/A',
        status: 'Active', dayPlacement: 'Friday', color: '#cffafe'
      },
      {
        resource: 'Sneha Kapoor', initials: 'SK', stage: 'Development', module: 'Backend',
        task: 'API Integration', fromDate: '2026-06-09', fromTime: '09:30 AM', toDate: '2026-06-09',
        toTime: '12:30 PM', planDuration: '3 hours', actualDuration: '3.5 hours',
        status: 'Completed', dayPlacement: 'Monday', color: '#fce7f3'
      },
      {
        resource: 'Manish Jain', initials: 'MJ', stage: 'Deployment', module: 'DevOps',
        task: 'CI/CD Pipeline Setup', fromDate: '2026-06-10', fromTime: '08:00 AM', toDate: '2026-06-10',
        toTime: '05:00 PM', planDuration: '9 hours', actualDuration: '9 hours',
        status: 'Completed', dayPlacement: 'Tuesday', color: '#e0f2fe'
      },
      {
        resource: 'Anjali Patel', initials: 'AP', stage: 'Design', module: 'UI/UX',
        task: 'Wireframe Review', fromDate: '2026-06-11', fromTime: '10:00 AM', toDate: '2026-06-11',
        toTime: '12:00 PM', planDuration: '2 hours', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Wednesday', color: '#f3e8ff'
      },
      {
        resource: 'Ravi Sharma', initials: 'RS', stage: 'Development', module: 'Frontend',
        task: 'Component Refactoring', fromDate: '2026-06-12', fromTime: '09:00 AM', toDate: '2026-06-12',
        toTime: '01:00 PM', planDuration: '4 hours', actualDuration: '4 hours',
        status: 'Completed', dayPlacement: 'Thursday', color: '#dcfce7'
      },
      {
        resource: 'Priya Singh', initials: 'PS', stage: 'Testing', module: 'QA',
        task: 'Regression Testing', fromDate: '2026-06-13', fromTime: '11:00 AM', toDate: '2026-06-13',
        toTime: '03:00 PM', planDuration: '4 hours', actualDuration: '4.5 hours',
        status: 'Active', dayPlacement: 'Friday', color: '#cffafe'
      },
      {
        resource: 'Amit Kumar', initials: 'AK', stage: 'Feasibility', module: 'Analysis',
        task: 'Requirement Gathering', fromDate: '2026-06-16', fromTime: '10:00 AM', toDate: '2026-06-17',
        toTime: '05:00 PM', planDuration: '14 hours', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Monday', color: '#fef08a'
      },
      {
        resource: 'Neha Sharma', initials: 'NS', stage: 'Deployment', module: 'Infrastructure',
        task: 'Server Configuration', fromDate: '2026-06-17', fromTime: '08:00 AM', toDate: '2026-06-17',
        toTime: '04:00 PM', planDuration: '8 hours', actualDuration: '7 hours',
        status: 'Completed', dayPlacement: 'Tuesday', color: '#e0f2fe'
      }
    ];
  }

  // Timeline modal
  openTimelineModal(item: ResourceScheduleItem): void {
    this.selectedScheduleItem = item;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedScheduleItem = null;
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + Number(this.pageSize);
    this.paginatedSchedules = this.schedules.slice(start, end);
  }

  handlePageEvent(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  setTab(tab: 'Scheduling' | 'Allocation'): void {
    this.activeTab = tab;
  }

  setCalendarView(val: boolean): void {
    this.isCalendarView = val;
  }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
  }

  get displayDays(): string[] {
    return this.showWeekend
      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  }

  getSchedulesForDay(day: string): ResourceScheduleItem[] {
    return this.schedules.filter(s => s.dayPlacement === day);
  }

  // Allocation Tab Methods
  toggleAvailableSelect(res: ResourceItem): void {
    res.selected = !res.selected;
  }

  toggleAllocatedSelect(res: ResourceItem): void {
    res.selected = !res.selected;
  }

  allocateResources(): void {
    const selected = this.availableResources.filter(r => r.selected);
    this.allocatedResources.push(...selected);
    this.availableResources = this.availableResources.filter(r => !r.selected);
    this.allocatedResources.forEach(r => r.selected = false);
  }

  deallocateResources(): void {
    const selected = this.allocatedResources.filter(r => r.selected);
    this.availableResources.push(...selected);
    this.allocatedResources = this.allocatedResources.filter(r => !r.selected);
    this.availableResources.forEach(r => r.selected = false);
  }

  canAllocate(): boolean {
    return this.availableResources.some(r => r.selected);
  }

  canDeallocate(): boolean {
    return this.allocatedResources.some(r => r.selected);
  }

  openAddResourceDialog(): void {
    const dialogRef = this.dialog.open(AddResourcePopComponent, {
      width: '850px',
      height: 'auto',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const newRes: ResourceItem = {
          code: result.code,
          name: result.name || result.resource,
          selected: false
        };
        this.availableResources.push(newRes);
      }
    });
  }

  openAddResourceScheduleDialog(): void {
    const dialogRef = this.dialog.open(AddResourcePopComponent, {
      width: '850px',
      height: 'auto',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: ResourceScheduleItem | undefined) => {
      if (result) {
        this.schedules.unshift(result);
        this.updatePagination();
      }
    });
  }

  editSchedule(item: ResourceScheduleItem): void {
    const dialogRef = this.dialog.open(AddResourcePopComponent, {
      width: '850px',
      height: 'auto',
      data: item
    });

    dialogRef.afterClosed().subscribe((result: ResourceScheduleItem | undefined) => {
      if (result) {
        Object.assign(item, result);
        this.updatePagination();
      }
    });
  }

  deleteSchedule(item: ResourceScheduleItem): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this record?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.schedules = this.schedules.filter(s => s !== item);
        this.updatePagination();
      }
    });
  }

  scrollTable(direction: 'left' | 'right'): void {
    if (this.tableContainer) {
      const scrollAmount = 350;
      const element = this.tableContainer.nativeElement;
      if (direction === 'left') {
        element.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }

  scrollLeft(): void {
    this.scrollTable('left');
  }

  scrollRight(): void {
    this.scrollTable('right');
  }

  goBack(): void {
    this.router.navigateByUrl('/app/testing/projects');
  }
}
