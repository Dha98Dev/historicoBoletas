import { Component, Input } from '@angular/core';
import { listadoPlanesEstudios } from '../../../interfaces/cargar-boleta';

@Component({
  selector: 'app-card-plan-estudio',
  templateUrl: './card-plan-estudio.component.html',
  styleUrl: './card-plan-estudio.component.css'
})
export class CardPlanEstudioComponent {

  @Input()
  public listadoPlanes:listadoPlanesEstudios[]=[]
  

}
