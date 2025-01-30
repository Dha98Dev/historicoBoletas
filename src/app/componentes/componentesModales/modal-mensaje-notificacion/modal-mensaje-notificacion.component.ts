import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Iconos } from '../../../enums/iconos.enum';

@Component({
  selector: 'app-modal-mensaje-notificacion',
  templateUrl: './modal-mensaje-notificacion.component.html',
  styleUrl: './modal-mensaje-notificacion.component.css'
})
export class ModalMensajeNotificacionComponent {
public iconos=Iconos

@ViewChild('modal') modal!:ElementRef
@ViewChild('mensaje') mensaje!:ElementRef
@ViewChild('iconoMensaje') icono!:ElementRef

@Input()
public mostrar:boolean = false;

@Input()
public mensajeNotificacion:string = "";

ngAfterViewInit() {
  if (this.mostrar) {
    this.openModal();
  }
}

openModal() {
  const modalElement = this.modal.nativeElement;
  console.log(modalElement)
  const mensajeElement = this.mensaje.nativeElement;

  modalElement.classList.remove('animate__fadeOut')
  mensajeElement.classList.remove('animate__fadeOutUp')
  modalElement.style.display = 'flex'; // Muestra el contenedor del modal
  modalElement.classList.add('animate__animated', 'animate__fadeIn'); // Anima el contenedor
  mensajeElement.classList.add('animate__animated', 'animate__fadeInDown'); // Anima el mensaje

  setTimeout(() => {
    const iconoElement= this.icono.nativeElement
    iconoElement.classList.add('animate__shakeX')
  }, 800);
}

closeModal() {
  const modalElement = this.modal.nativeElement;
  const mensajeElement = this.mensaje.nativeElement;
  const iconoElement= this.icono.nativeElement

  // Primero anima el mensaje de salida
  mensajeElement.classList.remove('animate__fadeInDown');
  mensajeElement.classList.add('animate__fadeOutUp');

  // Espera a que la animación del mensaje termine para ocultar el contenedor
  mensajeElement.addEventListener('animationend', () => {
    modalElement.classList.remove('animate__fadeIn');
    modalElement.classList.add('animate__fadeOut'); // Anima el contenedor de salida
    iconoElement.classList.remove('animate__shakeX')


    // Cuando el contenedor termina de animar, ocúltalo
    modalElement.addEventListener('animationend', () => {
      modalElement.style.display = 'none';
    }, { once: true });
  }, { once: true });
}

ngOnChanges(changes: SimpleChanges) {
if (changes['mostrar']) {
  if (this.mostrar) {
    this.openModal()
  } else {
    this.closeModal()
  }
}
}

}
