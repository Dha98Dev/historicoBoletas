import { Component } from '@angular/core';
import { opciones } from '../../../componentes/componentesInputs/select-form/select-form.component';
import { datosFiltro } from '../../../interfaces/filtros.interface';
import { HistorialBoletasGetService } from '../../../services/historial-boletas-get.service';
import { HistorialBoletasAgregarService } from '../../../services/historial-boletas-agregar.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Router } from '@angular/router';
import { Boleta, Calificacion, calificacionesPrimaria, calificacionesSecundaria } from '../../../interfaces/cargar-boleta';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';
import { Subject } from 'rxjs';
import { GetNombreService } from '../../../services/get-nombre.service';


@Component({
  selector: 'app-query-page',
  templateUrl: './query-page.component.html',
  styleUrl: './query-page.component.css'
})
export class QueryPageComponent {
  constructor(private historialServiceGet: HistorialBoletasGetService, private historialServiceAdd: HistorialBoletasAgregarService, private NotificacionesService: NotificacionesService, private router: Router, private userService: userService, private getNombreService:GetNombreService) { }

  public loader: boolean = false
  public ciclosEscolares: opciones[] = []
  public datosBoleta: Boleta[] = []
  public capturador: string = ''
  public vacio = true
  public calificacionesSeleccionadaPrimaria: Calificacion[] = []
  public calificacionesSeleccionadaSecundaria: calificacionesSecundaria = {} as calificacionesSecundaria
  public nivelSelecionado: string = ''
  public estadoCaptura:string = ''
  public verificador:string= ''
  public Egresado:string= ''
  public boletaSeleccionada:Boleta = {} as Boleta
  dtOptions: any = {}
  dtTrigger: Subject<any> = new Subject<any>();
  public tablaInicializada: boolean = false
  ngOnInit() {

    this.getNombreService.setNombre='Consultar'

    let ciclosEscolares = localStorage.getItem('ciclosEscolares')
    if (ciclosEscolares != null) {
      this.ciclosEscolares = JSON.parse(ciclosEscolares);
    } else {
      this.getCiclosEscolares();
    }

    setTimeout(() => {
      $('#resultadosBusqueda').DataTable(this.dtOptions);
    }, 500);




  }


  inicializarDatatable() {
    if (this.tablaInicializada) {
      $('#resultadosBusqueda').DataTable().destroy();
    }

    this.tablaInicializada = true
    this.dtOptions = {
      //'sPaginationType': 'full_numbers',
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false,
      //'retrieve': true,
      //'destroy': true,

      'order': [],
      responsive: true,
      language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        search: 'Buscar:',
        info: "Mostrando página _PAGE_ de _PAGES_ paginas ",
        infoEmpty: 'Mostrando del 0 al 0 de 0 Registros',
        searchPlaceholder: "filtrar registros ",

        paginate: {
          first: 'Primero',
          last: 'Ultimo',
          next: 'Siguiente',
          previous: 'Anterior',


        }
      },

    };


  }
  // 

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }






  recivirValoresFiltro(event: any) {
    let data: datosFiltro = { cct: "", boleta:"", idCiclo: "",estado:'', nombre: "", localidad: "", folio: "", curp: "", numeroFiltro: "", "token": this.userService.obtenerToken() }
    this.vacio = true;
    this.loader=true

    // verificamos que al menos un campo venga con informacion
    let tieneInformacion=false;

    // validamos que tipo de filtro se realizo

    switch (event.numeroFiltro) {
      case '1':
        data.curp = (event.data).toUpperCase()
        tieneInformacion = this.validarBusquedaVacia(data.curp)
        data.numeroFiltro = event.numeroFiltro
        break;
      case '2':
        let ciclo= event.data.idCiclo ? event.data.idCiclo : ""
        data.idCiclo = this.NotificacionesService.separarValor(ciclo, ' ')
        data.cct = (event.data.cct.toUpperCase())
        tieneInformacion = this.validarBusquedaVacia(data.idCiclo) &&  this.validarBusquedaVacia(data.cct) 
        data.numeroFiltro = event.numeroFiltro
        break;
      case '3':
        data.folio = event.data
        tieneInformacion = this.validarBusquedaVacia(data.folio)
        data.numeroFiltro = event.numeroFiltro
        break;
      case '4':
        data.nombre = event.data.nombre ? (event.data.nombre).toUpperCase() : ''

        data.cct = event.data.cct ?  (event.data.cct).toUpperCase() : ''
        tieneInformacion = this.validarBusquedaVacia(data.nombre) &&  this.validarBusquedaVacia(data.cct) 
        data.numeroFiltro = event.numeroFiltro
        break;

      case '5':
        data.nombre = (event.data).toUpperCase()
        tieneInformacion = this.validarBusquedaVacia(data.nombre)
        data.numeroFiltro = '5'
        break;

      case '6':
        data.localidad = event.data.toUpperCase()
        tieneInformacion = this.validarBusquedaVacia(data.localidad)
        data.numeroFiltro = '6'
        break;

      default:
        break;
    }

if(tieneInformacion){
    this.historialServiceGet.getDatosBoleta(data).subscribe(response => {
      if (!response.error) {
        this.datosBoleta = response.data;
        // this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
        this.vacio = false
        this.inicializarDatatable()

        this.datosBoleta.forEach(boleta => {
          boleta.id_boleta = this.userService.Encriptar(boleta.id_boleta.toString())
        })

        this.loader=false;

        // setTimeout(() => {
        //   $('#resultadosBusqueda').DataTable(this.dtOptions);
        // }, 500);

      } else {
        this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
        this.vacio = true;
        this.loader=false;
      }
    })
  }
  else{
    this.NotificacionesService.mostrarAlertaConIcono("Busqueda  para Filtar", "Debe de seleccionar y /o ingresar informacion para realizar la busqueda", 'warning')
    this.vacio = true;
    this.loader=false;
  }
  }

  validarBusquedaVacia(ValorCampo:string):boolean{
return ValorCampo != ''  ? true : false;
  }

  getCiclosEscolares() {
    let data = { "token": this.userService.obtenerToken(), };
    this.historialServiceGet.getCiclosEscolares(data).subscribe(response => {
      if (!response.error) {
        this.ciclosEscolares = response.data;
        localStorage.setItem('ciclosEscolares', JSON.stringify(this.ciclosEscolares))
      }
    })
  }

  filtrarCalificaciones(idBoleta: number | string, nivel: string) {
    let calificacionesFiltrdadas = this.datosBoleta.filter((d) => d.id_boleta == idBoleta)
    this.boletaSeleccionada= calificacionesFiltrdadas[0]
    if (nivel == 'PRIMARIA') {
      this.calificacionesSeleccionadaPrimaria = calificacionesFiltrdadas[0].calificacionesPrimaria
      this.nivelSelecionado = nivel
      this.estadoCaptura=calificacionesFiltrdadas[0].estado_boleta
      this.capturador = calificacionesFiltrdadas[0].capturado_por
      this.verificador=calificacionesFiltrdadas[0].verificado
      this.Egresado=calificacionesFiltrdadas[0].nombre+ ' ' + calificacionesFiltrdadas[0].apellido_paterno+ ' ' + calificacionesFiltrdadas[0].apellido_materno
    }
    else {
      this.calificacionesSeleccionadaSecundaria = calificacionesFiltrdadas[0].calificacionesSecundaria
      this.nivelSelecionado = nivel
      this.estadoCaptura=calificacionesFiltrdadas[0].estado_boleta
      this.capturador = calificacionesFiltrdadas[0].capturado_por
      this.verificador=calificacionesFiltrdadas[0].verificado
    }
  }

  redireccionarAVerificarRegistro(boleta:string | number){
    this.router.navigate(['verificarCaptura', boleta])
  }

}
  