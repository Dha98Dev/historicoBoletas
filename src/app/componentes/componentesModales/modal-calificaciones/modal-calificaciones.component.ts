import { Component, Input, SimpleChanges } from '@angular/core';
import { Calificacion, calificacionesPrimaria, calificacionesSecundaria } from '../../../interfaces/cargar-boleta';

@Component({
  selector: 'app-modal-calificaciones',
  templateUrl: './modal-calificaciones.component.html',
  styleUrl: './modal-calificaciones.component.css'
})
export class ModalCalificacionesComponent {


@Input()
public calificacionesPrimaria:Calificacion[] = [];

public promedioPrimaria:number = 0;

@Input()
public calificacionesSecundaria:calificacionesSecundaria = {} as calificacionesSecundaria;

@Input()
  public nivel:string = ''

  @Input()
  public capturador:string = ''

  @Input()
  public Verificador:string = ''

  @Input()
  public Estado :string = ''

  ngOnChanges(changes: SimpleChanges){
    if(changes['calificacionesPrimaria']){
      let suma =0;
      this.calificacionesPrimaria.forEach(cal =>{
      suma +=parseFloat(cal.calificacion)
      })
      this.promedioPrimaria = suma/this.calificacionesPrimaria.length;
    }
  }

}
