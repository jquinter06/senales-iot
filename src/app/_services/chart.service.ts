import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChartServiceService {
  private httpHeaders: any;

  constructor(private router: Router, private http: HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
  }

  getDataChart(
    signals,
    fromDate,
    toDate,
    groupBy,
    rangeByVariable,
    rangeBySignal
  ): Observable<any> {
    const body = new HttpParams()
      .set('senales', `[${signals}]`)
      .set('fromdate', fromDate)
      .set('todate', toDate)
      .set('groupBy', groupBy)
      .set('rangeByVariable', rangeByVariable)
      .set('rangeBySignal', rangeBySignal);

    const url = `${environment.apiUrl}/get/reporte_senal`;

    return this.http.post(url, body.toString(), this.httpHeaders);
  }

  exportChart(
    signals,
    variables,
    fromDate,
    toDate,
    groupBy,
    chart,
    logo,
    usuario,
    company,
    orderByDate,
    typeOutput
  ) {
    return this.http
      .post<any>(`${environment.apiUrl}/get/exportar_reporte`, {
        signals: signals,
        variables: variables,
        fromdate: fromDate,
        todate: toDate,
        groupBy: groupBy,
        chart: chart,
        logo: logo,
        user: usuario,
        company: company,
        orderByDate: orderByDate,
        typeOutput: typeOutput,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
