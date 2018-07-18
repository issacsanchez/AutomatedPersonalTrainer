import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  forgot_form: FormGroup;
  email: FormControl;
  credentials: TokenPayload = {
    email: ''
  };
  forgotResult: string;
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
  }
  createForm() {
    this.forgot_form = new FormGroup({
      email: this.email,
    });
  }
  forgot() {
    if (this.forgot_form.valid) {
      this.credentials.email = this.email.value;
      this.auth.forgot(this.credentials).subscribe(msg => {
        this.forgotResult = msg.msg;
      }, (err) => {
        console.error(err);
      });
    }
  }
}
