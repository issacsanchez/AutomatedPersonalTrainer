import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  register_form: FormGroup;
  name: FormControl;
  email: FormControl;
  password: FormControl;
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }
  createFormControls() {
    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]);
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
    this.register_form = new FormGroup({
      name: this.name,
      email: this.email,
      password: this.password
    });
  }
  register() {
    if (this.register_form.valid) {
      this.credentials.name = this.name.value;
      this.credentials.email = this.email.value;
      this.credentials.password = this.password.value;
      this.auth.register(this.credentials).subscribe(() => {
        this.router.navigateByUrl('/profile');
      }, (err) => {
        console.log(err);
      });
    }
  }
}
