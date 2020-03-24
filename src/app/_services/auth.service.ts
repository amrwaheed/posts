import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthData } from '../_modeles/auth-data';

const BACKEND_URL = environment.apiUrl +'/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = BACKEND_URL;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }


  /**
   * 
   * @param email 
   * @param password 
   */
  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }
    this.http.post(this.apiUrl + '/signup', authData).subscribe(
      () => {
        this.router.navigate(['/'])
      },
      err =>{
        this.authStatusListener.next(false);
      })
  }

  /**
   * Login Function 
   * @param email 
   * @param password 
   */
  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }

    this.http
      .post<{ token: string, expiresIn: number, userId: string }>(this.apiUrl + '/login', authData)
      .subscribe(
        response => {
          const token = response.token; // token
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
           
            this.saveAuthData(token, expirationDate, this.userId );

            this.router.navigate(['/']);
          }
          // console.log(response)
        },
        err =>{
          this.authStatusListener.next(false);
        })
  }

  getUserId() {
    return this.userId;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000);

  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null
    clearTimeout(this.tokenTimer)
    this.clearAuthData();
    this.router.navigate(['/']);
  }


  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }

  }


}
