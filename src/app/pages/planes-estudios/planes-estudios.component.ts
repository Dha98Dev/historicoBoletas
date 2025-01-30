import { Component } from '@angular/core';
import { GetNombreService } from '../../services/get-nombre.service';

@Component({
  selector: 'app-planes-estudios',
  templateUrl: './planes-estudios.component.html',
  styleUrl: './planes-estudios.component.css'
})
export class PlanesEstudiosComponent {
constructor( private tituloPagina:GetNombreService){}
ngOnInit(){
  this.tituloPagina.setNombre='Planes de Estudios';
}
}
