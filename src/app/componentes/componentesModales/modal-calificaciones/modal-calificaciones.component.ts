import { Component, Input, SimpleChanges } from '@angular/core';
import { Boleta, Calificacion, calificacionesPrimaria, calificacionesSecundaria } from '../../../interfaces/cargar-boleta';

@Component({
  selector: 'app-modal-calificaciones',
  templateUrl: './modal-calificaciones.component.html',
  styleUrl: './modal-calificaciones.component.css'
})
export class ModalCalificacionesComponent {



public promedioPrimaria:number = 0;

  @Input()
  public boletaSeleccionada:Boleta= {} as Boleta

  ngOnChanges(changes: SimpleChanges){
    if(changes['boletaSeleccionada']  && this.boletaSeleccionada.calificacionesPrimaria){
      let suma =0;
      this.boletaSeleccionada.calificacionesPrimaria.forEach(cal =>{
      suma +=parseFloat(cal.calificacion)
      })
      this.promedioPrimaria = suma/this.boletaSeleccionada.calificacionesPrimaria.length;
    }
  }

}
