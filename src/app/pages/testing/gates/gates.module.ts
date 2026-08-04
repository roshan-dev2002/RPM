import { Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { GatesComponent } from './gates.component';
import { GateFeasibilityComponent } from './gate-feasibility/gate-feasibility.component';
import { GateDesignComponent } from './gate-design/gate-design.component';
import { GatePrototypingComponent } from './gate-prototyping/gate-prototyping.component';
import { GateTestingComponent } from './gate-testing/gate-testing.component';
import { GateLaunchComponent } from './gate-launch/gate-launch.component';
import { GateImplimentationComponent } from './gate-implimentation/gate-implimentation.component';
import { DragulaModule } from "ng2-dragula";
import { AddcriteriaComponent } from './addcriteria/addcriteria.component';
import { AddGateComponent } from './add-gate/add-gate.component';
import { GridcolumnFeasibilityComponent } from './gate-feasibility/gridcolumn-feasibility/gridcolumn-feasibility.component';
import { GridcolumnDesignComponent } from './gate-design/gridcolumn-design/gridcolumn-design.component';
import { GridcolumnImplimentationComponent } from './gate-implimentation/gridcolumn-implimentation/gridcolumn-implimentation.component';
import { GridcolumnLaunchComponent } from './gate-launch/gridcolumn-launch/gridcolumn-launch.component';
import { GridcolumnPrototypingComponent } from './gate-prototyping/gridcolumn-prototyping/gridcolumn-prototyping.component';
import { GridcolumnTestingComponent } from './gate-testing/gridcolumn-testing/gridcolumn-testing.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const routes: Routes = [
    {
        path: '',
        component: GatesComponent,
        children: [
            {
                path: 'feasibility', component: GateFeasibilityComponent, data: {
                    breadcrumb: 'Feasibility',
                    description: 'The list of acceptance criteria along with priority are managed here.'
                }
            },
            { path: 'design', component: GateDesignComponent, data: { breadcrumb: 'Design', description: 'Design phase acceptance criteria and management.' } },
            { path: 'prototyping', component: GatePrototypingComponent, data: { breadcrumb: 'Prototyping', description: 'Prototyping phase acceptance criteria and management.' } },
            { path: 'testing', component: GateTestingComponent, data: { breadcrumb: 'Testing', description: 'Testing phase acceptance criteria and management.' } },
            { path: 'launch', component: GateLaunchComponent, data: { breadcrumb: 'Launch', description: 'Launch phase acceptance criteria and management.' } },
            { path: 'implementation', component: GateImplimentationComponent, data: { breadcrumb: 'Implementation', description: 'Implementation phase acceptance criteria and management.' } },
        ]
    },
]

@NgModule({
    declarations: [
        GatesComponent,
        GateFeasibilityComponent,
        GateDesignComponent,
        GatePrototypingComponent,
        GateTestingComponent,
        GateLaunchComponent,
        GateImplimentationComponent,
        AddcriteriaComponent,
        AddGateComponent,
        GridcolumnFeasibilityComponent,
        GridcolumnDesignComponent,
        GridcolumnImplimentationComponent,
        GridcolumnLaunchComponent,
        GridcolumnPrototypingComponent,
        GridcolumnTestingComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatPaginatorModule,
        MatCardModule,
        MatSelectModule,
        MatRadioModule,
        DragulaModule,
        DragDropModule
    ],
    providers: []
})
export class GatesModule { }