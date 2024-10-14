import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-input-incompleto',
  templateUrl: './label-input-incompleto.component.html',
  styleUrl: './label-input-incompleto.component.css'
})
export class LabelInputIncompletoComponent {

  @Input() 
  public smallIndicator:boolean = false

  @Input()
  public texto:string="Debe de llenar este Campo"

}
