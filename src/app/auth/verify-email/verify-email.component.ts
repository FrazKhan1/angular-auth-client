import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserEncService } from '../user-enc.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private userenc: UserEncService
  ) {}

  isLoading: boolean = false;

  ngOnInit() {
    this.verifyUser();
    this.loader();
  }

  loader() {
    this.authService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  verifyUser() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: (res) => {
          this.toastr.success((res as any).message, 'Success');
          this.userenc.saveUser((res as any).user);
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
}
