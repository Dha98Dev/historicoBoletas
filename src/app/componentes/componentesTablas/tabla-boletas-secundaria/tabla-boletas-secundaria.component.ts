import { Component, Input, SimpleChanges } from '@angular/core';
import { boletaSecundaria } from '../../../interfaces/cargar-boleta';

@Component({
  selector: 'app-tabla-boletas-secundaria',
  templateUrl: './tabla-boletas-secundaria.component.html',
  styleUrl: './tabla-boletas-secundaria.component.css'
})
export class TablaBoletasSecundariaComponent {
@Input() BoletasSecundaria:boletaSecundaria[]= [];
@Input() clase :string = ''
@Input() titulo :string = ''
@Input() textDanger:boolean = false

ngOnChanges(changes: SimpleChanges){
  if (changes['BoletasPrimaria']) {
  }
  }
}
