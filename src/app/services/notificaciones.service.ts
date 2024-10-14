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

separarValor(mensaje:string, sepador:string):string{
  let m=mensaje.split(sepador);
  return m[0];
}
separarDescipcion(mensaje:string, sepador:string):string{
  let m=mensaje.split(sepador);
  return m[1];
}

}
