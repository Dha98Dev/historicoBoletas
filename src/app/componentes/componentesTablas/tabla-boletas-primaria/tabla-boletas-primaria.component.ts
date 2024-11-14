import { Component, Input, SimpleChanges } from '@angular/core';
import { boletaPrimaria } from '../../../interfaces/cargar-boleta';

@Component({
  selector: 'app-tabla-boletas-primaria',
  templateUrl: './tabla-boletas-primaria.component.html',
  styleUrl: './tabla-boletas-primaria.component.css'
})
export class TablaBoletasPrimariaComponent {
@Input()BoletasPrimaria:boletaPrimaria[] = [];
@Input() clase :string = ''
@Input() titulo :string = ''
@Input() textDanger:boolean = false

ngOnChanges(changes: SimpleChanges){
if (changes['BoletasPrimaria']) {
  console.log(this.BoletasPrimaria) 
}
}
}
