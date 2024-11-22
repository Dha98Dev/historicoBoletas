import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

export interface opciones{
  nombre:string,
  valor:any,
  selected?:boolean,
  // esta es para poder hacer los filtros y el ordenamiento de los planes de estudios
  educacion_indigena?:string
  [key: string]: any;
}

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrl: './select-form.component.css'
})
export class SelectFormComponent {

  public esCampoValido:boolean=true
  public campoTocado:boolean=false


  @Input()
  public opciones:opciones[]=[];

  @Input()
  smallIndicator:boolean=false
  
  @Input()
  public mensajePredeterminado:string='Seleccione una Opcion'

  @Output()
  OnEmitValorSelect:EventEmitter<any> = new EventEmitter();

  emitirValor(valor: string|number){
    if(valor != ""){
      this.OnEmitValorSelect.emit(valor);
      this.esCampoValido=true;
    }
    else{
      this.esCampoValido=false;
    }
  }

  marcarTocado(valor:string|number){
    this.campoTocado=true;
  this.validarCampo(valor)
  }
  
  validarCampo(valor: string|number){
    if (valor=='' && this.campoTocado) {
      this.esCampoValido=false;
    }
    else{
      this.esCampoValido=true;
    }
  }

  ngOnChanges(changes: SimpleChanges){
if (changes['opciones']) {
  let selected =false;
  this.opciones.forEach(opcion =>{
    if (opcion.selected) {
      this.campoTocado=true;
      this.esCampoValido=true;
      selected=true;
      this.emitirValor(opcion.valor)
    }
  })
  this.campoTocado=selected
  

}

  }

}
