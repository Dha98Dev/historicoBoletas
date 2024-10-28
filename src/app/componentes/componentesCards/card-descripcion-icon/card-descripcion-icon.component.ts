import { Component, Input } from '@angular/core';
import { opciones } from '../../componentesInputs/select-form/select-form.component';
import { Iconos } from '../../../enums/iconos.enum';

@Component({
  selector: 'app-card-descripcion-icon',
  templateUrl: './card-descripcion-icon.component.html',
  styleUrl: './card-descripcion-icon.component.css'
})
export class CardDescripcionIconComponent {


@Input()
public  valores:opciones[]=[]

@Input()
public  titulo:string=''

@Input()
public  icono:Iconos = Iconos.Graduacion;

@Input()
public verificado:boolean = false

}
