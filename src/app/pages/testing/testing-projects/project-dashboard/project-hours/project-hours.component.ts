import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddHoursPopComponent } from './add-hours-pop/add-hours-pop.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

interface HourMessage {
  sender: string;
  date: string;
  text: string;
}

export interface HourTaskDetail {
  module: string;
  task: string;
  hours: number;
  description: string;
}

export interface HourEntry {
  dateObj: Date;
  jobCode: string;
  name: string;
  tasksList: HourTaskDetail[];
  totalHours: number;
  approved: boolean;
  declined: boolean;
  pending: boolean;
  messages?: HourMessage[];
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  claims: number;
}

@Component({
  selector: 'app-project-hours',
  templateUrl: './project-hours.component.html',
  styleUrls: ['./project-hours.component.scss']
})
export class ProjectHoursComponent implements OnInit {
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;
  @ViewChild('tasksDialog') tasksDialog!: TemplateRef<any>;

  monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentDate: Date = new Date(2025, 5, 1); // June 2025
  selectedDate: Date | null = null;

  filteredEntries: HourEntry[] = [];

  // Pagination variables
  paginatedEntries: HourEntry[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  calendarDays: CalendarDay[] = [];

  entries: HourEntry[] = [
    {
      dateObj: new Date(2025, 5, 2),
      jobCode: 'JB-201',
      name: 'Ravi Sharma',
      tasksList: [
        { module: 'Project Management', task: 'Client Meeting', hours: 2.0, description: 'Discussed project scope with client' },
        { module: 'Concept & Feasibility', task: 'Draft initial project charter', hours: 1.5, description: 'Prepared initial draft of charter' }
      ],
      totalHours: 3.5,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Ravi Sharma', date: '2025-06-02', text: 'Submitted timesheet report.' }, { sender: 'John Doe', date: '2025-06-03', text: 'Under review' }]
    },
    {
      dateObj: new Date(2025, 5, 2),
      jobCode: 'JB-202',
      name: 'Priya Singh',
      tasksList: [
        { module: 'HR', task: 'Team Building', hours: 1.0, description: 'Weekly sprint sync with team' }
      ],
      totalHours: 1.0,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Priya Singh', date: '2025-06-02', text: 'Completed design sprint sync.' }]
    },
    {
      dateObj: new Date(2025, 5, 2),
      jobCode: 'JB-203',
      name: 'Rajesh Kumar',
      tasksList: [
        { module: 'Process & Design Engineering', task: 'BOM Review', hours: 2.5, description: 'Detailed BOM revision session' },
        { module: 'Process & Design Engineering', task: 'Develop preliminary 3D assembly models', hours: 2.0, description: 'CAD fixture model updates' }
      ],
      totalHours: 4.5,
      approved: false,
      declined: false,
      pending: true,
      messages: []
    },
    {
      dateObj: new Date(2025, 5, 2),
      jobCode: 'JB-204',
      name: 'Vijay Verma',
      tasksList: [
        { module: 'Concept & Feasibility', task: 'Regulatory and EHS compliance check', hours: 3.0, description: 'Monthly plant safety audit' }
      ],
      totalHours: 3.0,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Vijay Verma', date: '2025-06-02', text: 'Audit passed successfully' }]
    },
    {
      dateObj: new Date(2025, 5, 2),
      jobCode: 'JB-211',
      name: 'Siddharth Rao',
      tasksList: [
        { module: 'Core Development', task: 'API Gateway Implementation', hours: 3.0, description: 'Built authentication endpoints' },
        { module: 'Core Development', task: 'Database ORM Mapping', hours: 2.0, description: 'Mapped relational schema' }
      ],
      totalHours: 5.0,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Siddharth Rao', date: '2025-06-02', text: 'API endpoints ready for testing' }]
    },
    {
      dateObj: new Date(2025, 5, 2),
      jobCode: 'JB-212',
      name: 'Ananya Mishra',
      tasksList: [
        { module: 'UX & Specification', task: 'Wireframe Validation', hours: 4.0, description: 'Figma mockups review with leads' }
      ],
      totalHours: 4.0,
      approved: false,
      declined: false,
      pending: true,
      messages: []
    },
    {
      dateObj: new Date(2025, 5, 2),
      jobCode: 'JB-213',
      name: 'Karan Malhotra',
      tasksList: [
        { module: 'Process & Design Engineering', task: 'Structural CAD Model', hours: 2.5, description: 'Revised load bearing specs' }
      ],
      totalHours: 2.5,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Karan Malhotra', date: '2025-06-02', text: 'CAD files uploaded to server' }]
    },
    {
      dateObj: new Date(2025, 5, 2),
      jobCode: 'JB-214',
      name: 'Deepak Nambiar',
      tasksList: [
        { module: 'Testing & QA', task: 'Security Scan Audit', hours: 6.0, description: 'Executed OWASP security scan' }
      ],
      totalHours: 6.0,
      approved: false,
      declined: true,
      pending: false,
      messages: [{ sender: 'Security Team', date: '2025-06-02', text: 'Overtime hours not pre-approved' }]
    },
    {
      dateObj: new Date(2025, 5, 2),
      jobCode: 'JB-215',
      name: 'Pooja Hegde',
      tasksList: [
        { module: 'Testing & QA', task: 'Unit Test Suites', hours: 3.5, description: 'Wrote unit test cases for auth service' }
      ],
      totalHours: 3.5,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2025, 5, 2),
      jobCode: 'JB-216',
      name: 'Arjun Reddy',
      tasksList: [
        { module: 'UAT & Compliance', task: 'Client Verification Session', hours: 4.5, description: 'Staging environment demo' }
      ],
      totalHours: 4.5,
      approved: false,
      declined: false,
      pending: true,
      messages: [{ sender: 'Arjun Reddy', date: '2025-06-02', text: 'Awaiting client sign-off' }]
    },
    {
      dateObj: new Date(2025, 5, 9),
      jobCode: 'JB-205',
      name: 'Amit Kumar',
      tasksList: [
        { module: 'Administration', task: 'Office Management', hours: 2.0, description: 'Sourced office supplies for site' },
        { module: 'Concept & Feasibility', task: 'Initial BOM & labor cost estimation', hours: 2.5, description: 'Revised BOM cost calculation' },
        { module: 'Supply Chain', task: 'Vendor Assessment', hours: 1.5, description: 'Evaluated tier-1 suppliers' }
      ],
      totalHours: 6.0,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2025, 5, 13),
      jobCode: 'JB-206',
      name: 'Neha Sharma',
      tasksList: [
        { module: 'Design', task: 'Tool & Software', hours: 4.0, description: 'Reviewed license renewal for design tool' },
        { module: 'Concept & Feasibility', task: 'Regulatory and EHS compliance check', hours: 1.5, description: 'Reviewed plant ventilation metrics' }
      ],
      totalHours: 5.5,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Neha Sharma', date: '2025-06-13', text: 'License invoice attached' }]
    },
    {
      dateObj: new Date(2025, 5, 13),
      jobCode: 'JB-207',
      name: 'Vikram Joshi',
      tasksList: [
        { module: 'Administration', task: 'Utilities', hours: 1.5, description: 'Resolved internet connectivity issue' },
        { module: 'Process & Design Engineering', task: 'Develop preliminary 3D assembly models', hours: 6.0, description: 'Completed assembly of structural prototype' }
      ],
      totalHours: 7.5,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'John Doe', date: '2025-06-13', text: 'Autopaid' }]
    },
    {
      dateObj: new Date(2025, 5, 25),
      jobCode: 'JB-208',
      name: 'Sneha Kapoor',
      tasksList: [
        { module: 'Business Development', task: 'Client Relationship', hours: 0.5, description: 'Coordinated Diwali gift for client' },
        { module: 'Concept & Feasibility', task: 'Preliminary supply chain & vendor assessment', hours: 2.0, description: 'Negotiated raw materials pricing' }
      ],
      totalHours: 2.5,
      approved: false,
      declined: true,
      pending: false,
      messages: [{ sender: 'Sneha Kapoor', date: '2025-06-25', text: 'Sent to client' }, { sender: 'Manager A', date: '2025-06-26', text: 'Budget exceeded, declined' }]
    },
    {
      dateObj: new Date(2025, 5, 25),
      jobCode: 'JB-209',
      name: 'Manish Jain',
      tasksList: [
        { module: 'Project Management', task: 'Offsite Meeting', hours: 1.0, description: 'Booked flight for offsite meeting' }
      ],
      totalHours: 1.0,
      approved: false,
      declined: true,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2025, 5, 29),
      jobCode: 'JB-210',
      name: 'Anjali Patel',
      tasksList: [
        { module: 'Project Management', task: 'Client Meeting', hours: 2.5, description: 'Coordinated hotel stay for client visit' },
        { module: 'Concept & Feasibility', task: 'Assess existing factory floor capacity', hours: 4.0, description: 'Reviewed floor space limitations with manager' }
      ],
      totalHours: 6.5,
      approved: false,
      declined: false,
      pending: true,
      messages: [{ sender: 'Anjali Patel', date: '2025-06-29', text: 'Requesting room upgrade' }]
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buildCalendar();

    const targetDefault = new Date(2025, 5, 2); // June 2nd, 2025
    const defaultDay = this.calendarDays.find(d => d.inCurrentMonth && this.isSameDay(d.date, targetDefault))
      ?? this.calendarDays.find(d => d.inCurrentMonth)!;

    this.filterByDate(defaultDay);
  }

  // ─── Calendar header label ──────────────────────────────────────────────

  get currentMonthLabel(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  // ─── Month navigation ───────────────────────────────────────────────────

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  // ─── Calendar build ─────────────────────────────────────────────────────

  buildCalendar(): void {
    const year  = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset  = firstOfMonth.getDay();
    const gridStart    = new Date(year, month, 1 - startOffset);
    const today        = new Date();
    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      const inCurrentMonth = cellDate.getMonth() === month;
      days.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        inCurrentMonth,
        isToday: this.isSameDay(cellDate, today),
        isSelected: this.selectedDate ? this.isSameDay(cellDate, this.selectedDate) : false,
        claims: inCurrentMonth ? this.entries.filter(e => this.isSameDay(e.dateObj, cellDate)).length : 0
      });
    }
    this.calendarDays = days;
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth()      === b.getMonth()
      && a.getDate()       === b.getDate();
  }

  // ─── Filtering ──────────────────────────────────────────────────────────

  filterByDate(day: CalendarDay) {
    if (!day.inCurrentMonth) return;

    this.selectedDate = day.date;
    this.filteredEntries = this.entries.filter(e => this.isSameDay(e.dateObj, day.date));

    for (const d of this.calendarDays) {
      d.isSelected = this.isSameDay(d.date, day.date);
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  // ─── Pagination ─────────────────────────────────────────────────────────

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + Number(this.pageSize);
    this.paginatedEntries = this.filteredEntries.slice(startIndex, endIndex);
  }

  handlePageEvent(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  changePageSize(event: any) {
    this.pageSize = event.target.value;
    this.currentPage = 1;
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEntries.length / this.pageSize);
  }

  get showingStart(): number {
    return this.filteredEntries.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredEntries.length);
  }

  get totalClaimsInRange(): number {
    return this.calendarDays.filter(d => d.inCurrentMonth).reduce((sum, d) => sum + d.claims, 0);
  }

  // ─── Table utilities ────────────────────────────────────────────────────

  scrollTable(direction: 'left' | 'right') {
    if (this.tableWrapper) {
      const scrollAmount = 400;
      const element = this.tableWrapper.nativeElement;
      const targetScroll = direction === 'right' ? element.scrollLeft + scrollAmount : element.scrollLeft - scrollAmount;

      element.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }

  truncateDescription(text: string): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length > 4) {
      return words.slice(0, 4).join(' ') + '...';
    }
    return text;
  }

  formatDate(d: Date): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}-${dd}-${yy}`;
  }

  toggleRowStatus(entry: HourEntry, field: 'approved' | 'declined' | 'pending'): void {
    if (field === 'approved') {
      entry.approved = !entry.approved;
      if (entry.approved) {
        entry.declined = false;
        entry.pending = false;
      }
    } else if (field === 'declined') {
      entry.declined = !entry.declined;
      if (entry.declined) {
        entry.approved = false;
        entry.pending = false;
      }
    } else if (field === 'pending') {
      entry.pending = !entry.pending;
      if (entry.pending) {
        entry.approved = false;
        entry.declined = false;
      }
    }
  }

  openTasksDialog(entry: HourEntry): void {
    this.dialog.open(this.tasksDialog, {
      width: '700px',
      data: entry
    });
  }

  openMessagesDialog(entry: HourEntry): void {
    this.dialog.open(this.messageDialog, {
      width: '500px',
      data: entry
    });
  }

  addMessage(entry: HourEntry, text: string): void {
    if (!text || !text.trim()) return;
    if (!entry.messages) {
      entry.messages = [];
    }
    entry.messages.push({
      sender: 'John Doe',
      date: new Date().toISOString().split('T')[0],
      text: text.trim()
    });
  }

  addTimesheet(): void {
    let dialogRef = this.dialog.open(AddHoursPopComponent, {
      width: '800px',
      height: 'auto',
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tasks: HourTaskDetail[] = (result.rows || []).map((r: any) => ({
          module: r.module || 'General',
          task: r.task || 'Task Log',
          hours: Number(r.hours) || 0,
          description: r.description || ''
        }));
        const total = tasks.reduce((sum, t) => sum + t.hours, 0);

        const newEntry: HourEntry = {
          dateObj: result.dateObj,
          jobCode: 'JB-' + (200 + this.entries.length + 1),
          name: result.name || 'Anonymous',
          tasksList: tasks.length > 0 ? tasks : [{ module: 'General', task: 'Task Log', hours: 1, description: 'General work' }],
          totalHours: total > 0 ? total : 1,
          approved: false,
          declined: false,
          pending: true,
          messages: []
        };
        this.entries.push(newEntry);

        this.buildCalendar();
        if (this.selectedDate) {
          const selectedDay = this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!));
          if (selectedDay) {
            this.filterByDate(selectedDay);
          }
        }
      }
    });
  }

  editEntry(entry: HourEntry): void {
    let dialogRef = this.dialog.open(AddHoursPopComponent, {
      width: '800px',
      height: 'auto',
      data: {
        dateObj: entry.dateObj,
        name: entry.name,
        tasksList: entry.tasksList
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        entry.dateObj = result.dateObj;
        entry.name = result.name;
        if (result.rows && result.rows.length > 0) {
          entry.tasksList = result.rows.map((r: any) => ({
            module: r.module || 'General',
            task: r.task || 'Task Log',
            hours: Number(r.hours) || 0,
            description: r.description || ''
          }));
          entry.totalHours = entry.tasksList.reduce((sum, t) => sum + t.hours, 0);
        }

        this.buildCalendar();
        if (this.selectedDate) {
          const selectedDay = this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!));
          if (selectedDay) {
            this.filterByDate(selectedDay);
          }
        }
      }
    });
  }

  deleteEntry(entry: HourEntry): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.entries = this.entries.filter(e => e !== entry);
        this.buildCalendar();
        if (this.selectedDate) {
          const selectedDay = this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!));
          if (selectedDay) {
            this.filterByDate(selectedDay);
          }
        }
      }
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/app/testing/projects');
  }
}