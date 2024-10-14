import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { opciones } from '../select-form/select-form.component';

@Component({
  selector: 'app-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrl: './checkbox-input.component.css'
})
export class CheckboxInputComponent {

  @Input()
  public opciones:opciones[] =[];

  @Output()
  public OnEmitCheckboxSeleccionado:EventEmitter<any> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges){
    if(changes['opciones']){
      this.opciones = this.opciones.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  }
  
  emitirValor(valor: any){
    this.OnEmitCheckboxSeleccionado.emit(valor);
  }
}
