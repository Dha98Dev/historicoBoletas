import { Component, Input } from '@angular/core';
import { Iconos } from '../../../enums/iconos.enum';

@Component({
  selector: 'app-card-mensaje',
  templateUrl: './card-mensaje.component.html',
  styleUrl: './card-mensaje.component.css'
})
export class CardMensajeComponent {

  public iconos=Iconos;

  @Input() 
  public titulo: string='';
  
  @Input() 
  public mensaje: string='';
  
  @Input() 
  public icono: Iconos= this.iconos.Info;
}
