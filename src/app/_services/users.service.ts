import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
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

  updateUser(user): Observable<any> {
    const body = new HttpParams()
      .set('id', user.id)
      .set('nombre', user.name)
      .set('telefono', user.phone)
      .set('correo', user.email)
      .set('perfil', user.profile)
      .set('cargo', user.position);

    const url = `${environment.apiUrl}/update/usuario`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  updateUserAvatar(avatar): Observable<any> {
    const url = `${environment.apiUrl}/update/avatar`;

    return this.http.post(url, avatar);
  }
}
