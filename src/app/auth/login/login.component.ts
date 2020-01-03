import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submit = 0;
  constructor(private authserv: AuthService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm){
    this.submit = 1;

    if (form.valid){
      this.authserv.loginUser(form.value.email, form.value.pwd);
      form.resetForm();
      this.submit = 0;
    }
  }

}
