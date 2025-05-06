import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';
import { UserEncService } from './auth/user-enc.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'client';
  user: any = null;

  private userSubscription!: Subscription;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private userService: UserEncService,
  ) {}

  ngOnInit() {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  

  isLoggedIn(): boolean {
    return this.cookieService.check('user');
  }
  logout() {
    this.cookieService.delete('user');
    this.router.navigate(['/login']);
  }
}
