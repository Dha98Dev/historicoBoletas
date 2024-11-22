import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { listadoErrores } from '../../../interfaces/errores.interface';
import { Iconos } from '../../../enums/iconos.enum';

@Component({
  selector: 'app-listado-errores-cexcel',
  templateUrl: './listado-errores-cexcel.component.html',
  styleUrl: './listado-errores-cexcel.component.css'
})
export class ListadoErroresCExcelComponent {
@Input()
public listadoErroresEncontrados: listadoErrores[]=[]
public iconos=Iconos
@ViewChild('modalContainer') modalContainer!: ElementRef;

cerrarErrores() {
  const modalElement = this.modalContainer.nativeElement;

  // Cambiar a la clase "hide"
  modalElement.classList.add('animate__zoomOut');
  modalElement.classList.remove('animate__zoomIn');
  
  setTimeout(() => {
    modalElement.classList.add('hide');
    modalElement.classList.remove('show');

  }, 2000);

  // Esperar que la transición termine para ocultar el modal
  modalElement.addEventListener(
    'transitionend',
    () => {
      // this.mostrarListadoErrores = false;
    },
    { once: true } // Escucha solo una vez
  );
}

}
