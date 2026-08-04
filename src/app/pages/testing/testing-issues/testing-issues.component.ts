import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

import { AddIssuesssComponent } from './add-issuesss/add-issuesss.component';
import { IssuesGridColumnsComponent } from './issues-grid-columns/issues-grid-columns.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

// --- Kanban Interfaces ---
export type Status = 'Pending' | 'Allocated' | 'Progress' | 'Hold' | 'Cancelled' | 'Completed';

export interface Card {
  id: number;
  subject: string;
  LawFirm: string;
  createdBy: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  expedite: boolean;
  notes: { text: string; author: string; date: string }[];
  expanded: boolean;
  status: Status;
}

@Component({
  selector: 'app-testing-issues',
  templateUrl: './testing-issues.component.html',
  styleUrls: ['./testing-issues.component.scss']
})
export class TestingIssuesComponent implements OnInit {
  filterToggle: boolean = false;
  showTimelineModal: boolean = false;
  selectedTimelineTask: any = null;
  totalSize = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  myGroup!: FormGroup;
  
  // Controls which view is currently shown (Table vs Kanban)
  isKanbanView: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    // RESTORE full FormGroup mapping to prevent console binding errors
    this.myGroup = new FormGroup({
      firstName: new FormControl(''),
      Keyword: new FormControl(''),
      TractorIdSections: new FormControl(''),
      ResponsibleSections: new FormControl(''),
      ResponsibleSectionLeadId: new FormControl(''),
      SubGroupId: new FormControl(''),
      ORCStatuses: new FormControl(''),
      IsNew: new FormControl(''),
      ScoreMatrix: new FormControl(''),
      Probability: new FormControl(''),
      PartCode: new FormControl(''),
      CategoryId: new FormControl(''),
      sortOrder: new FormControl('')
    });

    this.go();
  }

  // ==================== GRID DATA (SOURCE OF TRUTH) ====================
  originalTableList = [
    {
      id: 1,
      subject: 'Hydraulic Leakage',
      issueDescription: 'Hydraulic failure during operation due to valve leak',
      targetDate: '2026-07-15',
      remarks: 'Requires immediate replacement of the main valve seal.',
      status: 'Pending',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Roshan',
      projectName: 'NextGen Assembly Line-2026',
      projectCode: '202606/NGA/001'
    },
    {
      id: 2,
      subject: 'Engine Overheating',
      issueDescription: 'Engine overheating on long runs above 3000 RPM',
      targetDate: '2026-07-20',
      remarks: 'Coolant levels are fine, suspect thermostat failure.',
      status: 'Process',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Lokesh',
      projectName: 'Inventory Management System',
      projectCode: '202606/IMS/003'
    },
    {
      id: 3,
      subject: 'Transmission Noise',
      issueDescription: 'Loud gear grinding noise when shifting to reverse',
      targetDate: '2026-07-10',
      remarks: 'Gearbox inspected, synchronizer ring is worn out.',
      status: 'Closed',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Tejaswi',
      projectName: 'HR Management Platform',
      projectCode: '202606/HRM/004'
    },
    {
      id: 4,
      subject: 'Electrical Short',
      issueDescription: 'Console display flickers and shuts down randomly',
      targetDate: '2026-07-25',
      remarks: 'Wiring harness check complete, found loose ground wire.',
      status: 'Hold',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Santosh',
      projectName: 'Mobile Banking App',
      projectCode: '202606/MBA/005'
    }
  ];

  tableList: any[] = [];
  filteredIssues: any[] = [];

  tractors = [ { TractorStatusId: 'ID-01' }, { TractorStatusId: 'ID-02' }, { TractorStatusId: 'ID-03' } ];
  TractorIdSections = [ { item_id: 1, item_text: 'ID-01' }, { item_id: 2, item_text: 'ID-02' }, { item_id: 3, item_text: 'ID-03' } ];
  responsibleSections = [ { item_id: 1, item_text: 'Front Axle Bracket Area' }, { item_id: 2, item_text: 'Gearbox' }, { item_id: 3, item_text: 'Cooling Package' }, { item_id: 4, item_text: 'Air Intake System' } ];
  ORCStatuses = [ { item_id: 1, item_text: 'O' }, { item_id: 2, item_text: 'R1' }, { item_id: 3, item_text: 'R2' }, { item_id: 4, item_text: 'C' } ];
  sortOrder = [ { item_id: 1, item_text: 'ASC' }, { item_id: 2, item_text: 'DESC' } ];
  IsNew = [ { item_id: 1, item_text: 'New' }, { item_id: 2, item_text: 'Regular' } ];
  ScoreMatrix = [ { item_id: 1, item_text: 'Assembly' }, { item_id: 2, item_text: 'Service' }, { item_id: 3, item_text: 'Performance' }, { item_id: 4, item_text: 'Functional' } ];
  resSectionFilterLeads = [ { UserId: 'U001', UserName: 'Lead A' }, { UserId: 'U002', UserName: 'Lead B' }, { UserId: 'U003', UserName: 'Lead C' } ];
  FilterSubgroup = [ { SubGroupId: 'SG001', SubGroupName: 'Subgroup 1' }, { SubGroupId: 'SG002', SubGroupName: 'Subgroup 2' }, { SubGroupId: 'SG003', SubGroupName: 'Subgroup 3' } ];
  scorematrix = [ { ScoreMatrixId: 'FE001', ScoreMatrixName: 'High Impact' }, { ScoreMatrixId: 'FE002', ScoreMatrixName: 'Medium Impact' }, { ScoreMatrixId: 'FE003', ScoreMatrixName: 'Low Impact' } ];
  categories = [ { CategoryId: 'C001', CategoryName: 'Detection 1' }, { CategoryId: 'C002', CategoryName: 'Detection 2' }, { CategoryId: 'C003', CategoryName: 'Detection 3' } ];

  lists: Status[] = ['Pending', 'Allocated', 'Progress', 'Hold', 'Cancelled', 'Completed'];

  cards: Record<Status, Card[]> = {
    Pending: [], Allocated: [], Progress: [],
    Hold: [], Cancelled: [], Completed: []
  };

  // Maps Grid Status to Kanban Status
  private getKanbanStatus(gridStatus: string): Status {
    if (gridStatus === 'Process') return 'Progress';
    if (gridStatus === 'Closed') return 'Completed';
    if (gridStatus === 'Hold') return 'Hold';
    if (gridStatus === 'Allocated') return 'Allocated';
    if (gridStatus === 'Cancelled') return 'Cancelled';
    return 'Pending';
  }

  // Maps Kanban Status back to Grid Status
  private getGridStatus(kanbanStatus: Status): string {
    if (kanbanStatus === 'Progress') return 'Process';
    if (kanbanStatus === 'Completed') return 'Closed';
    if (kanbanStatus === 'Hold') return 'Hold';
    if (kanbanStatus === 'Allocated') return 'Allocated';
    if (kanbanStatus === 'Cancelled') return 'Cancelled';
    return 'Pending';
  }

  openProject(item: any): void {
    this.router.navigate(['/app/testing/projects/dashboard']);
  }

  initializeKanbanData(): void {
    const grouped: Record<Status, Card[]> = {
      Pending: [], Allocated: [], Progress: [],
      Hold: [], Cancelled: [], Completed: []
    };

    this.filteredIssues.forEach((item) => {
      const kStatus = this.getKanbanStatus(item.status);
      grouped[kStatus].push({
        id: item.id,
        subject: item.subject,
        LawFirm: item.remarks || '',
        createdBy: 'Admin',
        assignedTo: 'Engineer',
        createdDate: '',
        dueDate: item.targetDate,
        expedite: false,
        notes: [],
        expanded: false,
        status: kStatus
      });
    });

    this.cards = grouped;
  }

  // Grid Controls (using AddIssuesssComponent for both Add and Edit)
  addTests(applicant: any) {
    let dialogRef = this.dialog.open(AddIssuesssComponent, {
      height: 'auto',
      width: '600px',
      data: applicant
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.originalTableList.findIndex(item => item.id === applicant.id);
        if (index !== -1) {
          this.originalTableList[index] = { ...this.originalTableList[index], ...result };
        }
        this.go(); // re-evaluates filters and updates tableList & kanban cards
      }
    });
  }

  public addIssues(id: any) {
    let dialogRef = this.dialog.open(AddIssuesssComponent, {
      data: id,
      height: 'auto',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (id) {
          const index = this.originalTableList.findIndex(item => item.id === id.id);
          if (index !== -1) {
            this.originalTableList[index] = { ...this.originalTableList[index], ...result };
          }
        } else {
          const newId = this.originalTableList.length ? Math.max(...this.originalTableList.map(t => t.id)) + 1 : 1;
          this.originalTableList.push({
            id: newId,
            ...result,
            status: result.status || 'Pending',
            image: result.image || 'assets/sample-image.jpg',
            document: result.document || 'assets/sample-1.pdf'
          });
        }
        this.go(); // re-evaluates filters and updates tableList & kanban cards
      }
    });
  }

  public openGrid(id: any) {
    let dialogRef = this.dialog.open(IssuesGridColumnsComponent, {
      data: id,
      height: 'auto',
      width: '800px',
    });
  }

  deleteConfirmation(item: any) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { ProjectId: item.id, title: 'Delete Confirmation', content: 'Are you sure you want to Delete?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.originalTableList = this.originalTableList.filter(t => t.id !== item.id);
        this.go(); // re-evaluates filters and updates tableList & kanban cards
      }
    });
  }

  scrollRight() {
    const container = document.getElementById('grid-table-container');
    if (container) { container.scrollBy({ left: 300, behavior: 'smooth' }); }
  }

  scrollLeft() {
    const container = document.getElementById('grid-table-container');
    if (container) { container.scrollBy({ left: -300, behavior: 'smooth' }); }
  }

  clearFilter() {
    this.myGroup.reset();
    this.currentPage = 0;
    this.go();
  }

  fnHandlePage(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.go();
  }

  go() {
    const filterVals = this.myGroup.value;
    const keyword = (filterVals.Keyword || '').toLowerCase().trim();
    
    this.filteredIssues = this.originalTableList.filter(item => {
      if (keyword) {
        const matchesSubject = (item.subject || '').toLowerCase().includes(keyword);
        const matchesDesc = (item.issueDescription || '').toLowerCase().includes(keyword);
        const matchesRemarks = (item.remarks || '').toLowerCase().includes(keyword);
        if (!matchesSubject && !matchesDesc && !matchesRemarks) {
          return false;
        }
      }
      return true;
    });

    this.totalSize = this.filteredIssues.length;
    this.tableList = this.filteredIssues.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);

    this.initializeKanbanData();
  }

  drop(event: CdkDragDrop<Card[]>, targetList: Status): void {
    const previousList = event.previousContainer.id as Status;
    const currentList  = event.container.id as Status;

    if (previousList !== currentList) {
      transferArrayItem(
        this.cards[previousList],
        this.cards[currentList],
        event.previousIndex,
        event.currentIndex
      );
      
      const movedCard = this.cards[currentList][event.currentIndex];
      movedCard.status = currentList;

      // Update status in both original and displayed lists
      const issue = this.originalTableList.find(item => item.id === movedCard.id);
      if (issue) {
        issue.status = this.getGridStatus(currentList);
      }
      
      const displayedIssue = this.tableList.find(item => item.id === movedCard.id);
      if (displayedIssue) {
        displayedIssue.status = this.getGridStatus(currentList);
      }
    } else {
      moveItemInArray(this.cards[targetList], event.previousIndex, event.currentIndex);
    }

    this.cards = { ...this.cards };
  }

  toggleCard(card: Card): void {
    card.expanded = !card.expanded;
  }

  getColor(status: string): string {
    const colors: Record<string, string> = {
      'Pending':   '#e24b4a',
      'Allocated': '#ef9f27',
      'Progress':  '#378add',
      'Hold':      '#f0995b',
      'Cancelled': '#888780',
      'Completed': '#639922'
    };
    return colors[status] ?? '#888780';
  }

  getCardClass(status: string): string {
    const classes: Record<string, string> = {
      'Pending':   'pending-card',
      'Allocated': 'allocated-card',
      'Progress':  'progress-card',
      'Hold':      'hold-card',
      'Cancelled': 'cancelled-card',
      'Completed': 'completed-card'
    };
    return classes[status] ?? 'default-card';
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