import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HomeServiceService } from '@app/_services/home.service';
import { CompanyService } from '@app/_services/company.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SensorsComponent implements OnInit {
  @ViewChild('content') elementView: ElementRef;

  public currentCompany;
  public loading = false;
  public list = false;
  public alert = true;
  public mySignalList = [];
  public signalList: [];
  public searchMySignals: string = "";
  public searchSignals: string = "";
  public stations = [];
  public stationSelected;
  public origenSelected;
  pageActual: number = 1;
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
  public stateSelected;
  public signalListCopy = [];
  public mySignalListPrueba = [];

  constructor(
    private toastr: ToastrService,
    private homeService: HomeServiceService,
    private CompanyService: CompanyService,
    private cd: ChangeDetectorRef,
    private util: UtilService
  ) {
    this.CompanyService.setLabel('Sensores');
    this.CompanyService.company.subscribe((x) => {
      this.currentCompany = x;
      this.cd.markForCheck();
      if (!!this.currentCompany) {
        this.getMySignals();
        this.getStations();
        this.onLimpiar();
      }
    });
  }

  onLimpiar(){
    this.stationSelected = null;
    this.stateSelected = 2;
    this.origenSelected = 'N';
    this.searchMySignals = null;
  }


  ngOnInit() {
    this.stateSelected = 2;
    this.origenSelected = 'N';
  }

  onClearStations() {
    if(this.stateSelected === 2 && this.origenSelected != 2){
      this.mySignalList = this.signalListCopy.filter(x => x.manual == this.origenSelected);
    }else if(this.stateSelected < 2 && this.origenSelected === 2){
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
    }else if(this.stateSelected === 2 && this.origenSelected === 2){
      this.getMySignals();
    }else{
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
      this.mySignalList = this.mySignalList.filter(x => x.manual == this.origenSelected);
    }
  }

  onChangeStations() {
    if(this.stationSelected === null){
      if(this.stateSelected === 2 && this.origenSelected != 2){
        this.mySignalList = this.signalListCopy.filter(x => x.manual == this.origenSelected);
      }else if(this.stateSelected < 2 && this.origenSelected === 2){
        this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
      }else if(this.stateSelected === 2 && this.origenSelected === 2){
        this.getMySignals();
      }else{
        this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
        this.mySignalList = this.mySignalList.filter(x => x.manual == this.origenSelected);
      }
    }else if(this.stateSelected >= 0 && this.stateSelected < 2 && this.origenSelected != 2 && this.stationSelected > 0){
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
      this.mySignalList = this.mySignalList.filter(x => x.manual == this.origenSelected);
      this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
    }else if(this.stateSelected === 2 && this.origenSelected != 2){
      this.mySignalList = this.signalListCopy.filter(x => x.manual == this.origenSelected);
      this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
    }else if(this.stateSelected < 2 && this.origenSelected === 2){
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
      this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
    }else{
      this.mySignalList = this.signalListCopy.filter(x => x.idestacion === this.stationSelected);
    }

  }

  onChangeOrigen() {
    
   if(this.stateSelected >= 0 && this.stateSelected < 2 && this.origenSelected != 2 && this.stationSelected > 0){
    this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
    this.mySignalList = this.mySignalList.filter(x => x.manual == this.origenSelected);
    this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
  }else if(this.stateSelected >= 0 && this.stateSelected < 2 && this.origenSelected != 2){
    this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
    this.mySignalList = this.mySignalList.filter(x => x.manual == this.origenSelected);
  }else if(this.stateSelected === 2 && this.origenSelected != 2 && this.stationSelected > 0){
    this.mySignalList = this.signalListCopy.filter(x => x.manual == this.origenSelected);
    this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
  }else if(this.stateSelected < 2 && this.origenSelected === 2 && this.stationSelected > 0){
    this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
    this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
  }else if(this.stateSelected < 2 && this.origenSelected === 2){
    this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
  }else if(this.stateSelected === 2 && this.origenSelected != 2){
    this.mySignalList = this.signalListCopy.filter(x => x.manual == this.origenSelected);
  }else if(this.stateSelected === 2 && this.origenSelected === 2 && this.stationSelected > 0){
    this.mySignalList = this.signalListCopy.filter(x => x.idestacion === this.stationSelected);
  }else{
    this.mySignalList = this.signalListCopy;
  }
}

  onChangeState() {
    if(this.stateSelected >= 0 && this.stateSelected < 2 && this.origenSelected != 2 && this.stationSelected > 0){
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
      this.mySignalList = this.mySignalList.filter(x => x.manual == this.origenSelected);
      this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
    }else if(this.stateSelected >= 0 && this.stateSelected < 2 && this.origenSelected != 2){
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
      this.mySignalList = this.mySignalList.filter(x => x.manual == this.origenSelected);
    }else if(this.stateSelected === 2 && this.origenSelected != 2 && this.stationSelected > 0){
      this.mySignalList = this.signalListCopy.filter(x => x.manual == this.origenSelected);
      this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
    }else if(this.stateSelected < 2 && this.origenSelected === 2 && this.stationSelected > 0){
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
      this.mySignalList = this.mySignalList.filter(x => x.idestacion == this.stationSelected);
    }else if(this.stateSelected < 2 && this.origenSelected === 2){
      this.mySignalList = this.signalListCopy.filter(x => x.estado == this.stateSelected);
    }else if(this.stateSelected === 2 && this.origenSelected != 2){
      this.mySignalList = this.signalListCopy.filter(x => x.manual == this.origenSelected);
    }else if(this.stateSelected === 2 && this.origenSelected === 2 && this.stationSelected > 0){
      this.mySignalList = this.signalListCopy.filter(x => x.idestacion === this.stationSelected);
    }else{
      this.mySignalList = this.signalListCopy;
    }
  }

  onCleanFilter() {
    this.stationSelected = null;
    this.stateSelected = 2;
    this.origenSelected = 'N';
    this.searchMySignals = null;
    this.getMySignals();
  }

  getMySignals() {
    this.loading = true;
    this.util.openSpinner();
    this.mySignalList = [];
    this.homeService.getMySensors(this.currentCompany).subscribe(({ est, datos }) => {
      if (est === 200) {
        this.util.closeSpinner();
        this.mySignalList = datos;
        this.signalListCopy = datos;
        this.onChangeOrigen();
      } else {
        this.toastr.error('¡Algo salió mal con mis señales!');
      }
      this.loading = false;
    });
  }

  getStations() {
    this.homeService.getStations(this.currentCompany).subscribe(({ est, datos }) => {
      if (est === 200) {
        this.stations = datos.filter(signal => signal.activo === 'S');
      } else {
        this.toastr.error('¡Algo salió mal con las estaciones!');
      }
    });
  }


}
