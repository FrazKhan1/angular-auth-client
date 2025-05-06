import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserEncService {
  private readonly encryptionKey = 'your-encryption-key';
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService
  ) {
    this.loadInitialUser();
  }

  private loadInitialUser(): void {
    if (!this.isBrowser) return;
    try {
      const encrypted = this.cookieService.get('user');
      if (encrypted) {
        const decrypted = CryptoJS.AES.decrypt(
          encrypted,
          this.encryptionKey
        ).toString(CryptoJS.enc.Utf8);
        const user = JSON.parse(decrypted);
        this.userSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading initial user:', error);
    }
  }

  saveUser(user: any): void {
    if (!this.isBrowser) return;
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(user),
        this.encryptionKey
      ).toString();
      this.cookieService.set('user', encrypted, 1, '/', '', true, 'Strict');
      this.userSubject.next(user);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  getUser(): any | null {
    if (!this.isBrowser) return null;

    try {
      const encrypted = this.cookieService.get('user');
      if (!encrypted) return null;

      const decrypted = CryptoJS.AES.decrypt(
        encrypted,
        this.encryptionKey
      ).toString(CryptoJS.enc.Utf8);

      const user = JSON.parse(decrypted);

      return user;
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null;
    }
  }

  clearUser(): void {
    if (!this.isBrowser) return;
    this.cookieService.delete('user', '/');
    this.userSubject.next(null);
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
