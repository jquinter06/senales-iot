import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, Injectable, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertAlarmsService } from 'src/app/_services/alert-alarms.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';



@Component({
  selector: 'dialog-overview-example',
  templateUrl: './alert-alarm.component.html',
  styleUrls: ['./alert-alarm.component.less'],
})
@Injectable({
  providedIn: 'root',
})
export class AlertAlarmComponent {

  animal: string;
  name: string;

  public modalRef: BsModalRef;
  public causales = [];
  public stateSelected = null;
  public prueba = [];

  constructor(public dialog: MatDialog,
    private toastr: ToastrService,
    private Alertservi :AlertAlarmsService)
    { }

  openDialog(data?:any[]): void {
    this.prueba = [];
    this.prueba = data;

    data.forEach((alarma) => {
      let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: 'none',
        height: 'none',
        data: alarma,
        disableClose: true,
        backdropClass: 'backdropBackground'
      });
        dialogRef.afterClosed().subscribe(result => {
        this.animal = result;
      });
    })
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './alert-alarm.component-dialog.html',
  styleUrls: ['./alert-alarm.component.less'],
})
export class DialogOverviewExampleDialog {

  public causales = [];
  public selectedOption = null;
  public modalRef: BsModalRef;
  public profileForm: FormGroup;
  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public observacion: string;



  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public alarms: any,
    private modalService: BsModalService,
    private Alertservi :AlertAlarmsService,
    private toastr: ToastrService
    ) { }

    get f() {
      return this.profileForm.controls;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getCausales(){
    this.causales = [];
    this.Alertservi.getCausales().subscribe(({ est, datos }) => {
      if (est === 200) {
        this.causales = datos;
      } else {
        this.toastr.error('¡Algo salio mal!');
      }
    });
  }

  openModal(template: TemplateRef<any>) {
    this.getCausales();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  atenderAlarms(id){
    this.observacion = this.observacion;

    const alarms = {
      id: id,
      observacion: this.observacion,
      id_causal: this.selectedOption,
      usuario_visto: this.currentUser.usuario,
    };
    this.Alertservi.atenderalarma(alarms).subscribe(({ est }) => {
      if (est === 200) {
        this.modalRef.hide();
        this.toastr.success('¡Señal atendida con éxito!');
        this.onNoClick();
      } else {
        this.toastr.error('¡Algo salió mal!');
      }
    });
  }

  marcarleidas(id){
    this.Alertservi.marcarvisto(id).subscribe(({ est }) => {
      if (est === 200) {
        this.toastr.success('¡Señal vista con éxito!');
        this.onNoClick();
      } else {
        this.toastr.error('¡Ocurrio un error!');
      }
    });
  }

}

