import { ChangeDetectorRef, Component, OnInit, Injectable } from '@angular/core';
import { CompanyService } from '@app/_services/company.service';
import { AlertAlarmsService } from '@app/_services/alert-alarms.service';
import { ToastrService } from 'ngx-toastr';
import { AlertAlarmComponent } from 'src/app/_components/alert-alarm/alert-alarm.component';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
  public currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public menu;
  public openMenu = false;
  public NotifyAlarms = [];
  public CopyNotifyAlarms = [];
  public causales = [];
  constructor(
    private CompanyService: CompanyService,
    private cd: ChangeDetectorRef,
    private alertAlarm : AlertAlarmsService,
    private toastr: ToastrService,
    private alertaprueba : AlertAlarmComponent
    ) {
    this.CompanyService.expand.subscribe((isExpand) => {
      this.menu = isExpand;
      this.cd.markForCheck();
    });
    this.CompanyService.open.subscribe((isOpen) => {
      this.openMenu = isOpen;
    });

  }

  ngOnInit(): void {

    setInterval(()=>{
      this.getNotifyAlarm();
    }, 30000);

  }

  getNotifyAlarm(){
    const id = this.CompanyService.companyValue;
    this.NotifyAlarms = [];
    this.alertAlarm.getAlarmsToNotify(id).subscribe(({ est, datos }) => {
      if (est === 200) {
        this.NotifyAlarms = datos;
        this.CopyNotifyAlarms = datos;
        this.alertaprueba.openDialog(this.NotifyAlarms);
        const audio = document.createElement("audio")
        audio.setAttribute('src', '../../../assets/alarma.mp3')
        audio.play()
      } else {
      }
    });

    // const prueba: any[] = [
    //   { alarmId: "18169",dateWhenWasSeen: "2021-12-10 09:25:00.357",estacion: "PTAP EL ROBLE",
    //   id: "234360",name: "excelente caudal ",senal: "CaudalEntrada",signalId: "220809",sonido: "S",
    //   ultimovalor: "505.84",valoractual: "505.84",variable: "Caudal",wasSeen: "N" },
    //   { alarmId: "18170",dateWhenWasSeen: "2021-12-10 09:25:00.357",estacion: "PTAP NIVEL",
    //   id: "234361",name: "excelente nivel ",senal: "NivelEntrada",signalId: "220709",sonido: "S"
    //   ,ultimovalor: "705.84",valoractual: "605.84",variable: "Nivel",wasSeen: "N" },
    //   { alarmId: "18161",dateWhenWasSeen: "2021-12-10 09:25:00.357",estacion: "PTAP PRESION",
    //   id: "234362",name: "excelente presion ",senal: "PresionEntrada",signalId: "220609",sonido: "S",
    //   ultimovalor: "305.84",valoractual: "405.84",variable: "Presion",wasSeen: "N"}
    // ];
    // this.alertaprueba.openDialog(prueba);
    // console.log(prueba, 'PRUEBA');
  }

}
