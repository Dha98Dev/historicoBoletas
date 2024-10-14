import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-input-completo',
  templateUrl: './label-input-completo.component.html',
  styleUrl: './label-input-completo.component.css'
})
export class LabelInputCompletoComponent {

  @Input ()
  public smallIndicador: boolean = false;

  @Input ()
  public texto:string = "Campo Completado Correctamente";
}
