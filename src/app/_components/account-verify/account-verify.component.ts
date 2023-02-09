import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AuthenticationService } from '@app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alert',
  templateUrl: './account-verify.component.html',
  styleUrls: ['./account-verify.component.less']
})

export class AccountVerifyComponent implements OnInit {
  public currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public alert;
  @Input() showReport;
  @Input() showAlert;

  constructor(
    private authenticationService: AuthenticationService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.alert = this.showReport ? this.showAlert : !this.currentUser.correoactivo;
  }

  onSend() {
    this.authenticationService.activateAccount(this.currentUser.usuario, this.currentUser.correo).subscribe(({ eDB, est, msj }) => {
      if (est === 200) {
        this.alert = true;
        this.toastr.success(msj);
      } else {
        this.toastr.error(msj);
      }
    });
  }

  onClose() {
    this.alert = false;
  }

}
