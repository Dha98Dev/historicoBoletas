import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userService } from '../../Autenticacion1/servicios/user-service.service';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { Boleta } from '../../interfaces/cargar-boleta';
import { opciones } from '../../componentes/componentesInputs/select-form/select-form.component';
import { datosFiltro } from '../../interfaces/filtros.interface';
import { Iconos } from '../../enums/iconos.enum';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionesService } from '../../services/notificaciones.service';
import { HistorialBoletasUpdateService } from '../../services/historial-boletas-update.service';
import { GetNombreService } from '../../services/get-nombre.service';
import { ValidacionesService } from '../../services/validaciones.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalConfirmacionComponent } from '../../componentes/componentesModales/modal-confirmacion/modal-confirmacion.component';
import { hojaCertificado } from '../../interfaces/archivo.interface';

@Component({
  selector: 'app-verificar-captura',
  templateUrl: './verificar-captura.component.html',
  styleUrl: './verificar-captura.component.css'
})
export class VerificarCapturaComponent {

  private idBoleta: string = '';
  public datosCaptura: Boleta = {} as Boleta
  public dataPersona: opciones[] = []
  public dataEscuela: opciones[] = []
  public iconos = Iconos
  public promedioPrimaria: number = 0
  public pdfUrlSolicitud: string = 'http://localhost/historicoCalificaciones/pdfs/solicitudBoleta.php?boleta='
  public pdfSeleccionado: string = ''
  private pdfTemporal: string =''
  public infoAdicional = false
  public mostrarSeleccionTipoPromedio = true
  public loader: boolean = true;
  private tipoPresentacionPromedio:number=0
  private verHojaCertificado:boolean=false
  private hojaTemporal:string=''
  public hojaCertificado:hojaCertificado = {} as hojaCertificado
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

  constructor(private route: ActivatedRoute, private userService: userService, private _route: Router, private historialGet: HistorialBoletasGetService, private dialogo: MatDialog, private notificacionesService: NotificacionesService, private serviceUpdate: HistorialBoletasUpdateService, private tituloPagina: GetNombreService, private Validaciones: ValidacionesService, private fb: FormBuilder) { }
  @ViewChild('modalSeleccionarTipoPromedio') modalSeleccionarTipoPromedio!: ModalConfirmacionComponent;
  ngOnInit() {

    this.tituloPagina.setNombre = 'Detalles Certificado'
    this.route.paramMap.subscribe(params => {
      let idBoleta = params.get('idBoleta');

      if (idBoleta !== null && idBoleta !== undefined) {
        try {
          // Intentar desencriptar y convertir a número entero
          const desencriptado = this.userService.Desencriptar(idBoleta);
          this.idBoleta = desencriptado
          this.getInfoCaptura()


        } catch (error) {
          console.error('Error al desencriptar o procesar idBoleta:', error);

          // Redirigir en caso de error
          this._route.navigate(['verificacion']);
        }
      }


    })
  }
  ngAfterViewInit() {
    this.modalSeleccionarTipoPromedio.mostrar()
  }

  getInfoCaptura() {
    let data: datosFiltro = { folio: "", curp: "", localidad: "", cct: "", boleta: this.idBoleta.toString(), numeroFiltro: "7", estado: "", token: this.userService.obtenerToken(), idCiclo: "", nombre: "" }
    console.log(data);
    this.historialGet.getDatosBoleta(data).subscribe(response => {
      if (!response.error) {
        this.datosCaptura = response.data[0]
        let suma = 0
        let contador = 0;
        this.datosCaptura.calificacionesPrimaria.forEach(cal => {
          if (cal.nombre_materia != 'LENGUA QUE HABLA') {
            suma += parseFloat(cal.calificacion)
            contador++;
          }
        })
        this.promedioPrimaria = Number((suma / contador).toFixed(1))

        this.loader = false;
        let datosEscuela = ["clave_centro_trabajo", "nombre_cct", "grupo", "turno", "ciclo", "nivel", "plan_estudio", "zona", "localidad", "director_ct"];
        let datosPersona = ["nombre", "apellido_paterno", "apellido_materno", "curp"];

        datosEscuela.forEach(datoEscuela => {
          let opcion = this.separarDatos(datoEscuela)
          this.dataEscuela.push(opcion)
        })

        datosPersona.forEach(datoPersona => {
          let opcion = this.separarDatos(datoPersona)
          this.dataPersona.push(opcion)
        })
        this.hojaCertificado={
          url_path: this.datosCaptura.url_path != null ? this.tituloPagina.urlImagenes+ this.datosCaptura.url_path : '',
          nombre_hoja: this.datosCaptura.nombre_hoja,
          tipo_archivo: this.datosCaptura.tipo_archivo,
          extension_archivo: this.datosCaptura.extension_archivo,
          fecha_registro: this.datosCaptura.fecha_registro_hoja
        }
        console.log(this.datosCaptura.calificacionesPrimaria)
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
  }


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
    this.pdfSeleccionado = this.pdfUrlSolicitud + this.datosCaptura.boletaSolicitudServicio + '&tpp=' + this.tipoPresentacionPromedio
    console.log(this.pdfSeleccionado)
  }

  RedireccionarAEditar() {
    this._route.navigate(['editarBoleta', this.userService.Encriptar(this.idBoleta.toString())]);
    localStorage.setItem('datosCaptura', JSON.stringify(this.datosCaptura))
  }

  //este es el metodo para cargar la informacion adicional de la persona para poder generar el pdf de solicitud de servicio




  llenarInfoAcional(data: any) {
    {

      this.serviceUpdate.updateInformacionComplementaria(data).subscribe(response => {
        if (!response.error) {
          this.notificacionesService.mostrarAlertaConIcono('Registro exitoso', response.mensaje, 'success')
          this.infoAdicional = true
          this.datosCaptura.localidad_dom = data.localidad
          this.datosCaptura.domicilio_particular = data.domicilio
          this.datosCaptura.telefono = data.telefono
          this.datosCaptura.municipio_dom = data.municipio
        }
        else {
          this.notificacionesService.mostrarAlertaConIcono('Error al registrar', response.mensaje, 'error')
        }
      })

      // Aquí puedes procesar los datos ingresados
    }
  }


  recibirInfoSolicitudDuplicado(Event: any) {
    let data = { ...Event, token: this.userService.obtenerToken(), idBoleta: this.datosCaptura.id_boleta }
    console.log(data);
    this.llenarInfoAcional(data)
  }

  SeleccionarTipoPromedio(Event: any) {
    switch (Event) {
      case true:
        this.promedioPrimaria = Math.round(this.promedioPrimaria);
        this.tipoPresentacionPromedio =1
        break;

      case false:
        this.tipoPresentacionPromedio =0
        break;

      default:
        break;
    }
  }


}
