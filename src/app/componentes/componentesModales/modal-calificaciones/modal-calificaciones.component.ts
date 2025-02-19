import { Component, Input, SimpleChanges } from '@angular/core';
import { Boleta, Calificacion, calificacionesPrimaria, calificacionesSecundaria } from '../../../interfaces/cargar-boleta';

@Component({
  selector: 'app-modal-calificaciones',
  templateUrl: './modal-calificaciones.component.html',
  styleUrl: './modal-calificaciones.component.css'
})
export class ModalCalificacionesComponent {



public promedioPrimaria:number = 0;
public mostrarCalificaciones:boolean = false;

  @Input()
  public boletaSeleccionada:Boleta= {} as Boleta

  ngOnChanges(changes: SimpleChanges){
    let suma =0; 
    if(changes['boletaSeleccionada']){
      this.boletaSeleccionada.calificacionesPrimaria.forEach(cal =>{
        suma+=parseInt(cal.calificacion)
      })
    }
    if ((suma > 0 && !isNaN(suma)) || !isNaN(this.boletaSeleccionada.calificacionesSecundaria.calificacionFinal) ) {
      this.mostrarCalificaciones=true;
    }
    else{
      this.mostrarCalificaciones=false;
    }

  }

}
