import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { users } from '../helpers/data';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public settings: any;

  passwordType: string = 'password';
  passwordShown: boolean = true;
  alertService: any;
  data: any[] = users;

  constructor(public appSettings: AppSettings, public fb: FormBuilder, public router: Router, public dialog: MatDialog) {
    this.settings = this.appSettings.settings;
    this.form = this.fb.group({
      'email': ['admin@optionmatrix.com', Validators.compose([Validators.required, emailValidator])],
      'password': ['admin@123', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
    localStorage.clear();
    sessionStorage.clear();
  }

  public togglePassword() {
    this.passwordType = this.passwordType == 'text' ? 'password' : 'text';
  }

  public onSubmit(values) {
    console.log(values);
    if (this.form.valid) {
      let userToken = btoa(encodeURIComponent(values.email || 'admin@optionmatrix.com'));
      sessionStorage.setItem('userToken', userToken);
      sessionStorage.setItem('userType', 'admin');
      sessionStorage.setItem('isClient', JSON.stringify(false));
      localStorage.setItem('userToken', userToken);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('isClient', JSON.stringify(false));
      this.router.navigate(['/app']);
    }
  }

  openRegistrationDialog() {
    this.dialog.open(LoginComponent, {
      height: 'auto',
      width: '600px'
    });
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
    localStorage.setItem('userType', '');
  }
}
