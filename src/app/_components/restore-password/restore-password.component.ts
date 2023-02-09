import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Md5 } from "md5-typescript";

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {

  public restoreForm: FormGroup;
  public forgotForm: FormGroup;
  public loading = false;
  public submitted = false;
  public sentSuccessfully = false;
  public success = false;
  public fail = false;
  public returnUrl = '/';
  public error = '';
  public modalRef: BsModalRef;
  public xreportList = [
    'Visualización en tiempo real de las variables operativas críticas para el control de procesos.',
    'Operación de la infraestructura en forma remota, desde del centro de control o dispositivo móvil.',
    'Generación de reportes predefinidos y consultas personalizadas por los usuarios.  ',
  ];
  public xreportImg = [
    '../../../assets/svg/loginimg1.svg',
    '../../../assets/svg/loginimg2.svg',
    '../../../assets/svg/loginimg2.svg',
  ];
  public xportLabel: string;
  public indexLabel;
  public params: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.restoreForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    });
    this.selectXportLabel(0);
    this.params = this.router.parseUrl(this.router.url).queryParams;
  }

  get f() { return this.restoreForm.controls; };

  onSubmit(template) {
    this.submitted = true;
    this.loading = true;
    if (this.restoreForm.invalid) {
      return;
    } else {
      const password = Md5.init(this.f.password.value);
      this.authenticationService.changePass(this.params.user, password, this.params.token).subscribe(({ eDB, est, msj }) => {
        if (est === 200) {
          this.success = true;
        } else {
          this.fail = true;
        }
        this.error = msj;
        this.loading = false;
        this.modalRef = this.modalService.show(
          template,
          Object.assign({}, { class: 'gray modal-lg' })
        );
      });
    }

  }

  selectXportLabel(index) {
    this.xportLabel = this.xreportList[index];
    this.xreportImg[index];
    this.indexLabel = index;
  }

  sendToLogin() {
    this.modalService.hide(1);
    this.router.navigate([this.returnUrl]);
  }

}
