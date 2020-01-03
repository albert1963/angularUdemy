import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy{
  isAuthenticated = false;
  private authSubscription: Subscription;
  constructor(private authServ: AuthService) { }

  ngOnInit() {
    this.isAuthenticated = this.authServ.getIsAuth();
    this.authSubscription = this.authServ.getAuthStatusListener().subscribe(
      (status) => {
          this.isAuthenticated = status;
        }
        );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onLoggout() {
    this.authServ.loggout();
  }

}
