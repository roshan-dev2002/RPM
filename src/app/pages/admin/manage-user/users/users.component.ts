import { UserAudittypeComponent } from './user-audittype/user-audittype.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { MenuService } from 'src/app/theme/components/menu/menu.service';
import { environment } from 'src/environments/environment';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ProjPermComponent } from './proj-perm/proj-perm.component';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';
import { ManagerDialogComponent } from './manager-dialog/manager-dialog.component';
import { admindata } from '../../admindata';
import { JobCodesPopComponent } from './job-codes-pop/job-codes-pop.component';
import { UserLocationsPopComponent } from './user-locations-pop/user-locations-pop.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {


  clickEventSubscription: Subscription;

  access = {
    btCreate: false,
    btRead: false,
    btUpdate: false,
    btDelete: false
  };
  tableList: Object[] = [];
  alltableListLookup: any;
  public pageSize = parseInt(localStorage.getItem('settings') ? localStorage.getItem('settings') : '10');
  public currentPage = 0;
  public totalSize = 0;
  tableListLookup = [];
  public allReports: Array<any> = [];
  sortedData = [];
  filteredAlerts = [];
  status = [{ id: 1, value: "Active" }, { id: 2, value: "Inactive" }];
  Status = [{ name: 'Active', value: true }, { name: "Inactive", value: false }];
  filterForm: FormGroup;
  filteredUsers = [];

  public popoverTitle: string = 'Confirm Delete';
  public popoverMessage: string = 'Are you sure you want to delete this.?';
  public popoverStatusTitle: string = 'Confirm Status Change';
  public popoverStatusMessage: string = 'Are you sure you want to change status.?';
  public cancelClicked: boolean = false;
  public popoversendMessage: 'Are you sure you want to send.?'
  public popoversendTitle: string = 'Confirm Delete';

  allRoles: any;
  filterToggle: boolean;
  public searchText: string;
  public page: any;
  allUsers: any = [];
  userData: any = [];
  roleId: any;
  private _activeRoute: any;
  service: any;
  alertService: any;
  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,
    public titleService: Title, public _menuService: MenuService,) {
    this.sortedData = this.users.slice();
    this.filterForm = this.fb.group({
      Status: new FormControl(null),
      Keyword: new FormControl('',),
      Department: new FormControl(null),
      Role: new FormControl(null)

    });
  }
  public setTitle(newTitle: string) {
    // this.titleService.setTitle(newTitle);
  }
  users = [

  ];

  userss = [
    { name: 'Satya', managers: 1, email: 'spaswan383@gmail.com', phone: '7070936188', agency: 'R & D', department: 'Engineering', group: 'Assembly Group', site: 'Pune Manufacturing Facility', section: 'Chassis Section', role: 'Group Leader', cft: false, auditor: true, webAccess: true, mobileAccess: false, managerialRole: true, auditTypes: 19, twoFactor: false, resetPassword: true, status: 'Active', job: '3/40', locations: '6/10', workhours: '8-10' },
    { name: 'Pavan Kalyan', managers: 3, email: 'pavankalyan@gmail.com', phone: '9347153602', agency: 'Engineering', department: 'Quality', group: 'Quality Group', site: 'Chennai Engine Unit', section: 'Inspection Section', role: 'Group Leader', cft: true, auditor: true, webAccess: true, mobileAccess: true, managerialRole: false, auditTypes: 36, twoFactor: false, resetPassword: true, status: 'Active', job: '7/40', locations: '4/10', workhours: '8-10' },
    { name: 'Gaurav', managers: 1, email: 'gvrav@gmail.com', phone: '7894444444', agency: 'Engineering', department: 'R&D', group: 'Engineering Group', site: 'Bengaluru R&D Hub', section: 'CAD Section', role: 'Shop Head', cft: false, auditor: false, webAccess: true, mobileAccess: true, managerialRole: false, auditTypes: 0, twoFactor: false, resetPassword: true, status: 'Active', job: '6/40', locations: '6/10', workhours: '8-10' },
    { name: 'Ayush', managers: 1, email: 'ak@gmail.com', phone: '1234563213', agency: 'Inspection', department: 'EHS', group: 'EHS & Safety Group', site: 'Hosur Proving Grounds', section: 'Safety Section', role: 'General Manager', cft: false, auditor: true, webAccess: true, mobileAccess: true, managerialRole: false, auditTypes: 0, twoFactor: false, resetPassword: true, status: 'Active', job: '22/40', locations: '7/10', workhours: '8-10' },
    { name: 'Santosh', managers: 1, email: 'santosh@gmail.com', phone: '9878998887', agency: 'R & D', department: 'Supply Chain', group: 'Supply Chain Group', site: 'Gurugram Spares Depot', section: 'Logistics Section', role: 'Test', cft: false, auditor: true, webAccess: true, mobileAccess: true, managerialRole: false, auditTypes: 19, twoFactor: false, resetPassword: true, status: 'Active', job: '32/40', locations: '4/10', workhours: '8-10' }
  ]
  Departments = [
    { value: 'Developer', name: 'Developer' },
    { value: 'Test', name: 'Test' },
    { value: 'QA', name: 'QA' },
    //  { value: 'Admin', name: 'Admin' }
  ];
  Roles = [
    { value: 'Shop Head', name: 'Shop Head' },
    { value: 'Test', name: 'Test' },
    { value: 'General Manager', name: 'General Manager' },
    { value: 'Group Leader', name: 'Group Leader' }
  ];




  ngOnInit() {
    // Set totalSize from mock users list
    if (this.userss && this.userss.length) {
      this.totalSize = this.userss.length;
    }
    if (environment.mode == 1) {
      this.users = admindata.user();
    }
  }

  getallusers() {
    this.service.GetAllUsers().subscribe(data => {
      if (data != null) {
        this.users = data['Data'];
        this.sortedData = this.users.slice();
        this.bindData(data['Data']);
      }
    });
  }

  deleteUser(data: any) {
    var list = {
      UserId: data.UserId,
      result: null
    };

    this.service.DeleteUser(list).subscribe(data => {
      // console.log(data);
      this.getallusers();
      this.alertService.createAlert('User Deleted Successfully', 1);
    });
  }

  changestatus(data: any) {
    var list = {
      UserId: data.UserId
    };
    this.service.ChangeUserStatus(list).subscribe(res => {
      // console.log(data);
      this.getallusers();
    })
    this.alertService.createAlert('User Status Changed Successfully', 1);
  }

  openEditDialog(item) {
    let dialogRef = this.dialog.open(EditUserComponent, {
      data: item,
      height: 'auto',
      width: '850px'
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log(data, "data")
      if (data) {
        if (data === "SAVE") {
          this.getallusers();
        } else if (data.action === "SAVE") {
          if (item) {
            item.name = data.values.UserName;
            item.email = data.values.UserEmail;
            item.phone = data.values.UserPhone;
            const foundRole = [
              { RoleName: "Data Collector", RoleId: 1 },
              { RoleName: "Field Coordinator", RoleId: 2 },
              { RoleName: "Field Monitor", RoleId: 3 },
              { RoleName: "Supervisors", RoleId: 4 },
              { RoleName: "Business Analyst", RoleId: 5 }
            ].find(r => r.RoleId === data.values.RoleId);
            item.role = foundRole ? foundRole.RoleName : 'Group Leader';
          } else {
            const foundRole = [
              { RoleName: "Data Collector", RoleId: 1 },
              { RoleName: "Field Coordinator", RoleId: 2 },
              { RoleName: "Field Monitor", RoleId: 3 },
              { RoleName: "Supervisors", RoleId: 4 },
              { RoleName: "Business Analyst", RoleId: 5 }
            ].find(r => r.RoleId === data.values.RoleId);
            const newUser = {
              name: data.values.UserName,
              managers: 1,
              email: data.values.UserEmail,
              phone: data.values.UserPhone,
              agency: 'Engineering',
              department: 'Developer',
              role: foundRole ? foundRole.RoleName : 'Group Leader',
              cft: false,
              auditor: false,
              webAccess: true,
              mobileAccess: false,
              managerialRole: false,
              auditTypes: 0,
              twoFactor: false,
              resetPassword: true,
              status: 'Active',
              job: '0/40',
              locations: '0/10',
              workhours: '8-10',
              group: '',
              site: '',
              section: ''
            };
            this.userss.push(newUser);
          }
        }
      }
    });
  }
  onpermclick(item) {
    this.router.navigate(['admin/manage-users/permission/' + item.RoleId]);
  }
  openResetPassword(item) {
    let dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      data: item,
      height: 'auto',
      width: '550px'
    });
    dialogRef.afterClosed().subscribe(data => {
      this.getallusers();
    });
  }

  openProjectPermissions() {
    let dialogRef = this.dialog.open(ProjPermComponent, {
      data: null,
      height: 'auto',
      width: '600px'
    });
  }

  openManagersDialog() {
    let dialogRef = this.dialog.open(ManagerDialogComponent, {
      data: null,
      height: 'auto',
      width: '350px'
    });
  }


  audit() {
    let dialogRef = this.dialog.open(UserAudittypeComponent, {
      data: null,
      height: 'auto',
      width: '600px'
    });

  }

  public bindData(data) {
    //this.allRoles = data['RolesList'];
    this.allRoles = data;
    this.filter();
  }

  filter() {
    console.log(this.filterForm.value);
    this.filteredUsers = this.allRoles;
    let keyword = this.filterForm.controls['Keyword'].value;
    let status = this.filterForm.controls['Status'].value;

    if (keyword != null && keyword != '') {
      this.filteredUsers = this.filteredUsers.filter(function (item) {
        return JSON.stringify(item).toLowerCase().includes(keyword.toLowerCase());
      });
    }
    if (status != null) {
      this.filteredUsers = this.filteredUsers.filter(x => x['IsActive'] == status);
    }

    this.users = this.filteredUsers.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize);
    this.totalSize = this.filteredUsers.length;
    this.sortedData = this.users.slice();
  }

  clearFilter() {
    this.filterForm.reset();
    this.getallusers();
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    if (this.userss && this.userss.length) {
      this.totalSize = this.userss.length;
    }
  }

  // delete pop-up
  deleteConfirmation(applicant: any) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { component: null, title: 'Delete Confirmation', content: 'Are you sure you want to Delete?', isConfirmation: true }
    });
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          this.userss = this.userss.filter(u => u !== applicant);
          this.totalSize = this.userss.length;
        }
      }
    );
  }

  // Active/InActive pop-up
  Confirmation() {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      data: { component: null, title: 'Change Status', content: 'Are you sure you want to Change the Status ?', isConfirmation: true }
    });
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data) {
        }
      }
    );
  }

  scrollGrid(side: 'left' | 'right') {
    const ele = document.getElementById('grid-table-container');
    const scrollAmount = 210; // Adjust this value as needed

    if (ele) {
      // Check if ele is not null
      if (side === 'right') {
        ele.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        ele.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  }











  openjobpop() {
    this.dialog.open(JobCodesPopComponent, {
      data: null,
      height: 'auto',
      width: '1200px'
    });

  }

  openlocationpop() {
    this.dialog.open(UserLocationsPopComponent, {
      data: null,
      height: 'auto',
      width: '600px'
    });

  }

}
