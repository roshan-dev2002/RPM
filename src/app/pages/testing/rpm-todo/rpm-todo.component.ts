import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { StatusConfirmationDialogComponent } from '../testing-projects/add-projects/status-confirmation-dialog/status-confirmation-dialog.component';
import { EditTodoDialogComponent } from './edit-todo-dialog/edit-todo-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Card, Status } from '../testing-kanban/testing-kanban.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../complaints/complaints.service';
import { PageHeaderService } from 'src/app/shared/page-header.service';

export interface TaskElement {
  id: number;
  Subject: string;
  Comments: string;
  IsActive: boolean;
  DueDate: string;
  CompletionDate: string | null;
  Responsibility: string;
  ProjectName: string;
}

@Component({
  selector: 'app-rpm-todo',
  templateUrl: './rpm-todo.component.html',
  styleUrls: ['./rpm-todo.component.scss']
})
export class RpmTodoComponent implements OnInit {
  // ViewChild to grab the table container for horizontal scrolling
  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  totalSize: number = 0;
  showOverdueOnly: boolean = false;
  filteredData: TaskElement[] = [];

  // --- Timeline Modal State ---
  showTimelineModal: boolean = false;
  selectedTimelineTask: any = null;

  // --- View Toggle States ---
  isKanbanView: boolean = false;
  isCalendarView: boolean = false;
  showFilter: boolean = false;

  // --- Calendar Specific Properties ---

  showWeekend: boolean = false;
  displayDays: number[] = [1, 2, 3, 4, 5]; // Monday - Friday
  hoursList = ["1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];
  calendarCards: any[] = [];

  // Mock Data
  mockdata: TaskElement[] = [
    {
      id: 1,
      Subject: 'Update Compliance Protocols',
      Comments: 'Awaiting legal review',
      IsActive: true,
      DueDate: '2026-06-15T00:00:00',
      CompletionDate: null,
      Responsibility: 'John Doe',
      ProjectName: 'Project Alpha'
    },
    {
      id: 2,
      Subject: 'Server Migration',
      Comments: 'Scheduled for weekend',
      IsActive: true,
      DueDate: '2026-05-25T00:00:00',
      CompletionDate: '2026-05-24T00:00:00',
      Responsibility: 'IT Dept',
      ProjectName: 'Infra Upgrade'
    },
    {
      id: 3,
      Subject: 'Staff Training Module',
      Comments: 'Draft needs revision',
      IsActive: false,
      DueDate: '2026-07-01T00:00:00',
      CompletionDate: null,
      Responsibility: 'Sarah Lee',
      ProjectName: 'Q3 Onboarding'
    },
    {
      id: 4,
      Subject: 'Budget Review Q3',
      Comments: 'Pending CFO approval',
      IsActive: true,
      DueDate: '2026-06-30T00:00:00',
      CompletionDate: null,
      Responsibility: 'Finance Team',
      ProjectName: 'Annual Planning'
    },
    {
      id: 5,
      Subject: 'Security Audit',
      Comments: 'Third-party vendor assigned',
      IsActive: true,
      DueDate: '2026-05-20T00:00:00',
      CompletionDate: '2026-05-19T00:00:00',
      Responsibility: 'IT Dept',
      ProjectName: 'Infra Upgrade'
    },
    {
      id: 6,
      Subject: 'Policy Documentation Update',
      Comments: 'First draft complete',
      IsActive: false,
      DueDate: '2026-07-10T00:00:00',
      CompletionDate: null,
      Responsibility: 'Compliance Team',
      ProjectName: 'Project Alpha'
    },
    {
      id: 7,
      Subject: 'Vendor Contract Renewal',
      Comments: 'Legal team reviewing terms',
      IsActive: true,
      DueDate: '2026-06-20T00:00:00',
      CompletionDate: null,
      Responsibility: 'Procurement Dept',
      ProjectName: 'Vendor Management'
    },
    {
      id: 8,
      Subject: 'Data Backup Verification',
      Comments: 'All backups confirmed successful',
      IsActive: true,
      DueDate: '2026-05-28T00:00:00',
      CompletionDate: '2026-05-27T00:00:00',
      Responsibility: 'IT Dept',
      ProjectName: 'Infra Upgrade'
    },
    {
      id: 9,
      Subject: 'Employee Performance Reviews',
      Comments: 'Managers notified, forms distributed',
      IsActive: false,
      DueDate: '2026-07-15T00:00:00',
      CompletionDate: null,
      Responsibility: 'HR Department',
      ProjectName: 'Q3 Onboarding'
    },
    {
      id: 10,
      Subject: 'Network Infrastructure Upgrade',
      Comments: 'Hardware procurement in progress',
      IsActive: true,
      DueDate: '2026-08-01T00:00:00',
      CompletionDate: null,
      Responsibility: 'IT Dept',
      ProjectName: 'Infra Upgrade'
    },
    {
      id: 11,
      Subject: 'Quarterly Risk Assessment',
      Comments: 'Risk matrix updated',
      IsActive: true,
      DueDate: '2026-06-10T00:00:00',
      CompletionDate: '2026-06-09T00:00:00',
      Responsibility: 'Risk Management',
      ProjectName: 'Annual Planning'
    },
    {
      id: 12,
      Subject: 'Software License Audit',
      Comments: 'Unused licenses identified for removal',
      IsActive: false,
      DueDate: '2026-07-20T00:00:00',
      CompletionDate: null,
      Responsibility: 'IT Dept',
      ProjectName: 'Project Alpha'
    }
  ];

  constructor(private router: Router,
    private complaintsService: ComplaintsService,
    private pageHeaderService: PageHeaderService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    const savedData = localStorage.getItem('kanbanData');
    if (savedData) {
      this.cards = JSON.parse(savedData);
    } else {
      this.initializeKanbanData();
    }
    this.totalSize = this.mockdata.length;
    this.generateCalendarData();
    this.applyFilterData();
  }

  // --- View Toggle Logic ---
  toggleView() {
    this.isCalendarView = false;
    this.isKanbanView = !this.isKanbanView;
  }

  toggleCalendarView() {
    this.isCalendarView = !this.isCalendarView;
    this.isKanbanView = false;
  }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    this.generateCalendarData();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  toggleOverdueOnly(checked: boolean): void {
    this.showOverdueOnly = checked;
    this.applyFilterData();
  }

  applyFilterData(): void {
    if (this.showOverdueOnly) {
      this.filteredData = this.mockdata.filter(item => this.isOverdue(item.DueDate));
    } else {
      this.filteredData = [...this.mockdata];
    }
    this.totalSize = this.filteredData.length;
  }

  // --- Calendar Data Generation ---
  generateCalendarData(): void {
    const statusColors: any = {
      'Active': '#a0e4ff',
      'Inactive': '#ffcdd2'
    };

    const daysToDistribute = this.showWeekend ? 7 : 5;

    this.calendarCards = this.mockdata.map((project, i) => {
      const statusText = project.IsActive ? 'Active' : 'Inactive';
      return {
        hour: this.hoursList[i % this.hoursList.length],
        user: project.Responsibility,
        dayPlacement: (i % daysToDistribute) + 1,

        taskName: project.Subject,
        projectName: project.ProjectName,
        status: statusText,
        color: statusColors[statusText] || '#90ee90',
        pInitials: project.Subject ? project.Subject.substring(0, 2).toUpperCase() : 'NA'
      };
    });
  }

  // --- Scrolling Logic ---
  scrollLeft() {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  // --- Action Methods ---
  openEditDialog(item: any) {
    let dialogRef = this.dialog.open(EditTodoDialogComponent, {
      width: '600px',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.Subject = result.Subject;
        item.ProjectName = result.ProjectName;
        item.Responsibility = result.Responsibility;
        item.DueDate = result.DueDate;
        item.CompletionDate = result.CompletionDate;
        item.IsActive = result.IsActive;
        this.generateCalendarData();
      }
    });
  }

  deleteConfirmation(item: TaskElement) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mockdata = this.mockdata.filter(x => x.id !== item.id);
        this.totalSize = this.mockdata.length;
        this.generateCalendarData(); // Refresh calendar if deleted
        console.log("Deleted task:", item);
      }
    });
  }

  Confirmation(item: TaskElement) {
    let dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: 'Are you sure you want to Change the Status ?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.IsActive = !item.IsActive;
        this.generateCalendarData(); // Refresh calendar colors
        console.log(`Task status changed to ${item.IsActive ? 'Active' : 'Inactive'}`);
      }
    });
  }

  openPdf(fileName: string) {
    console.log("Opening PDF:", fileName);
  }

  // --- Kanban Specific Logic ---
  data = [
    { subject: 'Global fleet of connected vehicles', distributor: 'Mahindra', Lead: 'Ravi', status: 'Pending', TargetDate: '2026-04-25', FailureDate: '2026-04-20' },
    { subject: 'Engine Overheating', distributor: 'Tata Motors', Lead: 'Sneha', status: 'Pending', TargetDate: '2026-04-22', FailureDate: '2026-04-18' },
    { subject: 'Update Application Dependencies', distributor: 'Infosys', Lead: 'Kiran', status: 'Hold', TargetDate: '2026-04-30', FailureDate: '2026-04-21' },
    { subject: 'Verify DLL Versions', distributor: 'Tesla', Lead: 'Arjun', status: 'Process', TargetDate: '2026-04-15', FailureDate: '2026-04-10' },
    { subject: 'Bumper Issue', distributor: 'Tesla', Lead: 'Arjun', status: 'Hold', TargetDate: '2026-04-15', FailureDate: '2026-04-10' },
    { subject: 'Error Testing A', distributor: 'Tesla', Lead: 'Arjun', status: 'Pending', TargetDate: '2026-04-15', FailureDate: '2026-04-10' },
    { subject: 'Error Testing B', distributor: 'Tesla', Lead: 'Arjun', status: 'Hold', TargetDate: '2026-04-15', FailureDate: '2026-04-10' },
    { subject: 'Error Testing C', distributor: 'Tesla', Lead: 'Arjun', status: 'Process', TargetDate: '2026-04-15', FailureDate: '2026-04-10' },
    { subject: 'Error Testing D', distributor: 'Tesla', Lead: 'Arjun', status: 'Closed', TargetDate: '2026-04-15', FailureDate: '2026-04-10' }
  ];

  lists: Status[] = ['Pending', 'Allocated', 'Progress', 'Hold', 'Cancelled', 'Completed'];

  cards: Record<Status, Card[]> = {
    Pending: [], Allocated: [], Progress: [],
    Hold: [], Cancelled: [], Completed: []
  };

  private statusMap: Record<string, Status> = {
    'Pending': 'Pending',
    'Allocated': 'Allocated',
    'Process': 'Progress',
    'Progress': 'Progress',
    'Hold': 'Hold',
    'Cancelled': 'Cancelled',
    'Closed': 'Completed',
    'Completed': 'Completed'
  };

  initializeKanbanData(): void {
    const grouped: Record<Status, Card[]> = {
      Pending: [], Allocated: [], Progress: [],
      Hold: [], Cancelled: [], Completed: []
    };

    this.data.forEach((item, index) => {
      const status: Status = this.statusMap[item.status] ?? 'Pending';
      grouped[status].push({
        id: index + 1,
        subject: item.subject,
        LawFirm: item.distributor,
        createdBy: item.Lead,
        assignedTo: item.Lead,
        createdDate: item.FailureDate,
        dueDate: item.TargetDate,
        expedite: false,
        notes: [],
        expanded: false,
        status
      });
    });

    this.cards = grouped;
    localStorage.setItem('kanbanData', JSON.stringify(this.cards));
  }

  drop(event: CdkDragDrop<Card[]>, targetList: Status): void {
    const previousList = event.previousContainer.id as Status;
    const currentList = event.container.id as Status;

    if (previousList !== currentList) {
      transferArrayItem(
        this.cards[previousList],
        this.cards[currentList],
        event.previousIndex,
        event.currentIndex
      );
      this.cards[currentList][event.currentIndex].status = currentList;
    } else {
      moveItemInArray(this.cards[targetList], event.previousIndex, event.currentIndex);
    }

    this.cards = { ...this.cards };
    localStorage.setItem('kanbanData', JSON.stringify(this.cards));
  }

  toggleCard(card: Card): void {
    card.expanded = !card.expanded;
  }

  newNote = '';

  addNote(card: Card): void {
    if (this.newNote.trim()) {
      card.notes.push({
        text: this.newNote,
        author: 'Current User',
        date: new Date().toLocaleString()
      });
      this.newNote = '';
      localStorage.setItem('kanbanData', JSON.stringify(this.cards));
    }
  }

  isOverdue(dueDate: string): boolean {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }

  getColor(status: string): string {
    const colors: Record<string, string> = {
      'Pending': '#e24b4a',
      'Allocated': '#ef9f27',
      'Progress': '#378add',
      'Hold': '#f0995b',
      'Cancelled': '#888780',
      'Completed': '#639922'
    };
    return colors[status] ?? '#888780';
  }

  getCardClass(status: string): string {
    const classes: Record<string, string> = {
      'Pending': 'pending-card',
      'Allocated': 'allocated-card',
      'Progress': 'progress-card',
      'Hold': 'hold-card',
      'Cancelled': 'cancelled-card',
      'Completed': 'completed-card'
    };
    return classes[status] ?? 'default-card';
  }

  scrollGrid(side: 'left' | 'right'): void {
    const ele = document.getElementById('grid-table-container');
    if (ele) {
      ele.scrollLeft += side === 'right' ? 300 : -300;
    }
  }

  goBack(): void {
    this.router.navigate(['/app/complaints']);
  }

  trackByCard(index: number, item: Card): number {
    return item.id;
  }

  openTimelineModal(task: any): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }
}