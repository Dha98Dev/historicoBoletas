
import { Component, ElementRef, EventEmitter, Inject, Input, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  templateUrl: './modal-confirmacion.component.html',
  styleUrl: './modal-confirmacion.component.css',
  encapsulation:ViewEncapsulation.None
})
export class ModalConfirmacionComponent {

constructor(){}

// estos son los inputs 
@Input()
public titulo:string = '¿Desea confirmar la Veracidad de la información ?'

@Input()
public mensaje:string = 'La información se marcará como revisada, dando por hecho que la información capturada es correcta '

@Input()
public textoBotonConfirmar:string = 'Confirmar'

@Input()
public textoBotonCancelar:string = 'No Confirmar'

@Output() accionConfirmada = new EventEmitter<boolean>();
mostrarModal: boolean = false;

mostrar(): void {
    this.mostrarModal = true; // Activa la visibilidad y las animaciones
}

ocultar(): void {
    this.mostrarModal = false; // Desactiva las animaciones y oculta el modal
}

confirmar(): void {
    this.accionConfirmada.emit(true);
    this.ocultar();
}

cancelar(): void {
    this.accionConfirmada.emit(false);
    this.ocultar();
}
}
