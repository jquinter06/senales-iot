import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companySubject: BehaviorSubject<string>;
  public company: Observable<string>;

  private labelSubject: BehaviorSubject<string>;
  public label: Observable<string>;

  private expandSubject: BehaviorSubject<boolean>;
  public expand: Observable<boolean>;

  private isOpenNavbarSubject: BehaviorSubject<boolean>;
  public open: Observable<boolean>;

  constructor() {
    this.companySubject = new BehaviorSubject<string>('');
    this.company = this.companySubject.asObservable();

    this.labelSubject = new BehaviorSubject<string>('');
    this.label = this.labelSubject.asObservable();

    this.expandSubject = new BehaviorSubject<boolean>(false);
    this.expand = this.expandSubject.asObservable();

    this.isOpenNavbarSubject = new BehaviorSubject<boolean>(false);
    this.open = this.isOpenNavbarSubject.asObservable();
  }

  public get companyValue() {
    return this.companySubject.value;
  }

  public get labelValue() {
    return this.labelSubject.value;
  }

  public get expandValue() {
    return this.expandSubject.value;
  }

  public get OpenNavbar() {
    return this.isOpenNavbarSubject.value;
  }


  setCompanyId(id) {
    localStorage.setItem('CompanyId', JSON.stringify(id));
    this.companySubject.next(id);
    return id;
  }

  setExpandPanel(value) {
    this.expandSubject.next(value);
    return value;
  }

  setOpenNabvar(value) {
    this.isOpenNavbarSubject.next(value);
    return value;
  }


  setLabel(value) {
    this.labelSubject.next(value);
    return value;
  }
}
