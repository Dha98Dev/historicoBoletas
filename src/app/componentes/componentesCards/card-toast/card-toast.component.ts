import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Iconos } from '../../../enums/iconos.enum';

@Component({
  selector: 'app-card-toast',
  templateUrl: './card-toast.component.html',
  styleUrl: './card-toast.component.css'
})
export class CardToastComponent {

  public iconos=Iconos
  @ViewChild('mensaje') mensaje!:ElementRef

  
  @Input()
  public mostrar:boolean = false;
  @Input()
  public iconoSeleccionado:Iconos=this.iconos.XToCloseRounded
  @Input()
  public Valido: boolean = false;
  @Input()
  public mensajeToast:string = "";
  @Input()
  public tituloToast:string = ''
  @Input()
  public tiempoSegundos:number = 7; 
  

  // ngAfterViewInit() {
  //   if (this.mostrar) {
  //     this.openModal();
  //   }
  // }
  
  openModal() {
    const mensajeElement = this.mensaje.nativeElement;
  
    mensajeElement.classList.remove('animate__slideOutRight', 'ocultar')
    mensajeElement.classList.add('animate__animated', 'animate__slideInRight', 'mostrar'); // Anima el mensaje


  }
  
  closeModal() {
    const mensajeElement = this.mensaje.nativeElement;
  
    // Primero anima el mensaje de salida
    mensajeElement.classList.remove('animate__slideInRight', 'mostra');
    mensajeElement.classList.add('animate__slideOutRight');
    setTimeout(() => {
      mensajeElement.classList.add('ocultar')
    }, 2000);
  
  }
  
  ngOnChanges(changes: SimpleChanges) {
  if (changes['mostrar']) {
    console.log(changes['mostrar'])
    if (this.mostrar) {
      this.openModal()
    } else {
      this.closeModal()
    }
  }
  }
  

}
