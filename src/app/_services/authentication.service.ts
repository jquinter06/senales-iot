import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  private httpHeaders: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
  }

  public get isLoggedIn() {
    return this.isLoginSubject.value;
  }

  login(username, password) {
    return this.http.post<any>(`${environment.apiUrl}/authentication/login`, { username: username, password: password, expiration: environment.tokenExpiration })
      .pipe(map(data => {
        if (data.est === 200) {
          localStorage.setItem('isLogin', 'true');
          this.isLoginSubject.next(true);
          this.getData(data.datos[0]);
        }
        return data;
      }));
  }

  logout() {
    this.isLoginSubject.next(false);
    localStorage.removeItem('isLogin');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('CompanyId');
    window.location.reload();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }

  forgotPassword(username): Observable<any> {
    const body = new HttpParams().set('username', username);
    const url = `${environment.apiUrl}/authentication/recuperarClave`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  activateAccount(username, email): Observable<any> {
    const body = new HttpParams()
      .set('username', username)
      .set('email', email);
    const url = `${environment.apiUrl}/authentication/activarCorreo`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }


  changePass(username, password, token) {
    return this.http.post<any>(`${environment.apiUrl}/authentication/cambiarClave`, { username: username, password: password, token: token })
      .pipe(map(user => {
        return user;
      }));
  }

  rememberUser(user: string){
    localStorage.setItem('user',user)
  }

  private getData(data): Observable<any> {
    const { token } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(data));
    return of(data);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('isLogin');
  }
}
