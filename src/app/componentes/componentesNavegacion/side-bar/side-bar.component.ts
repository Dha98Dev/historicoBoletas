import { Component, ElementRef, Renderer2 } from '@angular/core';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';
import { BoletasXVerificarService } from '../../../services/boletasXVerificar.service';
import { Iconos } from '../../../enums/iconos.enum';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  constructor(private userService:userService,  private boletasXVerificar:BoletasXVerificarService,private elementRef: ElementRef, private renderer: Renderer2){}
  boletas:number=0;
  private peticionesEnviadas:number=0;
  verificacionActiva: boolean = false;
  private usuario:string = this.userService.obtenerUsuario();
  private tipoUsuario:string = this.userService.obtenerTipoUsuario();
  private logueado:boolean = false
  public  iconos=Iconos

 
  cerrarSesion(){
    this.userService.cerrarSesion()
  }
  ngOnInit(){
    // this.boletasPorVerificar()
    this.contarBoletas()
    this.renderer.listen('document', 'hide.bs.offcanvas', () => {
      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) {
        backdrop.remove(); // Elimina el fondo.
      }
    });
  }

get getUsuario(){
  return this.usuario
}

 getTipoUsuario(){
  return this.tipoUsuario
}

contarBoletas(){
this.logueado=this.userService.isLoggedIn()
  if( this.logueado){
setInterval(() => {
  this.boletasPorVerificar()
}, 4000);
}else{
}
}

boletasPorVerificar() {
  let token= this.userService.obtenerToken() != null ? this.userService.obtenerToken() : ""
  const data = { token};
  // console.log(data);
  if(token!=""){
    this.boletasXVerificar.numeroBoletasXVerificar(data).subscribe(response =>{
      if(!response.error){
        this.boletas=response.data['numero_boletas']
        this.peticionesEnviadas++;
    }
    else if(response.error && ! response.isValidToken){
      this.logueado=false
    this.userService.tokenInvalido("Su inicio de Sesion ha caducado")
    }
    })

  }
  }
}
