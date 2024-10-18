import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

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
  let m=mensaje.split(sepador);
  return m[0];
}
separarDescipcion(mensaje:string, sepador:string):string{
  let m=mensaje.split(sepador);
  return m[1];
}

}
