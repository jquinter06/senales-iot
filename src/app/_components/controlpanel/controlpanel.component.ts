import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyService } from '@app/_services/company.service';
import { HomeServiceService } from '@app/_services/home.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.less']
})
export class ControlpanelComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  public currentCompany;
  public loading = false;
  public loadingUrl = false;
  public expand = false;
  public panels = [];
  public tiposeleccion = [

  ];
  public estaciones = [];
  public url;
  public selectedPanel = null;
  public selectedOption = null;
  public selectedDetalisStations = null;
  public selectionEmpresa : boolean = false;

  public estacion = [];

  constructor(
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private homeService: HomeServiceService,
    private CompanyService: CompanyService,
    private cd: ChangeDetectorRef) {
    this.CompanyService.setLabel('Tablero de control');
    this.CompanyService.company.subscribe((x) => {
      this.currentCompany = x;
      if (!!this.currentCompany) {
/*        this.getPanel();*/
        this.selectedPanel = null;
        this.url = null;
      }
      this.cd.markForCheck();
    });
  }

  ngOnInit(): void {
    const id = this.CompanyService.companyValue;
    this.tiposeleccion.push(
      {nombre:'Empresa', id, tipo:'empresa'},
      {nombre:'Estación', id, tipo:'estacion'})
  }

  expanPanel() {
    let side = document.querySelector('#sidebar');
    let content = document.querySelector('#content');
    let prueba = document.querySelector('#prueba')
    if(!this.expand){
      side.classList.add('active');
      content.classList.remove('content-open');
      prueba.classList.remove('open');
      this.expand = !this.expand;
      side.classList.add('active');
      content.classList.remove('content-open');
      prueba.classList.remove('open');
      this.CompanyService.setExpandPanel(this.expand);
    }else{
      side.classList.remove('active');
      content.classList.add('content-open');
      prueba.classList.add('open');
      this.expand = !this.expand;
      side.classList.remove('active');
      content.classList.add('content-open');
      prueba.classList.add('open');
      this.CompanyService.setExpandPanel(this.expand);
    }
  }

  getPanel(path: string) {
    this.loading = true;

    this.homeService.getUrls(this.currentCompany,path).subscribe(({ est, datos }) => {
      if (est === 200) {
        this.panels = datos;
        
      } else {
        this.panels = null;
        this.toastr.error('¡Algo salió mal con el panel de control!');
      }
      this.loading = false;
    });
  }

  onChange(e) {
    this.selectedOption = null;
    this.selectedDetalisStations = null;
    if(e.tipo === 'empresa'){
      this.getPanel('tableros_control');
      this.selectionEmpresa = true;
    }else{
      this.getPanel('tableros_estacion')
      this.selectionEmpresa = false;
    }

  }

  onChangeSelection(e){
    this.loading = true;
    this.selectedDetalisStations = null;

    if(this.selectionEmpresa){
      const panel = this.panels.find(x => x.id === this.selectedOption);
      if (!!panel) {
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${panel.url}?theme=light`);
      } else {
        this.url = null;
      }
    }else if(this.selectionEmpresa === false){
        
        this.homeService.getUrslDetalleEstacion(e.id).subscribe(({ est, datos }) => {
        
        if (est === 200) {
          this.estaciones = datos;
          const panel = this.estaciones.find(x => x.id === this.selectedOption);
        if(this.estaciones.length > 0 && this.estaciones.length < 2){
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${panel.url}?theme=light`); 
        }

        }else {
          this.toastr.error('¡Algo salió mal con el panel de control!');
        }
        this.loading = false;
      });
    }


  }

  onChangeSelectionDetalle(e){
    const panel = this.estaciones.find(x => x.nombre === this.selectedDetalisStations);
    if (!!panel) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${panel.url}?theme=light`);
    } else {
      this.url = null;
    }
  }

}
