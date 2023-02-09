import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  Input,
  SimpleChanges,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HomeServiceService } from '@app/_services/home.service';
import { CompanyService } from '@app/_services/company.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilService } from 'src/app/_services/util.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-report-filters',
  templateUrl: './report-filters.component.html',
  styleUrls: ['./report-filters.component.scss'],
})
export class ReportFiltersComponent implements OnInit {
  @ViewChild('htmlInner', { static: true }) renderHtml;
  @Output() isVisible = new EventEmitter<boolean>();
  @Output() isVisibleTable = new EventEmitter<boolean>();
  @Output() signalList = new EventEmitter<any>();
  @Output() chartData = new EventEmitter<any>();
  @Output() objectData = new EventEmitter<any>();
  @Input() signalId;
  @Input() signalIdAdd;
  @Input() signalIdAddGlobal;
  @Input() signalIdAddRemove;

  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  private currentCompanyId = JSON.parse(localStorage.getItem('CompanyId'));

  public disabledRanges = true;
  public disabledUpdate = true;
  public currentCompany;
  public disabledFixedRange = false;
  public variables;
  public selectedHour;
  public selectedHourDownload;
  public selectedGrouped;
  public selectedUpdate;
  public origenSelected;
  public options = { quality: 0.95 };
  public loading = false;
  public idseñalesRemoto;
  public hours = [
    { name: '36 horas', id: 36 },
    { name: '24 horas', id: 24 },
    { name: '12 horas', id: 12 },
    { name: '6 horas', id: 6 },
    { name: '1 horas', id: 1 },
  ];
  public grouped = [
    { name: 'Minuto', id: 'Minuto' },
    { name: 'Hora', id: 'Hora' },
    { name: 'Día', id: 'Días' },
  ];
  public origen = [
    {code: 2, name: 'Todos'},
    {code: 'S', name: 'Datos manuales'},
    {code: 'N', name:'Datos automaticos'}
  ];
  public origenVariable = [
    {code: 2, name: 'Todos'},
    {code: 'S', name: 'Datos manuales'},
    {code: 'N', name:'Datos automaticos'}
  ];
  public update = [
    { name: '1 Minuto', id: '1' },
    { name: '5 Minuto', id: '5' },
    { name: '10 Minuto', id: '10' },
    { name: '15 Minuto', id: '15' },
    { name: '30 Minuto', id: '30' },
  ];
  public colors = [
    { id: '2', nombre: 'Amarillo', valor: '#F5D93F' },
    { id: '3', nombre: 'Azul', valor: '#109CF1' },
    { id: '4', nombre: 'Fuscia', valor: '#E02CC4' },
    { id: '5', nombre: 'Gris', valor: '#8492A4' },
    { id: '6', nombre: 'Naranja', valor: '#FFB946' },
    { id: '7', nombre: 'Negro', valor: '#0C1032' },
    { id: '8', nombre: 'Rojo', valor: '#F7685B' },
    { id: '9', nombre: 'Turquesa', valor: '#7557E5' },
    { id: '10', nombre: 'Verde', valor: '#2ED47A' },
    { id: '11', nombre: 'Morado', valor: '#7456e8' },
  ];
  public format = 'dd/MM/yyyy HH:mm';
  public currentDay = new Date();
  public dateFrom: Date = new Date();
  public dateTo: Date = new Date(
    this.currentDay.getFullYear(),
    this.currentDay.getMonth(),
    this.currentDay.getDate() + 30
  );
  public min: Date = this.dateFrom;
  public max: Date = this.dateTo;
  public isToggle: boolean = false;
  public selectedVariable;
  public selectedOrigen;
  public sendVariables = [];
  public disableChart = true;
  public modalRef: BsModalRef;
  public mySignalList = [];
  public signalListFilter = [];
  public dataList = [];
  public objectChartsValue = {};
  public selectedRangeByVariable = false;
  public selectedRangeBySignal = false;
  public datosCopy = [];
  public datosCopy2 = [];
  public fromDate = moment().subtract(36, 'hours').format('YYYY-MM-DD H:mm:ss');
  public toDate = moment().format('YYYY-MM-DD H:mm:ss');

  public pruebita : number;
  public pruebita2 : number;
  public pruebita3 : any;
  public pruebita4 : any;

  public dataListPrueba = [];

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private homeService: HomeServiceService,
    private CompanyService: CompanyService,
    private cd: ChangeDetectorRef,
    private util: UtilService
  ) {
    this.CompanyService.company.subscribe((x) => {
      this.currentCompany = x;
      this.cd.markForCheck();
      if (!!this.currentCompany) {
        this.getVariables();
        this.getSignals();
        this.onCleanFilter();
      }
    });
  }
  
  /* METODOS DE LOS CHECK */
  ngOnChanges(changes: SimpleChanges): void { 
/* 
const { currentValue } = changes.signalId;
if (!!currentValue) { 
this.dataList = this.dataList.filter((x) => x.idsenal !== currentValue);
console.log("dddd",this.dataList);
}
console.log(this.signalIdAdd, 'mirando');
*/
    this.pruebita = this.signalId;
    if(this.pruebita != null){
      this.dataList = this.dataList.filter((x) => x.idsenal !== this.pruebita);
    }
    this.pruebita2 = this.signalIdAdd;
    if(this.pruebita2 != null){
      this.util.openSpinner();
      this.homeService.getSenalCheck(this.pruebita2).subscribe(({ est, datos }) => {
        if (est === 200) {
          this.util.closeSpinner();
          datos.forEach((element) => {
            element['color'] = this.getColor();
          });
          this.dataList.push(datos[0]);
        }
      });
    }
    this.pruebita3 = this.signalIdAddGlobal; 
    if(this.pruebita3 != null){
      this.util.openSpinner();
      this.homeService.getSenalCheckMore(this.pruebita3).subscribe(({ est, datos }) => {
        if (est === 200){
          this.util.closeSpinner();
          datos.forEach((element) => {
            element['color'] = this.getColor();
          });
          for (let i=0; i < datos.length; i++){
          this.dataList.push(datos[i]);
          }
        }
      });
    }
    this.pruebita4 = this.signalIdAddRemove;
    if(this.pruebita4 != null){
      for (let i=0; i < this.pruebita4.length; i++){
        this.dataList = this.dataList.filter((x) => x.idsenal !== this.pruebita4[i]);
        
      }
    }   
  }

  OnDestroy(){
    this.subcripcion.unsubscribe();

  }

    public subcripcion: Subscription = null;

  ngOnInit(): void {

    this.selectedHour = '36';
    this.selectedGrouped = 'Minuto';
    this.origenSelected = 2;
    this.selectedOrigen = 2;
    
    this.subcripcion = this.util.señalesObservable.subscribe(mensaje => {
      this.idseñalesRemoto = mensaje;
    });
    this.getSignals();
    this.dateFrom = new Date(this.fromDate);
    this.dateTo = new Date(this.toDate);
  }

  onChangeOrigen(){
    if(this.origenSelected != 2){
    this.mySignalList = this.signalListFilter.filter(x => x.manual == this.origenSelected);
    }else{
      this.mySignalList = this.signalListFilter;
    }
  }

  onChange(event) {
    this.min = this.dateFrom;
    this.max = new Date(
      this.dateFrom.getFullYear(),
      this.dateFrom.getMonth(),
      this.dateFrom.getDate() + 30
    );
    this.fromDate = moment(this.dateFrom).format('YYYY-MM-DD H:mm:ss');
    this.toDate = moment(this.dateTo).format('YYYY-MM-DD H:mm:ss');
  }

  showChart() {
    let chartsValue = [];
    if (this.getUniqueUnitType(this.dataList)) {
      
      const { empresas } = this.currentUser;
      const empresa = empresas.find(x => x.empresa === this.currentCompanyId);
      
      
      const ids = this.dataList.map(({ idsenal }) => idsenal);
      
      this.objectChartsValue = {
        signals: ids,
        fromDate: this.fromDate,
        toDate: this.toDate,
        groupedBy: this.selectedGrouped,
        rangeByVariable: this.selectedRangeByVariable,
        rengeBySignal: this.selectedRangeBySignal,
        variables: this.sendVariables,
        user: this.currentUser,
        company:empresa
      };
      this.isToggle = !this.isToggle;
      this.objectData.emit(this.objectChartsValue);

      this.util.señalesComunicacion(ids);

      /* BehaSubject*/
      this.util.señalesBehavior(ids);


      this.isVisible.emit(this.isToggle);
      this.dataList.forEach((element) => {
        chartsValue.push({
          unit: element.unidad,
          color: element.color.valor,
        });
      });

      this.chartData.emit(chartsValue);
  
    } else {
      this.toastr.error(
        '¡No es posible hacer reportes de más de dos unidades!'
      );
    }
  }

  /* COMBO BOX */
  onSelectedVariable() {
    
   
    if(this.selectedVariable != null){
  
    this.dataList = [];
    this.isVisibleTable.emit(true);
    const variable = this.variables.find(x => x.idvariable == this.selectedVariable)
    this.sendVariables.push(variable.descripcion.trim());
    this.homeService
      .getSignalVariables(this.currentCompany, this.selectedVariable)
      .subscribe(({ est, datos }) => {
        if (est === 200) {
          this.datosCopy = datos;
          this.datosCopy2 = datos;
            if(this.selectedVariable > 0 && this.selectedOrigen != 2){
              datos = this.datosCopy.filter(x => x.manual == this.selectedOrigen);
            }
          datos.forEach((element) => {
            element['color'] = this.getColor();
          });
          this.dataList = !!this.dataList.length
            ? this.dataList.concat(datos)
            : datos;
          this.signalList.emit(datos);
         
        } else {
          this.toastr.error('¡Algo salió mal con las señales!');
        }
      });
    }
  }

  onSelectedOrigen(){
    this.getVariables();
    this.onCleanPrueba();
    this.onSelectedVariable();
  }

  onCleanFilter(){
    this.dataList = [];
    this.selectedVariable = 0;
    this.selectedOrigen = 2;
    this.signalList.emit(null);
  }

  onCleanPrueba(){
    this.selectedVariable = null;
    this.dataList = [];
    this.signalList.emit(null);
    
  }


  onSelectedTime() {
    this.fromDate = moment()
      .subtract(this.selectedHour, 'hours')
      .format('YYYY-MM-DD H:mm:ss');
    this.toDate = moment().format('YYYY-MM-DD H:mm:ss');
  }

  getUniqueUnitType(signal): boolean {
    let unique = [];
    unique = [...new Set(signal.map((x) => x.unidad))];
    return !!(unique.length <= 2);
  }

  getVariables() {

    this.homeService
      .getMyVariables(this.currentCompany)
      .subscribe(({ est, datos }) => {
        if (est === 200) {
          this.variables = datos;
          this.selectedVariable = 0;
          if(this.selectedOrigen != 2){
            datos = [];
            this.homeService
            .getMyVariablesTipo(this.currentCompany, this.selectedOrigen)
            .subscribe(({ est, datos}) => {
              if (est === 200) {
                this.variables = [];
                this.variables = datos;
                this.selectedVariable = null;
              }
            });
          }
          
        } else {
          this.toastr.error('¡Algo salió mal con las variables!');
        }
      });
      
      
  }

  onCloseModal() {
    this.modalRef.hide();
  }

  onChangeRange(e) {
    const { value } = e.target;
    this.disabledRanges = value === 'range1' ? true : false;
  }

  onChangeUpdate(e) {
    this.disabledUpdate = !this.disabledUpdate;
    if (!this.disabledUpdate) {
      this.selectedUpdate = '1';
    }
  }

  getSignals() {
    this.mySignalList = [];
    this.homeService
      .getMySignalsSensors(this.currentCompany)
      .subscribe(({ est, datos }) => {
        if (est === 200) {
          datos.forEach((element) => {
            element['color'] = this.getColor();
          });
          this.mySignalList = datos.map((x) => {
            return ({signal_station: `${x.nombre_variable} ${x.nombre_estacion}`, ...x})
          })
          this.signalListFilter = datos.map((x) => {
            return ({signal_station: `${x.nombre_variable} ${x.nombre_estacion}`, ...x})
          });
        } else {
          this.toastr.error('¡Algo salió mal con las señales!');
        }
      });
  }
/* señal por uno */
  openModalShowSignals(template: TemplateRef<any>) {
    
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  addSignal(signal) {
    let signalArray = [];
    this.dataList.push(signal);
    signalArray.push(signal);
    this.signalList.emit(signalArray);
    this.toastr.success(signal.nombre_variable,'¡Señal agregada!');
  }

  random(): number {
    return Math.floor(Math.random() * 10);
  }

  getColor() {
    return this.colors[this.random()];
  }
}
