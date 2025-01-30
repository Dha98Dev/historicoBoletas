
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
public titulo:string = '¿Desea confirmar la Veracidad de la informacion ?'

@Input()
public mensaje:string = 'La informacion se marcará como revisada, dando por echo que la informacion capturada es correcta '

@Input()
public textoBotonConfirmar:string = 'Confirmar'

@Input()
public textoBotonCancelar:string = 'Cancelar'

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
