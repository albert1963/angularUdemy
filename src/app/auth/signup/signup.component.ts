import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  submit = 0;
  constructor(private authserv: AuthService) { }

  ngOnInit() {
  }
  onSignup(form: NgForm){
    this.submit = 1;

    if (form.valid) {
      this.authserv.createUser(form.value.email, form.value.pwd,form);

      this.submit = 0;
    }
  }

}
