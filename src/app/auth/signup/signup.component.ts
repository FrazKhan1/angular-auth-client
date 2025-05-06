import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loader();
  }

  loader() {
    this.authService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  userRegister(event: Event) {
    event.preventDefault();
    const user: User = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };
    this.authService.setLoading(true);
    this.authService.signUp(user).subscribe({
      next: (res) => {
        this.toastr.success((res as any).message, 'Success');
        this.authService.setLoading(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error((err as any).error.message, 'Error');
        this.authService.setLoading(false);
      },
    });
  }
}
