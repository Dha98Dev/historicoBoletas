import { Component } from '@angular/core';
import { HistorialBoletasGetService } from '../../../services/historial-boletas-get.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';
import { Boleta } from '../../../interfaces/cargar-boleta';
import { datosFiltro } from '../../../interfaces/filtros.interface';
import { Router } from '@angular/router';
import { GetNombreService } from '../../../services/get-nombre.service';

@Component({
  selector: 'app-revisar-page',
  templateUrl: './revisar-page.component.html',
  styleUrl: './revisar-page.component.css'
})
export class RevisarPageComponent {

  public registros:Boleta[]=[]

  constructor(private historialGet: HistorialBoletasGetService, private notificaciones:NotificacionesService, private userService:userService, private router:Router,  private tituloPagina:GetNombreService){}

  ngOnInit(){
    this.tituloPagina.setNombre='Certificados por Revisar'
    this.getRegistros()
  }

  getRegistros(){
    let data: datosFiltro  = { cct: "", idCiclo: "", boleta: "",estado:'En Captura', nombre: "", localidad: "", folio: "", curp: "", numeroFiltro: "", "token": this.userService.obtenerToken() }
    this.historialGet.getDatosBoleta(data).subscribe(response =>{
      if(!response.error){
        this.registros = response.data

        // creamos un ciclo para encriptar el  id de la boleta

        this.registros.forEach(registro =>{
          registro.id_boleta=this.userService.Encriptar(registro.id_boleta.toString())
        })

      }
      else{
      }
    })
  }

  redireccionarAVerificarRegistro(event:any){
    this.router.navigate(['verificarCaptura', event])
  }

  verCalificaciones(event:any){

  }
}
