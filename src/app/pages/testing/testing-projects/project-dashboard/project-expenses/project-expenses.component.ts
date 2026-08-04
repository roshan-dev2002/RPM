import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddExpensePopComponent } from './add-expense-pop/add-expense-pop.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

interface Expense {
  date: number;
  initials: string;
  avatarBg: string;
  name: string;
  subject: string;
  description: string;
  approvedBy: string;
  stage: string;
  stageClass: string;
  module: string;
  task: string;
  amount: string;
  pdfCount: number;
  pdfFileName?: string;
  pdfUrl?: string;
  approved: boolean;
  paid: boolean;
  declined: boolean;
  submittedDate: string;
  submittedBy: string;
  approvedDate: string;
  messagesCount: number;
  messages: Array<{ sender: string, date: string, text: string }>;
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
  selector: 'app-project-expenses',
  templateUrl: './project-expenses.component.html',
  styleUrls: ['./project-expenses.component.scss']
})
export class ProjectExpensesComponent implements OnInit {
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentDate: Date = new Date(2025, 5, 1); // June 2025
  selectedDate: Date | null = null;

  filteredExpenses: Expense[] = [];

  // Pagination variables
  paginatedExpenses: Expense[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  calendarDays: CalendarDay[] = [];

  expenses: Expense[] = [
    { date: 2, initials: 'RS', avatarBg: '#e0f2fe', name: 'Ravi Sharma', subject: 'Travel to Client Site', description: 'Travel expenses for client meeting in Bangalore', approvedBy: '', stage: 'Review', stageClass: 'stage-review', module: 'Project Management', task: 'Client Meeting', amount: '₹2,500', pdfCount: 1, approved: false, paid: false, declined: false, submittedDate: '2025-06-02', submittedBy: 'Ravi Sharma', approvedDate: '', messagesCount: 2, messages: [{ sender: 'Ravi Sharma', date: '2025-06-02', text: 'Submitted travel expense report' }, { sender: 'John Doe', date: '2025-06-03', text: 'Under review' }] },
    { date: 2, initials: 'PS', avatarBg: '#dcfce7', name: 'Priya Singh', subject: 'Team Lunch', description: 'Team lunch after project milestone completion', approvedBy: 'Jane Smith', stage: 'Approved', stageClass: 'stage-approved', module: 'HR', task: 'Team Building', amount: '₹1,200', pdfCount: 1, approved: true, paid: false, declined: false, submittedDate: '2025-06-02', submittedBy: 'Priya Singh', approvedDate: '2025-06-03', messagesCount: 1, messages: [{ sender: 'Jane Smith', date: '2025-06-03', text: 'Approved' }] },
    { date: 9, initials: 'AK', avatarBg: '#f3e8ff', name: 'Amit Kumar', subject: 'Office Supplies', description: 'Purchase of stationery and office supplies', approvedBy: 'Manager A', stage: 'Approved', stageClass: 'stage-approved', module: 'Administration', task: 'Office Management', amount: '₹850', pdfCount: 0, approved: true, paid: false, declined: false, submittedDate: '2025-06-09', submittedBy: 'Amit Kumar', approvedDate: '2025-06-10', messagesCount: 0, messages: [] },
    { date: 13, initials: 'NS', avatarBg: '#fef08a', name: 'Neha Sharma', subject: 'Software License', description: 'Annual license renewal for design tool', approvedBy: 'Director B', stage: 'Paid', stageClass: 'stage-paid', module: 'Design', task: 'Tool & Software', amount: '₹3,600', pdfCount: 2, approved: true, paid: true, declined: false, submittedDate: '2025-06-13', submittedBy: 'Neha Sharma', approvedDate: '2025-06-14', messagesCount: 3, messages: [{ sender: 'Neha Sharma', date: '2025-06-13', text: 'license invoice attached' }, { sender: 'Director B', date: '2025-06-14', text: 'Approved for payment' }, { sender: 'Finance', date: '2025-06-15', text: 'Payment completed' }] },
    { date: 13, initials: 'VJ', avatarBg: '#cffafe', name: 'Vikram Joshi', subject: 'Internet Recharge', description: 'Monthly internet recharge for office', approvedBy: 'John Doe', stage: 'Paid', stageClass: 'stage-paid', module: 'Administration', task: 'Utilities', amount: '₹1,000', pdfCount: 0, approved: true, paid: true, declined: false, submittedDate: '2025-06-13', submittedBy: 'Vikram Joshi', approvedDate: '2025-06-13', messagesCount: 1, messages: [{ sender: 'John Doe', date: '2025-06-13', text: 'Autopaid' }] },
    { date: 25, initials: 'SK', avatarBg: '#fce7f3', name: 'Sneha Kapoor', subject: 'Client Gift', description: 'Diwali gift for important client', approvedBy: '', stage: 'Declined', stageClass: 'stage-declined', module: 'Business Development', task: 'Client Relationship', amount: '₹1,500', pdfCount: 1, approved: false, paid: false, declined: true, submittedDate: '2025-06-25', submittedBy: 'Sneha Kapoor', approvedDate: '', messagesCount: 2, messages: [{ sender: 'Sneha Kapoor', date: '2025-06-25', text: 'Sent to client' }, { sender: 'Manager A', date: '2025-06-26', text: 'Budget exceeded, declined' }] },
    { date: 25, initials: 'MJ', avatarBg: '#e0e7ff', name: 'Manish Jain', subject: 'Flight to Mumbai', description: 'Flight booking for offsite meeting', approvedBy: '', stage: 'Declined', stageClass: 'stage-declined', module: 'Project Management', task: 'Offsite Meeting', amount: '₹4,800', pdfCount: 0, approved: false, paid: false, declined: true, submittedDate: '2025-06-25', submittedBy: 'Manish Jain', approvedDate: '', messagesCount: 0, messages: [] },
    { date: 29, initials: 'AP', avatarBg: '#ffedd5', name: 'Anjali Patel', subject: 'Hotel Booking', description: 'Hotel stay during client visit', approvedBy: '', stage: 'Declined', stageClass: 'stage-declined', module: 'Project Management', task: 'Client Meeting', amount: '₹2,200', pdfCount: 2, approved: false, paid: false, declined: true, submittedDate: '2025-06-29', submittedBy: 'Anjali Patel', approvedDate: '', messagesCount: 1, messages: [{ sender: 'Anjali Patel', date: '2025-06-29', text: 'Requesting room upgrade' }] },
    { date: 5, initials: 'RK', avatarBg: '#e0f2fe', name: 'Rajesh Kumar', subject: 'Cab Fare', description: 'Cab fare for local client visit', approvedBy: 'John Doe', stage: 'Approved', stageClass: 'stage-approved', module: 'Sales', task: 'Client Pitch', amount: '₹450', pdfCount: 0, approved: true, paid: false, declined: false, submittedDate: '2025-06-05', submittedBy: 'Rajesh Kumar', approvedDate: '2025-06-06', messagesCount: 1, messages: [{ sender: 'John Doe', date: '2025-06-06', text: 'Approved fare.' }] },
    { date: 22, initials: 'VV', avatarBg: '#e0e7ff', name: 'Vijay Verma', subject: 'Marketing Materials', description: 'Printing of flyers for exhibition', approvedBy: '', stage: 'Declined', stageClass: 'stage-declined', module: 'Marketing', task: 'Exhibition Prep', amount: '₹5,000', pdfCount: 1, approved: false, paid: false, declined: true, submittedDate: '2025-06-22', submittedBy: 'Vijay Verma', approvedDate: '', messagesCount: 1, messages: [{ sender: 'Vijay Verma', date: '2025-06-22', text: 'Urgent request.' }] }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  isMaskingApproved = false;

  ngOnInit(): void {
    this.buildCalendar();
    this.applyFiltering();
  }

  applyFiltering(): void {
    let list = [...this.expenses];
    if (this.selectedDate) {
      list = list.filter(e => e.date === this.selectedDate!.getDate());
    }
    if (this.isMaskingApproved) {
      list = list.filter(e => !e.approved);
    }
    this.filteredExpenses = list;
    this.currentPage = 1;
    this.updatePagination();
  }

  toggleMaskApproved(): void {
    this.isMaskingApproved = !this.isMaskingApproved;
    this.applyFiltering();
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
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const today = new Date();
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
        claims: inCurrentMonth ? this.expenses.filter(e => e.date === cellDate.getDate()).length : 0
      });
    }
    this.calendarDays = days;
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  // ─── Filtering ──────────────────────────────────────────────────────────

  filterByDate(day: CalendarDay) {
    if (!day.inCurrentMonth) return;

    this.selectedDate = day.date;
    this.applyFiltering();

    for (const d of this.calendarDays) {
      d.isSelected = this.isSameDay(d.date, day.date);
    }
  }

  // ─── Pagination ─────────────────────────────────────────────────────────

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + Number(this.pageSize);
    this.paginatedExpenses = this.filteredExpenses.slice(startIndex, endIndex);
  }

  handlePageEvent(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredExpenses.length / this.pageSize);
  }

  get showingStart(): number {
    return this.filteredExpenses.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredExpenses.length);
  }

  get totalClaimsInRange(): number {
    return this.calendarDays.filter(d => d.inCurrentMonth).reduce((sum, d) => sum + d.claims, 0);
  }

  get dailyAverageClaims(): string {
    const daysInMonth = this.calendarDays.filter(d => d.inCurrentMonth).length;
    return daysInMonth === 0 ? '0.00' : (this.totalClaimsInRange / daysInMonth).toFixed(2);
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

  scrollLeft() {
    this.scrollTable('left');
  }

  scrollRight() {
    this.scrollTable('right');
  }

  truncateDescription(text: string): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length > 4) {
      return words.slice(0, 4).join(' ') + '...';
    }
    return text;
  }

  addExpense(): void {
    let dialogRef = this.dialog.open(AddExpensePopComponent, {
      width: '950px',
      height: 'auto',
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newExpense: Expense = {
          date: new Date(result.submittedDate || new Date()).getDate(),
          initials: this.getInitials(result.submittedBy || result.name),
          avatarBg: this.getRandomColor(),
          name: result.submittedBy || result.name,
          subject: result.subject,
          description: result.description,
          approvedBy: result.approvedBy || '',
          stage: result.stage || 'Review',
          stageClass: this.getStageClass(result.stage),
          module: result.module,
          task: result.task,
          amount: result.amount,
          pdfCount: result.pdfFile ? 1 : 0,
          pdfFileName: result.pdfFile ? result.pdfFile.name : '',
          pdfUrl: result.pdfFile ? URL.createObjectURL(result.pdfFile) : '',
          approved: result.stage === 'Approved' || result.stage === 'Paid',
          paid: result.stage === 'Paid',
          declined: result.stage === 'Declined',
          submittedDate: result.submittedDate || new Date().toISOString().split('T')[0],
          submittedBy: result.submittedBy || result.name,
          approvedDate: result.approvedDate || '',
          messagesCount: 0,
          messages: []
        };
        this.expenses.unshift(newExpense);
        this.buildCalendar();
        this.applyFiltering();
      }
    });
  }

  editExpense(expense: Expense): void {
    let dialogRef = this.dialog.open(AddExpensePopComponent, {
      width: '950px',
      height: 'auto',
      data: expense
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle PDF separately: new file uploaded, or keep existing one
        if (result.pdfFile) {
          expense.pdfFileName = result.pdfFile.name;
          expense.pdfUrl = URL.createObjectURL(result.pdfFile);
          expense.pdfCount = (expense.pdfCount || 0) + 1;
        } else if (!result.pdfFileName) {
          // user removed the PDF in the dialog
          expense.pdfFileName = '';
          expense.pdfUrl = '';
        }

        expense.name = result.submittedBy || result.name;
        expense.submittedBy = result.submittedBy || result.name;
        expense.subject = result.subject;
        expense.description = result.description;
        expense.approvedBy = result.approvedBy;
        expense.stage = result.stage;
        expense.module = result.module;
        expense.task = result.task;
        expense.amount = result.amount;
        expense.submittedDate = result.submittedDate;
        expense.approvedDate = result.approvedDate;
        expense.date = new Date(result.submittedDate || new Date()).getDate();

        expense.stageClass = this.getStageClass(result.stage);
        expense.approved = result.stage === 'Approved' || result.stage === 'Paid';
        expense.paid = result.stage === 'Paid';
        expense.declined = result.stage === 'Declined';

        this.buildCalendar();
        this.applyFiltering();
      }
    });
  }

  deleteExpense(expense: Expense): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenses = this.expenses.filter(e => e !== expense);
        this.buildCalendar();
        this.applyFiltering();
      }
    });
  }

  toggleApproved(expense: Expense): void {
    expense.approved = !expense.approved;
    if (expense.approved) {
      expense.declined = false;
      expense.stage = 'Approved';
      expense.stageClass = 'stage-approved';
      expense.approvedBy = 'Admin';
      expense.approvedDate = new Date().toISOString().split('T')[0];
    } else {
      expense.stage = 'Review';
      expense.stageClass = 'stage-review';
      expense.approvedBy = '';
      expense.approvedDate = '';
    }
    this.buildCalendar();
    this.applyFiltering();
  }

  toggleDeclined(expense: Expense): void {
    expense.declined = !expense.declined;
    if (expense.declined) {
      expense.approved = false;
      expense.paid = false;
      expense.stage = 'Declined';
      expense.stageClass = 'stage-declined';
      expense.approvedBy = '';
      expense.approvedDate = '';
    } else {
      expense.stage = 'Review';
      expense.stageClass = 'stage-review';
    }
    this.buildCalendar();
    this.applyFiltering();
  }

  openMessagesDialog(expense: Expense): void {
    this.dialog.open(this.messageDialog, {
      width: '500px',
      data: expense
    });
  }

  addMessage(expense: Expense, text: string): void {
    if (!text || !text.trim()) return;
    if (!expense.messages) {
      expense.messages = [];
    }
    expense.messages.push({
      sender: 'Admin',
      date: new Date().toISOString().split('T')[0],
      text: text.trim()
    });
    expense.messagesCount = expense.messages.length;
  }

  // ─── PDF view/download (table icons) ───────────────────────────────────

  viewPdf(expense: Expense): void {
    if (expense.pdfUrl) {
      window.open(expense.pdfUrl, '_blank');
    } else {
      alert('No PDF uploaded for this expense.');
    }
  }

  downloadPdf(expense: Expense): void {
    if (expense.pdfUrl) {
      const link = document.createElement('a');
      link.href = expense.pdfUrl;
      link.download = expense.pdfFileName || 'expense.pdf';
      link.click();
    } else {
      alert('No PDF uploaded for this expense.');
    }
  }

  getInitials(name: string): string {
    if (!name) return 'EX';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  getRandomColor(): string {
    const colors = ['#e0f2fe', '#dcfce7', '#f3e8ff', '#fef08a', '#cffafe', '#fce7f3', '#e0e7ff', '#ffedd5'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getStageClass(stage: string): string {
    switch (stage) {
      case 'Approved': return 'stage-approved';
      case 'Paid': return 'stage-paid';
      case 'Declined': return 'stage-declined';
      default: return 'stage-review';
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/app/testing/projects');
  }

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineTask: Expense | null = null;

  openTimelineModal(expense: Expense) {
    this.selectedTimelineTask = expense;
    this.showTimelineModal = true;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  closeTimelineModal() {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }
}