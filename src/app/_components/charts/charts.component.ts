import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeServiceService } from '@app/_services/home.service';
import * as echarts from 'echarts';
import { Location } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UtilService } from 'src/app/_services/util.service';
import { CompanyService } from '@app/_services/company.service';
import { ChartServiceService } from '@app/_services/chart.service';
import { FormControl, FormGroup } from '@angular/forms';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  public currentCompany;
  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  private currentCompanyId = JSON.parse(localStorage.getItem('CompanyId'));

  public data: any[];
  public id;
  public active = '#22b0fc';
  public signal;
  public today = moment().format('YYYY-MM-DD H:mm:ss');
  public fromDate = moment(this.today)
    .subtract(36, 'hours')
    .format('YYYY-MM-DD H:mm:ss');
  public toDate = this.today;
  public lastUpdate;
  public showChart = true;
  public options: any;
  public updateOptions: any;
  public back;
  public serie = [];
  public mergeOptions = {};
  public modalRef: BsModalRef;
  public signalList = [];
  public signals = [];
  public isLoading = false;
  public loading = false;
  public hours = [
    { name: '36 horas', id: 36 },
    { name: '24 horas', id: 24 },
    { name: '12 horas', id: 12 },
    { name: '6 horas', id: 6 },
    { name: '1 horas', id: 1 },
  ];
  public selectedHour;
  public colors = [
    '#FC7D58',
    '#FFB946',
    '#2ED47A',
    '#22B0FC',
    '#F4E04D',
    '#7557E5',
    '#FC7D58',
    '#37C1CF',
    '#334D6E',
    '#C2CFE0',
  ];
  isFirstTime: any;
  public selectedExportData = true;
  public dateFrom: Date = new Date();
  public currentDay = new Date();
  public dateTo: Date = new Date(
    this.currentDay.getFullYear(),
    this.currentDay.getMonth(),
    this.currentDay.getDate() + 30
  );
  public format = 'dd/MM/yyyy HH:mm';
  public min: Date = this.dateFrom;
  public max: Date = this.dateTo;
  public exportData = [
    { name: 'Fecha', id: true },
    { name: 'Señal y Fecha ', id: false },
  ];


  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private location: Location,
    private homeService: HomeServiceService,
    private CompanyService: CompanyService,
    private cd: ChangeDetectorRef,
    private chartService: ChartServiceService,
    private util: UtilService
  ) {
    this.CompanyService.company.subscribe((company) => {
      this.currentCompany = company;
      this.cd.markForCheck();
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.signals.push(this.id);
    this.signal = window.history.state.signal;
    if (this.signal) {
      this.active = this.signal.estado === '1' ? '#22b0fc' : '#FFB946';
    }
    this.getData(this.fromDate, this.toDate);
    this.selectedHour = '36';
    this.dateFrom = new Date(this.fromDate);
    this.dateTo = new Date(this.toDate);
  }

  form = new FormGroup({
    exportType: new FormControl(''),
  });

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

  goBack() {
    this.location.back();
  }

  addSignals(signal) {
    const unique = [...new Set(this.signals)];
    if (unique.length >= 10) {
      this.toastr.error('¡No se puede agregar más señales!');
    } else {
      this.signals.push(signal);
    }
  }

  addData() {
    if(this.toDate < this.today){
      const endDate = moment(this.toDate)
      .add(this.selectedHour, 'hours')
      .format('YYYY-MM-DD H:mm:ss');
    this.getData(this.fromDate, endDate);
    this.toDate = endDate;
    this.dateTo = new Date(this.toDate);
    }else{
      this.toastr.error('¡La fecha final es superior a la actual!');
    }
  }

  removeData() {
    const startDate = moment(this.fromDate)
      .subtract(this.selectedHour, 'hours')
      .format('YYYY-MM-DD H:mm:ss');
    this.getData(startDate, this.toDate);
    this.fromDate = startDate;
    this.dateFrom = new Date(this.fromDate);
  }

  graficar(){
    const startDate = moment(this.fromDate)
      .format('YYYY-MM-DD H:mm:ss');
    this.getData(startDate, this.toDate);
    this.fromDate = startDate;

    const endDate = moment(this.toDate)
      .format('YYYY-MM-DD H:mm:ss');
    this.getData(this.fromDate, endDate);
    this.toDate = endDate;
  }

  getSignals() {
    this.homeService
      .getSignals(this.currentCompany, this.currentUser.usuario)
      .subscribe(({ est, datos }) => {
        if (est === 200) {
          this.signalList = datos.map((x) => {
            return {
              signal_station: `${x.nombre_variable} ${x.nombre_estacion}`,
              ...x,
            };
          });
        } else {
          this.toastr.error('¡Algo salió mal con las señales!');
        }
      });
  }

  openModalShowSignals(template: TemplateRef<any>) {
    this.getSignals();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  onCloseModal() {
    this.modalRef.hide();
  }


  getData(fromDate, toDate) {
    this.util.openSpinner();
    this.chartService
      .getDataChart(
        this.signals.toString(),
        moment(fromDate).format('YYYY-MM-DD H:mm:ss'),
        moment(toDate).format('YYYY-MM-DD H:mm:ss'),
        'S',
        'false',
        'false'
      )
      .subscribe(({ est, data }) => {   
        if (est === 200) {
          this.util.closeSpinner();
          this.serie = [];
          const legend = Object.keys(data);
          let dates;
          const chartDataValues = Object.values(data);
          if (chartDataValues instanceof Array) {
            const lengths = chartDataValues.map((chart) => chart.length);
            const index = lengths.indexOf(Math.max(...lengths));
            dates = chartDataValues[index].map((item) => {
              return moment(item.fecha).format('YYYY/MM/DD H:mm:ss');
            });
            chartDataValues.forEach((chartItem, index) => {
              let values = [];
              values = chartItem.map((item) => {
                return item.value;
              });
              const obj = {
                name: chartItem[0].nombre,
                type: 'line',
                step: 'start',
                smooth: true,
                stack: 'Total',
                data: values,
              };
              this.serie.push(obj);
            }); 
          }
          this.options = {
            
            color: this.signals.length > 1 ? this.colors : this.active,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#505765',
                },
              },
            },
            toolbox: {
              show: true,
              feature: {
                dataZoom: {
                  yAxisIndex: 'none',
                  title: {zoom: 'area', back: 'area reset'},
                },
                magicType: 
                { 
                  type: ['line', 'bar'],
                  title: {line: 'grafica lineal', bar: 'grafica de barras'},
               },
                restore: {title: "restablecer"},
                saveAsImage: {title: "capture"},
              }           
            },
            legend: {
              
              data: legend,
            },
            xAxis: {
              type: 'category',
              data: dates,
            },
            yAxis: {
              type: 'value',
            },
            dataZoom: [
              {
                show: true,
                realtime: true,
              },
            ],
            series: this.serie,
          };
        } else {
          this.showChart = false;
          this.toastr.error('¡No hay datos que mostrar!');
          this.util.closeSpinner();
        }
      });
    }

  onClose() {
    this.signals = [...new Set(this.signals)];
    this.getData(this.fromDate, this.toDate);
    this.modalRef.hide();
  }

  submit() {
    this.showImage();
  }

  async showImage() {
    const node = document.getElementById('chart');
      const { empresas } = this.currentUser;
      const empresa = empresas.find(x => x.empresa === this.currentCompanyId);
    const img = await domtoimage
      .toPng(node)
      .then(function (dataUrl) {
        return dataUrl;
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
    this.chartService
      .exportChart(
        this.signals,
        [this.signal.descsenal],
        this.fromDate,
        this.toDate,
        'Minuto',
        img,
        empresa.logo,
        this.currentUser.usuario,
        empresa.nombre,
        this.selectedExportData,
        this.form.value.exportType
      )
      .subscribe(({ data, est }) => {
        if (est === 200) {
          const { url } = data;
          window.open(url, '_blank');
        }
      });
  }

}
