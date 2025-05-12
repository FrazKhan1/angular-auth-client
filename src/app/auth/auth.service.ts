import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
const { apiUrl } = environment;
interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface Update {
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}
interface Credential {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  setLoading(value: boolean) {
    this.loadingSubject.next(value);
  }

  constructor(private http: HttpClient) {}

  signUp(user: User) {
    return this.http.post(`${apiUrl}/register`, user);
  }

  login(user: Credential) {
    return this.http.post(`${apiUrl}/login`, user);
  }

  update(user: any) {
    return this.http.put(`${apiUrl}/profile`, user);
  }

  verifyEmail(token: string) {
    return this.http.get(`${apiUrl}/verify-email?token=${token}`);
  }

  resendVerificationLink(email: string) {
    return this.http.post(`${apiUrl}/resend-link`, {email})
  }
}
