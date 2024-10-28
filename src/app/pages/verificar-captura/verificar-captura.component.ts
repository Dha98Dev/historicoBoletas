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
import Swal from 'sweetalert2';

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
  public iconos = Iconos
  public promedioPrimaria: number = 0
  public pdfUrlSolicitud: string = 'http://localhost/historicoCalificaciones/pdfs/solicitudBoleta.php?boleta='
  public pdfSeleccionado: string = ''

  public loader: boolean = true;

  municipios: string[] = [
    'Acaponeta',
    'Ahuacatlán',
    'Amatlán de Cañas',
    'Bahía de Banderas',
    'Compostela',
    'Del Nayar',
    'Huajicori',
    'Ixtlán del Río',
    'Jala',
    'La Yesca',
    'Rosamorada',
    'Ruiz',
    'San Blas',
    'San Pedro Lagunillas',
    'Santa María del Oro',
    'Santiago Ixcuintla',
    'Tecuala',
    'Tepic',
    'Tuxpan',
    'Xalisco'
  ];

  constructor(private route: ActivatedRoute, private userService: userService, private _route: Router, private historialGet: HistorialBoletasGetService, private dialogo: MatDialog, private notificacionesService: NotificacionesService, private serviceUpdate: HistorialBoletasUpdateService) { }

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
        let suma = 0
        this.datosCaptura.calificacionesPrimaria.forEach(cal => {
          suma += parseFloat(cal.calificacion)
        })
        this.promedioPrimaria = Number((suma / this.datosCaptura.calificacionesPrimaria.length).toFixed(2))

        this.loader = false;
        let datosEscuela = ["clave_centro_trabajo", "nombre_cct", "grupo", "turno", "ciclo", "nivel", "plan_estudio", "zona"];
        let datosPersona = ["nombre", "apellido_paterno", "apellido_materno", "curp"];

        datosEscuela.forEach(datoEscuela => {
          let opcion = this.separarDatos(datoEscuela)
          this.dataEscuela.push(opcion)
        })

        datosPersona.forEach(datoPersona => {
          let opcion = this.separarDatos(datoPersona)
          this.dataPersona.push(opcion)
        })



      }
      else {
        this.loader = false;
      }
    })
  }
  separarDatos(campo: string) {
    // Crear los arrays con objetos de nombre y valor
    let opcion: opciones = {} as opciones
    opcion.valor = this.datosCaptura[campo]
    opcion.nombre = campo.replace(/_/g, ' ')
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
  //     } else {
  //       // Acción cancelada
  //     }
  //   });
  // }

  ConfirmarVerificacion() {
    let respuesta = this.notificacionesService.mostrarConfirmacion('Desea Confirmar que la informacion es correcta', 'Confirmar', 'No').then(result => {
      if (result) {
        this.loader = true;
        // mandamos a llamar al servicio de actualizaciones para cambiar el estado de la captura  a revisada

        let data = { "token": this.userService.obtenerToken(), "idBoleta": this.idBoleta }
        this.serviceUpdate.updateEstadoBoleta(data).subscribe(response => {
          if (!response.error) {
            this.datosCaptura.verificado = response.data['verificado'];
            this.datosCaptura.estado_boleta = response.data['estado_boleta'];
            this.notificacionesService.mostrarAlertaConIcono("Verificacion de la Informacion Capturada", response.mensaje, 'success')
            this.loader = false
          }
          else {
            this.notificacionesService.mostrarAlertaConIcono("Verificacion de la Informacion Capturada", response.mensaje, 'error')
            this.loader = false
          }
        })

      }
      else {
      }
    })
  }

  descargarSolicitudServicios() {
    this.pdfSeleccionado = this.pdfUrlSolicitud + this.datosCaptura.boletaSolicitudServicio
  }

  RedireccionarAEditar() {
    this._route.navigate(['editarBoleta', this.userService.Encriptar(this.idBoleta.toString())]);
    localStorage.setItem('datosCaptura', JSON.stringify(this.datosCaptura))
  }

//este es el metodo para cargar la informacion adicional de la persona para poder generar el pdf de solicitud de servicio




llenarInfoAcional() {
  Swal.fire({
    title: 'Formulario de Registro',
    html:
      `<select id="municipio" class="swal2-input">
        <option value="" disabled selected>Selecciona un municipio</option>` +
      this.municipios.map(municipio => `<option value="${municipio}">${municipio}</option>`).join('') +
      `</select>
      <input type="text" id="localidad" class="swal2-input" placeholder="Localidad">
      <input type="text" id="domicilio" class="swal2-input" placeholder="Domicilio Particular">
      <input type="text" id="telefono" class="swal2-input" placeholder="Teléfono">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const municipio = (document.getElementById('municipio') as HTMLSelectElement).value;
      const localidad = (document.getElementById('localidad') as HTMLInputElement).value;
      const domicilio = (document.getElementById('domicilio') as HTMLInputElement).value;
      const telefono = (document.getElementById('telefono') as HTMLInputElement).value;

      // Validaciones
      if (!municipio) {
        Swal.showValidationMessage('Debes seleccionar un municipio');
        return false;
      }

      if (!localidad.trim()) {
        Swal.showValidationMessage('El campo localidad no puede estar vacío');
        return false;
      }

      if (!domicilio.trim()) {
        Swal.showValidationMessage('El campo domicilio no puede estar vacío');
        return false;
      }

      const telefonoRegex = /^[0-9]{10}$/;
      if (!telefonoRegex.test(telefono)) {
        Swal.showValidationMessage('Debe de ingresar un numero de telefono valido');
        return false;
      }

      return { municipio, localidad, domicilio, telefono };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { municipio, localidad, domicilio, telefono } = result.value;
      const data = {token:this.userService.obtenerToken(),municipio, localidad, domicilio, telefono, idBoleta: this.datosCaptura.id_boleta}

      this.serviceUpdate.updateInformacionComplementaria(data).subscribe(response =>{
        if (!response.error) {
          this.notificacionesService.mostrarAlertaConIcono('Registro exitoso', response.mensaje,'success')
          this.datosCaptura.localidad_dom=localidad
          this.datosCaptura.domicilio_particular=domicilio
          this.datosCaptura.telefono=telefono
          this.datosCaptura.municipio_dom=municipio
        }
        else{
          this.notificacionesService.mostrarAlertaConIcono('Error al registrar', response.mensaje, 'error')
        }
      })

      // Aquí puedes procesar los datos ingresados
    }
  });
}


}
