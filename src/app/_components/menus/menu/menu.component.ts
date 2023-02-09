import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '@app/_services/company.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public navbarOpen = true;
  public subMenuOpen = true;
  public menu;
  public element;
  constructor(private CompanyService: CompanyService, private cd: ChangeDetectorRef) {
    this.element = document.getElementById('wrapper') as HTMLElement
    this.CompanyService.expand.subscribe((x) => {
      this.menu = x;
      this.cd.markForCheck();
    });
  }

  ngOnInit(): void {}

  toggleNavbar() {
    if (this.element.offsetWidth > 769) {
      this.navbarOpen = !this.navbarOpen;
      this.CompanyService.setOpenNabvar(!this.navbarOpen);
    }
  }

  toggleSubmenu() {
    this.subMenuOpen = !this.subMenuOpen;
  }

}
