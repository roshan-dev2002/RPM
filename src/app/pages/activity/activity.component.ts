import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../theme/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  activeTab: 'Tasks' | 'Issues' | 'ToDo' = 'Tasks';

  constructor() { }

  ngOnInit(): void {
    this.updateBreadcrumb(this.activeTab);
  }

  setTab(tab: 'Tasks' | 'Issues' | 'ToDo'): void {
    this.activeTab = tab;
    this.updateBreadcrumb(tab);
  }

  updateBreadcrumb(tab: 'Tasks' | 'Issues' | 'ToDo'): void {
    if (tab === 'Tasks') {
      BreadcrumbComponent.update$.next({
        header: 'Activity > Tasks',
        description: 'The list of tasks can be managed here.'
      });
    } else if (tab === 'Issues') {
      BreadcrumbComponent.update$.next({
        header: 'Activity > Issues',
        description: 'Issues accross the projects are managed here.'
      });
    } else if (tab === 'ToDo') {
      BreadcrumbComponent.update$.next({
        header: 'Activity > To do',
        description: 'The list of todo items are managed here.'
      });
    }
  }

}
