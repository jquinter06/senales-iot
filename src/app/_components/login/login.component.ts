import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/_services/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Md5 } from 'md5-typescript';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public forgotForm: FormGroup;
  public loading = false;
  public submitted = false;
  public sentSuccessfully = false;
  public successMailMsj = '';
  public returnUrl: string;
  public error = '';
  public forgotError = '';
  public sendForgotError = false;
  public modalRef: BsModalRef;
  public submittedforgotForm: boolean;
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
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberUser: [true]
    });

    const user = localStorage.getItem('user')
    if(user){
      this.loginForm.controls.username.setValue(user)
    }
    this.forgotForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this.selectXportLabel(0);
    this.returnUrl = '/';
  }

  get f() {
    return this.loginForm.controls;
  }
  get forgotf() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    
    const user = this.loginForm.controls.username.value;
 
    this.loading = true;
    const password = Md5.init(this.f.password.value);
    this.authenticationService
      .login(this.f.username.value, password)
      .subscribe(({ eDB, est, msj }) => {
        if (est === 200) {
          console.log(this.loginForm.controls.rememberUser.value);
          
          if(this.loginForm.controls.rememberUser.value){
            this.authenticationService.rememberUser(user);
          }else{
            localStorage.removeItem('user' || '')
          }
          window.location.reload();
          this.router.navigate([this.returnUrl]);
        } else {
          this.error = msj;
        }
        this.loading = false;
      });
  }

  onForgot() {
    this.submittedforgotForm = true;
    this.loading = true;

    if (this.forgotForm.invalid) {
      this.forgotError = 'Se requiere el nombre de usuario';
      return;
    } else {
      this.authenticationService
        .forgotPassword(this.forgotf.name.value)
        .subscribe(({ eDB, est, msj }) => {
          if (est === 200) {
            this.sentSuccessfully = true;
            this.successMailMsj = msj;
          } else {
            this.sendForgotError = true;
            this.forgotError = msj;
          }
          this.loading = false;
        });
    }

    this.loading = true;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  selectXportLabel(index) {
    this.xportLabel = this.xreportList[index];
    this.xreportImg[index];
    this.indexLabel = index;
  }
}
