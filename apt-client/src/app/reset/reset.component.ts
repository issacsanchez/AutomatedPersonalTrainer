import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from "@angular/router";
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  token: string;
  resetResult: string;
  reset_form: FormGroup;
  password: FormControl;
  credentials: TokenPayload = {
    token: ''
  };
  constructor(private route: ActivatedRoute, private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.route.params.subscribe( params => {
      this.token = params.token;
      console.log(this.token)
    });
  }
  createFormControls() {
    this.password = new FormControl('', [
      Validators.required,
    ]);
  }
  createForm() {
    this.reset_form = new FormGroup({
      password: this.password,
    });
  }
  reset() {
    if (this.reset_form.valid) {
      this.credentials.token = this.token;
      this.credentials.password = this.password.value;
      this.auth.reset(this.credentials).subscribe(msg => {
        this.resetResult = msg.msg;
        setTimeout((router: Router) => {
          this.router.navigate(['login']);
      }, 3000); 
      }, (err) => {
        console.error(err);
      });
    }
  }
}
