
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';



import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';

import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};

import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { AppSettings } from './app.settings';
import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
//import { BoxChartModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErrorComponent } from './pages/error/error.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
//import { MatCardModule } from '@angular/material/card/card-module';
import { MatBadgeModule } from '@angular/material/badge';
// import { LogissueInnerForm2Component } from './pages/logissue-inner-form2/logissue-inner-form2.component';
import { LogissueInnerFormComponent } from './pages/logissue-inner-form/logissue-inner-form.component';
import exporting from 'highcharts/modules/exporting.src';
import windbarb from 'highcharts/modules/windbarb.src';
import { TestingComponent } from './pages/testing/testing.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { AddComplaintComponent } from './pages/complaints/add-complaint/add-complaint.component';
import { CapaComponent } from './pages/capa/capa.component';
import { AddCapaComponent } from './pages/capa/add-capa/add-capa.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { MeetingComponent } from './pages/meeting/meeting.component';

import { AddMeetingPageComponent } from './pages/meeting/add-meeting-page/add-meeting-page.component';
import { ReferenceNumberComponent } from './pages/reference-number/reference-number.component';
import { AddtractorsComponent } from './addtractors/addtractors.component';
import { AddtestsComponent } from './addtests/addtests.component';
import { MSectionsComponent } from './pages/admin/masterdata/m-sections/m-sections.component';
import { AddsecComponent } from './addsec/addsec.component';
import { FiletrCurrentStatusComponent } from './filetr-current-status/filetr-current-status.component';
import { SetupsComponent } from './pages/setups/setups.component';
import { AddupdsComponent } from './addupds/addupds.component';
import { AddattendanceComponent } from './addattendance/addattendance.component';
import { AddInterimComponent } from './add-interim/add-interim.component';
import { AddrcaComponent } from './addrca/addrca.component';
import { AddactsComponent } from './addacts/addacts.component';
import { EditissuesComponent } from './editissues/editissues.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ComplaintsdashboardComponent } from './pages/dashboard/complaintsdashboard/complaintsdashboard.component';
import { PopPieChartComponent } from './pages/dashboard/pop-pie-chart/pop-pie-chart.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MDepartmentsComponent } from './pages/admin/masterdata/m-departments/m-departments.component';
import { KanbanComponent } from './pages/complaints/kanban/kanban.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MeetingrefComponent } from './meetingref/meetingref.component';
import { AgendadetailsComponent } from './agendadetails/agendadetails.component';
import { DragulaModule } from 'ng2-dragula';
import { SqmComponent } from './pages/sqm/sqm.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { TestingModule } from './pages/testing/testing.module';
 
 
 



export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [exporting, windbarb];
}


@NgModule({
  imports: [
    TestingModule,


    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    AppRoutingModule,
    NgxChartsModule,
    //BoxChartModule,
    //NgxChartsModule,
    FlexLayoutModule,
    MatCardModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    DragDropModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    PerfectScrollbarModule,
    MatBadgeModule,
    HighchartsChartModule,
    ChartModule,
    NgxChartsModule,

DragulaModule.forRoot()

  ],
  declarations: [
    AppComponent,
    ErrorComponent,
    PagesComponent,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    //LogissueInnerForm2Component,
    LogissueInnerFormComponent,
    TestingComponent,
    ComplaintsComponent,
    AddComplaintComponent,
    CapaComponent,
    AddCapaComponent,
    AttendanceComponent,
    MeetingComponent,

    AddMeetingPageComponent,
    ReferenceNumberComponent,
    AddtractorsComponent,
    AddtestsComponent,

    MSectionsComponent,
    AddsecComponent,
    FiletrCurrentStatusComponent,
    SetupsComponent,
    AddupdsComponent,
    AddattendanceComponent,
    AddInterimComponent,
    AddrcaComponent,
    AddactsComponent,
    EditissuesComponent,
    DashboardComponent,
    ComplaintsdashboardComponent,
    PopPieChartComponent,
    KanbanComponent,
    MeetingrefComponent,
    AgendadetailsComponent,
    SqmComponent,
    ActivityComponent,
 
 
     
    








  ],
  providers: [
    AppSettings,
    // { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
