import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRequisitionPopComponent } from './add-requisition-pop/add-requisition-pop.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

export interface ProjectMaterial {
  stage: string;
  module: string;
  task: string;
  itemName: string;
  quantity: number;
  unitRate: number;
  materialCost: number;
  remarks: string;
  targetDate: string;
  requestedBy: string;
  requestDate: string;
  available: boolean;
  reserved: boolean;
  requestedQuantity: number;
  issuedQuantity: number;
  issued: boolean;
  issueDate: string;
}

@Component({
  selector: 'app-project-materials',
  templateUrl: './project-materials.component.html',
  styleUrls: ['./project-materials.component.scss']
})
export class ProjectMaterialsComponent implements OnInit {
  
  // Grabs the table container div to apply scroll logic
  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

  displayedRows: ProjectMaterial[] = [];

  // constructor(private dialog: MatDialog,private location: Location) { }

    constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,private location: Location
  ) { }

  showTimelineModal = false;
  selectedTimelineItem: ProjectMaterial | null = null;

  openTimelineModal(item: ProjectMaterial) {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  closeTimelineModal() {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }

  ngOnInit(): void {
    this.loadData();
  }

 loadData() {
    this.displayedRows = [
      {
        stage: 'Feasibility', 
        module: 'Chassis Assembly', 
        task: 'Weld Frame', 
        itemName: 'Steel Tubing 50mm',
        quantity: 120, 
        unitRate: 450, 
        materialCost: 54000, 
        remarks: 'Urgent for line A',
        targetDate: '15-Oct-2026', 
        requestedBy: 'Rajesh Kumar', 
        requestDate: '01-Oct-2026',
        available: true, 
        reserved: true, 
        requestedQuantity: 120, 
        issuedQuantity: 120, 
        issued: true, 
        issueDate: '05-Oct-2026'
      },
      {
        stage: 'Design', 
        module: 'Engine Mount', 
        task: 'Bolt Placement', 
        itemName: 'M12 Hex Bolts',
        quantity: 500, 
        unitRate: 15, 
        materialCost: 7500, 
        remarks: 'Standard stock',
        targetDate: '20-Oct-2026', 
        requestedBy: 'Anita Desai', 
        requestDate: '02-Oct-2026',
        available: true, 
        reserved: false, 
        requestedQuantity: 500, 
        issuedQuantity: 0, 
        issued: false, 
        issueDate: '-'
      },
      {
        stage: 'Prototyping', 
        module: 'Wiring', 
        task: 'Harness Install', 
        itemName: 'Copper Wire Spool',
        quantity: 10, 
        unitRate: 3200, 
        materialCost: 32000, 
        remarks: 'Check spec sheet',
        targetDate: '25-Oct-2026', 
        requestedBy: 'Vikram Singh', 
        requestDate: '05-Oct-2026',
        available: false, 
        reserved: false, 
        requestedQuantity: 10, 
        issuedQuantity: 0, 
        issued: false, 
        issueDate: '-'
      },
      {
        stage: 'Testing', 
        module: 'Quality Control', 
        task: 'Stress Test', 
        itemName: 'Load Sensors',
        quantity: 4, 
        unitRate: 15000, 
        materialCost: 60000, 
        remarks: 'Calibration needed',
        targetDate: '05-Nov-2026', 
        requestedBy: 'Neha Sharma', 
        requestDate: '10-Oct-2026',
        available: true, 
        reserved: true, 
        requestedQuantity: 4, 
        issuedQuantity: 4, 
        issued: true, 
        issueDate: '12-Oct-2026'
      },
      {
        stage: 'Launch', 
        module: 'Packaging', 
        task: 'Final Boxing', 
        itemName: 'Custom Crates',
        quantity: 50, 
        unitRate: 2500, 
        materialCost: 125000, 
        remarks: 'Export quality',
        targetDate: '15-Nov-2026', 
        requestedBy: 'Amit Patel', 
        requestDate: '12-Oct-2026',
        available: false, 
        reserved: false, 
        requestedQuantity: 50, 
        issuedQuantity: 0, 
        issued: false, 
        issueDate: '-'
      },
      {
        stage: 'Implementation', 
        module: 'Deployment', 
        task: 'Site Setup', 
        itemName: 'Mounting Brackets',
        quantity: 200, 
        unitRate: 350, 
        materialCost: 70000, 
        remarks: 'Anti-corrosion coating',
        targetDate: '25-Nov-2026', 
        requestedBy: 'Priya Reddy', 
        requestDate: '15-Oct-2026',
        available: true, 
        reserved: true, 
        requestedQuantity: 200, 
        issuedQuantity: 100, 
        issued: false, 
        issueDate: '-'
      },
      {
  stage: 'Procurement',
  module: 'Battery Pack',
  task: 'Cell Assembly',
  itemName: 'Lithium-ion Cells',
  quantity: 300,
  unitRate: 1800,
  materialCost: 540000,
  remarks: 'Supplier confirmed',
  targetDate: '28-Oct-2026',
  requestedBy: 'Suresh Naidu',
  requestDate: '08-Oct-2026',
  available: true,
  reserved: true,
  requestedQuantity: 300,
  issuedQuantity: 150,
  issued: false,
  issueDate: '-'
},
{
  stage: 'Manufacturing',
  module: 'Suspension',
  task: 'Spring Fitting',
  itemName: 'Coil Springs',
  quantity: 80,
  unitRate: 1250,
  materialCost: 100000,
  remarks: 'Inspect before use',
  targetDate: '02-Nov-2026',
  requestedBy: 'Rohit Mehta',
  requestDate: '11-Oct-2026',
  available: true,
  reserved: false,
  requestedQuantity: 80,
  issuedQuantity: 0,
  issued: false,
  issueDate: '-'
},
{
  stage: 'Assembly',
  module: 'Dashboard',
  task: 'Instrument Panel',
  itemName: 'LCD Display Unit',
  quantity: 25,
  unitRate: 8500,
  materialCost: 212500,
  remarks: 'High priority',
  targetDate: '06-Nov-2026',
  requestedBy: 'Kiran Rao',
  requestDate: '14-Oct-2026',
  available: true,
  reserved: true,
  requestedQuantity: 25,
  issuedQuantity: 25,
  issued: true,
  issueDate: '18-Oct-2026'
},
{
  stage: 'Validation',
  module: 'Braking System',
  task: 'Brake Testing',
  itemName: 'Brake Pads',
  quantity: 60,
  unitRate: 900,
  materialCost: 54000,
  remarks: 'OEM approved',
  targetDate: '10-Nov-2026',
  requestedBy: 'Deepa Nair',
  requestDate: '16-Oct-2026',
  available: false,
  reserved: false,
  requestedQuantity: 60,
  issuedQuantity: 0,
  issued: false,
  issueDate: '-'
},
{
  stage: 'Commissioning',
  module: 'Electrical',
  task: 'Control Panel Wiring',
  itemName: 'MCB Switches',
  quantity: 100,
  unitRate: 650,
  materialCost: 65000,
  remarks: 'Awaiting inspection',
  targetDate: '18-Nov-2026',
  requestedBy: 'Harish Babu',
  requestDate: '18-Oct-2026',
  available: true,
  reserved: true,
  requestedQuantity: 100,
  issuedQuantity: 60,
  issued: false,
  issueDate: '-'
},
{
  stage: 'Maintenance',
  module: 'Hydraulics',
  task: 'Pump Replacement',
  itemName: 'Hydraulic Pump',
  quantity: 8,
  unitRate: 18500,
  materialCost: 148000,
  remarks: 'Critical spare',
  targetDate: '22-Nov-2026',
  requestedBy: 'Arun Joseph',
  requestDate: '20-Oct-2026',
  available: true,
  reserved: false,
  requestedQuantity: 8,
  issuedQuantity: 8,
  issued: true,
  issueDate: '21-Oct-2026'
},
{
  stage: 'Inspection',
  module: 'Body Shop',
  task: 'Paint Inspection',
  itemName: 'Industrial Paint',
  quantity: 40,
  unitRate: 3200,
  materialCost: 128000,
  remarks: 'Color code RAL 5015',
  targetDate: '26-Nov-2026',
  requestedBy: 'Lakshmi Devi',
  requestDate: '21-Oct-2026',
  available: false,
  reserved: false,
  requestedQuantity: 40,
  issuedQuantity: 0,
  issued: false,
  issueDate: '-'
},
// {
//   stage: 'Production',
//   module: 'Transmission',
//   task: 'Gearbox Assembly',
//   itemName: 'Gear Shaft',
//   quantity: 30,
//   unitRate: 9800,
//   materialCost: 294000,
//   remarks: 'Precision machined',
//   targetDate: '30-Nov-2026',
//   requestedBy: 'Manoj Verma',
//   requestDate: '22-Oct-2026',
//   available: true,
//   reserved: true,
//   requestedQuantity: 30,
//   issuedQuantity: 30,
//   issued: true,
//   issueDate: '24-Oct-2026'
// },
// {
//   stage: 'Logistics',
//   module: 'Warehouse',
//   task: 'Dispatch Preparation',
//   itemName: 'Wooden Pallets',
//   quantity: 120,
//   unitRate: 450,
//   materialCost: 54000,
//   remarks: 'Store in dry area',
//   targetDate: '05-Dec-2026',
//   requestedBy: 'Sanjay Gupta',
//   requestDate: '24-Oct-2026',
//   available: true,
//   reserved: false,
//   requestedQuantity: 120,
//   issuedQuantity: 0,
//   issued: false,
//   issueDate: '-'
// },
// {
//   stage: 'Closure',
//   module: 'Documentation',
//   task: 'Final Handover',
//   itemName: 'Technical Manuals',
//   quantity: 15,
//   unitRate: 1200,
//   materialCost: 18000,
//   remarks: 'Print latest revision',
//   targetDate: '10-Dec-2026',
//   requestedBy: 'Meera Iyer',
//   requestDate: '26-Oct-2026',
//   available: true,
//   reserved: true,
//   requestedQuantity: 15,
//   issuedQuantity: 15,
//   issued: true,
//   issueDate: '28-Oct-2026'
// }
    ];
  }

  // Scroll logic
  scrollTable(direction: 'left' | 'right') {
    const container = this.tableContainer.nativeElement;
    const scrollAmount = 350; // Pixels to jump per click

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  scrollLeft() {
    this.scrollTable('left');
  }

  scrollRight() {
    this.scrollTable('right');
  }

    goBack(): void {
    this.router.navigateByUrl('/app/testing/projects');
  }

  addMaterial() {
       this.dialog.open(AddRequisitionPopComponent, {
          width: '850px',
          height: 'auto'
       });
  }

  editMaterial(row: ProjectMaterial) {
    this.dialog.open(AddRequisitionPopComponent, {
      width: '850px',
      height: 'auto',
      data: row
    });
  }

  deleteMaterial(row: ProjectMaterial) {
    this.displayedRows = this.displayedRows.filter(r => r !== row);
  }
}