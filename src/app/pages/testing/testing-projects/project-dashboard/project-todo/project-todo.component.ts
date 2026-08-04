import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddTodoPopComponent } from './add-todo-pop/add-todo-pop.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

export interface ProjectTodoItem {
  id?: number;
  subject: string;
  description: string;
  dueDate: string;
  role: string;
  group: string;
  site: string;
  department: string;
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  actualHours?: number;
  section?: string;
  taskCode?: string;
  effort?: number;
}

@Component({
  selector: 'app-project-todo',
  templateUrl: './project-todo.component.html',
  styleUrls: ['./project-todo.component.scss']
})
export class ProjectTodoComponent implements OnInit {

  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

  todos: ProjectTodoItem[] = [];
  filteredTodos: ProjectTodoItem[] = [];
  paginatedTodos: ProjectTodoItem[] = [];

  // Toggleable Filter Card state matching Documents & Expenses
  filterToggle: boolean = false;
  searchKeyword: string = '';
  selectedRole: string | null = null;
  selectedGroup: string | null = null;
  selectedSite: string | null = null;
  selectedDepartment: string | null = null;

  // Dropdown options
  roleOptions: string[] = [];
  groupOptions: string[] = [];
  siteOptions: string[] = [];
  departmentOptions: string[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
    this.extractFilterOptions();
    this.applyFilters();
  }

  loadInitialData(): void {
    this.todos = [
      {
        id: 1,
        subject: 'Review Assembly Tooling Specs',
        description: 'Verify CAD models and tolerance stack-up for line A fixtures.',
        dueDate: '2026-07-28',
        role: 'Design Lead',
        group: 'Tooling Group',
        site: 'Plant 1 - Sanand',
        department: 'Tooling Design',
        planStart: '2026-07-01',
        planEnd: '2026-07-28',
        actualStart: '2026-07-02',
        actualEnd: '2026-07-27',
        eta: '2026-07-28',
        actualHours: 32,
        section: 'Section A',
        taskCode: 'TODO-101',
        effort: 40
      },
      {
        id: 2,
        subject: 'Setup EHS Safety Guarding',
        description: 'Install perimeter light curtains and emergency stop switches.',
        dueDate: '2026-08-05',
        role: 'Safety Engineer',
        group: 'EHS Group',
        site: 'Plant 2 - Chakan',
        department: 'EHS & Compliance',
        planStart: '2026-07-15',
        planEnd: '2026-08-05',
        actualStart: '2026-07-16',
        actualEnd: '',
        eta: '2026-08-05',
        actualHours: 18,
        section: 'Section B',
        taskCode: 'TODO-102',
        effort: 24
      },
      {
        id: 3,
        subject: 'Calibrate Robotic Arm Controllers',
        description: 'Perform teach-pendant offset verification and payload test.',
        dueDate: '2026-08-10',
        role: 'Automation Lead',
        group: 'Robotics Group',
        site: 'Plant 1 - Sanand',
        department: 'Automation',
        planStart: '2026-07-20',
        planEnd: '2026-08-10',
        actualStart: '2026-07-22',
        actualEnd: '',
        eta: '2026-08-10',
        actualHours: 25,
        section: 'Section A',
        taskCode: 'TODO-103',
        effort: 36
      },
      {
        id: 4,
        subject: 'Audit Supplier Quality Reports',
        description: 'Cross-check dimensional inspection certificates for M12 bolts batch.',
        dueDate: '2026-08-15',
        role: 'Quality Inspector',
        group: 'Supplier Quality',
        site: 'Plant 3 - Hosur',
        department: 'Quality Assurance',
        planStart: '2026-08-01',
        planEnd: '2026-08-15',
        actualStart: '',
        actualEnd: '',
        eta: '2026-08-15',
        actualHours: 0,
        section: 'Section C',
        taskCode: 'TODO-104',
        effort: 16
      },
      {
        id: 5,
        subject: 'Finalize Line 2 Electric Wiring',
        description: 'Complete high-voltage harness insulation testing and sign-off.',
        dueDate: '2026-08-20',
        role: 'Electrical Engineer',
        group: 'Electrical Systems',
        site: 'Plant 2 - Chakan',
        department: 'Electrical Maintenance',
        planStart: '2026-08-05',
        planEnd: '2026-08-20',
        actualStart: '',
        actualEnd: '',
        eta: '2026-08-20',
        actualHours: 0,
        section: 'Section B',
        taskCode: 'TODO-105',
        effort: 28
      },
      {
        id: 6,
        subject: 'BOM Reconciliation for Phase 2',
        description: 'Align SAP part numbers with engineering change notices.',
        dueDate: '2026-08-25',
        role: 'Planner',
        group: 'Supply Chain Group',
        site: 'Plant 1 - Sanand',
        department: 'Production Control',
        planStart: '2026-08-10',
        planEnd: '2026-08-25',
        actualStart: '',
        actualEnd: '',
        eta: '2026-08-25',
        actualHours: 0,
        section: 'Section A',
        taskCode: 'TODO-106',
        effort: 20
      },
      {
        id: 7,
        subject: 'Conduct Operator Ergonomics Trial',
        description: 'Evaluate lift-assist mechanisms during mockup assembly.',
        dueDate: '2026-08-30',
        role: 'Industrial Engineer',
        group: 'Process Group',
        site: 'Plant 3 - Hosur',
        department: 'Process Engineering',
        planStart: '2026-08-15',
        planEnd: '2026-08-30',
        actualStart: '',
        actualEnd: '',
        eta: '2026-08-30',
        actualHours: 0,
        section: 'Section C',
        taskCode: 'TODO-107',
        effort: 15
      },
      {
        id: 8,
        subject: 'Prepare Gate 3 Checklist',
        description: 'Compile testing logs and safety audit clearance docs.',
        dueDate: '2026-09-02',
        role: 'Project Manager',
        group: 'NPI Management',
        site: 'Plant 1 - Sanand',
        department: 'Project Management',
        planStart: '2026-08-20',
        planEnd: '2026-09-02',
        actualStart: '',
        actualEnd: '',
        eta: '2026-09-02',
        actualHours: 0,
        section: 'Section A',
        taskCode: 'TODO-108',
        effort: 12
      }
    ];
  }

  extractFilterOptions(): void {
    this.roleOptions = Array.from(new Set(this.todos.map(t => t.role).filter(Boolean)));
    this.groupOptions = Array.from(new Set(this.todos.map(t => t.group).filter(Boolean)));
    this.siteOptions = Array.from(new Set(this.todos.map(t => t.site).filter(Boolean)));
    this.departmentOptions = Array.from(new Set(this.todos.map(t => t.department).filter(Boolean)));
  }

  applyFilters(): void {
    let result = [...this.todos];

    if (this.searchKeyword && this.searchKeyword.trim() !== '') {
      const kw = this.searchKeyword.toLowerCase().trim();
      result = result.filter(item =>
        item.subject.toLowerCase().includes(kw) ||
        item.description.toLowerCase().includes(kw) ||
        item.role.toLowerCase().includes(kw) ||
        item.group.toLowerCase().includes(kw) ||
        item.site.toLowerCase().includes(kw) ||
        item.department.toLowerCase().includes(kw)
      );
    }

    if (this.selectedRole) {
      result = result.filter(item => item.role === this.selectedRole);
    }

    if (this.selectedGroup) {
      result = result.filter(item => item.group === this.selectedGroup);
    }

    if (this.selectedSite) {
      result = result.filter(item => item.site === this.selectedSite);
    }

    if (this.selectedDepartment) {
      result = result.filter(item => item.department === this.selectedDepartment);
    }

    this.filteredTodos = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedRole = null;
    this.selectedGroup = null;
    this.selectedSite = null;
    this.selectedDepartment = null;
    this.applyFilters();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + Number(this.pageSize);
    this.paginatedTodos = this.filteredTodos.slice(start, end);
  }

  handlePageEvent(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
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

  addTodo(): void {
    const dialogRef = this.dialog.open(AddTodoPopComponent, {
      width: '850px',
      height: 'auto',
      data: null
    });

    dialogRef.afterClosed().subscribe((res: ProjectTodoItem | undefined) => {
      if (res) {
        res.id = Date.now();
        this.todos.unshift(res);
        this.extractFilterOptions();
        this.applyFilters();
      }
    });
  }

  editTodo(todo: ProjectTodoItem): void {
    const dialogRef = this.dialog.open(AddTodoPopComponent, {
      width: '850px',
      height: 'auto',
      data: todo
    });

    dialogRef.afterClosed().subscribe((res: ProjectTodoItem | undefined) => {
      if (res) {
        Object.assign(todo, res);
        this.extractFilterOptions();
        this.applyFilters();
      }
    });
  }

  deleteTodo(todo: ProjectTodoItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this Todo?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.todos = this.todos.filter(t => t.id !== todo.id);
        this.extractFilterOptions();
        this.applyFilters();
      }
    });
  }

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineTask: ProjectTodoItem | null = null;

  openTimelineModal(todo: ProjectTodoItem) {
    this.selectedTimelineTask = todo;
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
