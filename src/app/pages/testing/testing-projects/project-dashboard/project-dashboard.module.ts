import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DragulaModule } from "ng2-dragula";

// --- Highcharts ---
import { HighchartsChartModule } from "highcharts-angular";

// --- Flex Layout ---
import { FlexLayoutModule } from "@angular/flex-layout"; // <-- ADDED THIS IMPORT

// --- Material Modules ---
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";

// --- Components ---
import { ProjectDashboardComponent } from "./project-dashboard.component";
import { ProjectDocumentsComponent } from "./project-documents/project-documents.component";
import { ProjectNotesComponent } from "./project-notes/project-notes.component";
import { ProjectPhotosComponent } from "./project-photos/project-photos.component";
import { UploadDocumentComponent } from "./project-notes/upload-document/upload-document.component";
import { AddReferralDocComponent } from "./project-documents/add-referral-doc/add-referral-doc.component";
import { PlaceholderImageComponent } from "./placeholder-image/placeholder-image.component";
import { AddphotoPopComponent } from "./project-photos/addphoto-pop/addphoto-pop.component";
import { ProjectAnalyticsComponent } from "./project-analytics/project-analytics.component";
import { ProjectOverviewComponent } from "./project-overview/project-overview.component";
import { ProjectTeamComponent } from "./project-team/project-team.component";
import { ProjectSetupComponent } from "./project-setup/project-setup.component";
import { ProjectScheduleComponent } from "./project-schedule/project-schedule.component";
import { ProjectBudgetComponent } from "./project-budget/project-budget.component";
import { ProjectAssetsComponent } from "./project-assets/project-assets.component";
import { AssetsSchedulingComponent } from "./project-assets/assets-scheduling/assets-scheduling.component";
import { ProjectExpensesComponent } from "./project-expenses/project-expenses.component";
import { ProjectMaterialsComponent } from "./project-materials/project-materials.component";
import { AddRequisitionPopComponent } from "./project-materials/add-requisition-pop/add-requisition-pop.component";
import { ProjectBacklogComponent } from "./project-backlog/project-backlog.component";
import { ProjectFacilitiesComponent } from "./project-facilities/project-facilities.component";
import { FacilitiesSchedulingComponent } from "./project-facilities/facilities-scheduling/facilities-scheduling.component";
import { ProjectHoursComponent } from "./project-hours/project-hours.component";
import { AddAssetPopComponent } from './project-assets/add-asset-pop/add-asset-pop.component';
import { AddFacilityPopComponent } from './project-facilities/add-facility-pop/add-facility-pop.component';
import { EditBacklogTaskComponent } from './project-backlog/edit-backlog-task/edit-backlog-task.component';
import { AddExpensePopComponent } from './project-expenses/add-expense-pop/add-expense-pop.component';
import { AddHoursPopComponent } from './project-hours/add-hours-pop/add-hours-pop.component';
import { ProjectStagesComponent } from "./project-stages/project-stages.component";
import { AddstagesmoduleComponent } from "./project-stages/addstagesmodule/addstagesmodule.component";
import { AddAssignmentComponent } from './project-backlog/add-assignment/add-assignment.component';
import { ProjectTodoComponent } from './project-todo/project-todo.component';
import { AddTodoPopComponent } from './project-todo/add-todo-pop/add-todo-pop.component';
import { ProjectResourcesComponent } from './project-resources/project-resources.component';
import { AddResourcePopComponent } from './project-resources/add-resource-pop/add-resource-pop.component';
import { ProjectIssuesComponent } from './project-issues/project-issues.component';
import { AddProjectIssuesPopComponent } from './project-issues/add-project-issues-pop/add-project-issues-pop.component';

const routes: Routes = [
  {
    path: "",
    component: ProjectDashboardComponent, // The parent wrapper with the side-nav
    children: [
      { path: "", redirectTo: "analytics", pathMatch: "full" },
      {
        path: "documents", component: ProjectDocumentsComponent,
        data: {
          breadcrumb: 'Documents (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track and manage all documents.'
        }
      },
      {
        path: "notes", component: ProjectNotesComponent,
        data: {
          breadcrumb: 'Notes (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Manage project notes and documentation.'
        }
      },
      {
        path: "photos", component: ProjectPhotosComponent,
        data: {
          breadcrumb: 'Photos (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track, upload, and organize all project site photos..'
        }
      },
      {
        path: "analytics", component: ProjectAnalyticsComponent,
        data: {
          breadcrumb: 'Project Dashboard (NextGen Assembly Line - 2026/MFG/011 )',
          description: 'Real-time overview of NPI timeline, production metrics, and resource allocation.'
        }
      },
      {
        path: "overview", component: ProjectOverviewComponent,
        data: {
          breadcrumb: 'Project Overview',
          description: 'High-level summary of project status, key performance indicators, and master schedule.'
        }
      },
      {
        path: "setup", component: ProjectSetupComponent,
        data: {
          breadcrumb: 'Stage Gate Project Management (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track progress across stages, modules, and tasks.'
        }
      },
      {
        path: "team", component: ProjectTeamComponent,
        data: {
          breadcrumb: 'Assign Team Members (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Select and move members to build your project team.'
        }
      },
      {
        path: "stages", component: ProjectStagesComponent,
        data: {
          breadcrumb: 'Stages (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track progress across stages, effort planning, and gate scheduling.'
        }
      },
      {
        path: "addstagesmodule", component: AddstagesmoduleComponent,
        data: {
          breadcrumb: 'Add Stage Module (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Add a new module to a stage.'
        }
      },
      { path: "wbs", component: PlaceholderImageComponent },
      {
        path: "schedule", component: ProjectScheduleComponent,
        data: {
          breadcrumb: 'Schedule (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track allocation, progress, and ETA across all tasks.'
        }
      },
      {
        path: "budget", component: ProjectBudgetComponent,
        data: {
          breadcrumb: 'Budget (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track project financial allocations, expenses, and completion status.'
        }
      },
      {
        path: "backlog", component: ProjectBacklogComponent,
        data: {
          breadcrumb: 'Scrum (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Plan and track tasks across sprints and stages.'
        }
      },
      { path: "sprints", component: PlaceholderImageComponent },
      { path: "timeline", component: PlaceholderImageComponent },
      {
        path: "assets",
        data: {
          breadcrumb: 'Assets (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Manage project equipment, machinery, and resource scheduling.'
        },
        children: [
          { path: "", component: ProjectAssetsComponent },
          { path: "sample", component: AssetsSchedulingComponent }, // or whatever the scheduling view is called
        ],
      },
      {
        path: "facilities",
        data: {
          breadcrumb: 'Facilities (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Manage project facilities and resource scheduling.'
        },
        children: [
          { path: "", component: ProjectFacilitiesComponent },
          {
            path: "facilities_sample",
            component: FacilitiesSchedulingComponent,
          }, // or whatever the scheduling view is called
        ],
      },
      {
        path: "expenses", component: ProjectExpensesComponent,
        data: {
          breadcrumb: 'Expenses (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track and manage all expense claims.'
        }
      },
      {
        path: "hours", component: ProjectHoursComponent,
        data: {
          breadcrumb: 'Hours (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track project time allocation and attendance.'
        }
      },
      { path: "timesheet1", component: PlaceholderImageComponent },
      { path: "timesheet2", component: PlaceholderImageComponent },
      { path: "sample", component: AssetsSchedulingComponent },
      {
        path: "todo", component: ProjectTodoComponent,
        data: {
          breadcrumb: 'To do (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track and manage project to-do items and assigned deliverables.'
        }
      },
      {
        path: "materials", component: ProjectMaterialsComponent,
        data: {
          breadcrumb: 'Materials (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track project material availability, allocations, and issue status.'
        }
      },
      {
        path: "resources", component: ProjectResourcesComponent,
        data: {
          breadcrumb: 'Resources (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track project resource scheduling, calendar allocations, and team assignments.'
        }
      },
      {
        path: "issues", component: ProjectIssuesComponent,
        data: {
          breadcrumb: 'Issues (NextGen Assembly Line-2026/MFG/011 )',
          description: 'Track and manage project issues, risk mitigations, and status.'
        }
      },
    ],
  },
];

@NgModule({
  declarations: [
    ProjectDashboardComponent,
    ProjectDocumentsComponent,
    ProjectNotesComponent,
    ProjectPhotosComponent,
    UploadDocumentComponent,
    AddReferralDocComponent,
    PlaceholderImageComponent,
    AddphotoPopComponent,
    ProjectAnalyticsComponent,
    ProjectOverviewComponent,
    ProjectTeamComponent,
    ProjectSetupComponent,
    ProjectScheduleComponent,
    ProjectBudgetComponent,
    ProjectAssetsComponent,
    AssetsSchedulingComponent,
    ProjectExpensesComponent,
    ProjectMaterialsComponent,
    AddRequisitionPopComponent,
    ProjectBacklogComponent,
    ProjectFacilitiesComponent,
    FacilitiesSchedulingComponent,
    ProjectHoursComponent,
    AddAssetPopComponent,
    AddFacilityPopComponent,
    EditBacklogTaskComponent,
    AddExpensePopComponent,
    AddHoursPopComponent,
    ProjectStagesComponent,
    AddstagesmoduleComponent,
    AddAssignmentComponent,
    ProjectTodoComponent,
    AddTodoPopComponent,
    ProjectResourcesComponent,
    AddResourcePopComponent,
    ProjectIssuesComponent,
    AddProjectIssuesPopComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule, // <-- ADDED TO IMPORTS ARRAY
    FormsModule,
    HighchartsChartModule,
    DragDropModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    DragulaModule,
  ],
})
export class ProjectDashboardModule { }
