import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userService } from '../../Autenticacion1/servicios/user-service.service';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { Boleta } from '../../interfaces/cargar-boleta';
import { data } from 'jquery';
import { opciones } from '../../componentes/componentesInputs/select-form/select-form.component';
import { datosFiltro } from '../../interfaces/filtros.interface';
import { Iconos } from '../../enums/iconos.enum';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmacionComponent } from '../../componentes/componentesModales/modal-confirmacion/modal-confirmacion.component';
import { NotificacionesService } from '../../services/notificaciones.service';
import { HistorialBoletasUpdateService } from '../../services/historial-boletas-update.service';

@Component({
  selector: 'app-verificar-captura',
  templateUrl: './verificar-captura.component.html',
  styleUrl: './verificar-captura.component.css'
})
export class VerificarCapturaComponent {

  private idBoleta: number = 0;
  public datosCaptura: Boleta = {} as Boleta
  public dataPersona: opciones[] = []
  public dataEscuela: opciones[] = []
  public iconos=Iconos
  public promedioPrimaria:number=0

  public loader: boolean = true;
  constructor(private route: ActivatedRoute, private userService: userService, private _route: Router, private historialGet: HistorialBoletasGetService,private dialogo: MatDialog, private notificacionesService:NotificacionesService, private serviceUpdate:HistorialBoletasUpdateService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let idBoleta = params.get('idBoleta');

      if (idBoleta !== null && idBoleta !== undefined) {
        try {
          // Intentar desencriptar y convertir a número entero
          const desencriptado = this.userService.Desencriptar(idBoleta);

          // Validar que el valor desencriptado sea numérico antes de asignarlo
          this.idBoleta = parseInt(desencriptado, 10);

          // Verificar si parseInt devolvió un valor no numérico (NaN)
          if (isNaN(this.idBoleta)) {
            throw new Error('ID de boleta no es un número válido');
          }
          else {
            this.getInfoCaptura()
          }

        } catch (error) {
          console.error('Error al desencriptar o procesar idBoleta:', error);

          // Redirigir en caso de error
          this._route.navigate(['verificacion']);
        }
      }


    })
  }

  getInfoCaptura() {
    let data: datosFiltro = { folio: "", curp: "", localidad: "", cct: "", boleta: this.idBoleta.toString(), numeroFiltro: "7", estado: "", token: this.userService.obtenerToken(), idCiclo: "", nombre: "" }
    this.historialGet.getDatosBoleta(data).subscribe(response => {
      if (!response.error) {
        this.datosCaptura = response.data[0]
        let suma=0
        this.datosCaptura.calificacionesPrimaria.forEach(cal =>{
          console.log(cal.nombre_materia + ' ' + cal.calificacion)
          suma += parseFloat(cal.calificacion)
        })
        this.promedioPrimaria = Number((suma/this.datosCaptura.calificacionesPrimaria.length).toFixed(2))

        console.log(this.datosCaptura)
        this.loader = false;
        let datosEscuela = ["clave_centro_trabajo", "nombre_cct", "grupo", "turno", "ciclo", "nivel", "plan_estudio","zona"];
        let datosPersona = ["nombre", "apellido_paterno", "apellido_materno", "curp"];

        datosEscuela.forEach(datoEscuela =>{
          let opcion= this.separarDatos(datoEscuela)
          this.dataEscuela.push(opcion)
        })

        datosPersona.forEach(datoPersona =>{
          let opcion= this.separarDatos(datoPersona)
          this.dataPersona.push(opcion)
        })

        console.log(this.dataEscuela)
        console.log(this.dataPersona)
    

      }
      else {
        console.log(response.mensaje)
        this.loader = false;
      }
    })
  }
  separarDatos(campo:string) {
// Crear los arrays con objetos de nombre y valor
let opcion:opciones= {} as  opciones
opcion.valor=this.datosCaptura[campo]
opcion.nombre=campo.replace(/_/g, ' ')
return opcion
// kimberly 
}
// openConfirmDialog(): void {
//   const dialogRef = this.dialogo.open(ModalConfirmacionComponent, {
//     width: '300px',
//     data: { message: '¿Estás seguro de que deseas continuar?' },
//     panelClass:'redondeado'
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       // Acción confirmada
//       console.log('Acción confirmada');
//     } else {
//       // Acción cancelada
//       console.log('Acción cancelada');
//     }
//   });
// }

ConfirmarVerificacion(){
let respuesta = this.notificacionesService.mostrarConfirmacion('Desea Confirmar que la informacion es correcta', 'Confirmar', 'No').then(result => {
if (result) {
  this.loader=true;
  // mandamos a llamar al servicio de actualizaciones para cambiar el estado de la captura  a revisada

  let data = {"token": this.userService.obtenerToken(), "idBoleta": this.idBoleta}
  console.log(data)
  this.serviceUpdate.updateEstadoBoleta(data).subscribe(response => {
    if (!response.error) {
      console.log(response)
      this.datosCaptura.verificado = response.data['verificado'];
      this.datosCaptura.estado_boleta=response.data['estado_boleta'];
      this.notificacionesService.mostrarAlertaConIcono("Verificacion de la Informacion Capturada", response.mensaje, 'success')
      this.loader=false
    }
    else {
      this.notificacionesService.mostrarAlertaConIcono("Verificacion de la Informacion Capturada", response.mensaje, 'error')
      this.loader=false
    }
  })

}
else{
  console.log('no se confirmo la informacion')
}
})
}
RedireccionarAEditar(){}
}
