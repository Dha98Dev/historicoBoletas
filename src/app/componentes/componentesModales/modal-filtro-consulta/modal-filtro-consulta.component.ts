import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { opciones } from '../../componentesInputs/select-form/select-form.component';
import { cctYCiclo, nombreCct } from '../../../interfaces/filtros.interface';

@Component({
  selector: 'app-modal-filtro-consulta',
  templateUrl: './modal-filtro-consulta.component.html',
  styleUrl: './modal-filtro-consulta.component.css'
})
export class ModalFiltroConsultaComponent {

  public filtroCurp: string = ''
  public filtroCicloYCct: cctYCiclo = {} as cctYCiclo;
  public filtroBoleta: string = ''
  public filtroNombreCct: nombreCct = {} as nombreCct;
  public filtroNombre: string = ''
  public filtroLocalidad: string = ''
  public filtroSeleccionado: string = ''
  public disabled:boolean = true



  @Input()
  filtros: any;

  @Input()
  IdModal: string = ''

  @Input()
  public encabezado: string = ''

  @Input()
  public tipoFiltro: string = ''

  @Input()
  public opcionesSelect: opciones[] = [];

  @Input()
  public ciclosEscolares: opciones[] = [];

  // @Input()
  // public validadorCurp:boolean = false

  // @Input()
  // public validadorCct: boolean = false

  @Output()
  public OnEmitFiltro: EventEmitter<any> = new EventEmitter();



  emitirValor(filtro: any) {
    // console.log(filtro)
    this.OnEmitFiltro.emit(filtro);
  }
  recibirCurp(event: any) {
    this.filtroCurp = event;
    this.filtroSeleccionado='1'
    if ( this.filtroCurp !='') {
      this.disabled=false
    }
  }

  recibirFiltroCicloYCct(nombreCampo: string, event: any) {
this.filtroCicloYCct[nombreCampo]=event;
this.filtroSeleccionado='2'
  }
  
    recibirFolio(event: any) {
      this.filtroBoleta = event;
    this.filtroSeleccionado='3'
    // if (this.filtroBoleta != '') {
    //   this.disabled=false

    // }
    }
  recibirfiltroNombreCct(nombreCampo: string, event: any) {
    this.filtroNombreCct[nombreCampo] = event;
    this.filtroSeleccionado='4'
    // if ((this.filtroNombreCct.cct != undefined && this.filtroNombreCct.nombre != undefined) || (this.filtroNombreCct.cct != '' && this.filtroNombreCct.nombre != '')) {
     
    //   this.disabled=false
    // }
  }
  recibirNombreSolicitante(nombreSolicitante: string, event: any){
this.filtroNombre=event;
this.filtroSeleccionado='5'
    // if (this.filtroNombre!= '') {
    //   this.disabled=false

    // }
  }
  recibirLocalidad(nombreCampo: string, event: any){
    this.filtroLocalidad=event;
    console.log(this.filtroLocalidad)
    this.filtroSeleccionado='6'
    // if (this.filtroLocalidad!= '') {
    //   this.disabled=false
    // }
  }

  realizarBusqueda() {
    let filtro = {}
    switch (this.filtroSeleccionado) {
      case '1':
        filtro = { "numeroFiltro": this.filtroSeleccionado, "data": this.filtroCurp }
        break;
      case '2':
        filtro = { "numeroFiltro": this.filtroSeleccionado, "data": this.filtroCicloYCct }
        break;
      case '3':
        filtro = { "numeroFiltro": this.filtroSeleccionado, "data": this.filtroBoleta }
        break;
      case '4':
        filtro = { "numeroFiltro": this.filtroSeleccionado, "data": this.filtroNombreCct }
        break;
        case '5':
          filtro = { "numeroFiltro": this.filtroSeleccionado, "data": this.filtroNombre }
          break;
          case '6':
            filtro = { "numeroFiltro": this.filtroSeleccionado, "data": this.filtroLocalidad }
            break;

      default:
        break;
    }
    console.log(filtro)
    this.emitirValor(filtro);
  }
}
