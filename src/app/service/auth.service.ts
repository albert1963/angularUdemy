import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private token: any;
 private isAuth = false;
 private tokenTimer: any;
  constructor(private http: HttpClient, private router: Router) { }
 private authStatusListener = new Subject<boolean>();
  createUser(email: string, password: string, form) {
    let user = {email: email, password: password};

    this.http.post(environment.backenUrl + 'Users', user).subscribe(
      (success) => {
        form.resetForm();
        this.router.navigate(['/']);

      });
  }

  loginUser(email: string, password: string){
    let user = {email: email, password: password};

    this.http.post(environment.backenUrl + 'Users/login', user).subscribe(
      (success: any) => {
        this.isAuth = true;
        if(success){
          const expireIn = success.ttl;
           this.setAuthTimer(expireIn);
          this.token = success.id;
          this.authStatusListener.next(true);
          const now = new Date();
          const expiresDate = new Date(now.getTime() + expireIn * 1000);
          this.saveAuthData(success.id, expiresDate, success.userId);
          this.router.navigate(['/']);
        }

      });
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuth;
  }
  loggout() {
    this.isAuth = false;
    this.token = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.removeAuthData();
    this.router.navigateByUrl('/login');
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.loggout();
    }, duration * 1000);
  }
  autoAuthUser() {
   const authInformation = this.getAuthData();
   if(!authInformation){
     return;
   }
   const now = new Date();
   const expireIn = authInformation.expirationDate.getTime() - now.getTime();

   if (expireIn > 0){
     this.token = authInformation.token;
     this.isAuth = true;
     this.setAuthTimer(expireIn / 1000);
     this.authStatusListener.next(true);
   }
  }

  private saveAuthData (token, expirationDate: Date, userId) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private removeAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

   getAuthData(){
    const token = localStorage.getItem('token');
    const expireDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (!token || !expireDate) {
      return;
    }
      return {
        token: token,
        expirationDate: new Date(expireDate),
        userId: userId
      };
  }
}
