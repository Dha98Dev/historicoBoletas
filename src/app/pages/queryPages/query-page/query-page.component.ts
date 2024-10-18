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


@Component({
  selector: 'app-query-page',
  templateUrl: './query-page.component.html',
  styleUrl: './query-page.component.css'
})
export class QueryPageComponent {
  constructor(private historialServiceGet: HistorialBoletasGetService, private historialServiceAdd: HistorialBoletasAgregarService, private NotificacionesService: NotificacionesService, private router: Router, private userService: userService) { }

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
  dtOptions: any = {}
  dtTrigger: Subject<any> = new Subject<any>();
  public tablaInicializada: boolean = false
  ngOnInit() {
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


    console.log('Inicializando datatable...')
  }
  // 

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }






  recivirValoresFiltro(event: any) {
    let data: datosFiltro = { cct: "", boleta:"", idCiclo: "",estado:'', nombre: "", localidad: "", folio: "", curp: "", numeroFiltro: "", "token": this.userService.obtenerToken() }
    this.vacio = true;
    // validamos que tipo de filtro se realizo

    switch (event.numeroFiltro) {
      case '1':
        data.curp = (event.data).toUpperCase()
        data.numeroFiltro = event.numeroFiltro
        break;
      case '2':
        data.idCiclo = this.NotificacionesService.separarValor(event.data.idCiclo, ' ')
        data.cct = (event.data.cct.toUpperCase())
        data.numeroFiltro = event.numeroFiltro
        break;
      case '3':
        data.folio = event.data
        data.numeroFiltro = event.numeroFiltro
        break;
      case '4':
        data.nombre = (event.data.nombre).toUpperCase()
        data.cct = (event.data.cct).toUpperCase()
        data.numeroFiltro = event.numeroFiltro

        break;

      case '5':
        data.nombre = (event.data).toUpperCase()
        data.numeroFiltro = '5'
        // console.log(event.data)
        break;

      case '6':
        data.localidad = event.data.toUpperCase()
        data.numeroFiltro = '6'
        // console.log(event.data)
        break;

      default:
        break;
    }
    console.log(data)

    this.historialServiceGet.getDatosBoleta(data).subscribe(response => {
      if (!response.error) {
        this.datosBoleta = response.data;
        this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
        this.vacio = false
        this.inicializarDatatable()
        console.log(this.datosBoleta);
        // setTimeout(() => {
        //   $('#resultadosBusqueda').DataTable(this.dtOptions);
        // }, 500);

      } else {
        this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
        console.log(response.data)
        this.vacio = true;
      }
    })
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
    if (nivel == 'PRIMARIA') {
      this.calificacionesSeleccionadaPrimaria = calificacionesFiltrdadas[0].calificacionesPrimaria
      this.nivelSelecionado = nivel
      this.estadoCaptura=calificacionesFiltrdadas[0].estado_boleta
      // console.log(this.estadoCaptura)
      this.capturador = calificacionesFiltrdadas[0].capturado_por
      this.verificador=calificacionesFiltrdadas[0].verificado
      console.log(this.verificador)
    }
    else {
      this.calificacionesSeleccionadaSecundaria = calificacionesFiltrdadas[0].calificacionesSecundaria
      this.nivelSelecionado = nivel
      this.estadoCaptura=calificacionesFiltrdadas[0].estado_boleta
      this.capturador = calificacionesFiltrdadas[0].capturado_por
      this.verificador=calificacionesFiltrdadas[0].verificado
      console.log(this.verificador)
    }
  }


}
