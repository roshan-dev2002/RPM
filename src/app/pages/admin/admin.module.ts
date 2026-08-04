import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EscalationComponent } from './escalation/escalation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventLogComponent } from './event-log/event-log.component';
import { LookupComponent } from './lookup/lookup.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { SettingsComponent } from './settings/settings.component';
import { Routes, RouterModule } from '@angular/router';
import { AddLookupDialogComponent } from './lookup/add-lookup-dialog/add-lookup-dialog.component';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { CredentialsComponent } from './credentials/credentials.component';
import { AuditConfigComponent } from './audit-config/audit-config.component';
import { MasterdataComponent } from './masterdata/masterdata.component';
import { DistributorComponent } from './masterdata/distributor/distributor.component';
import { AddDistributorComponent } from './masterdata/distributor/add-distributor/add-distributor.component';
import { MDepartmentsComponent } from './masterdata/m-departments/m-departments.component';
import { MdataDeptsComponent } from '../setups/test-master-data/mdata-depts/mdata-depts.component';
import { AvailabilityComponent } from './availability/availability.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      { path: "", redirectTo: "manage-users", pathMatch: "full" },
      {
        path: "manage-users",
        component: ManageUserComponent,
        loadChildren: () =>
          import("./manage-user/manage-user.module").then((m) => m.ManageUserModule),
        data: { breadcrumb: 'Manage Users', description: 'This page is used to manage User' }
      },
      {
        path: "availability",
        component: AvailabilityComponent,
        loadChildren: () =>
          import("./availability/availability.module").then((m) => m.AvailabilityModule),
        data: { breadcrumb: 'Availability', description: 'This page is used to manage user availability' }
      },
      {
        path: "escalation",
        component: EscalationComponent,
        loadChildren: () =>
          import("./escalation/escalation.module").then((m) => m.EscalationModule),
        data: { breadcrumb: 'Escalation Matrix', description: 'Settings related to escalation are managed here.' }
      },
      {
        path: "settings",
        component: SettingsComponent,
        pathMatch: "full",
        data: { breadcrumb: 'Preferences', description: "Application settings are updated here." }
      },
      {
        path: "lookups",
        component: LookupComponent,
        pathMatch: "full",
        data: { breadcrumb: 'Dashboard', description: "Codes and Lookup options are managed here." }
      },
      {
        path: "departments",
        component: MdataDeptsComponent,
        pathMatch: "full",
        data: { breadcrumb: 'Departments', description: "The list of departments is managed here." }
      },
      {
        path: 'event-log',
        component: EventLogComponent,
        pathMatch: "full",
        data: { breadcrumb: 'Event Log', description: "Create, read, update and delete event across the application are logged here." }
      },
      {
        path: "audit-config",
        component: AuditConfigComponent,
        loadChildren: () =>
          import("./audit-config/audit-config.module").then((m) => m.AuditConfigModule),
        data: { breadcrumb: 'Audit Config', description: "Choices that appear in drop down select boxes are updated here." }
      },
      {
        path: 'credentials',
        component: CredentialsComponent,
        pathMatch: "full",
        data: { breadcrumb: 'Credentials', description: "This page is used to view Credentials" }
      }
    ]
  }
];

@NgModule({
  declarations: [
    AdminComponent,
    EventLogComponent,
    LookupComponent,
    SettingsComponent,
    AddLookupDialogComponent,
    CredentialsComponent,
    AuditConfigComponent,
    MasterdataComponent,
    MdataDeptsComponent,
    AvailabilityComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule,
    FormsModule
  ],
  providers: [DragulaService]
})
export class AdminModule { }
