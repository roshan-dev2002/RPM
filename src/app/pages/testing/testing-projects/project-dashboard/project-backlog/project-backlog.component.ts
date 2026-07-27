import { Location } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditBacklogTaskComponent } from './edit-backlog-task/edit-backlog-task.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
// import { ProjectTeamComponent } from '../project-team/project-team.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';

export type Stage = 'Design' | 'Development' | 'Testing' | 'Deployment';
export type SprintKind = 'backlog' | 'completed' | 'active';

export interface AssignTask {
  id: string;
  name: string;
  code: string;
  module: string;
  duration: string;
  effort: string;
  selected: boolean;
}

export interface Task {
  id: string;
  task: string;
  taskCode: string;
  jobCode: string;
  planStart: string;
  planFinish: string;
  effort: number;
  duration: number;
  description: string;
  stage: Stage;
  assigned?: string;
  eta?: string;
  actualStart?: string;
  actualFinish?: string;
  expenses?: number;
  status?: string;
  approved?: boolean;
  notes?: { sender: string; date: string; text: string }[];
  progress?: number;
  expanded?: boolean;
}

export interface Sprint {
  id: string;
  label: string;
  kind: SprintKind;
  tasks: Task[];
}

export interface CalendarCell {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-project-backlog',
  templateUrl: './project-backlog.component.html',
  styleUrls: ['./project-backlog.component.scss']
})
export class ProjectBacklogComponent {

  team = ['Aarav Shah', 'Priya Nair', 'Diego Ruiz', 'Mei Tanaka', 'Olivia Brown'];
  stages: Stage[] = ['Design', 'Development', 'Testing', 'Deployment'];
  stageFilter: 'all' | Stage = 'Design';

  showAssignmentView = false;

  assignAvailableTasks: AssignTask[] = [
    { id: 'AT1', name: 'Requirement Gathering', code: 'T-001', module: 'Planning', duration: '5d', effort: '40h', selected: false },
    { id: 'AT2', name: 'System Design', code: 'T-002', module: 'Design', duration: '7d', effort: '56h', selected: false },
    { id: 'AT3', name: 'Database Schema', code: 'T-003', module: 'Backend', duration: '3d', effort: '24h', selected: false },
    { id: 'AT4', name: 'API Development', code: 'T-004', module: 'Backend', duration: '10d', effort: '80h', selected: false },
    { id: 'AT5', name: 'UI Prototyping', code: 'T-005', module: 'Frontend', duration: '4d', effort: '32h', selected: false },
    { id: 'AT6', name: 'Component Library', code: 'T-006', module: 'Frontend', duration: '6d', effort: '48h', selected: false },
    { id: 'AT7', name: 'Integration Testing', code: 'T-007', module: 'QA', duration: '5d', effort: '40h', selected: false }
  ];

  assignAssignedTasks: AssignTask[] = [
    { id: 'AT8', name: 'Unit Testing', code: 'T-008', module: 'QA', duration: '4d', effort: '32h', selected: false },
    { id: 'AT9', name: 'Deployment Setup', code: 'T-009', module: 'DevOps', duration: '3d', effort: '24h', selected: false },
    { id: 'AT10', name: 'User Training', code: 'T-010', module: 'Support', duration: '2d', effort: '16h', selected: false },
    { id: 'AT11', name: 'Documentation', code: 'T-011', module: 'Support', duration: '3d', effort: '24h', selected: false }
  ];

  toggleAssignAvailable(t: AssignTask): void {
    t.selected = !t.selected;
  }

  toggleAssignAssigned(t: AssignTask): void {
    t.selected = !t.selected;
  }

  canAddAssignTasks(): boolean {
    return this.assignAvailableTasks.some(t => t.selected);
  }

  canRemoveAssignTasks(): boolean {
    return this.assignAssignedTasks.some(t => t.selected);
  }

  addSelectedAssignTasks(): void {
    const toMove = this.assignAvailableTasks.filter(t => t.selected);
    this.assignAvailableTasks = this.assignAvailableTasks.filter(t => !t.selected);
    toMove.forEach(t => t.selected = false);
    this.assignAssignedTasks.push(...toMove);
  }

  removeSelectedAssignTasks(): void {
    const toMove = this.assignAssignedTasks.filter(t => t.selected);
    this.assignAssignedTasks = this.assignAssignedTasks.filter(t => !t.selected);
    toMove.forEach(t => t.selected = false);
    this.assignAvailableTasks.push(...toMove);
  }

  showAddSprint = false;
  newSprintName = '';

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineTask: Task | null = null;

  openTimelineModal(task: Task) {
    this.selectedTimelineTask = task;
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

  activeTabId = 'backlog';
  activeView: 'grid' | 'kanban' | 'calendar' | 'gantt' = 'grid';

  kanbanStatuses: string[] = ['Pending', 'Allocated', 'In Process', 'On Hold', 'Cancelled', 'Completed'];
  kanbanCards: Record<string, Task[]> = {};

  // Calendar state
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDate: Date = new Date(2026, 6, 1);
  calendarCells: CalendarCell[] = [];
  hoveredCellIndex: number = -1;

  sprints: Sprint[] = [
    {
      id: 'backlog', label: 'Backlog', kind: 'backlog',
      tasks: [
        // Design stage (9 records)
        this.t('Design login screen wireframes', 'TSK-101', 'JOB-21', '2026-01-05', '2026-01-20', 16, 15, 'Initial wireframes for the new login flow.', 'Design', 'Pending'),
        this.t('Design branding & style guides', 'TSK-108', 'JOB-21', '2026-02-01', '2026-02-25', 24, 25, 'Create assets and typography guides.', 'Design', 'Pending'),
        this.t('UX Navigation & User Flows', 'TSK-109', 'JOB-22', '2026-03-02', '2026-03-20', 20, 18, 'Map navigation journeys and site hierarchy.', 'Design', 'Allocated'),
        this.t('Design Component Library', 'TSK-110', 'JOB-22', '2026-04-05', '2026-04-26', 32, 21, 'Build reusable UI design tokens and components.', 'Design', 'In Process'),
        this.t('Interactive Dashboard Mockups', 'TSK-111', 'JOB-23', '2026-05-02', '2026-05-28', 28, 26, 'Clickable Figma prototypes for executive dashboard.', 'Design', 'In Process'),
        this.t('Mobile Responsive UI Specs', 'TSK-112', 'JOB-23', '2026-06-01', '2026-06-22', 18, 21, 'Mobile viewport layout and breakpoint specs.', 'Design', 'On Hold'),
        this.t('Accessibility & Contrast Audit', 'TSK-113', 'JOB-24', '2026-07-01', '2026-07-15', 14, 15, 'Ensure WCAG AAA color and contrast compliance.', 'Design', 'Cancelled'),
        this.t('Dark Theme Color Palette', 'TSK-114', 'JOB-24', '2026-08-03', '2026-08-25', 22, 22, 'Color specs and tokens for dark theme mode.', 'Design', 'Completed'),
        this.t('Final UX Handoff & Specs', 'TSK-115', 'JOB-25', '2026-09-01', '2026-09-18', 16, 18, 'Handoff design documentation to engineering.', 'Design', 'Completed'),

        // Development stage (9 records)
        this.t('Implement OAuth provider', 'TSK-102', 'JOB-21', '2026-01-10', '2026-01-28', 24, 18, 'Add Google and Apple sign-in providers.', 'Development', 'Pending'),
        this.t('Develop dashboard widgets', 'TSK-105', 'JOB-21', '2026-02-05', '2026-02-22', 16, 17, 'Implement widgets for main analytics panel.', 'Development', 'Pending'),
        this.t('Core Microservices Architecture', 'TSK-120', 'JOB-21', '2026-03-01', '2026-03-25', 40, 24, 'Establish decoupled backend service architecture.', 'Development', 'Allocated'),
        this.t('REST API Gateway Endpoints', 'TSK-121', 'JOB-22', '2026-04-02', '2026-04-24', 32, 22, 'Expose secure REST API routes and rate limits.', 'Development', 'In Process'),
        this.t('Database ORM & Migration Scripts', 'TSK-122', 'JOB-22', '2026-05-05', '2026-05-27', 28, 22, 'Schema migrations and entity model mapping.', 'Development', 'In Process'),
        this.t('Webhooks & Event Messaging', 'TSK-123', 'JOB-23', '2026-06-03', '2026-06-25', 20, 22, 'Configure RabbitMQ event bus handlers.', 'Development', 'On Hold'),
        this.t('Real-time Notification Service', 'TSK-124', 'JOB-23', '2026-07-02', '2026-07-20', 18, 18, 'WebSocket connection push engine.', 'Development', 'Cancelled'),
        this.t('User Roles & RBAC Middleware', 'TSK-125', 'JOB-24', '2026-08-01', '2026-08-22', 22, 21, 'Granular access control policies.', 'Development', 'Completed'),
        this.t('Performance Caching with Redis', 'TSK-126', 'JOB-24', '2026-09-02', '2026-09-24', 16, 22, 'In-memory caching layer for queries.', 'Development', 'Completed'),

        // Testing stage (9 records)
        this.t('Write E2E tests for checkout', 'TSK-103', 'JOB-22', '2026-01-12', '2026-01-26', 12, 14, 'Cover the happy path and edge cases.', 'Testing', 'Pending'),
        this.t('Security pen testing', 'TSK-106', 'JOB-22', '2026-02-08', '2026-02-24', 10, 16, 'Perform vulnerability analysis.', 'Testing', 'Pending'),
        this.t('Unit Testing Framework Suite', 'TSK-130', 'JOB-22', '2026-03-04', '2026-03-22', 18, 18, 'Setup Jest unit test coverage runner.', 'Testing', 'Allocated'),
        this.t('API Integration & Contract Tests', 'TSK-131', 'JOB-23', '2026-04-06', '2026-04-25', 24, 19, 'Validate API schema payload responses.', 'Testing', 'In Process'),
        this.t('Cross-browser Compatibility Tests', 'TSK-132', 'JOB-23', '2026-05-08', '2026-05-26', 16, 18, 'Verify Safari, Chrome, and Firefox layout.', 'Testing', 'In Process'),
        this.t('Load & Performance Stress Testing', 'TSK-133', 'JOB-24', '2026-06-05', '2026-06-24', 22, 19, 'JMeter load test up to 10k concurrent users.', 'Testing', 'On Hold'),
        this.t('Automated Regression Pipeline', 'TSK-134', 'JOB-24', '2026-07-03', '2026-07-22', 20, 19, 'Cypress automated regression suite in CI.', 'Testing', 'Cancelled'),
        this.t('Vulnerability & Compliance Audit', 'TSK-135', 'JOB-25', '2026-08-05', '2026-08-24', 15, 19, 'Execute OWASP Top 10 security audit.', 'Testing', 'Completed'),
        this.t('User Acceptance Test (UAT) Sign-off', 'TSK-136', 'JOB-25', '2026-09-03', '2026-09-22', 14, 19, 'Client walkthrough and sign-off verification.', 'Testing', 'Completed'),

        // Deployment stage (9 records)
        this.t('Configure staging deployment', 'TSK-104', 'JOB-23', '2026-01-15', '2026-01-28', 6, 13, 'Set up the staging environment pipeline.', 'Deployment', 'Pending'),
        this.t('Configure SSL certificates', 'TSK-107', 'JOB-23', '2026-02-10', '2026-02-22', 4, 12, 'Deploy LetsEncrypt certs on staging.', 'Deployment', 'Pending'),
        this.t('Docker Container Orchestration', 'TSK-140', 'JOB-23', '2026-03-06', '2026-03-24', 16, 18, 'Containerize microservices with Dockerfile.', 'Deployment', 'Allocated'),
        this.t('Kubernetes Cluster Provisioning', 'TSK-141', 'JOB-24', '2026-04-08', '2026-04-26', 28, 18, 'Provision EKS cluster with Terraform.', 'Deployment', 'In Process'),
        this.t('CI/CD Pipeline Automation', 'TSK-142', 'JOB-24', '2026-05-10', '2026-05-28', 20, 18, 'GitHub Actions workflow for auto deploy.', 'Deployment', 'In Process'),
        this.t('Cloud Infra Terraform Setup', 'TSK-143', 'JOB-24', '2026-06-06', '2026-06-24', 24, 18, 'Infrastructure as Code IaC scripts.', 'Deployment', 'On Hold'),
        this.t('Zero-Downtime Blue-Green Deploy', 'TSK-144', 'JOB-25', '2026-07-04', '2026-07-22', 18, 18, 'Traffic switching deployment strategy.', 'Deployment', 'Cancelled'),
        this.t('Automated Rollback & Recovery', 'TSK-145', 'JOB-25', '2026-08-06', '2026-08-25', 15, 19, 'Configure failover monitoring alerts.', 'Deployment', 'Completed'),
        this.t('Production Release Kickoff', 'TSK-146', 'JOB-25', '2026-09-04', '2026-09-22', 12, 18, 'Production environment launch & telemetry.', 'Deployment', 'Completed')
      ]
    },
    {
      id: 'sprint-1', label: 'Sprint 1', kind: 'completed',
      tasks: [
        { ...this.t('Project kickoff brief', 'TSK-001', 'JOB-10', '2026-06-01', '2026-06-02', 4, 1, 'Stakeholder kickoff and goals.', 'Design', 'Completed'), assigned: 'Aarav Shah', status: 'completed', approved: true, progress: 100, eta: '2026-06-02', actualStart: '2026-06-01', actualFinish: '2026-06-02', expenses: 250 },
        { ...this.t('Set up repository', 'TSK-002', 'JOB-10', '2026-06-02', '2026-06-03', 6, 1, 'Bootstrap repo, CI, lint.', 'Development', 'Completed'), assigned: 'Diego Ruiz', status: 'completed', approved: true, progress: 85, eta: '2026-06-03', actualStart: '2026-06-02', actualFinish: '2026-06-03', expenses: 0 },
        { ...this.t('QA environment baseline', 'TSK-003', 'JOB-11', '2026-06-03', '2026-06-04', 8, 1, 'Initial QA env smoke tests.', 'Testing', 'In Process'), assigned: 'Mei Tanaka', status: 'inprocess', approved: false, progress: 60, eta: '2026-06-04', actualStart: '2026-06-03', actualFinish: '', expenses: 50 },
        { ...this.t('Initial server setup', 'TSK-004', 'JOB-12', '2026-06-03', '2026-06-05', 6, 2, 'Spin up instances in EC2.', 'Deployment', 'Completed'), assigned: 'Olivia Brown', status: 'completed', approved: true, progress: 100, eta: '2026-06-05', actualStart: '2026-06-03', actualFinish: '2026-06-05', expenses: 1200 },
        { ...this.t('User access credentials', 'TSK-005', 'JOB-12', '2026-06-02', '2026-06-04', 8, 2, 'Configure user access levels.', 'Development', 'Allocated'), assigned: 'Diego Ruiz', status: 'allocated', approved: false, progress: 25, eta: '2026-06-04', actualStart: '2026-06-02', actualFinish: '', expenses: 0 },
        { ...this.t('Database schema review', 'TSK-006', 'JOB-13', '2026-06-04', '2026-06-05', 4, 1, 'Validate design with DB architects.', 'Design', 'Completed'), assigned: 'Aarav Shah', status: 'completed', approved: true, progress: 90, eta: '2026-06-05', actualStart: '2026-06-04', actualFinish: '2026-06-05', expenses: 150 },
        { ...this.t('API endpoints contract', 'TSK-007', 'JOB-13', '2026-06-05', '2026-06-08', 12, 3, 'Create OpenAPI specification.', 'Development', 'In Process'), assigned: 'Priya Nair', status: 'inprocess', approved: false, progress: 50, eta: '2026-06-08', actualStart: '2026-06-05', actualFinish: '', expenses: 0 },
        { ...this.t('UI kit styling alignment', 'TSK-008', 'JOB-14', '2026-06-06', '2026-06-07', 8, 1, 'Import core style guidelines.', 'Design', 'On Hold'), assigned: 'Priya Nair', status: 'onhold', approved: false, progress: 30, eta: '2026-06-07', actualStart: '2026-06-06', actualFinish: '', expenses: 300 }
      ]
    },
    {
      id: 'sprint-2', label: 'Sprint 2', kind: 'active',
      tasks: [
        { ...this.t('Build dashboard widgets', 'TSK-201', 'JOB-30', '2026-06-25', '2026-07-02', 16, 5, 'Three KPI widgets for the home dashboard.', 'Development', 'In Process'), assigned: 'Priya Nair', status: 'inprocess', approved: false, progress: 75, eta: '2026-07-02', actualStart: '2026-06-26', actualFinish: '', expenses: 120, notes: [{sender: 'Admin', date: '2026-07-02', text: 'Almost complete, waiting on widget styling.'}] },
        { ...this.t('Refine empty states', 'TSK-202', 'JOB-30', '2026-06-26', '2026-06-30', 6, 2, 'Empty states for tables and lists.', 'Design', 'Completed'), assigned: 'Priya Nair', status: 'completed', approved: true, progress: 100, eta: '2026-06-30', actualStart: '2026-06-26', actualFinish: '2026-06-29', expenses: 0 },
        { ...this.t('Regression test suite', 'TSK-203', 'JOB-31', '2026-06-27', '2026-07-03', 10, 4, 'Add regression cases for sprint-1 features.', 'Testing', 'In Process'), assigned: 'Mei Tanaka', status: 'inprocess', approved: false, progress: 40, eta: '2026-07-03', actualStart: '2026-06-28', actualFinish: '', expenses: 50 },
        { ...this.t('Sprint review & feedback', 'TSK-204', 'JOB-31', '2026-06-29', '2026-07-01', 4, 2, 'Walkthrough sprint outcomes.', 'Design', 'Allocated'), assigned: 'Aarav Shah', status: 'allocated', approved: false, progress: 0, eta: '2026-07-01', actualStart: '', actualFinish: '', expenses: 0 },
        { ...this.t('Automate deploy scripts', 'TSK-205', 'JOB-32', '2026-06-30', '2026-07-03', 12, 3, 'Create CI CD scripts.', 'Deployment', 'In Process'), assigned: 'Diego Ruiz', status: 'inprocess', approved: false, progress: 60, eta: '2026-07-03', actualStart: '2026-07-01', actualFinish: '', expenses: 0 },
        { ...this.t('Optimize database indexes', 'TSK-206', 'JOB-33', '2026-07-01', '2026-07-04', 8, 3, 'Tune slow queries on customer tables.', 'Development', 'Allocated'), assigned: 'Diego Ruiz', status: 'allocated', approved: false, progress: 10, eta: '2026-07-04', actualStart: '', actualFinish: '', expenses: 0 },
        { ...this.t('End-to-end user tests', 'TSK-207', 'JOB-33', '2026-07-02', '2026-07-05', 12, 3, 'Coordinate feedback sessions.', 'Testing', 'On Hold'), assigned: 'Mei Tanaka', status: 'onhold', approved: false, progress: 20, eta: '2026-07-05', actualStart: '2026-07-02', actualFinish: '', expenses: 80, notes: [{sender: 'Admin', date: '2026-07-03', text: 'Blocked by regression test suite stability.'}] },
        { ...this.t('Deploy container images', 'TSK-208', 'JOB-34', '2026-07-03', '2026-07-04', 6, 1, 'Publish Docker images to AWS ECR.', 'Deployment', 'Allocated'), assigned: 'Olivia Brown', status: 'allocated', approved: false, progress: 0, eta: '2026-07-04', actualStart: '', actualFinish: '', expenses: 150 }
      ]
    }
  ];

  private t(task: string, taskCode: string, jobCode: string, ps: string, pf: string, eff: number, dur: number, desc: string, stage: Stage, status: string = 'Pending'): Task {
    return { id: taskCode, task, taskCode, jobCode, planStart: ps, planFinish: pf, effort: eff, duration: dur, description: desc, stage, status };
  }

  get activeSprint(): Sprint {
    return this.sprints.find(s => s.id === this.activeTabId) || this.sprints[0];
  }

  get filteredTasks(): Task[] {
    const tasks = this.activeSprint.tasks;
    return this.stageFilter === 'all' ? tasks : tasks.filter(t => t.stage === this.stageFilter);
  }

  selectTab(id: string) {
    this.activeTabId = id;
    this.initViewData();
  }

  initials(name?: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  openAddSprint() { this.newSprintName = `Sprint ${this.sprints.filter(s => s.kind !== 'backlog').length + 1}`; this.showAddSprint = true; }
  closeAddSprint() { this.showAddSprint = false; }
  confirmAddSprint() {
    const name = this.newSprintName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, '-');
    this.sprints.push({ id, label: name, kind: 'active', tasks: [] });
    this.activeTabId = id;
    this.initViewData();
    this.showAddSprint = false;
  }

  trackById(_i: number, item: { id: string }) { return item.id; }

  // --- View toggler ---
  setView(view: 'grid' | 'kanban' | 'calendar' | 'gantt') {
    this.activeView = view;
    if (view === 'calendar') {
      this.buildCalendar();
    }
  }

  // --- Kanban Column Helpers ---
  getTasksByStage(stage: Stage): Task[] {
    return this.filteredTasks.filter(t => t.stage === stage);
  }

  // --- Calendar logic ---
  get currentMonthLabel(): string {
    return `${this.monthNames[this.calendarDate.getMonth()]} ${this.calendarDate.getFullYear()}`;
  }

  prevMonth(): void {
    this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  buildCalendar(): void {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const today = new Date();
    const cells: CalendarCell[] = [];

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      cells.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        inCurrentMonth: cellDate.getMonth() === month,
        isToday: this.isSameDay(cellDate, today),
        tasks: this.getTasksForDate(cellDate)
      });
    }
    this.calendarCells = cells;
  }

  getTasksForDate(date: Date): Task[] {
    const d = this.stripTime(date);
    return this.filteredTasks.filter(t => {
      if (!t.planStart || !t.planFinish) return false;
      const start = this.stripTime(new Date(t.planStart));
      const end = this.stripTime(new Date(t.planFinish));
      return d >= start && d <= end;
    });
  }

  stripTime(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  initViewData() {
    const tasks = this.filteredTasks;
    if (tasks && tasks.length > 0) {
      let earliest = new Date(tasks[0].planStart);
      for (const t of tasks) {
        const d = new Date(t.planStart);
        if (d < earliest) {
          earliest = d;
        }
      }
      this.calendarDate = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    } else {
      this.calendarDate = new Date(2026, 6, 1);
    }

    // Group tasks by status for Kanban columns
    const cards: Record<string, Task[]> = {};
    this.kanbanStatuses.forEach(status => {
      cards[status] = tasks.filter(t => {
        const s = t.status || 'Pending';
        if (status === 'In Process') return s === 'In Process' || s === 'inprocess' || s === 'Process';
        if (status === 'On Hold') return s === 'On Hold' || s === 'onhold' || s === 'Hold';
        if (status === 'Completed') return s === 'Completed' || s === 'completed' || s === 'Closed';
        return s.toLowerCase() === status.toLowerCase();
      });
    });
    this.kanbanCards = cards;

    this.buildCalendar();
  }

  dropStatus(event: CdkDragDrop<Task[]>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const task = event.container.data[event.currentIndex];
      task.status = targetStatus;
    }
  }

  // --- Gantt View logic ---
  ganttScale: 'monthly' | 'weekly' | 'daily' = 'monthly';

  setGanttScale(scale: 'monthly' | 'weekly' | 'daily') {
    this.ganttScale = scale;
  }

  get ganttMonths(): { name: string; fullYear: number; monthIndex: number }[] {
    return [
      { name: 'JAN', fullYear: 2026, monthIndex: 0 },
      { name: 'FEB', fullYear: 2026, monthIndex: 1 },
      { name: 'MAR', fullYear: 2026, monthIndex: 2 },
      { name: 'APR', fullYear: 2026, monthIndex: 3 },
      { name: 'MAY', fullYear: 2026, monthIndex: 4 },
      { name: 'JUN', fullYear: 2026, monthIndex: 5 },
      { name: 'JUL', fullYear: 2026, monthIndex: 6 },
      { name: 'AUG', fullYear: 2026, monthIndex: 7 },
      { name: 'SEP', fullYear: 2026, monthIndex: 8 },
      { name: 'OCT', fullYear: 2026, monthIndex: 9 },
      { name: 'NOV', fullYear: 2026, monthIndex: 10 },
      { name: 'DEC', fullYear: 2026, monthIndex: 11 }
    ];
  }

  get ganttWeeks(): { label: string; monthName: string; monthIndex: number; weekInMonth: number }[] {
    const weeks: { label: string; monthName: string; monthIndex: number; weekInMonth: number }[] = [];
    const months = this.ganttMonths;
    months.forEach(m => {
      ['W1', 'W2', 'W3', 'W4'].forEach((wLabel, wIdx) => {
        weeks.push({
          label: wLabel,
          monthName: m.name,
          monthIndex: m.monthIndex,
          weekInMonth: wIdx + 1
        });
      });
    });
    return weeks;
  }

  get ganttDays(): Date[] {
    const tasks = this.filteredTasks;
    if (!tasks || tasks.length === 0) return [];

    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    for (const t of tasks) {
      if (!t.planStart || !t.planFinish) continue;
      const start = new Date(t.planStart);
      const finish = new Date(t.planFinish);
      if (isNaN(start.getTime()) || isNaN(finish.getTime())) continue;

      if (!minDate || start < minDate) minDate = start;
      if (!maxDate || finish > maxDate) maxDate = finish;
    }

    if (!minDate || !maxDate) return [];

    const days: Date[] = [];
    let current = new Date(minDate);
    let count = 0;
    while (current <= maxDate && count < 120) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      count++;
    }
    return days;
  }

  private getDaysInMonth(year: number, monthIndex: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  getGanttBarStyle(t: Task): any {
    if (!t || !t.planStart || !t.planFinish) return { display: 'none' };

    const start = new Date(t.planStart);
    const finish = new Date(t.planFinish);
    if (isNaN(start.getTime()) || isNaN(finish.getTime())) return { display: 'none' };

    if (this.ganttScale === 'monthly') {
      const totalMonths = 12;
      const startM = start.getMonth();
      const startD = start.getDate();
      const startDaysTotal = this.getDaysInMonth(start.getFullYear(), startM);
      const startVal = startM + (startD - 1) / startDaysTotal;

      const finishM = finish.getMonth();
      const finishD = finish.getDate();
      const finishDaysTotal = this.getDaysInMonth(finish.getFullYear(), finishM);
      const finishVal = finishM + finishD / finishDaysTotal;

      const leftPercent = (startVal / totalMonths) * 100;
      const widthPercent = Math.max(0.5, ((finishVal - startVal) / totalMonths) * 100);

      return {
        left: `${leftPercent.toFixed(2)}%`,
        width: `${widthPercent.toFixed(2)}%`
      };
    } else if (this.ganttScale === 'weekly') {
      const totalWeeks = 48; // 12 months * 4 weeks
      const startM = start.getMonth();
      const startD = start.getDate();
      const startDaysTotal = this.getDaysInMonth(start.getFullYear(), startM);
      const startWeekVal = startM * 4 + ((startD - 1) / startDaysTotal) * 4;

      const finishM = finish.getMonth();
      const finishD = finish.getDate();
      const finishDaysTotal = this.getDaysInMonth(finish.getFullYear(), finishM);
      const finishWeekVal = finishM * 4 + (finishD / finishDaysTotal) * 4;

      const leftPercent = (startWeekVal / totalWeeks) * 100;
      const widthPercent = Math.max(0.5, ((finishWeekVal - startWeekVal) / totalWeeks) * 100);

      return {
        left: `${leftPercent.toFixed(2)}%`,
        width: `${widthPercent.toFixed(2)}%`
      };
    } else { // daily
      const days = this.ganttDays;
      const totalDays = days.length;
      if (totalDays === 0) return { display: 'none' };

      const startStripped = this.stripTime(start);
      const finishStripped = this.stripTime(finish);

      let startIndex = -1;
      for (let i = 0; i < days.length; i++) {
        if (this.stripTime(days[i]).getTime() === startStripped.getTime()) {
          startIndex = i;
          break;
        }
      }

      if (startIndex === -1) {
        if (startStripped < this.stripTime(days[0])) {
          startIndex = 0;
        } else {
          return { display: 'none' };
        }
      }

      let spanDays = Math.round((finishStripped.getTime() - startStripped.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (spanDays <= 0) spanDays = 1;

      if (startIndex + spanDays > totalDays) {
        spanDays = totalDays - startIndex;
      }

      const leftPercent = (startIndex / totalDays) * 100;
      const widthPercent = (spanDays / totalDays) * 100;

      return {
        left: `${leftPercent.toFixed(2)}%`,
        width: `${widthPercent.toFixed(2)}%`
      };
    }
  }

  // --- class helpers (replace former inline style helpers) ---

  getTabClasses(s: Sprint): string[] {
    const classes = ['tab-btn'];
    if (this.activeTabId === s.id) {
      classes.push('tab-btn--active', `tab-btn--${s.kind}`);
    }
    classes.push(`tab-btn--${s.id}`);
    return classes;
  }

  getStageClasses(stage: Stage): string[] {
    return ['stage-badge', `stage-badge--${stage.toLowerCase()}`];
  }

  getStatusClasses(status: string): string[] {
    const s = (status || '').toLowerCase().replace(' ', '');
    return ['status-badge', `status-badge--${s}`];
  }

  getStatusLabel(status: string): string {
    if (!status) return '—';
    if (status === 'inprocess') return 'In Process';
    if (status === 'onhold') return 'On Hold';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  colSpanForActiveSprint(): number {
    return this.activeSprint.kind === 'backlog' ? 9 : 11;
  }

  deleteAsset(item: Task): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const sprint = this.activeSprint;
        sprint.tasks = sprint.tasks.filter(t => t.id !== item.id);
        this.initViewData();
      }
    });
  }

  editAsset(item: Task): void {
    let dialogRef = this.dialog.open(EditBacklogTaskComponent, {
      width: '850px',
      height: 'auto',
      data: {
        task: item,
        isSprint: this.activeSprint.kind !== 'backlog'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, result);
        this.initViewData();
      }
    });
  }

  @ViewChild('notesDialog') notesDialog!: TemplateRef<any>;

  getSliderColor(percent: number): string {
    if (!percent && percent !== 0) return '#0000ff';
    if (percent <= 30) return '#0000ff';
    if (percent > 30 && percent <= 80) return '#ffb300';
    if (percent === 100) return '#ff0000';
    return '#008000';
  }

  openNotesDialog(task: Task): void {
    this.dialog.open(this.notesDialog, {
      width: '500px',
      data: task
    });
  }

  addNoteMessage(task: Task, text: string): void {
    if (!text || !text.trim()) return;
    if (!task.notes) {
      task.notes = [];
    }
    task.notes.push({
      sender: 'Admin',
      date: new Date().toISOString().split('T')[0],
      text: text.trim()
    });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.initViewData();
  }

  openAssignmentPopup(): void {
    this.showAssignmentView = true;
  }

  goBack(): void {
    this.router.navigateByUrl('/app/testing/projects');
  }

}