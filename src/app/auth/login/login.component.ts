import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { getUser, saveUser } from '../../../config/env.config';
import { UserEncService } from '../user-enc.service';

interface User {
  email: string;
  password: string;
}
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private userenc: UserEncService
  ) {}

  ngOnInit() {
    this.loader();
  }

  loader() {
    this.authService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  userLogin(event: Event) {
    event.preventDefault();
    const user: User = {
      email: this.email,
      password: this.password,
    };
    this.authService.setLoading(true);
    this.authService.login(user).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        this.toastr.success((res as any).message, 'Success');
        this.userenc.saveUser((res as any).user);
        this.authService.setLoading(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toastr.success((err as any).message, 'Error');
        this.authService.setLoading(false);
      },
    });
  }

  logUserdata() {
    const user = getUser().token;
    console.log('User data:', user);
  }
}
