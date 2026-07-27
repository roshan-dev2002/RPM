// Force dev server re-build
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

export interface Predecessor {
  moduleName: string;
  taskCode: string;
}

export interface Task {
  task: string;
  taskCode: string;
  jobCode: string;
  effort: number;
  duration: number;
  description: string;
  department: string;
  role: string;
  section?: string;
  planStart: string;
  planEnd: string;
  actualStart: string;
  actualEnd: string;
  eta: string;
  actualHours: number;
  expenses: string;
  priority: 'High' | 'Medium' | 'Low';
  predecessors?: Predecessor[];
}

export interface StageModule {
  name: string;
  count: number;
  tasks: Task[];
  planStart?: string;
  planEnd?: string;
}

export interface GanttBar {
  name: string;
  planStart: string;
  planEnd: string;
  planEffort: string;
}

export interface StageItem {
  stageCode: string;
  name: string;
  planEffort: string;
  planDuration: string;
  description: string;
  planStart: string;
  planEnd: string;
  actualStart: string;
  actualEnd: string;
  eta: string;
  buffer: string;
  gateName: string;
  gateStatus: 'Approved' | 'Pending' | 'Rejected';
  gateCode: string;
  status: boolean;
  setupCount: number;
  modules: StageModule[];
  expanded?: boolean;
  bars?: GanttBar[];
}

@Component({
  selector: 'app-project-stages',
  templateUrl: './project-stages.component.html',
  styleUrls: ['./project-stages.component.scss']
})
export class ProjectStagesComponent implements OnInit, OnDestroy {

  stages: StageItem[] = [
    {
      stageCode: 'STG001',
      name: 'Requirements & Concept',
      planEffort: '160 hrs',
      planDuration: '40 days',
      description: 'Define product requirements and initial concept validation.',
      planStart: '2026-01-05',
      planEnd: '2026-02-15',
      actualStart: '2026-01-05',
      actualEnd: '2026-02-14',
      eta: '2026-02-15',
      buffer: '3 days',
      gateName: 'Gate 0',
      gateStatus: 'Approved',
      gateCode: 'GT000',
      status: true,
      setupCount: 10,
      bars: [
        { name: 'Requirements & Concept', planStart: '2026-01-05', planEnd: '2026-02-15', planEffort: '160 hrs' },
        { name: 'Mid-Year Concept Review', planStart: '2026-07-01', planEnd: '2026-07-25', planEffort: '60 hrs' },
        { name: 'Annual Requirement Sync', planStart: '2026-11-05', planEnd: '2026-11-28', planEffort: '40 hrs' }
      ],
      modules: [
        {
          name: 'Stakeholder Alignment',
          count: 5,
          tasks: [
            { task: 'Initial Briefing', taskCode: 'TC-01', jobCode: 'INIT0', effort: 10, duration: 2, description: 'Client Briefing', department: 'Management', role: 'Olivia Brown', section: 'Section A', planStart: '2026-01-05', planEnd: '2026-01-07', actualStart: '2026-01-05', actualEnd: '2026-01-07', eta: '2026-01-07', actualHours: 10, expenses: '₹0', priority: 'High' },
            { task: 'Gather Stakeholder Requirements', taskCode: 'TC-01-B', jobCode: 'INIT0', effort: 20, duration: 4, description: 'Interviews with business leads', department: 'Management', role: 'Olivia Brown', section: 'Section A', planStart: '2026-01-08', planEnd: '2026-01-12', actualStart: '2026-01-08', actualEnd: '2026-01-12', eta: '2026-01-12', actualHours: 20, expenses: '₹0', priority: 'Medium' },
            { task: 'Market Research & Competitor Analysis', taskCode: 'TC-01-C', jobCode: 'INIT0', effort: 30, duration: 6, description: 'Competitor study', department: 'R & D', role: 'Diego Ruiz', section: 'Section B', planStart: '2026-01-13', planEnd: '2026-01-20', actualStart: '2026-01-13', actualEnd: '2026-01-20', eta: '2026-01-20', actualHours: 32, expenses: '₹2,000', priority: 'Low' },
            { task: 'Define Project Charter', taskCode: 'TC-01-D', jobCode: 'INIT0', effort: 15, duration: 3, description: 'Document project goals & bounds', department: 'Management', role: 'Olivia Brown', section: 'Section B', planStart: '2026-01-21', planEnd: '2026-01-24', actualStart: '2026-01-21', actualEnd: '2026-01-24', eta: '2026-01-24', actualHours: 15, expenses: '₹0', priority: 'High' },
            { task: 'Sign-off on Concept Document', taskCode: 'TC-01-E', jobCode: 'INIT0', effort: 8, duration: 2, description: 'Get formal approval from stakeholders', department: 'Management', role: 'Olivia Brown', section: 'Section C', planStart: '2026-01-25', planEnd: '2026-01-27', actualStart: '2026-01-25', actualEnd: '2026-01-27', eta: '2026-01-27', actualHours: 8, expenses: '₹0', priority: 'High' }
          ]
        },
        {
          name: 'Concept Validation',
          count: 5,
          tasks: [
            { task: 'Concept Ideation Workshop', taskCode: 'TC-02-A', jobCode: 'VAL01', effort: 12, duration: 2, description: 'Brainstorm concepts', department: 'R & D', role: 'Diego Ruiz', section: 'Section A', planStart: '2026-01-28', planEnd: '2026-01-30', actualStart: '2026-01-28', actualEnd: '2026-01-30', eta: '2026-01-30', actualHours: 12, expenses: '₹500', priority: 'Medium' },
            { task: 'Feasibility Pre-check', taskCode: 'TC-02-B', jobCode: 'VAL01', effort: 16, duration: 3, description: 'Pre-check technical risks', department: 'R & D', role: 'Aarav Shah', section: 'Section B', planStart: '2026-02-01', planEnd: '2026-02-04', actualStart: '2026-02-01', actualEnd: '2026-02-04', eta: '2026-02-04', actualHours: 16, expenses: '₹0', priority: 'Low' },
            { task: 'Customer Persona Modeling', taskCode: 'TC-02-C', jobCode: 'VAL01', effort: 15, duration: 3, description: 'Model target persona profiles', department: 'Management', role: 'Olivia Brown', section: 'Section B', planStart: '2026-02-05', planEnd: '2026-02-08', actualStart: '2026-02-05', actualEnd: '2026-02-08', eta: '2026-02-08', actualHours: 15, expenses: '₹0', priority: 'Medium' },
            { task: 'Mockup Flow Validation', taskCode: 'TC-02-D', jobCode: 'VAL01', effort: 20, duration: 4, description: 'Validate user flow diagrams', department: 'Management', role: 'Olivia Brown', section: 'Section C', planStart: '2026-02-09', planEnd: '2026-02-12', actualStart: '2026-02-09', actualEnd: '', eta: '2026-02-12', actualHours: 0, expenses: '₹0', priority: 'Medium' },
            { task: 'Pre-Validation Gate Review', taskCode: 'TC-02-E', jobCode: 'VAL01', effort: 8, duration: 1, description: 'Review concept checklist', department: 'Management', role: 'Olivia Brown', section: 'Section C', planStart: '2026-02-13', planEnd: '2026-02-14', actualStart: '2026-02-13', actualEnd: '', eta: '2026-02-14', actualHours: 0, expenses: '₹0', priority: 'High' }
          ]
        }
      ]
    },
    {
      stageCode: 'STG002',
      name: 'Feasibility & Viability',
      planEffort: '180 hrs',
      planDuration: '45 days',
      description: 'Evaluate technical feasibility and financial model.',
      planStart: '2026-02-16',
      planEnd: '2026-03-31',
      actualStart: '2026-02-16',
      actualEnd: '2026-03-30',
      eta: '2026-03-31',
      buffer: '4 days',
      gateName: 'Gate 1',
      gateStatus: 'Approved',
      gateCode: 'GT001',
      status: true,
      setupCount: 8,
      bars: [
        { name: 'Feasibility Pre-check', planStart: '2026-01-08', planEnd: '2026-01-14', planEffort: '40 hrs' },
        { name: 'Feasibility & Viability', planStart: '2026-02-16', planEnd: '2026-03-31', planEffort: '180 hrs' },
        { name: 'Tech Stack Audit', planStart: '2026-06-01', planEnd: '2026-06-25', planEffort: '50 hrs' },
        { name: 'Financial Re-viability', planStart: '2026-11-01', planEnd: '2026-11-20', planEffort: '30 hrs' }
      ],
      modules: [
        {
          name: 'Feasibility Study',
          count: 5,
          tasks: [
            { task: 'Technical Audit', taskCode: 'TC-02', jobCode: 'FEAS1', effort: 40, duration: 10, description: 'Audit tech stack', department: 'R & D', role: 'Diego Ruiz', section: 'Section A', planStart: '2026-02-16', planEnd: '2026-02-28', actualStart: '2026-02-16', actualEnd: '2026-02-28', eta: '2026-02-28', actualHours: 40, expenses: '₹1,000', priority: 'High' },
            { task: 'Financial Viability Projections', taskCode: 'TC-02-B', jobCode: 'FEAS1', effort: 25, duration: 5, description: 'Prepare 5-year budget forecast', department: 'Management', role: 'Olivia Brown', section: 'Section A', planStart: '2026-03-01', planEnd: '2026-03-06', actualStart: '2026-03-01', actualEnd: '2026-03-06', eta: '2026-03-06', actualHours: 25, expenses: '₹0', priority: 'Medium' },
            { task: 'Risk Assessment & Mitigation Plan', taskCode: 'TC-02-C', jobCode: 'FEAS1', effort: 20, duration: 4, description: 'Identify project vulnerabilities', department: 'R & D', role: 'Diego Ruiz', section: 'Section B', planStart: '2026-03-07', planEnd: '2026-03-11', actualStart: '2026-03-07', actualEnd: '2026-03-11', eta: '2026-03-11', actualHours: 22, expenses: '₹500', priority: 'High' },
            { task: 'Technology Stack Decision Matrix', taskCode: 'TC-02-D', jobCode: 'FEAS1', effort: 16, duration: 3, description: 'Evaluate frameworks & vendors', department: 'R & D', role: 'Aarav Shah', section: 'Section B', planStart: '2026-03-12', planEnd: '2026-03-15', actualStart: '2026-03-12', actualEnd: '2026-03-15', eta: '2026-03-15', actualHours: 16, expenses: '₹0', priority: 'Low' },
            { task: 'Present Feasibility Report', taskCode: 'TC-02-E', jobCode: 'FEAS1', effort: 12, duration: 2, description: 'Review report with steering committee', department: 'Management', role: 'Olivia Brown', section: 'Section C', planStart: '2026-03-16', planEnd: '2026-03-18', actualStart: '2026-03-16', actualEnd: '2026-03-18', eta: '2026-03-18', actualHours: 12, expenses: '₹1,500', priority: 'High' }
          ]
        },
        {
          name: 'Financial Modeling',
          count: 3,
          tasks: [
            { task: 'Cost Structure Estimation', taskCode: 'TC-02-F', jobCode: 'FIN01', effort: 15, duration: 3, description: 'Estimate project development costs', department: 'Management', role: 'Olivia Brown', section: 'Section A', planStart: '2026-03-19', planEnd: '2026-03-22', actualStart: '2026-03-19', actualEnd: '2026-03-22', eta: '2026-03-22', actualHours: 15, expenses: '₹0', priority: 'Medium' },
            { task: 'Revenue Projection Models', taskCode: 'TC-02-G', jobCode: 'FIN01', effort: 20, duration: 4, description: 'Forecast licensing & subscription revenues', department: 'Management', role: 'Olivia Brown', section: 'Section B', planStart: '2026-03-23', planEnd: '2026-03-27', actualStart: '2026-03-23', actualEnd: '', eta: '2026-03-27', actualHours: 0, expenses: '₹0', priority: 'Medium' },
            { task: 'ROI Break-Even Analysis', taskCode: 'TC-02-H', jobCode: 'FIN01', effort: 18, duration: 3, description: 'Calculate timeline to profit break-even', department: 'Management', role: 'Olivia Brown', section: 'Section C', planStart: '2026-03-28', planEnd: '2026-03-31', actualStart: '', actualEnd: '', eta: '2026-03-31', actualHours: 0, expenses: '₹0', priority: 'Medium' }
          ]
        }
      ]
    },
    {
      stageCode: 'STG003',
      name: 'System Architecture',
      planEffort: '220 hrs',
      planDuration: '45 days',
      description: 'Design high-level architecture and system components.',
      planStart: '2026-04-01',
      planEnd: '2026-05-15',
      actualStart: '2026-04-01',
      actualEnd: '2026-05-14',
      eta: '2026-05-15',
      buffer: '5 days',
      gateName: 'Gate 2',
      gateStatus: 'Approved',
      gateCode: 'GT002',
      status: true,
      setupCount: 6,
      bars: [
        { name: 'Early Arch Review', planStart: '2026-01-10', planEnd: '2026-01-16', planEffort: '45 hrs' },
        { name: 'System Architecture', planStart: '2026-04-01', planEnd: '2026-05-15', planEffort: '220 hrs' },
        { name: 'Scalability & Cloud Arch', planStart: '2026-09-01', planEnd: '2026-09-25', planEffort: '70 hrs' }
      ],
      modules: [
        {
          name: 'Blueprint Design',
          count: 5,
          tasks: [
            { task: 'High-Level Diagramming', taskCode: 'TC-03', jobCode: 'ARCH1', effort: 50, duration: 12, description: 'Prepare architecture diagrams', department: 'R & D', role: 'Aarav Shah', section: 'Section A', planStart: '2026-04-01', planEnd: '2026-04-15', actualStart: '2026-04-01', actualEnd: '2026-04-15', eta: '2026-04-15', actualHours: 50, expenses: '₹0', priority: 'High' },
            { task: 'Database Schema Architecture', taskCode: 'TC-03-B', jobCode: 'ARCH1', effort: 35, duration: 8, description: 'ERD modeling and indexing strategy', department: 'R & D', role: 'Aarav Shah', section: 'Section A', planStart: '2026-04-16', planEnd: '2026-04-24', actualStart: '2026-04-16', actualEnd: '2026-04-24', eta: '2026-04-24', actualHours: 35, expenses: '₹0', priority: 'High' },
            { task: 'Microservices Boundary Definition', taskCode: 'TC-03-C', jobCode: 'ARCH1', effort: 30, duration: 6, description: 'Design service interfaces & API gateways', department: 'R & D', role: 'Aarav Shah', section: 'Section B', planStart: '2026-04-25', planEnd: '2026-05-01', actualStart: '2026-04-25', actualEnd: '2026-05-01', eta: '2026-05-01', actualHours: 30, expenses: '₹0', priority: 'Medium' },
            { task: 'Security & Threat Modeling', taskCode: 'TC-03-D', jobCode: 'ARCH1', effort: 24, duration: 5, description: 'Define authentication & data encryption rules', department: 'Testing', role: 'Priya Nair', section: 'Section B', planStart: '2026-05-02', planEnd: '2026-05-07', actualStart: '2026-05-02', actualEnd: '2026-05-07', eta: '2026-05-07', actualHours: 24, expenses: '₹0', priority: 'High' },
            { task: 'Infrastructure Architecture Blueprint', taskCode: 'TC-03-E', jobCode: 'ARCH1', effort: 20, duration: 4, description: 'Design cloud deployment network & VPCs', department: 'R & D', role: 'Diego Ruiz', section: 'Section C', planStart: '2026-05-08', planEnd: '2026-05-12', actualStart: '2026-05-08', actualEnd: '2026-05-12', eta: '2026-05-12', actualHours: 20, expenses: '₹0', priority: 'Medium' }
          ]
        },
        {
          name: 'API Specification',
          count: 1,
          tasks: [
            { task: 'Define Endpoint Schemas', taskCode: 'TC-03-F', jobCode: 'API01', effort: 15, duration: 3, description: 'Document OpenAPI specs', department: 'R & D', role: 'Aarav Shah', section: 'Section A', planStart: '2026-05-13', planEnd: '2026-05-15', actualStart: '', actualEnd: '', eta: '2026-05-15', actualHours: 0, expenses: '₹0', priority: 'Medium' }
          ]
        }
      ]
    },
    {
      stageCode: 'STG004',
      name: 'Detail Specification & UX',
      planEffort: '200 hrs',
      planDuration: '45 days',
      description: 'Produce UX wireframes and detailed component specs.',
      planStart: '2026-05-16',
      planEnd: '2026-06-30',
      actualStart: '2026-05-16',
      actualEnd: '',
      eta: '2026-06-30',
      buffer: '3 days',
      gateName: 'Gate 3',
      gateStatus: 'Approved',
      gateCode: 'GT003',
      status: true,
      setupCount: 5,
      bars: [
        { name: 'UX Wireframe Sprint', planStart: '2026-01-11', planEnd: '2026-01-19', planEffort: '75 hrs' },
        { name: 'Detail Specification & UX', planStart: '2026-05-16', planEnd: '2026-06-30', planEffort: '200 hrs' }
      ],
      modules: [
        {
          name: 'UX Mockups',
          count: 3,
          tasks: [
            { task: 'Figma Prototyping', taskCode: 'TC-04', jobCode: 'DSGN1', effort: 30, duration: 8, description: 'Create Figma design system', department: 'Management', role: 'Olivia Brown', section: 'Section A', planStart: '2026-05-16', planEnd: '2026-05-25', actualStart: '2026-05-16', actualEnd: '', eta: '2026-05-25', actualHours: 30, expenses: '₹0', priority: 'Medium' },
            { task: 'High-Fidelity Wireframes', taskCode: 'TC-04-B', jobCode: 'DSGN1', effort: 40, duration: 10, description: 'Design actual page templates', department: 'Management', role: 'Olivia Brown', section: 'Section B', planStart: '2026-05-26', planEnd: '2026-06-05', actualStart: '', actualEnd: '', eta: '2026-06-05', actualHours: 0, expenses: '₹0', priority: 'Medium' },
            { task: 'Responsive Layout Specs', taskCode: 'TC-04-C', jobCode: 'DSGN1', effort: 20, duration: 5, description: 'Document mobile & tablet breakpoints', department: 'Management', role: 'Olivia Brown', section: 'Section C', planStart: '2026-06-06', planEnd: '2026-06-11', actualStart: '', actualEnd: '', eta: '2026-06-11', actualHours: 0, expenses: '₹0', priority: 'Low' }
          ]
        },
        {
          name: 'Technical Specifications',
          count: 2,
          tasks: [
            { task: 'Write System SRS Document', taskCode: 'TC-04-D', jobCode: 'SRS01', effort: 50, duration: 12, description: 'Compile detailed specification document', department: 'Management', role: 'Olivia Brown', section: 'Section A', planStart: '2026-06-12', planEnd: '2026-06-25', actualStart: '', actualEnd: '', eta: '2026-06-25', actualHours: 0, expenses: '₹0', priority: 'High' },
            { task: 'Review Specifications with Leads', taskCode: 'TC-04-E', jobCode: 'SRS01', effort: 10, duration: 2, description: 'Resolve specs checklist discrepancies', department: 'R & D', role: 'Diego Ruiz', section: 'Section B', planStart: '2026-06-26', planEnd: '2026-06-28', actualStart: '', actualEnd: '', eta: '2026-06-28', actualHours: 0, expenses: '₹0', priority: 'High' }
          ]
        }
      ]
    },
    {
      stageCode: 'STG005',
      name: 'Prototype & Tooling',
      planEffort: '150 hrs',
      planDuration: '30 days',
      description: 'Build initial hardware & software mock prototype.',
      planStart: '2026-07-01',
      planEnd: '2026-07-31',
      actualStart: '2026-07-01',
      actualEnd: '',
      eta: '2026-07-31',
      buffer: '2 days',
      gateName: 'Gate 4',
      gateStatus: 'Approved',
      gateCode: 'GT004',
      status: true,
      setupCount: 5,
      bars: [
        { name: 'Early Tooling Setup', planStart: '2026-02-01', planEnd: '2026-02-25', planEffort: '40 hrs' },
        { name: 'Prototype & Tooling', planStart: '2026-07-01', planEnd: '2026-07-31', planEffort: '150 hrs' },
        { name: 'Field Hardware Tooling', planStart: '2026-11-01', planEnd: '2026-11-25', planEffort: '50 hrs' }
      ],
      modules: [
        {
          name: 'Project Initiation & Planning',
          count: 3,
          tasks: [
            { task: 'Client Kickoff Meeting', taskCode: 'TC-100', jobCode: 'INIT0', effort: 4, duration: 1, description: 'Kickoff meeting with client', department: 'Management', role: 'Olivia Brown', section: 'Section A', planStart: '2026-07-01', planEnd: '2026-07-01', actualStart: '2026-07-01', actualEnd: '2026-07-01', eta: '2026-07-01', actualHours: 4, expenses: '₹1,500', priority: 'High' },
            { task: 'Define Project Scope', taskCode: 'TC-101', jobCode: 'INIT1', effort: 10, duration: 2, description: 'Define initial parameters', department: 'R & D', role: 'Diego Ruiz', section: 'Section A', planStart: '2026-07-01', planEnd: '2026-07-03', actualStart: '2026-07-01', actualEnd: '2026-07-03', eta: '2026-07-03', actualHours: 10, expenses: '₹0', priority: 'High' },
            { task: 'Setup Dev Infrastructure', taskCode: 'TC-102', jobCode: 'INIT1', effort: 12, duration: 3, description: 'Configure cloud environment & repos', department: 'R & D', role: 'Aarav Shah', section: 'Section B', planStart: '2026-07-04', planEnd: '2026-07-07', actualStart: '', actualEnd: '', eta: '2026-07-07', actualHours: 0, expenses: '₹0', priority: 'Medium' }
          ]
        },
        {
          name: 'Prototype Development',
          count: 2,
          tasks: [
            { task: 'Interactive Clickable UI Mockup', taskCode: 'TC-103', jobCode: 'INIT2', effort: 20, duration: 5, description: 'Build clickable prototype in Angular', department: 'Developer', role: 'Mei Tanaka', section: 'Section A', planStart: '2026-07-08', planEnd: '2026-07-13', actualStart: '', actualEnd: '', eta: '2026-07-13', actualHours: 0, expenses: '₹0', priority: 'Medium' },
            { task: 'Prototype Technical Review', taskCode: 'TC-104', jobCode: 'INIT2', effort: 8, duration: 2, description: 'Verify user experience with focus groups', department: 'Management', role: 'Olivia Brown', section: 'Section C', planStart: '2026-07-14', planEnd: '2026-07-16', actualStart: '', actualEnd: '', eta: '2026-07-16', actualHours: 0, expenses: '₹0', priority: 'Medium' }
          ]
        }
      ]
    },
    {
      stageCode: 'STG006',
      name: 'Core Development',
      planEffort: '450 hrs',
      planDuration: '45 days',
      description: 'Execute main frontend & backend software development.',
      planStart: '2026-08-01',
      planEnd: '2026-09-15',
      actualStart: '',
      actualEnd: '',
      eta: '2026-09-15',
      buffer: '6 days',
      gateName: 'Gate 5',
      gateStatus: 'Pending',
      gateCode: 'GT005',
      status: true,
      setupCount: 6,
      bars: [
        { name: 'Core PoC Sprint 1', planStart: '2026-01-08', planEnd: '2026-01-14', planEffort: '60 hrs' },
        { name: 'Core PoC Sprint 2 (Overlap)', planStart: '2026-01-12', planEnd: '2026-01-21', planEffort: '90 hrs' },
        { name: 'Core PoC Development', planStart: '2026-03-01', planEnd: '2026-03-25', planEffort: '80 hrs' },
        { name: 'Core Development', planStart: '2026-08-01', planEnd: '2026-09-15', planEffort: '450 hrs' }
      ],
      modules: [
        {
          name: 'Frontend Development',
          count: 3,
          tasks: [
            { task: 'Core UI Implementation', taskCode: 'TC-500', jobCode: 'DEVL0', effort: 80, duration: 15, description: 'Build Angular modules', department: 'Developer', role: 'Mei Tanaka', section: 'Section A', planStart: '2026-08-01', planEnd: '2026-08-20', actualStart: '', actualEnd: '', eta: '2026-08-20', actualHours: 0, expenses: '₹0', priority: 'High' },
            { task: 'Dashboard Widgets Implementation', taskCode: 'TC-501', jobCode: 'DEVL0', effort: 50, duration: 10, description: 'Implement charts & widgets', department: 'Developer', role: 'Mei Tanaka', section: 'Section B', planStart: '2026-08-21', planEnd: '2026-08-31', actualStart: '', actualEnd: '', eta: '2026-08-31', actualHours: 0, expenses: '₹0', priority: 'Medium' },
            { task: 'Integrate HTTP Interceptors', taskCode: 'TC-502', jobCode: 'DEVL0', effort: 20, duration: 4, description: 'Configure auth headers & error handlers', department: 'Developer', role: 'Mei Tanaka', section: 'Section A', planStart: '2026-09-01', planEnd: '2026-09-05', actualStart: '', actualEnd: '', eta: '2026-09-05', actualHours: 0, expenses: '₹0', priority: 'Medium' }
          ]
        },
        {
          name: 'Backend Development',
          count: 3,
          tasks: [
            { task: 'Setup API Gateway', taskCode: 'TC-503', jobCode: 'DEVL1', effort: 40, duration: 8, description: 'Configure API routing & middleware', department: 'R & D', role: 'Diego Ruiz', section: 'Section B', planStart: '2026-08-01', planEnd: '2026-08-09', actualStart: '', actualEnd: '', eta: '2026-08-09', actualHours: 0, expenses: '₹0', priority: 'High' },
            { task: 'Implement User Auth Service', taskCode: 'TC-504', jobCode: 'DEVL1', effort: 30, duration: 6, description: 'Develop JWT authentication & token flows', department: 'R & D', role: 'Aarav Shah', section: 'Section A', planStart: '2026-08-10', planEnd: '2026-08-16', actualStart: '', actualEnd: '', eta: '2026-08-16', actualHours: 0, expenses: '₹0', priority: 'High' },
            { task: 'Database ORM Mapping', taskCode: 'TC-505', jobCode: 'DEVL1', effort: 35, duration: 7, description: 'Map schemas to relational database entities', department: 'R & D', role: 'Diego Ruiz', section: 'Section B', planStart: '2026-08-17', planEnd: '2026-08-24', actualStart: '', actualEnd: '', eta: '2026-08-24', actualHours: 0, expenses: '₹0', priority: 'Medium' }
          ]
        }
      ]
    },
    {
      stageCode: 'STG007',
      name: 'Integration & QA',
      planEffort: '200 hrs',
      planDuration: '45 days',
      description: 'Perform system integration, automated testing and security audit.',
      planStart: '2026-09-16',
      planEnd: '2026-10-31',
      actualStart: '',
      actualEnd: '',
      eta: '2026-10-31',
      buffer: '4 days',
      gateName: 'Gate 6',
      gateStatus: 'Pending',
      gateCode: 'GT006',
      status: true,
      setupCount: 5,
      bars: [
        { name: 'Early QA Automation', planStart: '2026-01-16', planEnd: '2026-01-24', planEffort: '55 hrs' },
        { name: 'Integration & QA', planStart: '2026-09-16', planEnd: '2026-10-31', planEffort: '200 hrs' }
      ],
      modules: [
        {
          name: 'Unit & Integration Testing',
          count: 3,
          tasks: [
            { task: 'System Testing Specs', taskCode: 'TC-700', jobCode: 'TEST0', effort: 40, duration: 10, description: 'Automated test suite execution', department: 'Testing', role: 'Priya Nair', section: 'Section A', planStart: '2026-09-16', planEnd: '2026-09-30', actualStart: '', actualEnd: '', eta: '2026-09-30', actualHours: 0, expenses: '₹0', priority: 'High' },
            { task: 'Run Unit Test Suites', taskCode: 'TC-701', jobCode: 'TEST0', effort: 25, duration: 5, description: 'Verify individual units of code', department: 'Testing', role: 'Priya Nair', section: 'Section B', planStart: '2026-10-01', planEnd: '2026-10-06', actualStart: '', actualEnd: '', eta: '2026-10-06', actualHours: 0, expenses: '₹0', priority: 'Medium' },
            { task: 'Perform End-to-End Testing', taskCode: 'TC-702', jobCode: 'TEST0', effort: 45, duration: 9, description: 'Execute integration tests on staging server', department: 'Testing', role: 'Priya Nair', section: 'Section A', planStart: '2026-10-07', planEnd: '2026-10-16', actualStart: '', actualEnd: '', eta: '2026-10-16', actualHours: 0, expenses: '₹0', priority: 'High' }
          ]
        },
        {
          name: 'Security & Penetration Testing',
          count: 2,
          tasks: [
            { task: 'Execute OWASP Vulnerability Scan', taskCode: 'TC-703', jobCode: 'TEST1', effort: 20, duration: 4, description: 'Scan application endpoints for vulnerabilities', department: 'Testing', role: 'Priya Nair', section: 'Section B', planStart: '2026-10-17', planEnd: '2026-10-21', actualStart: '', actualEnd: '', eta: '2026-10-21', actualHours: 0, expenses: '₹0', priority: 'High' },
            { task: 'Resolve Found Security Discrepancies', taskCode: 'TC-704', jobCode: 'TEST1', effort: 30, duration: 6, description: 'Fix SQL Injection or XSS vulnerabilities', department: 'Developer', role: 'Mei Tanaka', section: 'Section A', planStart: '2026-10-22', planEnd: '2026-10-28', actualStart: '', actualEnd: '', eta: '2026-10-28', actualHours: 0, expenses: '₹0', priority: 'High' }
          ]
        }
      ]
    },
    {
      stageCode: 'STG008',
      name: 'UAT & Compliance Audit',
      planEffort: '140 hrs',
      planDuration: '30 days',
      description: 'User acceptance testing, security compliance and sign-off.',
      planStart: '2026-11-01',
      planEnd: '2026-11-30',
      actualStart: '',
      actualEnd: '',
      eta: '2026-11-30',
      buffer: '3 days',
      gateName: 'Gate 7',
      gateStatus: 'Pending',
      gateCode: 'GT007',
      status: true,
      setupCount: 4,
      bars: [
        { name: 'Compliance Pre-Audit', planStart: '2026-01-14', planEnd: '2026-01-23', planEffort: '65 hrs' },
        { name: 'Compliance Audit Phase 2', planStart: '2026-03-01', planEnd: '2026-03-25', planEffort: '35 hrs' },
        { name: 'Mid-Year Security Audit', planStart: '2026-06-01', planEnd: '2026-06-25', planEffort: '45 hrs' },
        { name: 'UAT & Compliance Audit', planStart: '2026-11-01', planEnd: '2026-11-30', planEffort: '140 hrs' }
      ],
      modules: [
        {
          name: 'UAT Testing',
          count: 3,
          tasks: [
            { task: 'Client User Acceptance', taskCode: 'TC-800', jobCode: 'UAT0', effort: 30, duration: 7, description: 'Client verification session', department: 'Testing', role: 'Priya Nair', section: 'Section A', planStart: '2026-11-01', planEnd: '2026-11-10', actualStart: '', actualEnd: '', eta: '2026-11-10', actualHours: 0, expenses: '₹0', priority: 'High' },
            { task: 'Collect UAT Feedback Log', taskCode: 'TC-801', jobCode: 'UAT0', effort: 15, duration: 3, description: 'Log client requests & remarks', department: 'Management', role: 'Olivia Brown', section: 'Section B', planStart: '2026-11-11', planEnd: '2026-11-14', actualStart: '', actualEnd: '', eta: '2026-11-14', actualHours: 0, expenses: '₹0', priority: 'Medium' },
            { task: 'Bug Hotfixing & Resolution', taskCode: 'TC-802', jobCode: 'UAT0', effort: 25, duration: 5, description: 'Address client blocker bugs', department: 'Developer', role: 'Mei Tanaka', section: 'Section C', planStart: '2026-11-15', planEnd: '2026-11-20', actualStart: '', actualEnd: '', eta: '2026-11-20', actualHours: 0, expenses: '₹0', priority: 'High' }
          ]
        },
        {
          name: 'Compliance Sign-off',
          count: 1,
          tasks: [
            { task: 'Perform Compliance Review Audit', taskCode: 'TC-803', jobCode: 'UAT1', effort: 20, duration: 4, description: 'Check system specifications list', department: 'Testing', role: 'Priya Nair', section: 'Section A', planStart: '2026-11-21', planEnd: '2026-11-25', actualStart: '', actualEnd: '', eta: '2026-11-25', actualHours: 0, expenses: '₹0', priority: 'High' }
          ]
        }
      ]
    },
    {
      stageCode: 'STG009',
      name: 'Final Release & Deployment',
      planEffort: '100 hrs',
      planDuration: '25 days',
      description: 'Production infrastructure provisioning, migration, and go-live.',
      planStart: '2026-12-01',
      planEnd: '2026-12-25',
      actualStart: '',
      actualEnd: '',
      eta: '2026-12-25',
      buffer: '2 days',
      gateName: 'Gate 8',
      gateStatus: 'Pending',
      gateCode: 'GT008',
      status: true,
      setupCount: 3,
      bars: [
        { name: 'Release Prep Kickoff', planStart: '2026-01-22', planEnd: '2026-01-28', planEffort: '40 hrs' },
        { name: 'Final Release & Deployment', planStart: '2026-12-01', planEnd: '2026-12-25', planEffort: '100 hrs' }
      ],
      modules: [
        {
          name: 'Go-Live Release',
          count: 3,
          tasks: [
            { task: 'Production Deployment', taskCode: 'TC-900', jobCode: 'DEPL0', effort: 20, duration: 3, description: 'Deploy to Cloud Server', department: 'Developer', role: 'Diego Ruiz', section: 'Section A', planStart: '2026-12-01', planEnd: '2026-12-05', actualStart: '', actualEnd: '', eta: '2026-12-05', actualHours: 0, expenses: '₹0', priority: 'High' },
            { task: 'Database Production Migration', taskCode: 'TC-901', jobCode: 'DEPL0', effort: 15, duration: 2, description: 'Migrate user databases & keys', department: 'R & D', role: 'Aarav Shah', section: 'Section B', planStart: '2026-12-06', planEnd: '2026-12-08', actualStart: '', actualEnd: '', eta: '2026-12-08', actualHours: 0, expenses: '₹0', priority: 'High' },
            { task: 'Verify Production Live Operations', taskCode: 'TC-902', jobCode: 'DEPL0', effort: 10, duration: 2, description: 'Run sanity testing suite on production', department: 'Testing', role: 'Priya Nair', section: 'Section C', planStart: '2026-12-09', planEnd: '2026-12-11', actualStart: '', actualEnd: '', eta: '2026-12-11', actualHours: 0, expenses: '₹0', priority: 'High' }
          ]
        }
      ]
    }
  ];

  // Views state
  showSetupView = false;
  activeStage: StageItem | null = null;
  activeModuleIndex = 0;
  activeView: 'grid' | 'gantt' = 'grid';
  ganttScale: 'monthly' | 'weekly' | 'daily' = 'monthly';

  // Setup/WBS view search & filters state
  showSetupFilter = false;
  filterKeyword = '';
  filterDepartment = '';
  filterSection = '';
  filterStartDate = '';
  filterEndDate = '';

  tempKeyword = '';
  tempDepartment = '';
  tempSection = '';
  tempStartDate = '';
  tempEndDate = '';

  setView(view: 'grid' | 'gantt') {
    this.activeView = view;
  }

  setGanttScale(scale: 'monthly' | 'weekly' | 'daily') {
    this.ganttScale = scale;
  }

  // --- Multi-scale Gantt view getters ---
  get ganttMonths(): { name: string; fullYear: number; monthIndex: number }[] {
    return [
      { name: 'Jan', fullYear: 2026, monthIndex: 0 },
      { name: 'Feb', fullYear: 2026, monthIndex: 1 },
      { name: 'Mar', fullYear: 2026, monthIndex: 2 },
      { name: 'Apr', fullYear: 2026, monthIndex: 3 },
      { name: 'May', fullYear: 2026, monthIndex: 4 },
      { name: 'Jun', fullYear: 2026, monthIndex: 5 },
      { name: 'Jul', fullYear: 2026, monthIndex: 6 },
      { name: 'Aug', fullYear: 2026, monthIndex: 7 },
      { name: 'Sep', fullYear: 2026, monthIndex: 8 },
      { name: 'Oct', fullYear: 2026, monthIndex: 9 },
      { name: 'Nov', fullYear: 2026, monthIndex: 10 },
      { name: 'Dec', fullYear: 2026, monthIndex: 11 }
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
    if (this.stages.length === 0) return [];

    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    for (const s of this.stages) {
      const bars = this.getStageBars(s);
      for (const bar of bars) {
        if (!bar.planStart || !bar.planEnd) continue;
        const start = new Date(bar.planStart);
        const finish = new Date(bar.planEnd);
        if (isNaN(start.getTime()) || isNaN(finish.getTime())) continue;

        if (!minDate || start < minDate) minDate = start;
        if (!maxDate || finish > maxDate) maxDate = finish;
      }
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

  getStageBars(s: StageItem): GanttBar[] {
    if (s.bars && s.bars.length > 0) {
      return s.bars;
    }
    return [{
      name: s.name,
      planStart: s.planStart,
      planEnd: s.planEnd,
      planEffort: s.planEffort
    }];
  }

  getGanttBarStyle(s: { planStart?: string; planEnd?: string }, index: number = 0): any {
    if (!s || !s.planStart || !s.planEnd) return { display: 'none' };

    const start = new Date(s.planStart);
    const finish = new Date(s.planEnd);
    if (isNaN(start.getTime()) || isNaN(finish.getTime())) return { display: 'none' };

    let styleObj: any = {};

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

      styleObj = {
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

      styleObj = {
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

      styleObj = {
        left: `${leftPercent.toFixed(2)}%`,
        width: `${widthPercent.toFixed(2)}%`
      };
    }

    if (index > 0) {
      styleObj.top = `${6 + (index % 3) * 12}px`;
      styleObj.height = '26px';
      styleObj.zIndex = `${index + 1}`;
      styleObj.opacity = '0.94';
      styleObj.boxShadow = '-2px 2px 6px rgba(0,0,0,0.12)';
    }

    return styleObj;
  }

  getStageGanttClass(stageName: string): string {
    const name = stageName.toLowerCase();
    if (name.includes('feasibility') || name.includes('concept') || name.includes('requirement')) return 'gantt-bar-feasibility';
    if (name.includes('design') || name.includes('architecture') || name.includes('specification')) return 'gantt-bar-design';
    if (name.includes('development') || name.includes('implementation') || name.includes('core')) return 'gantt-bar-development';
    if (name.includes('testing') || name.includes('qa') || name.includes('uat') || name.includes('audit') || name.includes('compliance')) return 'gantt-bar-testing';
    if (name.includes('deployment') || name.includes('release') || name.includes('prototype') || name.includes('tooling')) return 'gantt-bar-deployment';
    return 'gantt-bar-default';
  }

  stripTime(d: Date): Date {
    if (!d || isNaN(d.getTime())) return new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  // Filters logic
  toggleSetupFilter() {
    this.showSetupFilter = !this.showSetupFilter;
  }

  applySetupFilters() {
    this.filterKeyword = this.tempKeyword;
    this.filterDepartment = this.tempDepartment;
    this.filterSection = this.tempSection;
    this.filterStartDate = this.tempStartDate;
    this.filterEndDate = this.tempEndDate;
  }

  resetSetupFilters() {
    this.tempKeyword = '';
    this.tempDepartment = '';
    this.tempSection = '';
    this.tempStartDate = '';
    this.tempEndDate = '';
    this.applySetupFilters();
  }

  getFilteredTasks(tasks: Task[]): Task[] {
    if (!tasks) return [];
    return tasks.filter(t => {
      if (this.filterKeyword) {
        const kw = this.filterKeyword.toLowerCase();
        const matchesName = t.task && t.task.toLowerCase().includes(kw);
        const matchesCode = t.taskCode && t.taskCode.toLowerCase().includes(kw);
        const matchesJob = t.jobCode && t.jobCode.toLowerCase().includes(kw);
        if (!matchesName && !matchesCode && !matchesJob) return false;
      }
      if (this.filterDepartment) {
        if (t.department !== this.filterDepartment) return false;
      }
      if (this.filterSection) {
        const sec = this.filterSection.toLowerCase();
        if (!t.section || !t.section.toLowerCase().includes(sec)) return false;
      }
      if (this.filterStartDate) {
        if (!t.planStart || t.planStart < this.filterStartDate) return false;
      }
      if (this.filterEndDate) {
        if (!t.planEnd || t.planEnd > this.filterEndDate) return false;
      }
      return true;
    });
  }

  get uniqueDepartments(): string[] {
    const depts = new Set<string>();
    if (this.activeStage && this.activeStage.modules) {
      this.activeStage.modules.forEach(m => {
        if (m.tasks) {
          m.tasks.forEach(t => {
            if (t.department) depts.add(t.department);
          });
        }
      });
    }
    depts.add('R & D');
    depts.add('Testing');
    depts.add('Developer');
    return Array.from(depts);
  }

  // Predecessors logic
  getPredecessorTasksForModule(moduleName: string): Task[] {
    if (!this.activeStage || !moduleName) return [];
    const mod = this.activeStage.modules.find(m => m.name === moduleName);
    if (!mod || !mod.tasks) return [];
    return mod.tasks.filter(t => t.taskCode !== this.taskModalData.taskCode);
  }

  onPredecessorModuleChange(pred: any) {
    pred.taskCode = '';
  }

  addPredecessorRow() {
    if (!this.taskModalData.predecessors) {
      this.taskModalData.predecessors = [];
    }
    this.taskModalData.predecessors.push({
      moduleName: '',
      taskCode: ''
    });
  }

  deletePredecessorRow(idx: number) {
    if (this.taskModalData.predecessors) {
      this.taskModalData.predecessors.splice(idx, 1);
    }
  }

  // Stage table pagination
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 0;

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  openTimelineModal(item: any) {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal() {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  // Add / Edit Stage Modal states
  showStageModal = false;
  stageModalStep = 1; // Track active step/tab in popup
  isEditStageMode = false;
  stageModalData: Partial<StageItem> = {};
  stageModalIndex = -1;

  // Add / Edit Task Modal states
  showTaskModal = false;
  taskModalStep = 1; // Track active step/tab in task popup
  isEditTaskMode = false;
  taskModalData: Partial<Task> = {};
  taskModalIndex = -1;

  // Stimulation (Add Module) Modal state
  showStimulationModal = false;
  newModuleName = '';
  newModulePlanStart = '';
  newModulePlanEnd = '';

  private subs = new Subscription();

  constructor(
    private dialog: MatDialog,
    private dragulaService: DragulaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.dragulaService.find('PROJECTSTAGES')) {
      this.dragulaService.destroy('PROJECTSTAGES');
    }

    this.dragulaService.createGroup('PROJECTSTAGES', {
      revertOnSpill: true,
      moves: (el, container, handle) => {
        return !el?.classList.contains('no-drag');
      }
    });

    this.subs.add(
      this.dragulaService.dropModel('PROJECTSTAGES').subscribe(({ targetModel }) => {
        this.onPagedStagesChange(targetModel);
      })
    );
  }

  ngOnInit(): void {
    this.updatePagedStages();
    this.subs.add(
      this.route.queryParams.subscribe(params => {
        if (params['view'] === 'setup' && params['stageCode']) {
          const stage = this.stages.find(s => s.stageCode === params['stageCode']);
          if (stage) {
            this.activeStage = stage;
            this.activeModuleIndex = 0;
            this.showSetupView = true;
            this.resetSetupFilters();
          } else {
            this.showSetupView = false;
            this.activeStage = null;
          }
        } else {
          this.showSetupView = false;
          this.activeStage = null;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('PROJECTSTAGES');
    this.subs.unsubscribe();
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigateByUrl('/app/testing/projects');
  }

  pagedStagesList: StageItem[] = [];

  updatePagedStages() {
    const start = this.currentPage * this.pageSize;
    this.pagedStagesList = this.stages.slice(start, start + this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedStages();
  }

  onPagedStagesChange(newPagedStages: StageItem[]): void {
    if (!newPagedStages) return;
    const start = this.currentPage * this.pageSize;
    this.stages.splice(start, newPagedStages.length, ...newPagedStages);
    this.updatePagedStages();
  }

  get pagedStages(): StageItem[] {
    return this.pagedStagesList;
  }

  get pageStart(): number {
    return this.stages.length === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.stages.length);
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.stages.length / this.pageSize));
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
  }

  goToPage(delta: number) {
    const next = this.currentPage + delta;
    if (next >= 0 && next < this.pageCount) {
      this.currentPage = next;
    }
  }

  private setBodyScrollLock(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }


  // --- Stage CRUD & Actions ---
  Confirmation(item: StageItem): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: 'Are you sure you want to Change the Status ?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.status = !item.status;
      }
    });
  }

  deleteStage(item: StageItem): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stages = this.stages.filter(s => s !== item);
        if (this.currentPage >= this.pageCount) {
          this.currentPage = Math.max(0, this.pageCount - 1);
        }
        this.updatePagedStages();
      }
    });
  }

  openAddStage() {
    this.stageModalStep = 1;
    this.stageModalData = {
      stageCode: 'STG00' + (this.stages.length + 1),
      name: '',
      planEffort: '',
      planDuration: '',
      description: '',
      planStart: '',
      planEnd: '',
      actualStart: '',
      actualEnd: '',
      eta: '',
      buffer: '',
      gateName: '',
      gateStatus: 'Pending',
      gateCode: '',
      status: true,
      setupCount: 0,
      modules: []
    };
    this.isEditStageMode = false;
    this.showStageModal = true;
    this.setBodyScrollLock(true);
  }

  openEditStage(item: StageItem, index: number) {
    const actualIndex = this.stages.findIndex(s => s === item);
    this.stageModalStep = 1;
    this.stageModalData = { ...item };
    this.isEditStageMode = true;
    this.stageModalIndex = actualIndex >= 0 ? actualIndex : index;
    this.showStageModal = true;
    this.setBodyScrollLock(true);
  }

  closeStageModal() {
    this.showStageModal = false;
    this.setBodyScrollLock(false);
  }

  saveStage() {
    if (!this.stageModalData.name || !this.stageModalData.stageCode) return;
    
    if (this.isEditStageMode && this.stageModalIndex > -1) {
      this.stages[this.stageModalIndex] = { ...this.stages[this.stageModalIndex], ...this.stageModalData } as StageItem;
    } else {
      this.stages.push(this.stageModalData as StageItem);
    }
    this.updatePagedStages();
    this.closeStageModal();
  }

  // --- Setup View navigation ---
  openSetup(item: StageItem) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: 'setup', stageCode: item.stageCode },
      queryParamsHandling: 'merge'
    });
  }

  closeSetup() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: null, stageCode: null },
      queryParamsHandling: 'merge'
    });
  }

  // --- Modules (Stimulation) CRUD ---
  openStimulationModal() {
    this.newModuleName = '';
    this.newModulePlanStart = '2026-01-05';
    this.newModulePlanEnd = '2026-01-25';
    this.showStimulationModal = true;
    this.setBodyScrollLock(true);
  }

  closeStimulationModal() {
    this.showStimulationModal = false;
    this.setBodyScrollLock(false);
  }

  saveStimulationModule() {
    const name = this.newModuleName.trim();
    if (!name || !this.activeStage) return;

    if (!this.activeStage.modules) {
      this.activeStage.modules = [];
    }

    this.activeStage.modules.push({
      name,
      planStart: this.newModulePlanStart,
      planEnd: this.newModulePlanEnd,
      count: 0,
      tasks: []
    });
    this.activeModuleIndex = this.activeStage.modules.length - 1;
    this.closeStimulationModal();
  }

  selectModule(index: number) {
    this.activeModuleIndex = index;
  }

  // --- Task CRUD ---
  openAddTask() {
    this.taskModalStep = 1;
    this.taskModalData = {
      task: '',
      taskCode: 'TC-' + (Math.floor(Math.random() * 900) + 100),
      jobCode: '',
      effort: 0,
      duration: 0,
      description: '',
      department: '',
      role: '',
      section: '',
      planStart: '',
      planEnd: '',
      actualStart: '',
      actualEnd: '',
      eta: '',
      actualHours: 0,
      expenses: '₹0',
      priority: 'Medium',
      predecessors: []
    };
    this.isEditTaskMode = false;
    this.showTaskModal = true;
    this.setBodyScrollLock(true);
  }

  openEditTask(task: Task, index: number) {
    this.taskModalStep = 1;
    this.taskModalData = {
      ...task,
      predecessors: task.predecessors ? JSON.parse(JSON.stringify(task.predecessors)) : []
    };
    this.isEditTaskMode = true;
    this.taskModalIndex = this.activeStage?.modules[this.activeModuleIndex]?.tasks.indexOf(task) ?? index;
    this.showTaskModal = true;
    this.setBodyScrollLock(true);
  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.setBodyScrollLock(false);
  }

  saveTask() {
    if (!this.taskModalData.task || !this.activeStage) return;
    const activeModule = this.activeStage.modules[this.activeModuleIndex];
    if (!activeModule) return;

    if (this.isEditTaskMode && this.taskModalIndex > -1) {
      activeModule.tasks[this.taskModalIndex] = { ...activeModule.tasks[this.taskModalIndex], ...this.taskModalData } as Task;
    } else {
      activeModule.tasks.push(this.taskModalData as Task);
    }
    activeModule.count = activeModule.tasks.length;
    this.closeTaskModal();
  }

  deleteTask(task: Task) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.activeStage) {
        const activeModule = this.activeStage.modules[this.activeModuleIndex];
        if (activeModule) {
          activeModule.tasks = activeModule.tasks.filter(t => t !== task);
          activeModule.count = activeModule.tasks.length;
        }
      }
    });
  }

}
