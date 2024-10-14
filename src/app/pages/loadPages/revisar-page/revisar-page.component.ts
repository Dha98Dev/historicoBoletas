import { Component } from '@angular/core';
import { HistorialBoletasGetService } from '../../../services/historial-boletas-get.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';
import { Boleta } from '../../../interfaces/cargar-boleta';
import { datosFiltro } from '../../../interfaces/filtros.interface';

@Component({
  selector: 'app-revisar-page',
  templateUrl: './revisar-page.component.html',
  styleUrl: './revisar-page.component.css'
})
export class RevisarPageComponent {

  public registros:Boleta[]=[]

  constructor(private historialGet: HistorialBoletasGetService, private notificaciones:NotificacionesService, private userService:userService){}

  ngOnInit(){
    this.getRegistros()
  }

  getRegistros(){
    let data: datosFiltro  = { cct: "", idCiclo: "",estado:'En Captura', nombre: "", localidad: "", folio: "", curp: "", numeroFiltro: "", "token": this.userService.obtenerToken() }
    // console.log(data)
    this.historialGet.getDatosBoleta(data).subscribe(response =>{
      if(!response.error){
        this.registros = response.data
        console.log(this.registros)

        // creamos un ciclo para encriptar el  id de la boleta

        this.registros.forEach(registro =>{
          registro.id_boleta=this.userService.Encriptar(registro.id_boleta.toString())
        })

      }
      else{
        console.log(response.mensaje)
      }
    })
  }

  redireccionarAVerificarRegistro(event:any){
    console.log(event)
  }

  verCalificaciones(event:any){

  }
}
