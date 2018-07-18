import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login_form: FormGroup;
  email: FormControl;
  password: FormControl;
  credentials: TokenPayload = {
    email: '',
    password: ''
  };
  
  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }
  createFormControls() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('[^ @]*@[^ @]*')
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]);
  }
  createForm() {
    this.login_form = new FormGroup({
      email: this.email,
      password: this.password
    });
  }
  login() {
    if (this.login_form.valid) {
      this.credentials.email = this.email.value;
      this.credentials.password = this.password.value;
      this.auth.login(this.credentials).subscribe(() => {
        this.router.navigateByUrl('/profile');
      }, (err) => {
        console.log(err);
      });
    }
  }

}
