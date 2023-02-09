import { Injectable, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService implements OnInit{

  /* Subject */
  señalComun : any;
  private señalesBehaviorSubject = new Subject<any>();
  señalesObservable = this.señalesBehaviorSubject.asObservable();

  /* BehaviorSubject */
  señalBehavior : any;
  private subjectSeñales = new BehaviorSubject<any>('');
  subjectSeñalesBehavior = this.subjectSeñales.asObservable();

  constructor(private spinner: NgxSpinnerService) {
     }


  ngOnInit(){
    this.openSpinner();
  }

  openSpinner(){
    this.spinner.show();
  }

  closeSpinner(){
    this.spinner.hide();
  }

  señalesComunicacion(señalComun: any){
      this.señalComun = señalComun;
      this.señalesBehaviorSubject.next(señalComun);
  }

  señalesBehavior(señalBehavior: any){
    this.señalBehavior = señalBehavior;
    this.subjectSeñales.next(señalBehavior);
  }

}
