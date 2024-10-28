import { Component } from '@angular/core';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';
import { BoletasXVerificarService } from '../../../services/boletasXVerificar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private userService:userService,  private boletasXVerificar:BoletasXVerificarService){}
  boletas:number=0;
  private peticionesEnviadas:number=0;
  verificacionActiva: boolean = false;
  private usuario:string = this.userService.obtenerUsuario();
  private tipoUsuario:string = this.userService.obtenerTipoUsuario();
  cerrarSesion(){
    this.userService.cerrarSesion()
  }
  ngOnInit(){
    // this.boletasPorVerificar()
    this.boletasPorVerificar()
    console.log(this.tipoUsuario)
  }

get getUsuario(){
  return this.usuario
}

 getTipoUsuario(){
  return this.tipoUsuario
}

  boletasPorVerificar() {
    const data = { token: this.userService.obtenerToken() };
  
    // Realizar la primera petición inmediatamente
    this.boletasXVerificar.numeroBoletasXVerificar(data).subscribe(response => {
      if (!response.error) {
        this.boletas = response.data['numero_boletas'];
  
        // Después de la primera llamada, iniciar un intervalo de 5 segundos
        setInterval(() => {
          this.boletasXVerificar.numeroBoletasXVerificar(data).subscribe(response => {
            if (!response.error) {
              this.boletas = response.data['numero_boletas'];
            } else {
              console.error("Error en la respuesta:", response.error);
            }
          }, error => {
            console.error("Error en la petición HTTP:", error);
          });
        }, 5000);  // Intervalo de 5 segundos
      } else {
        console.error("Error en la respuesta inicial:", response.error);
      }
    }, error => {
      console.error("Error en la petición HTTP inicial:", error);
    });
  }
  
  

}
