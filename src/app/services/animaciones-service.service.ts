import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimacionesServiceService {

  constructor() { }
  mostrarElemento(elemento:ElementRef){
    const modalElement = elemento.nativeElement;

    modalElement.classList.remove('animate__fadeOut')
    modalElement.style.display = 'flex'; // Muestra el contenedor del modal
    modalElement.classList.add('animate__animated', 'animate__fadeIn'); // Anima el contenedor

  }


  ocultarElemento(elemento:ElementRef){
    const modalElement = elemento.nativeElement; 
    // Espera a que la animación del mensaje termine para ocultar el contenedor
    addEventListener('animationend', () => {
      modalElement.classList.remove('animate__fadeIn');
      modalElement.classList.add('animate__fadeOut'); // Anima el contenedor de salida

      // Cuando el contenedor termina de animar, ocúltalo
      modalElement.addEventListener('animationend', () => {
        modalElement.style.display = 'none';
      }, { once: true });
    }, { once: true });
  }
}
