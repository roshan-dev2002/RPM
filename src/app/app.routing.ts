import { LogissueInnerFormComponent } from './pages/logissue-inner-form/logissue-inner-form.component';
//import { LogissueInnerFormComponent } from './pages/parameter-dashboard/par-auditlog/logissue-inner-form/logissue-inner-form.component';
//import { LogissueInnerForm2Component } from './pages/logissue-inner-form2/logissue-inner-form2.component';
import { PrtsAddgridComponent } from './pages/prts-addgrid/prts-addgrid.component';
import { ParameterDashboardComponent } from './pages/parameter-dashboard/parameter-dashboard.component';
import { ChecklistDashboardComponent } from './pages/checklist-dashboard/checklist-dashboard.component';
//import { RadarComponent } from './pages/analytics/radar/radar.component';
import { SetupComponent } from './pages/setup/setup.component';
//import { NewAuditsComponent } from './pages/new-audits/new-audits.component';
//import { AuditsModule } from './pages/audits/audits.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { ErrorComponent } from './pages/error/error.component';
//import { AuditsComponent } from './pages/audits/audits.component';
import { RadarComponent } from './pages/radar/radar.component';
import { SubjectiveAuditsComponent } from './pages/subjective-audits/subjective-audits.component';
import { ObjectiveAuditsComponent } from './pages/objective-audits/objective-audits.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PrtsOnePagerComponent } from './pages/prts-one-pager/prts-one-pager.component';
import { GridPrtsComponent } from './pages/prts/grid-prts/grid-prts.component';
import { PrtsComponent } from './pages/prts/prts.component';
import { PrtsPart1Component } from './pages/prts-part/prts-part.component';
import { TestingComponent } from './pages/testing/testing.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { AddComplaintComponent } from './pages/complaints/add-complaint/add-complaint.component';
import { CapaComponent } from './pages/capa/capa.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { MeetingComponent } from './pages/meeting/meeting.component';
import { AddMeetingPageComponent } from './pages/meeting/add-meeting-page/add-meeting-page.component';
import { ReferenceNumberComponent } from './pages/reference-number/reference-number.component';
import { TestdashboardComponent } from './pages/dashboard/testdashboard/testdashboard.component';
import { SetupsComponent } from './pages/setups/setups.component';
import { ComplaintsdashboardComponent } from './pages/dashboard/complaintsdashboard/complaintsdashboard.component';
import { KanbanComponent } from './pages/complaints/kanban/kanban.component';
import { GatesModule } from './pages/testing/gates/gates.module';
import { SqmComponent } from './pages/sqm/sqm.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { LoginGuard } from './pages/helpers/login.guard';


const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    {
        path: 'app',
        component: PagesComponent,
        canActivate: [LoginGuard],
        children: [

            { path: '', redirectTo: 'test-dashboard', pathMatch: 'full' },

            {
                path: "test-dashboard",
                component: TestdashboardComponent,
                data: {
                    breadcrumb: 'RPM Dashboard',
                    description: 'This is a System Dashboard with details of metrics, trends, and distribution across the system'
                }
            },
            {
                path: "test-activity",
                component: ActivityComponent,
                data: {
                    breadcrumb: 'Tasks',
                    description: 'The list of tasks can be managed here.'
                }
            },
            {
                path: 'inne@r-form', component: LogissueInnerFormComponent,
                data: { breadcrumb: 'Issuelog', description: 'This page is used to display the Issue Log' }
            },
            {
                path: 'client-login', loadChildren: () =>
                    import("./pages/client-login/client-login.module").then((m) => m.ClientLoginModule),
                data: { breadcrumb: 'Client Login' }
            },
            {
                path: 'Comp@leints', loadChildren: () =>
                    import("./pages/complaints/complaints.module").then((m) => m.ComplaintsNewModule),
                data: { breadcrumb: 'Client Login' }
            },


            {
                path: 'admin', loadChildren: () =>
                    import("./pages/admin/admin.module").then((m) => m.AdminModule),
                data: { breadcrumb: 'Admin' }
            },


            {
                path: 'supplier', loadChildren: () =>
                    import("./pages/admin/admin.module").then((m) => m.AdminModule),
                data: { breadcrumb: 'Admin' }
            },


            {
                path: 'dash@board', component: DashboardComponent,
                data: { breadcrumb: 'Audit Dashboard' }
            },

            {
                path: 'testing', component: TestingComponent,
                loadChildren: () => import("./pages/testing/testing.module").then((m) => m.TestingModule),
                data: { breadcrumb: 'Projects', description: 'Projects can be created and managed on this screen click on the project code to see detailed dashboard.' }
            },
            {
                path: 'sq@m', component: SqmComponent,
                loadChildren: () => import("./pages/sqm/sqm.module").then((m) => m.SqmModule),
                data: { breadcrumb: 'Dashboard', hideBreadcrumb: true }
            },

            {
                path: 'com@plaints', component: ComplaintsComponent,
                data: { breadcrumb: 'Complaints' }
            },
            {
                path: 'com@plaints/complaintsdashboard', component: ComplaintsdashboardComponent,
                data: { breadcrumb: 'Complaints Dashboard' }
            },
            {
                path: 'comp@laints/add-complaints', component: AddComplaintComponent,
                data: { breadcrumb: ' Add Complaints' }
            },
            {
                path: 'comp@laints/capa', component: CapaComponent,
                data: { breadcrumb: 'CAPA' }
            },
            {
                path: 'comp@laints/attendance', component: AttendanceComponent,
                data: { breadcrumb: 'Attendance' }
            },
            {
                path: 'compl@aints/kanban', component: KanbanComponent,
                data: { breadcrumb: 'Kanban' }
            },
            {
                path: 'compl@aints/meeting', component: MeetingComponent,
                data: { breadcrumb: 'Meeting' }
            },
            {
                path: 'com@plaints/meeting/add', component: AddMeetingPageComponent,
                data: { breadcrumb: 'Add Meeting' }
            },

            {
                path: 'set@ups',
                loadChildren: () => import("./pages/setups/setups.module").then((m) => m.TestingModule),
                data: { breadcrumb: 'Setup' }
            },

            {
                path: 'compla@ints/reference-number', component: ReferenceNumberComponent,
                loadChildren: () => import("./pages/reference-number/reference-number.module").then((m) => m.ReferenceModule),
                data: { breadcrumb: 'Base info' }
            },


            {
                path: 'checkl@istdoard', component: ChecklistDashboardComponent, loadChildren: () =>
                    import('./pages/checklist-dashboard/checklist-dashboard.module').then((m) => m.ChecklistDashboardModule),
                data: { breadcrumb: 'Subjective Audit', description: 'Audits throught the application are managed here.' }
            },

            {
                path: 'prt@sonepager', component: PrtsOnePagerComponent, loadChildren: () =>
                    import("./pages/prts-one-pager/prts-one-pager.module").then((m) => m.PrtsOnePagerModule),


            },
            // {
            //     path: 'new-au@dits', component: NewAuditsComponent, loadChildren: () =>
            //         import('./pages/new-audits/new-audits.module').then((m) => m.NewAuditsModule),
            //     data: { breadcrumb: 'Audit' }
            // },
            {
                path: 'subje@ctive-audits', component: SubjectiveAuditsComponent, loadChildren: () =>
                    import('./pages/subjective-audits/subjective-audits.module').then((m) => m.SubjectiveAuditsModule),

            },
            {
                path: 'objec@tive-audits', component: ObjectiveAuditsComponent, loadChildren: () =>
                    import('./pages/objective-audits/objective-audits.module').then((m) => m.ObjectiveAuditsModule),

            },

            {
                path: 'setup', component: SetupComponent, loadChildren: () =>
                    import("./pages/setup/setup.module").then((m) => m.SetupModule),
                data: { breadcrumb: 'Setup' }
            },

            {
                path: 'rad@ar1', component: RadarComponent, loadChildren: () =>
                    import("./pages/radar/radar.module").then((m) => m.RadarModule),

                data: { breadcrumb: 'Home' }
            },

            {
                path: 'p@rts', component: GridPrtsComponent, loadChildren: () =>
                    import("./pages/prts/prts.module").then((m) => m.PrtsModule),


            },
            {

                path: 'prts@-grid', component: PrtsAddgridComponent, loadChildren: () =>
                    import("./pages/prts-addgrid/prts-addgrid.module").then((m) => m.PrtsAddgridModule),


            },

            {
                path: 'prtsn@avbar', component: PrtsComponent, loadChildren: () =>
                    import("./pages/prts/prts.module").then((m) => m.PrtsModule),


            },
            {
                path: 'prts-part', component: PrtsPart1Component, loadChildren: () =>
                    import("./pages/prts-part/prts-part.module").then((m) => m.PrtsPartModule),


            },

            {
                path: 'parameterboard', component: ParameterDashboardComponent, loadChildren: () =>
                    import("./pages/parameter-dashboard/parameter-dashboard.module").then((m) => m.ParameterDashboardModule),
                data: { breadcrumb: 'Objective Audit', description: 'Audits throught the application are managed here.' }
            },
            {
                path: 'gates',
                loadChildren: () => import('./pages/testing/gates/gates.module').then(m => m.GatesModule)
                // use whichever path actually exists on disk
            },
            // Add this inside the { path: 'app', component: PagesComponent, children: [ ... ] } array
            {
                path: 'inner@-screens',
                loadChildren: () => import('./pages/inner-screens/inner-screens.module').then(m => m.InnerScreensModule),
                data: { breadcrumb: 'Inner Screens', hideBreadcrumb: true }
            },





        ]
    },

    { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
    {
        path: 'error', component: ErrorComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
            relativeLinkResolution: 'legacy',
        })
    ],
    exports: [
        RouterModule,

    ]
})
export class AppRoutingModule { }

