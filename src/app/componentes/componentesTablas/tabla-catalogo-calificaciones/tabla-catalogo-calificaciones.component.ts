import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { Boleta, Calificacion, calificacionesSecundaria } from '../../../interfaces/cargar-boleta';
import * as bootstrap from 'bootstrap'

@Component({
  selector: 'app-tabla-catalogo-calificaciones',
  templateUrl: './tabla-catalogo-calificaciones.component.html',
  styleUrl: './tabla-catalogo-calificaciones.component.css'
})

export class TablaCatalogoCalificacionesComponent {

  public loader: boolean = false
  public capturador: string = ''
  public vacio = true
  public calificacionesSeleccionadaPrimaria: Calificacion[] = []
  public calificacionesSeleccionadaSecundaria: calificacionesSecundaria = {} as calificacionesSecundaria
  public nivelSelecionado: string = ''

// aqui van los inputs
@Input()
  public datosBoleta: Boleta[] = []

@Input()
public verCalificaciones:boolean=false

@Input()
public verificar:boolean=false

@Output()
public OnEmitRegistroSeleccionado:EventEmitter<any> = new EventEmitter();
  // aqui van los outputs
  
  dtOptions: any = {}
  dtTrigger: Subject<any> = new Subject<any>();
  public tablaInicializada: boolean = false
  
  ngOnInit() {
    // setTimeout(() => {
    //   $('#resultadosBusqueda').DataTable(this.dtOptions);
    // }, 500);
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


    // console.log('Inicializando datatable...')
  }
  // 


  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  filtrarCalificaciones(idBoleta: number, nivel: string) {
    let calificacionesFiltrdadas = this.datosBoleta.filter((d) => d.id_boleta == idBoleta)
    if (nivel == 'PRIMARIA') {
      this.calificacionesSeleccionadaPrimaria = calificacionesFiltrdadas[0].calificacionesPrimaria
      this.nivelSelecionado = nivel
      this.capturador = calificacionesFiltrdadas[0].capturado_por
    }
    else {
      this.calificacionesSeleccionadaSecundaria = calificacionesFiltrdadas[0].calificacionesSecundaria
      this.nivelSelecionado = nivel
      this.capturador = calificacionesFiltrdadas[0].capturado_por

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['datosBoleta']) {
      this.inicializarDatatable()
      console.log("Datos de boleta", this.datosBoleta)
    }
  }

  redireccionarAVerificar(idBoleta:string | number){
this.OnEmitRegistroSeleccionado.emit(idBoleta)
  }

}
