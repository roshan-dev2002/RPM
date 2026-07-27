import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { AddProjectIssuesPopComponent } from './add-project-issues-pop/add-project-issues-pop.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

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
  selector: 'app-project-issues',
  templateUrl: './project-issues.component.html',
  styleUrls: ['./project-issues.component.scss']
})
export class ProjectIssuesComponent implements OnInit {
  filterToggle: boolean = false;
  totalSize = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  myGroup!: FormGroup;
  
  isKanbanView: boolean = false;

  showTimelineModal: boolean = false;
  selectedTimelineItem: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.myGroup = new FormGroup({
      Keyword: new FormControl(''),
      Status: new FormControl('')
    });

    this.go();
  }

  openTimelineModal(item: any): void {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
  }

  // Sample data for Project Issues
  originalTableList = [
    {
      id: 1,
      subject: 'Hydraulic Valve Failure',
      issueDescription: 'Hydraulic system pressure drop due to main relief valve seal erosion',
      targetDate: '2026-07-28',
      remarks: 'Vendor dispatched replacement seal assembly kit.',
      status: 'Pending',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Ravi Sharma'
    },
    {
      id: 2,
      subject: 'PLC Assembly Firmware Crash',
      issueDescription: 'Line 2 controller freezes on high throughput cycle test',
      targetDate: '2026-08-05',
      remarks: 'Patch update under simulation in staging environment.',
      status: 'Process',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Priya Singh'
    },
    {
      id: 3,
      subject: 'Robot Arm Calibration Offset',
      issueDescription: '3-axis welding arm misaligned by 1.8mm on chassis mount',
      targetDate: '2026-07-22',
      remarks: 'Laser calibration completed and zero position set.',
      status: 'Closed',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Amit Kumar'
    },
    {
      id: 4,
      subject: 'EHS Noise Level Spike',
      issueDescription: 'Acoustic enclosure ventilation fan exceeding 85dB threshold',
      targetDate: '2026-08-12',
      remarks: 'Awaiting quiet damper baffle delivery from supplier.',
      status: 'Hold',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Neha Sharma'
    },
    {
      id: 5,
      subject: 'Conveyor Belt Tension Slip',
      issueDescription: 'Primary assembly line conveyor slipping under max payload',
      targetDate: '2026-08-18',
      remarks: 'Re-tensioning drive belt and replacing worn pulley bearings.',
      status: 'Allocated',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Vikram Joshi'
    },
    {
      id: 6,
      subject: 'Thermal Sensor Drifting',
      issueDescription: 'Chamber temperature sensor reading fluctuating by ±5°C during burn-in phase',
      targetDate: '2026-08-22',
      remarks: 'Recalibrating RTD sensors and inspecting thermal paste application.',
      status: 'Pending',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Suresh Patel'
    },
    {
      id: 7,
      subject: 'Pneumatic Actuator Leakage',
      issueDescription: 'Air leakage detected at cylinder head gasket of pick-and-place unit',
      targetDate: '2026-08-10',
      remarks: 'Replaced damaged O-rings and verified holding pressure at 6 bar.',
      status: 'Process',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Ananya Verma'
    },
    {
      id: 8,
      subject: 'Vision System Lens Fogging',
      issueDescription: 'High humidity causing lens condensation on inspection station camera',
      targetDate: '2026-07-30',
      remarks: 'Installed inline air dryer and enclosure heating module.',
      status: 'Closed',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Karan Malhotra'
    },
    {
      id: 9,
      subject: 'Emergency Stop Relay Intermittent Fail',
      issueDescription: 'Safety circuit trips randomly on line startup due to chatter in E-stop relay',
      targetDate: '2026-08-25',
      remarks: 'Ordered SIL3 safety relay module for immediate replacement.',
      status: 'Hold',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Deepak Nair'
    },
    {
      id: 10,
      subject: 'Coolant Pump Motor Overheating',
      issueDescription: 'Pump motor temperature exceeding 90°C during continuous 8-hour shift',
      targetDate: '2026-08-15',
      remarks: 'Flushed coolant lines and replaced clogged impeller filter.',
      status: 'Allocated',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      responsibility: 'Meera Deshmukh'
    }
  ];

  tableList: any[] = [];
  filteredIssues: any[] = [];

  lists: Status[] = ['Pending', 'Allocated', 'Progress', 'Hold', 'Cancelled', 'Completed'];

  cards: Record<Status, Card[]> = {
    Pending: [], Allocated: [], Progress: [],
    Hold: [], Cancelled: [], Completed: []
  };

  private getKanbanStatus(gridStatus: string): Status {
    if (gridStatus === 'Process') return 'Progress';
    if (gridStatus === 'Closed') return 'Completed';
    if (gridStatus === 'Hold') return 'Hold';
    if (gridStatus === 'Allocated') return 'Allocated';
    if (gridStatus === 'Cancelled') return 'Cancelled';
    return 'Pending';
  }

  private getGridStatus(kanbanStatus: Status): string {
    if (kanbanStatus === 'Progress') return 'Process';
    if (kanbanStatus === 'Completed') return 'Closed';
    if (kanbanStatus === 'Hold') return 'Hold';
    if (kanbanStatus === 'Allocated') return 'Allocated';
    if (kanbanStatus === 'Cancelled') return 'Cancelled';
    return 'Pending';
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
        createdBy: 'Quality Lead',
        assignedTo: item.responsibility || 'Engineer',
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

  addTests(applicant: any) {
    let dialogRef = this.dialog.open(AddProjectIssuesPopComponent, {
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
        this.go();
      }
    });
  }

  public addIssues(id: any) {
    let dialogRef = this.dialog.open(AddProjectIssuesPopComponent, {
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
            document: result.document || 'assets/sample-1.pdf',
            responsibility: result.responsibility || 'Ravi Sharma'
          });
        }
        this.go();
      }
    });
  }

  deleteConfirmation(item: any) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { ProjectId: item.id, title: 'Delete Confirmation', content: 'Are you sure you want to delete this issue?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.originalTableList = this.originalTableList.filter(t => t.id !== item.id);
        this.go();
      }
    });
  }

  scrollRight() {
    const container = document.getElementById('project-issues-grid-container');
    if (container) { container.scrollBy({ left: 300, behavior: 'smooth' }); }
  }

  scrollLeft() {
    const container = document.getElementById('project-issues-grid-container');
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
    const status = (filterVals.Status || '').trim();
    
    this.filteredIssues = this.originalTableList.filter(item => {
      if (keyword) {
        const matchesSubject = (item.subject || '').toLowerCase().includes(keyword);
        const matchesDesc = (item.issueDescription || '').toLowerCase().includes(keyword);
        const matchesRemarks = (item.remarks || '').toLowerCase().includes(keyword);
        if (!matchesSubject && !matchesDesc && !matchesRemarks) {
          return false;
        }
      }
      if (status && item.status !== status) {
        return false;
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
      'Process':   '#378add',
      'Hold':      '#f0995b',
      'Cancelled': '#888780',
      'Completed': '#639922',
      'Closed':    '#639922'
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

  goBack(): void {
    this.router.navigateByUrl('/app/testing/projects');
  }
}
