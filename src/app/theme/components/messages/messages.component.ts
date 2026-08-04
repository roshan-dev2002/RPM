import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessagesService]
})
export class MessagesComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  public selectedTab: number = 1;
  public messages: Array<any>;
  public notifications: Array<any>;
  public files: Array<any>;
  public meetings: Array<any>;

  constructor(private messagesService: MessagesService, private router: Router) {
    this.messages = messagesService.getMessages();
    this.notifications = messagesService.getNotifications();
    this.files = messagesService.getFiles();
    this.meetings = messagesService.getMeetings();
  }

  ngOnInit() {
  }

  openMessagesMenu() {
    if (this.trigger) {
      this.trigger.openMenu();
    }
    this.selectedTab = 0;
  }

  onMouseLeave() {
    if (this.trigger) {
      this.trigger.closeMenu();
    }
  }

  viewAllNotifications() {
    this.onMouseLeave();
    this.router.navigate(['/app/test-activity']);
  }

  stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

}
