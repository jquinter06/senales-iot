import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import * as echarts from 'echarts';
import domtoimage from 'dom-to-image';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChartServiceService } from '@app/_services/chart.service';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-report-chart',
  templateUrl: './report-chart.component.html',
  styleUrls: ['./report-chart.component.scss'],
})
export class ReportChartComponent implements OnInit {
  options: any;
  updateOptions: any;
  @Input() chatData;
  @Input() objectData;

  public arraySeñales = [];
  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public loading = false;
  public series = [];
  public modalRef: BsModalRef;
  public formatter = [];
  public exportData = [
    { name: 'Fecha', id: true },
    { name: 'Señal y Fecha ', id: false },
  ];
  public hours = [
    { name: '36 horas', id: 36 },
    { name: '24 horas', id: 24 },
    { name: '12 horas', id: 12 },
    { name: '6 horas', id: 6 },
    { name: '1 horas', id: 1 },
  ];
  public selectedExportData = true;
  private timer: any;
  public showChart = false;

  public fromDates;
  public toDates;
  public idseñalesRemoto;
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
  public selectedHour;
  public today = moment().format('YYYY-MM-DD H:mm:ss');

  constructor(
    private modalService: BsModalService,
    private service: ChartServiceService,
    private toastr: ToastrService,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    
    const {
      fromDate,
      toDate
    } = this.objectData;
    this.fromDates = fromDate;
    this.toDates = toDate;
    this.getDataChart(this.fromDates, this.toDates);
    this.selectedHour = '36';

    this.dateFrom = new Date(this.fromDates);
    this.dateTo = new Date(this.toDates);
  }

  form = new FormGroup({
    exportType: new FormControl(''),
  });

  openModalShowSignals(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }
  onCloseModal() {
    this.modalRef.hide();
  }

  addData() {
    if(this.toDates < this.today){
    const endDate = moment(this.toDates)
      .add(this.selectedHour, 'hours')
      .format('YYYY-MM-DD H:mm:ss');
    this.getDataChart(this.fromDates, endDate);
    this.toDates = endDate;
    this.dateTo = new Date(this.toDates);
    }else{
      this.toastr.error('¡La fecha final es superior a la actual!');
    }
  }

  removeData() {
    const startDate = moment(this.fromDates)
      .subtract(this.selectedHour, 'hours')
      .format('YYYY-MM-DD H:mm:ss');
    this.getDataChart(startDate, this.toDates);
    this.fromDates = startDate;
    this.dateFrom = new Date(this.fromDates);
  }

  onChange(event) {
    this.min = this.dateFrom;
    this.max = new Date(
      this.dateFrom.getFullYear(),
      this.dateFrom.getMonth(),
      this.dateFrom.getDate() + 30
    );
    this.fromDates = moment(this.dateFrom).format('YYYY-MM-DD H:mm:ss');
    this.toDates = moment(this.dateTo).format('YYYY-MM-DD H:mm:ss');

  }

  graficar(){
    this.getDataChart(this.fromDates, this.toDates);
  }

  getDataChart(fromDates, toDates) {
  
    this.util.subjectSeñalesBehavior.subscribe(mensaje => {
      this.idseñalesRemoto = mensaje;
    });

    this.series = [];
    this.util.openSpinner();
    this.loading = true;
    
    const {
      signals,
      groupedBy,
      rangeByVariable,
      rengeBySignal,
    } = this.objectData;
   
    this.service
      .getDataChart(
        signals,
        moment(fromDates).format('YYYY-MM-DD H:mm:ss'),
        moment(toDates).format('YYYY-MM-DD H:mm:ss'),
        groupedBy,
        rangeByVariable,
        rengeBySignal
      )
      .subscribe(({ est, data }) => {
        this.util.closeSpinner();
        if (est === 200) {
          if (!!data) {
            this.showChart = true;
            const seriesData = Object.values(data);
            const color = this.chatData.map(({ color }) => color);
            let ayixData = [];

            this.chatData.forEach((item) => {
              ayixData.push({
                type: 'value',
                name: item.unit,
                axisLabel: {
                  formatter: `{value}`,
                },
              });
            });

            

            seriesData.forEach((subarray: any) => {
              let itemsArray = [];
              subarray.forEach((element) => {
                itemsArray.push([
                  moment(element.fecha).format(),
                  element.value,
                ]);
              });
              console.log("probando", subarray);
              this.series.push({
                name: subarray[0].nombre,
                type: 'line',
                symbol: 'circle',
                symbolSize: 5,
                data: itemsArray,
              });
            });

            

            this.options = {
              color: color,
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985',
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
              dataZoom: [
                {
                  type: 'slider',
                  xAxisIndex: 0,
                  filterMode: 'empty',
                },
                {
                  type: 'slider',
                  yAxisIndex: 0,
                  filterMode: 'empty',
                },
                {
                  type: 'inside',
                  xAxisIndex: 0,
                  filterMode: 'empty',
                },
                {
                  type: 'inside',
                  yAxisIndex: 0,
                  filterMode: 'empty',
                },
              ],
              legend: {},
              calculable: true,
              xAxis: {
                type: 'time',
                axisLabel: {
                  formatter: (value) => {
                    return moment(value).format('MM-DD-YYYY H:mm');
                  },
                },
              },
              yAxis: ayixData,
              series: this.series,
            };
          }
        }
        this.loading = false;
      });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.showImage();
  }

  async showImage() {

    const node = document.getElementById('chart');
    const { signals, fromDate, toDate, groupedBy, company, user, variables } =
      this.objectData;
    const img = await domtoimage
      .toPng(node)
      .then(function (dataUrl) {
        return dataUrl;
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
    this.service
      .exportChart(
        signals,
        variables,
        this.fromDates,
        this.toDates,
        groupedBy,
        img,
        company.logo,
        user.usuario,
        company.nombre,
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
