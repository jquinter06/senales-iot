import {
  Component,
  TemplateRef,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Input,
} from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '@app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from '@app/_services/users.service';

import { CompanyService } from '@app/_services/company.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChild('process') process: TemplateRef<any>;
  @Input() isOpenMenu;

  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  private currentCompanyId = JSON.parse(localStorage.getItem('CompanyId'));
  public companies = this.currentUser.empresas;
  public selectedCompany;
  public isShownAdmin = false;
  public isMenuAdmin = false;
  public modalRef: BsModalRef;
  public profileForm: FormGroup;
  public loading = false;
  public companyService: CompanyService;
  public labelMenu;
  public subMenuOpen = false;
  public avatar;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private usersService: UsersService,
    private toastr: ToastrService,
    private CompanyService: CompanyService,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef
  ) {
    this.CompanyService.label.subscribe((label) => {
      this.labelMenu = label;
      this.cd.markForCheck();
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  ngAfterViewInit(): void {
    if (!!this.currentCompanyId) {
      this.selectedCompany = this.currentCompanyId;
      this.CompanyService.setCompanyId(this.currentCompanyId);
    } else if (this.companies.length > 1) {
      this.openModal(this.process);
    } else {
      this.selectedCompany = this.companies[0].empresa;
      this.onChange();
    }
  }

  ngOnInit(): void {
    this.avatar = !!this.currentUser.avatar
      ? this.currentUser.avatar
      : '../../assets/svg/profile-menu.svg';
    this.profileForm = this.formBuilder.group({
      avatar: [this.currentUser.avatar],
      username: [this.currentUser.usuario],
      name: [this.currentUser.nombre],
      email: [this.currentUser.correo, Validators.required],
      phone: [this.currentUser.telefono],
      position: [this.currentUser.cargo],
      profile: [this.currentUser.perfil],
    });
    this.profileForm.get('username').disable();
    this.profileForm.get('position').disable();
    this.profileForm.get('profile').disable();
  }

  logout() {
    this.authenticationService.logout();
  }

  openModal(template: TemplateRef<any>) {
    this.isShownAdmin = false;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  updateUser() {
    this.loading = true;

    const user = {
      id: this.f.username.value,
      name: this.f.name.value,
      phone: this.f.phone.value,
      email: this.f.email.value,
      position: this.currentUser.cargo,
      profile: this.currentUser.perfil,
    };

    this.usersService.updateUser(user).subscribe(({ est }) => {
      if (est === 200) {
        this.modalRef.hide();
        this.toastr.success('¡Usuario actualizado con éxito!');
      } else {
        this.toastr.error('¡Algo salió mal!');
      }
      this.loading = false;
    });
  }

  onChange() {
    this.CompanyService.setCompanyId(this.selectedCompany);
    if (!!this.modalRef) {
      this.modalRef.hide();
    }
  }

  toggleSubmenu() {
    this.subMenuOpen = !this.subMenuOpen;
  }

  uploadFile(event) {
    const files = event.target.files;
    const [file] = files;
    const lastDot = file.name.lastIndexOf('.');
    const ext = file.name.substring(lastDot + 1);
    let formData = new FormData();
    if (ext === 'png') {
      let reader = new FileReader();
      reader.onload = (ev: any) => {
        this.avatar = reader.result as string;
      };
      reader.readAsDataURL(file);
      formData.append('username', this.currentUser.usuario);
      formData.append('avatar', file);
      this.usersService
        .updateUserAvatar(formData)
        .subscribe(({ est, datos }) => {
          if (est === 200) {
            this.currentUser.avatar = datos[0];
            this.toastr.success('¡Usuario actualizado con éxito la imagen!');
          } else {
            this.toastr.error('¡Algo salió mal al subir la imagen!');
          }
        });
    } else {
      this.toastr.error('¡Error en la extensión de la imagen!', file.name);
    }
  }
}
