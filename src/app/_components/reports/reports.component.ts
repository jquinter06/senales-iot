import { Component, OnInit, } from '@angular/core';
import { CompanyService } from '@app/_services/company.service';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {
  public getReports = true;
  public showCharts = false;
  public alert = false;
  public signals;
  public chartValue;
  public chartObject;
  public signalId;
  public signalIdAdd;
  public signalIdAddGlobal;
  public signalIdAddRemove;

  constructor(private CompanyService: CompanyService) {
    this.CompanyService.setLabel('Reportes');
  }

  ngOnInit(): void {
  }

  onVisible(visible) {
    this.showCharts = visible;
  }

  showTable(visible) {
    this.getReports = !visible;
  }

  getSignals(signals) {
    this.signals = signals;
  }

  getSignalId(id) {
    this.signalId = id;
  }

  getSignalIdAdd(id) {
    this.signalIdAdd = id;
  }

  getSignalIdAddGlobal(id) {
    this.signalIdAddGlobal = id;
  }

  getSignalIdAddRemove(id){
    this.signalIdAddRemove = id;
  }

  getChartValue(value){
    this.chartValue = value;
  }

  getObjectData(value){
    this.chartObject = value;
  }

  onToggleCollapse() {
    if (!!this.signals) {
      this.showCharts = !this.showCharts
    }
  }
}
