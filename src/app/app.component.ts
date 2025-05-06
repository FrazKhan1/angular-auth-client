import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  username: string = '';

  constructor(private cookieService: CookieService, private router: Router , private userService: UserEncService) { }
  
  ngOnInit() {
    this.loadUser()

  }

  loadUser() {
    const user = this.userService.getUser();
    if (user) {
      this.username = user.firstName + ' ' + user.lastName;
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
