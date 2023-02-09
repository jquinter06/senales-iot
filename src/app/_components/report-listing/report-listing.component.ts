import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UtilService } from 'src/app/_services/util.service';
@Component({
  selector: 'app-report-listing',
  templateUrl: './report-listing.component.html',
  styleUrls: ['./report-listing.component.scss']
})

export class ReportListingComponent implements OnInit, OnChanges {
  @Input() signalList;
  @Output() setSignalId = new EventEmitter<any>();
  @Output() setSignalIdAdd = new EventEmitter<any>();
  @Output() setSignalIdAddGlobal = new EventEmitter<any>();
  @Output() setSignalIdAddRemove = new EventEmitter<any>();

  public isCheck = false;
  public arrayId = [];
  public signalArray = [];
  public idseñalesRemoto;
  public colors = [
    { id: "2", nombre: "Amarillo", valor: "#F5D93F" },
    { id: "3", nombre: "Azul", valor: "#109CF1" },
    { id: "4", nombre: "Fuscia", valor: "#E02CC4" },
    { id: "5", nombre: "Gris", valor: "#8492A4" },
    { id: "6", nombre: "Naranja", valor: "#FFB946" },
    { id: "7", nombre: "Negro", valor: "#0C1032" },
    { id: "8", nombre: "Rojo", valor: "#F7685B" },
    { id: "9", nombre: "Turquesa", valor: "#7557E5" },
    { id: "10", nombre: "Verde", valor: "#2ED47A" },
    { id: "11", nombre: "Morado", valor: "#7456e8" }
  ]

  constructor(
    private util: UtilService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    if(this.signalList === null){
      this.signalArray = [];
    }
    const { currentValue } = changes.signalList;
    if (!!currentValue) {
      if(this.signalList.length > 1){
        this.signalArray = [];
      }
      currentValue.forEach(element => {
        if (!(this.signalArray.find(x => x.idsenal === element.idsenal))) {
          this.signalArray.push(element);
        
          setTimeout(() => {
            const item = document.getElementById(element.idsenal) as HTMLInputElement
           
            item.checked = true
          }, 50);
        }
      });
    }
  }

  ngOnInit(): void { 
    
  }

  selectAll() {
    this.setSignalId.emit(null);
    this.setSignalIdAdd.emit(null);
    this.setSignalIdAddGlobal.emit(null);
    this.setSignalIdAddRemove.emit(null);
    let ids = [];
    const checkbox = Array.from(document.querySelectorAll('.checkbox'));
    checkbox.forEach((item) => {
      let element = document.getElementById(item.id) as HTMLInputElement;
      element.checked = this.isCheck;
      ids.push(+item.id);
    });
    this.arrayId = this.isCheck ? [...new Set(ids)] : [];
   
   

   if(this.isCheck){
     console.log("o");
    this.setSignalIdAddGlobal.emit(ids);
   }else{
     console.log("i");
    this.setSignalIdAddRemove.emit(ids);
   }
  }

  isChecked(id, event) {
    this.setSignalId.emit(null);
    this.setSignalIdAdd.emit(null);
    this.setSignalIdAddGlobal.emit(null);
    this.setSignalIdAddRemove.emit(null);
    const { checked } = event.target
    if (checked) {
      //this.setSignalIdAddGlobal.emit(null);
      //this.setSignalIdAddRemove.emit(null);
      this.arrayId.push(id);
      this.arrayId = [...new Set(this.arrayId)];
      this.setSignalIdAdd.emit(id);
      
    } else {
      //this.setSignalIdAddGlobal.emit(null);
      //this.setSignalIdAddRemove.emit(null);
      this.setSignalId.emit(id);
    }
  }

  resetTable() {
    this.signalArray = null;
    this.signalArray = [];
  }

}

