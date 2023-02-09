import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {
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

  getMySignals(company, user): Observable<any> {
    const body = new HttpParams()
      .set('usuario', user)
      .set('empresa', company);
    const url = `${environment.apiUrl}/get/senal_usuario`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  getMySignalsSensors(company): Observable<any> {
    const body = new HttpParams()
      .set('empresa', company);
    const url = `${environment.apiUrl}/get/senal`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  getMySensors(company): Observable<any> {
    const body = new HttpParams()
      .set('empresa', company);
    const url = `${environment.apiUrl}/get/sensores`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  getSignals(company, user): Observable<any> {
    const body = new HttpParams()
      .set('usuario', user)
      .set('empresa', company);
    const url = `${environment.apiUrl}/get/senal_sin_asignar`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  getMyVariables(company): Observable<any> {
    const body = new HttpParams()
      .set('empresa', company);
    const url = `${environment.apiUrl}/get/variable`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  getMyVariablesTipo(company, manual): Observable<any> {
    const body = new HttpParams()
      .set('empresa', company)
      .set('manual', manual);
    const url = `${environment.apiUrl}/get/variable_tipo`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }


  getSignalVariables(company, variable): Observable<any> {
    const body = new HttpParams()
      .set('empresa', company)
      .set('variable', variable);
    const url = `${environment.apiUrl}/get/senal_variable`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  createSignal(user, signal): Observable<any> {
    const body = new HttpParams()
      .set('usuario', user)
      .set('idsenal', signal);
    const url = `${environment.apiUrl}/create/senal_usuario`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  deleteSignal(user, signal): Observable<any> {
    const body = new HttpParams()
      .set('usuario', user)
      .set('idsenal', signal);
    const url = `${environment.apiUrl}/delete/senal_usuario`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  signalDetail(user, signal) {
    const body = new HttpParams()
      .set('usuario', user)
      .set('idsenal', signal);
    const url = `${environment.apiUrl}/get/detallesenal`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  getStations(company): Observable<any> {
    const body = new HttpParams().set('empresa', company);
    const url = `${environment.apiUrl}/get/estacion`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  getDataChart(date, id): Observable<any> {
    const body = new HttpParams()
      .set('idsenal', id)
      .set('fecha', date)
      .set('rango', environment.range);
    const url = `${environment.apiUrl}/get/datossenal`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

    getUrls(company:string,path: string): Observable<any> {
    const body = new HttpParams().set('empresa', company);
    const url = `${environment.apiUrl}/get/${path}`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  getUrslDetalleEstacion(idstation:string): Observable<any> {
    const body = new HttpParams().set('idestacion', idstation);
    const url = `${environment.apiUrl}/get/tableros_estacion_detalle`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }
  /*
  getUrls(company): Observable<any> {
    const body = new HttpParams().set('empresa', company);
    const url = `${environment.apiUrl}/get/tableros_generales_control`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }
*/
remoteControl(stationId, signalId, company, username, remoteControl) {
  return this.http
    .post<any>(`${environment.apiUrl}/update/telecontrol`, {
      stationId: stationId,
      signalId: signalId,
      company: company,
      username: username,
      remoteControl: remoteControl,
    })
    .pipe(
      map((data) => {
        return data;
      })
    );
}

getEstacionesFavoritas(empresa, user): Observable<any> {
  const body = new HttpParams()
    .set('user', user)
    .set('empresa', empresa);
  const url = `${environment.apiUrl}/get/estaciones`;

  return this.http.post(url, body.toString(), this.httpHeaders);
}

getSenalCheck(idsenal): Observable<any> {
  const body = new HttpParams()
    .set('idsenal', idsenal);
  const url = `${environment.apiUrl}/get/senal_check`;
  return this.http.post(url, body.toString(), this.httpHeaders);
}

getSenalCheckMore(idsenal): Observable<any> {
  const body = new HttpParams()
    .set('idsenal', idsenal);
  const url = `${environment.apiUrl}/get/senal_check_more`;
  return this.http.post(url, body.toString(), this.httpHeaders);
}
}
