import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Iconos } from '../../../enums/iconos.enum';

@Component({
  selector: 'app-banner-mensaje',
  templateUrl: './banner-mensaje.component.html',
  styleUrl: './banner-mensaje.component.css'
})
export class BannerMensajeComponent {
@Input()
tituloBanner: string=''
@Input()
public mensaje: string = ''
@Input()
public IconoSeleccionado:Iconos=Iconos.ExcelFile
@Input()
mostrarBanner:boolean = false
@Input()
public tituloBoton:string=''
@Output()
public onEmitClick:EventEmitter<any> = new EventEmitter

onEmitClickButton(){
this.onEmitClick.emit()
}

}
