import { Component, ElementRef, EventEmitter, Input, input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { hojaCertificado } from '../../../interfaces/archivo.interface';
import { Iconos } from '../../../enums/iconos.enum';

@Component({
  selector: 'app-card-miniatura-imagen',
  templateUrl: './card-miniatura-imagen.component.html',
  styleUrl: './card-miniatura-imagen.component.css'
})
export class CardMiniaturaImagenComponent {
  @ViewChild('contenedor') contenedor!:ElementRef 

  @Input()
  public hojaCertificado:hojaCertificado = {} as hojaCertificado
  @Input()
  public mostrarBotonEliminar:boolean = false

  @Output()
  public emitClick:EventEmitter<boolean> = new EventEmitter();
  public iconos=Iconos


  emitirClick(){
    this.emitClick.emit(true)
  }

  activarSalida(){
    this.contenedor.nativeElement.classList.remove('animate__backInLeft')
this.contenedor.nativeElement.classList.add('animate__backOutLeft')

setTimeout(() => {
  this.emitirClick()
}, 2000);
  }

  activarEntrada(){
    this.contenedor.nativeElement.classList.add('animate__backInLeft')
    this.contenedor.nativeElement.classList.remove('animate__backOutLeft')
    
  }

  ngOnChanges(changes: SimpleChanges) {
if (changes['hojaCertificado']  && this.hojaCertificado.nombre_hoja) {
  this.activarEntrada()
}
  }

}
