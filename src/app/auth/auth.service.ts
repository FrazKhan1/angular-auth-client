import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface Credential {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'https://angular-auth-server.vercel.app/api';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  setLoading(value: boolean) {
    this.loadingSubject.next(value);
  }

  constructor(private http: HttpClient) {}

  signUp(user: User) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: Credential) {
    return this.http.post(`${this.apiUrl}/login`, user);
  }
}
