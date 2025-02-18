import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import Toastify from 'toastify-js'
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

mostrarAlertaSimple(mensaje:string):void{
  Swal.fire(mensaje);
}
mostrarAlertaConIcono(title:string, body:string, icon:SweetAlertIcon ):void{
  Swal.fire({
    title: title,
    text: body,
    icon: icon
  });
}

mostrarConfirmacion(mensaje: string, textConfirm: string, textDeny: string): Promise<boolean> {
  return new Promise((resolve) => {
    Swal.fire({
      title: mensaje,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: textConfirm,
      denyButtonText: textDeny
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else if (result.isDenied) {
        resolve(false);
      } else {
        resolve(false); // Si se cancela, o no se confirma ni se niega
      }
    });
  });
}

separarValor(mensaje:string, sepador:string):string{
if(mensaje != '' || mensaje !=  undefined || mensaje != null){
  let m=mensaje.split(sepador);
  return m[0];
}
return '';
}
separarDescipcion(mensaje:string, sepador:string):string{
if(mensaje != '' || mensaje !=  undefined || mensaje != null){
    let m=mensaje.split(sepador);
    return m[1];
  }
  return '' 
}


Toastify(mensaje:string, clase:string){
  let background= clase == 'error' ? 'linear-gradient(270deg, hsla(311, 94%, 50%, 1) 20%, hsla(0, 96%, 46%, 1) 100%)' : ' linear-gradient(270deg, hsla(107, 100%, 31%, 1) 20%, hsla(121, 100%, 29%, 1) 100%)'

  
  Toastify({
    text: mensaje,
    className: "info",
    position:'center',
    duration: 7000,
    offset: {
      x: 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
      y: 100 // vertical axis - can be a number or a string indicating unity. eg: '2em'
    },
    style: {
      background: background,
      position: 'absolute',

    }
  }).showToast();

}


}
