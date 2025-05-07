import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserEncService } from '../auth/user-enc.service';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  constructor(
    private userService: UserEncService,
    private authService: AuthService,
    private toastr: ToastrService,
    private userenc: UserEncService
  ) {}
  profile: any;
  isLoading: boolean = false;
  imageUrl: string = '';

  loader() {
    this.authService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  ngOnInit() {
    this.userenc.user$.subscribe((user) => {
      if (user) {
        this.profile = { ...user };
        if (user.profileImage) {
          this.imageUrl = user.profileImage;
        }
      }
    });
    this.loader();
  }
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  onSubmit() {
    this.authService.setLoading(true);
    const formData = new FormData();
  
    formData.append('firstName', this.profile.firstName);
    formData.append('lastName', this.profile.lastName);
    formData.append('email', this.profile.email);
  
    if (this.selectedFile) {
      formData.append(
        'profileImage',
        this.selectedFile,
        this.selectedFile.name
      );
    }
  
    this.authService.update(formData).subscribe({
      next: (res) => {
        this.toastr.success((res as any).message, 'Success');
  
        const updatedUser = {
          ...this.profile,
          ...(res as any).user,
          profileImage: (res as any).data.profileImage
        };
  
        if ((res as any).data.profileImage) {
          this.imageUrl = `${environment.uploadUrl}/${(res as any).data.profileImage}`;
        }
        
        this.previewUrl = null;
        this.selectedFile = null;
  
        this.userenc.saveUser(updatedUser);
        this.authService.setLoading(false);
      },
      error: (err) => {
        this.toastr.error(err.error.message, 'Error');
        this.authService.setLoading(false);
      },
    });
  }

}
