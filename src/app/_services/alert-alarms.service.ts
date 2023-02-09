import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertAlarmsService {

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

  getAlarmsToNotify(company):Observable<any> {
    const body = new HttpParams()
    .set('company', company);
    const url = `${environment.apiUrl}/get/notificar_alarmas`;
    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  getCausales():Observable<any>{
    const url =  `${environment.apiUrl}/get/causales`;
    return this.http.get(url, this.httpHeaders);
  }

  getTiemposAut():Observable<any>{
    const url =  `${environment.apiUrl}/get/temporizadores`;
    return this.http.post(url, this.httpHeaders);
  }

  getRefresh(idempresa):Observable<any>{
    const body = new HttpParams()
    .set('idempresa', idempresa);
    const url =  `${environment.apiUrl}/get/refresh`;
    return this.http.post(url, body.toString(), this.httpHeaders);
  }


  atenderalarma(atender): Observable<any> {
    const body = new HttpParams()
      .set('id', atender.id)
      .set('observacion', atender.observacion)
      .set('id_causal', atender.id_causal)
      .set('usuario_visto', atender.usuario_visto)
    const url = `${environment.apiUrl}/update/atender_alarma`;
    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  marcarvisto(id): Observable<any> {
    const body = new HttpParams()
      .set('id', id);
    const url = `${environment.apiUrl}/update/marcarleido`;
    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  estadorefresh(estado,temporizador, id): Observable<any> {
    const body = new HttpParams()
      .set('estado', estado)
      .set('temporizador', temporizador)
      .set('id', id)
    const url = `${environment.apiUrl}/update/estadorefresh`;
    return this.http.post(url, body.toString(), this.httpHeaders);
  }

}
