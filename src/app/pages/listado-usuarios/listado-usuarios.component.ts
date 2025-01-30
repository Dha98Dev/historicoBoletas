import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { userService } from '../../Autenticacion1/servicios/user-service.service';
import { HistorialBoletasUpdateService } from '../../services/historial-boletas-update.service';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { listadoUsuarios } from '../../interfaces/listadoUsuarios.interface';
import { Iconos } from '../../enums/iconos.enum';
import { NotificacionesService } from '../../services/notificaciones.service';
import { GetNombreService } from '../../services/get-nombre.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrl: './listado-usuarios.component.css'
})
export class ListadoUsuariosComponent implements OnInit, OnDestroy {
  dtOptions:any; // Cambia el tipo de 'any' a 'DataTables.Settings'
  dtTrigger: Subject<void> = new Subject<void>();
  public listadoUsuarios: listadoUsuarios[] = [];
  public iconos = Iconos;

  constructor(
    private userService: userService,
    private updateService: HistorialBoletasUpdateService,
    private getService: HistorialBoletasGetService,
    private notificacionService:NotificacionesService,
    private tituloPagina:GetNombreService
  ) {}

  ngOnInit() {
    this.tituloPagina.setNombre='Listado de usuarios';
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false,
      order: [],
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
          previous: 'Anterior'
        }
      },
    };
    this.getListadoUsuarios();
  }

  getListadoUsuarios() {
    const data = { token: this.userService.obtenerToken() };
    this.getService.getUsuarios(data).subscribe(response => {
      if (!response.error) {
        this.listadoUsuarios = response.data;
        this.listadoUsuarios.forEach(u =>{
          u.id_usuario=this.userService.Encriptar(u.id_usuario.toString().toString())
        })
        this.dtTrigger.next(); // Notifica a DataTables que los datos están listos
        console.log(this.listadoUsuarios);
      }
    });
  }

  ngOnDestroy(): void {
    // Completa el Subject para prevenir posibles fugas de memoria
    this.dtTrigger.unsubscribe();
  }

  habilitarEInhabilitar(idUser:string | number, accion:number){
    let estado= accion == 1 ? 'activo' : 'inactivo';
    let data = { token:this.userService.obtenerToken(), usuario:this.userService.Desencriptar(idUser.toString()), estado}
    console.log(data)
    this.updateService.updateEstadoUsuario(data).subscribe(response => {
      if (!response.error) {
        this.actualizarEstado(idUser, estado)
        this.notificacionService.mostrarAlertaConIcono('Estado de usuario', response.mensaje, 'success');
      }
      else{
        this.notificacionService.mostrarAlertaConIcono('Estado de usuario', response.mensaje, 'error');
      }
    })

  }

  actualizarEstado(idUsuario:number | string, estado:string){
    this.listadoUsuarios.forEach(user => {
      if (user.id_usuario == idUsuario) {
        console.log(user.id_usuario, idUsuario)
        user.estado=estado
      }
    })
  }

}
