import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class GetNombreService {
  private nombrePagina:string = ''

set setNombre(nombre:string){
this.nombrePagina = nombre
this.titulo.setTitle(this.nombrePagina)
}

  constructor(private titulo:Title) { }

  get urlImagenes(){
    return 'https://srv37app003.sepen.gob.mx'
  }
}
