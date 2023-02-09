import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CompanyService } from '@app/_services/company.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HomeComponent implements OnInit {
  public currentUser = JSON.parse(localStorage.getItem('currentUser'));

  constructor(
    private CompanyService: CompanyService, private cd: ChangeDetectorRef) {
    this.CompanyService.setLabel('Mis dispositivos');
  }

  ngOnInit() {
  }

}
