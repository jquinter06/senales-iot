/*
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { HomeServiceService } from '@app/_services/home.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { CompanyService } from '@app/_services/company.service';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignalsComponent implements OnInit {
  @ViewChild('content') elementView: ElementRef;

  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public currentCompany;
  public loading = false;
  public list = false;
  public alert = true;
  public modalRef: BsModalRef;
  public mySignalList = [];
  public signalList: [];
  public searchMySignals: string = '';
  public searchSignals: string = '';
  public stations = [];
  public stationSelected;
  public state = [
    { code: 2, name: 'Todos' },
    { code: 0, name: 'Sin transmitir' },
    { code: 1, name: 'Transmitiendo' },
  ];
  public stateSelected;
  public signalListCopy = [];
  public switchSignal = [];
  public isResponsive = false;

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private homeService: HomeServiceService,
    private CompanyService: CompanyService,
    private cd: ChangeDetectorRef
  ) {
    const element = document.getElementById('wrapper') as HTMLElement;
    this.isResponsive = element.offsetWidth > 768;
    this.CompanyService.company.subscribe((company) => {
      this.currentCompany = company;
      this.cd.markForCheck();
      if (!!this.currentCompany) {
        this.getMySignals();
        this.getStations();
      }
    });
  }

  ngOnInit() {
    this.stateSelected = 2;
  }

  onChangeView(view) {
    this.list = !!(view === 'list');
  }

  onChangeStations() {
    this.mySignalList = this.signalListCopy.filter(
      (x) => x.idestacion == this.stationSelected
    );
  }

  onChangeState() {
    if (this.stateSelected == 2) {
      this.getMySignals();
    } else {
      this.mySignalList = this.signalListCopy.filter(
        (x) => x.estado == this.stateSelected
      );
    }
  }

  onClearStations() {
    this.getMySignals();
  }

  onCleanFilter() {
    this.stationSelected = null;
    this.stateSelected = 2;
    this.searchMySignals = null;
    this.getMySignals();
  }

  getMySignals() {
    this.loading = true;
    this.mySignalList = [];
    this.homeService
      .getMySignals(this.currentCompany, this.currentUser.usuario)
      .subscribe(({ est, datos }) => {
        if (est === 200) {
          this.mySignalList = datos.map((signal) => {
            return {
              signal_station: `${signal.nombre_variable} ${signal.nombre_estacion}`,
              ...signal,
            };
          });
          this.switchSignal = datos.map((signal) => {
            return {
              state: signal.valor === '0.0' ? false : true,
            };
          });
          this.signalListCopy = datos;
        } else {
          this.toastr.error('¡No tienes señales!');
        }
        this.loading = false;
      });
  }

  getSignals() {
    this.loading = true;
    this.signalList = [];
    this.homeService
      .getSignals(this.currentCompany, this.currentUser.usuario)
      .subscribe(({ est, datos }) => {
        if (est === 200) {
          this.signalList = datos.map((signal) => {
            return {
              signal_station: `${signal.nombre_variable} ${signal.nombre_estacion}`,
              ...signal,
            };
          });
        } else {
          this.toastr.error('¡Algo salió mal con las señales!');
        }
        this.loading = false;
      });
  }

  openModalViewProcess(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  openModalShowSignals(template: TemplateRef<any>) {
    this.getSignals();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  removeSignals(index, signal) {
    Swal.fire({
      title: '¿Desea eliminar la señal?',
      text: `${signal.nombre_variable}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.homeService
          .deleteSignal(this.currentUser.usuario, signal.idsenal)
          .subscribe(({ est }) => {
            if (est === 200) {
              this.mySignalList.splice(index, 1);
              this.toastr.success(signal.nombre_variable, '¡Señal eliminada!');
            } else {
              this.toastr.error('¡Algo salió mal!');
            }
          });
      }
    });
  }

  addSignal(signal, index) {
    this.homeService
      .createSignal(this.currentUser.usuario, signal.idsenal)
      .subscribe(({ est }) => {
        if (est === 200) {
          this.mySignalList.push(signal);
          this.signalList.splice(index, 1);
          this.toastr.success(signal.nombre_variable, '¡Señal agregada!');
        } else {
          this.toastr.error('¡Algo salió mal!');
        }
      });
  }

  getStations() {
    this.homeService
      .getStations(this.currentCompany)
      .subscribe(({ est, datos }) => {
        if (est === 200) {
          this.stations = datos.filter((signal) => signal.activo === 'S');
        } else {
          this.toastr.error('¡Algo salió mal !');
        }
      });
  }

  onClose() {
    this.getMySignals();
    this.modalRef.hide();
  }

  onChangeSignal(e, signal, index) {
    const initalState = this.switchSignal[index].state;
    const search = parseInt(signal.valor) === 1 ? 0 : 1;
    const idx = signal.comandos
      .map(function (elem) {
        return parseInt(elem.valor);
      })
      .indexOf(search);
    const commands = signal.comandos[idx];
    const remoteControl = {
      cmdId: commands.cmdId,
      plc: signal.plc,
      conexion: signal.conexion,
      ip: signal.dirIP,
      port: signal.puerto,
      unitId: commands.unitId,
      value: commands.valor,
      startRegister: signal.registromodbus,
    };
    const title = () => {
      switch (signal.unidad) {
        case 'On / Off':
          return signal.valor === '0.0'
            ? `¿Esta seguro que desea encender ${signal.nombre_variable}?`
            : `¿Esta seguro que desea apagar ${signal.nombre_variable}?`;
        case 'I/O':
          return signal.valor === '0.0'
            ? `¿Esta seguro que desea abrir ${signal.nombre_variable}?`
            : `¿Esta seguro que desea cerrar ${signal.nombre_variable}?`;
        default:
          return '';
      }
    };
    const congrats =
    commands.valor == 0 ? '¡Señal apagada!' : '¡Señal encendida!';

    Swal.fire({
      title: title(),
      text: `${signal.nombre_variable}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      this.loading = true;
      if (result.isConfirmed) {
        this.homeService
          .remoteControl(
            signal.idestacion,
            signal.idsenal,
            this.currentCompany,
            this.currentUser.usuario,
            remoteControl
          )
          .subscribe(({ est }) => {
            if (est === 200) {
              this.getMySignals();
              this.toastr.success(signal.nombre_variable, congrats);
            } else {
              this.toastr.error('¡Error al enviar telemando!');
            }
            this.loading = false;
          });
      }
      if (result.isDismissed) {
        this.switchSignal[index].state = initalState;
      }
    });
  }
}



/* ACA COMIENZA OTRO NUEVO */
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { HomeServiceService } from '@app/_services/home.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { AlertAlarmsService } from 'src/app/_services/alert-alarms.service';
import { CompanyService } from '@app/_services/company.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SignalsComponent implements OnInit, OnDestroy {
  @ViewChild('content') elementView: ElementRef;

  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public currentCompany;
  public loading = false;
  public list = false;
  public alert = true;
  public modalRef: BsModalRef;
  public mySignalList = [];
  public signalList= [];
  public mySignalListPrueba = [];
  public signalListFilter= [];
  public origenSelected;
  public searchMySignals: string = "";
  public searchSignals: string = "";
  public stations = [];
  public stationSelected;
  public state = [
    { code: 2, name: 'Todos' },
    { code: 1, name: 'Transmitiendo' },
    { code: 0, name: 'Sin transmitir' }
  ];
  public origen = [
    {code: 2, name: 'Todos'},
    {code: 'S', name: 'Datos manuales'},
    {code: 'N', name:'Datos automaticos'}
  ];
  public selectedTiempo;
  public stateSelected;
  public signalListCopy = [];
  public isResponsive = false;
  public time;
  public variablex = false;
  public timeValue;

  public tiempos = [];
  public refresh = [];
  public refreshCopy = [];

  public PruebaXtrack = [];
  public PruebaXtrackCopy = [];
  public sumaXtrack: number = 0;
  public promedioXtrack: number;
  public contadorXtrack: number = 1; 

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private homeService: HomeServiceService,
    private CompanyService: CompanyService,
    private AutoTime :AlertAlarmsService,
    private cd: ChangeDetectorRef,
    private util: UtilService
  ) {
    const element = document.getElementById('wrapper') as HTMLElement;
    this.isResponsive = element.offsetWidth > 768;
    this.CompanyService.company.subscribe((company) => {
      this.currentCompany = company;
      this.cd.markForCheck();
      if (!!this.currentCompany) {
        
        this.getMySignals();
        this.getStationsFavorita();
        this.onCleanFilter();
        clearInterval(this.timeValue);
        /*
        clearInterval(this.timeValue);
        this.refresh = null;
        this.refreshCopy = null;
        this.variablex = false;  
        this.onArancar();
        console.log("observando");
        */
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timeValue);
  }



  ngOnInit() {
    this.stateSelected = 2;
    this.origenSelected =2;
    this.onArancar();
  }

  onChangeOrigen(){
    if(this.origenSelected != 2){
    this.signalList = this.signalListFilter.filter(x => x.manual == this.origenSelected);
    }else{
    this.getSignals()
    }
  }

  onParar(){
    this.AutoTime.estadorefresh(0,this.selectedTiempo,this.refresh[0].idautomatico).subscribe(({ est }) => {
      if (est === 200) {
        clearInterval(this.timeValue);
        this.variablex = false;
        this.onArancar();
        this.toastr.success('¡Se ha desactivado la actualizacion automatica!');
      } else {
        this.toastr.error('¡Ocurrio un error!');
      }
    });
  }

  onUpdateTime(){
    this.AutoTime.estadorefresh(1,this.selectedTiempo,this.refresh[0].idautomatico).subscribe(({ est }) => {
      if (est === 200) {
        this.modalRef.hide();
        this.toastr.success('¡Se ha activado la actualizacion automatica!');
        this.onArancar();
      } else {
        this.toastr.error('¡Ocurrio un error!');
      }
    });
  }

  onChangeTiempo(){
    if(this.refresh[0].estado === 1){
    clearInterval(this.timeValue);
    this.onUpdateTime();
    }
  }

  onArancar(){
    
    const id = this.CompanyService.companyValue;
    this.AutoTime.getRefresh(id).subscribe(({ est, datos }) => {
      if (est === 200) {
        this.refresh = datos;
        this.refreshCopy = this.refresh;
        this.onInterval();
        this.selectedTiempo = this.refresh[0].id_temporizador;
      } else {

      }
    });
  }

  onInterval(){

    if(this.refresh[0].estado === 1){
      if(this.refresh[0].tiempo === 30000){
        this.variablex = true;
         this.timeValue = setInterval(()=>{
          this.getMySignals();
        }, 30000);
      }else if(this.refresh[0].tiempo === 60000){
        this.variablex = true;
         this.timeValue = setInterval(()=>{
          this.getMySignals();
          
        }, 60000);
      }else if(this.refresh[0].tiempo === 120000){
        this.variablex = true;
         this.timeValue = setInterval(()=>{
          this.getMySignals();
        }, 120000);
       }else if(this.refresh[0].tiempo === 180000){
        this.variablex = true;
         this.timeValue = setInterval(()=>{
          this.getMySignals();
        }, 180000);
       }else if(this.refresh[0].tiempo === 240000){
        this.variablex = true;
         this.timeValue = setInterval(()=>{
          this.getMySignals();
        }, 240000);
       }else if(this.refresh[0].tiempo === 300000){
        this.variablex = true;
         this.timeValue = setInterval(()=>{
          this.getMySignals();
        }, 300000);
        }else if(this.refresh[0].tiempo === 600000){
          this.variablex = true;
           this.timeValue = setInterval(()=>{
            this.getMySignals();
          }, 600000);
        }else{
          this.toastr.error('¡Algo salió mal!');
       }
    }

  }

  onChangeView(view) {
    this.list = view === 'list' ? true : false;
  }

  onChangeStations() {

    if(this.stateSelected != 2 && this.stationSelected > 0){
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
      this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
    }else if(this.stateSelected == 2 && this.stationSelected > 0){
      this.mySignalList = this.signalListCopy.filter(x => x.idestacion == this.stationSelected);
    }else{
      this.mySignalList = this.signalListCopy.filter(x => x.idestacion == this.stationSelected);
    }

    

  }

  onChangeState() {
    
    if(this.stateSelected != 2 && this.stationSelected > 0){
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
      this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
    }else if(this.stateSelected == 2 && this.stationSelected > 0){
      this.mySignalList = this.signalListCopy.filter(x => x.idestacion == this.stationSelected);
    }else if(this.stateSelected === 2){
      this.getMySignals();
    }else{
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
    }

  }

  onClearStations() {
    this.getMySignals();
  }

  onCleanFilter() {
    this.stationSelected = null;
    this.stateSelected = 2;
    this.searchMySignals = null;
    this.getMySignals();
  }

  getMySignals() {
    this.util.openSpinner();
    this.loading = true;
    this.mySignalList = [];
    this.homeService.getMySignals(this.currentCompany, this.currentUser.usuario).subscribe(({ est, datos }) => {
      if (est === 200) {
        this.util.closeSpinner();
        this.mySignalList = datos.map((x) => {
          return ({signal_station: `${x.nombre_variable} ${x.nombre_estacion}`, ...x})
        })
        this.signalListCopy = datos;
        
        if(this.stationSelected > 0 && this.stateSelected != 2){
          this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
          this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
        }else if(this.stateSelected == 2 && this.stationSelected > 0){
          this.mySignalList = this.signalListCopy.filter(x => x.idestacion == this.stationSelected);
        }else if(this.stateSelected != 2){
          this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
        }
        
      } else {
        this.toastr.error('¡Algo salió mal con mis señales!');
      }
      this.loading = false;
    });
  }

  pruebas(){
    if(this.stationSelected > 0){
      this.mySignalList = this.signalListCopy.filter(x => x.idestacion == this.stationSelected);
    }
  }

  getSignals() {
    this.loading = true;
    this.signalList = [];
    this.homeService.getSignals(this.currentCompany, this.currentUser.usuario).subscribe(({ est, datos }) => {
      if (est === 200) {
        
        this.signalList = datos.map((x) => {
          return ({signal_station: `${x.nombre_variable} ${x.nombre_estacion}`, ...x})
        });
        
        this.signalListFilter = datos.map((x) => {
          return ({signal_station: `${x.nombre_variable} ${x.nombre_estacion}`, ...x})
        });
        
      } else {
        this.toastr.error('¡Algo salió mal con las señales!');
      }
      this.loading = false;
    });
  }

  openModalViewProcess(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );

  }

  openModalShowSignals(template: TemplateRef<any>) {

    this.getSignals();
    this.origenSelected =2;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  getTiempo(){

    this.tiempos = [];
    this.AutoTime.getTiemposAut().subscribe(({ est, datos }) => {
      if (est === 200) {
        this.tiempos = datos;
      } else {
        this.toastr.error('¡Algo salio mal!');
      }
    });
  }

  openUpdate(template: TemplateRef<any>) {
    this.getTiempo();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  removeSignals(index, signal) {
    Swal.fire({
      title: '¿Desea eliminar la señal?',
      text: `${signal.nombre_variable}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.homeService.deleteSignal(this.currentUser.usuario, signal.idsenal)
          .subscribe(({ est }) => {
            if (est === 200) {
              this.mySignalList.splice(index, 1);
              this.toastr.success(signal.nombre_variable, '¡Señal eliminada!');
              this.getStationsFavorita();
            } else {
              this.toastr.error('¡Algo salió mal con las estaciones!');
            }
          });
      }
    })
  }

  addSignal(signal, index) {
    this.homeService.createSignal(this.currentUser.usuario, signal.idsenal)
      .subscribe(({ est }) => {
        if (est === 200) {
          this.mySignalList.push(signal);
          this.signalList.splice(index, 1);
          this.toastr.success(signal.nombre_variable, '¡Señal agregada!');
          this.getStationsFavorita();
          /*
          this.onChangeStations();
          */
        } else {
          this.toastr.error('¡Algo salió mal con las estaciones!');
        }
      });
  }
/*
  getStations() {
    this.homeService.getStations(this.currentCompany).subscribe(({ est, datos }) => {
      if (est === 200) {
        this.stations = datos.filter(signal => signal.activo === 'S');
      } else {
        this.toastr.error('¡Algo salió mal con las estaciones!');
      }
    });
  }
*/
  getStationsFavorita(){
    this.homeService.getEstacionesFavoritas(this.currentCompany, this.currentUser.usuario).subscribe(({est, datos}) => {
      if(est === 200){
        this.stations = datos.filter(signal => signal.activo === 'S');
      }else{
        this.toastr.error('¡Algo salió mal con las estaciones!');
      }
    });
  }

  onClose() {
    this.getMySignals();
    this.modalRef.hide()
  }

}

