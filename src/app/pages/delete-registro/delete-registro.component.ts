import { Component, inject, ViewChild } from '@angular/core';
import { Iconos } from '../../enums/iconos.enum';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { datosFiltro } from '../../interfaces/filtros.interface';
import { userService } from '../../Autenticacion1/servicios/user-service.service';
import { Boleta } from '../../interfaces/cargar-boleta';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Subject } from 'rxjs';
import { ModalConfirmacionComponent } from '../../componentes/componentesModales/modal-confirmacion/modal-confirmacion.component';
import { historialBoletasDeleteService } from '../../services/historial-boletas-delete.service';

@Component({
  selector: 'app-delete-registro',
  templateUrl: './delete-registro.component.html',
  styleUrl: './delete-registro.component.css'
})
export class DeleteRegistroComponent {
iconos=Iconos
folioIngresado:string = ''
registrosEncontrados:Boleta[]=[]
loader:boolean = false
dtOptions: any = {}
dtTrigger: Subject<any> = new Subject<any>();
mensaje: string = ''
limpiarInput:boolean = false

@ViewChild('modalConfirmacion') modalConfirmacion: ModalConfirmacionComponent = new ModalConfirmacionComponent

  
public tablaInicializada: boolean = false
private historialBoletasGet = inject(HistorialBoletasGetService);
private historialBoletasDelete = inject(historialBoletasDeleteService);
private userService = inject(userService);
private notificaciones = inject(NotificacionesService);

TomarfolioIngresado(folio:string){
  this.folioIngresado = folio
}

buscarRegistro(){
  this.loader=true
  let data: datosFiltro = { cct: "", boleta:"", idCiclo: "",estado:'', nombre: "", localidad: "", folio: (this.folioIngresado.toLocaleUpperCase()), curp: "", numeroFiltro: '3', "token": this.userService.obtenerToken() }
  this.registrosEncontrados = []
this.historialBoletasGet.getDatosBoleta(data).subscribe(response =>{
  if (!response.error) {
    this.registrosEncontrados = response.data
    this.loader=false
    console.log(this.registrosEncontrados)
    this.inicializarDatatable()
  }else{
    this.loader=false
    this.notificaciones.mostrarAlertaConIcono('Error al buscar registro',response.mensaje, 'error')
  }
  
})
}


ngOnInit(){
  console.log(this.userService.obtenerToken())
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

confirmarEliminacion(idBoleta:string | number){
  this.mensaje='¿Está seguro de eliminar el registro con folio'+this.folioIngresado +' ?'
  this.modalConfirmacion.mostrar();
}

elimiarRegistro(event:any){
  if (event) {
    this.loader = true;
  let data = {token: this.userService.obtenerToken(), idBoleta: this.registrosEncontrados[0].id_boleta}
  console.log(data)
  this.historialBoletasDelete.DeleteBoleta(data).subscribe(response =>{
    if (!response.error) {
      this.notificaciones.mostrarAlertaConIcono('Registro eliminado',response.mensaje, 'success')
      this.registrosEncontrados = []
      this.folioIngresado = ''
      this.loader = false
      this.limpiarInput = true
      setTimeout(() => {
        this.limpiarInput = false //
      }, 500);
    }else{
      this.notificaciones.mostrarAlertaConIcono('Error al eliminar registro',response.mensaje, 'error')
      this.loader = false
    }
  })
  }
}

}
