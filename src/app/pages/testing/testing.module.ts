import { HighchartsChartModule } from 'highcharts-angular';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TestingIssuesComponent } from './testing-issues/testing-issues.component';
import { TestingProductsComponent } from './testing-products/testing-products.component';
import { TestingTestsComponent } from './testing-tests/testing-tests.component';
import { AddIssuesssComponent } from './testing-issues/add-issuesss/add-issuesss.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddProductsComponent } from './testing-products/add-products/add-products.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddTestsComponent } from './testing-tests/add-tests/add-tests.component';
import { TractorstatusComponent } from './tractorstatus/tractorstatus.component';
import { TeststatusComponent } from './teststatus/teststatus.component';
import { MasterdataComponent } from './masterdata/masterdata.component';
import { StatusConfirmationDialogComponent } from './testing-projects/add-projects/status-confirmation-dialog/status-confirmation-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TestdashboardComponent } from '../dashboard/testdashboard/testdashboard.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivityRpmComponent } from './activity/activity-rpm/activity-rpm.component';
import { RpmStagesComponent } from './rpm-stages/rpm-stages.component';
import { RpmTasksComponent } from './rpm-tasks/rpm-tasks.component';
import { GatesComponent } from './gates/gates.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RpmStagesWbsComponent } from './rpm-stages/rpm-stages-wbs/rpm-stages-wbs.component';
import { AddModuleComponent } from './rpm-stages/rpm-stages-wbs/add-module/add-module.component';
import { AddTaskComponent } from './rpm-tasks/add-task/add-task.component';
import { TestingKanbanComponent } from './testing-kanban/testing-kanban.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddTasksComponent } from './rpm-tasks/add-tasks/add-tasks.component';
import { RpmTodoComponent } from './rpm-todo/rpm-todo.component';
import { DragulaModule } from 'ng2-dragula';
import { AddStagePopComponent } from './rpm-stages/add-stage-pop/add-stage-pop.component';
import { ProcedurePopComponent } from './rpm-stages/rpm-stages-wbs/procedure-pop/procedure-pop.component';
import { StageGridcolumnComponent } from './rpm-stages/rpm-stages-wbs/procedure-pop/stage-gridcolumn/stage-gridcolumn.component';
import { de } from 'date-fns/locale';
import { EditTodoDialogComponent } from './rpm-todo/edit-todo-dialog/edit-todo-dialog.component';
import { RpmResourcesComponent } from './rpm-resources/rpm-resources.component';
import { AddResourcePopComponent } from './rpm-resources/add-resource-pop/add-resource-pop.component';
import { LoginGuard } from '../helpers/login.guard';

const routes: Routes = [
    { path: "", redirectTo: "test-dashboard", pathMatch: "full" },
    { path: 'test-dashboard', component: TestdashboardComponent, canActivate: [LoginGuard], data: { breadcrum: 'Radar' } },
    { path: 'issues', component: TestingIssuesComponent, data: { breadcrumb: 'Issues',
        description: 'Issues accross the projects are managed here.' } },
     
    { path: 'tractorstatus', component: TractorstatusComponent, data: { breadcrumb: 'Tractor Status' } },
    { path: 'teststatus', component: TeststatusComponent, data: { breadcrumb: 'Test Status' } },
    { path: 'activity', component: ActivityRpmComponent, data: { breadcrumb: 'Activity' } },
    {
        path: 'stages', component: RpmStagesComponent,
        data: {
            breadcrumb: 'Stages',
            description: 'The master list of stages / work break down structure (WBS) can be managed here.'
        }
    },
    { path: 'tasks', component: RpmTasksComponent, data: { breadcrumb: 'Tasks', description: 'The list of tasks can be managed here.' } },
    {
        path: 'stages/wbs', component: RpmStagesWbsComponent, data: {
            breadcrumb: 'Work Breakdown Structure (Fesibility-STG001)',
            description: 'The list of task for each module can be updated here.'
        }
    },
    {
        path: 'projects',
        loadChildren: () => import('./testing-projects/testing-projects.modules').then(m => m.TestingProjectsModule),
        // data: { breadcrumb: 'Projects' } 
    },
    { path: 'testing-kanban', component: TestingKanbanComponent, data: { breadcrumb: 'Kanban' } },
    { path: 'todo', component: RpmTodoComponent, 
        data: { breadcrumb: 'To do', description: 'The list of todo items are managed here.' } },
    { path: 'resources', component: RpmResourcesComponent, 
        data: { breadcrumb: 'Resources', description: 'Manage resource scheduling and allocation here.' } },
    {
        path: "gates",
        component: GatesComponent,
        loadChildren: () =>
            import("./gates/gates.module").then((m) => m.GatesModule),
        data: { breadcrumb: 'Gates', screenId: 4,
            description: 'The Gates and info about acceptance criteria at each gate is updated here.'
         }
    },
    {
        path: "testing-masterData", component: MasterdataComponent,
        loadChildren: () => import("./masterdata/masterdata.module").then((m) => m.MasterdataModule),
        data: { breadcrumb: 'Master Data', screenId: 4 }
    },
]

@NgModule({
    declarations: [
        TestingIssuesComponent,
        TestingProductsComponent,
        TestingTestsComponent,
        AddIssuesssComponent,
        AddProductsComponent,
        AddTestsComponent,
        TractorstatusComponent,
        TeststatusComponent,
        StatusConfirmationDialogComponent,
        TestdashboardComponent,
        ActivityRpmComponent,
        RpmStagesComponent,
        RpmTasksComponent,
        MasterdataComponent,
        RpmStagesWbsComponent,
        AddModuleComponent,
        AddTaskComponent,
        TestingKanbanComponent,
        AddTasksComponent,
        RpmTodoComponent,
        AddStagePopComponent,
        ProcedurePopComponent,
        StageGridcolumnComponent,
        EditTodoDialogComponent,
        RpmResourcesComponent,
        AddResourcePopComponent,
    ],
    exports: [
        RpmTasksComponent,
        TestingIssuesComponent,
        RpmTodoComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        NgxChartsModule,
        MatButtonModule,
        MatTooltipModule,
        MatCardModule,
        HighchartsChartModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        DragDropModule,
        DragulaModule.forRoot()
    ]
})
export class TestingModule { }