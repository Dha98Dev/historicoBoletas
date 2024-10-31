import { Component, ElementRef, HostListener } from '@angular/core';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';
import { BoletasXVerificarService } from '../../../services/boletasXVerificar.service';
import { Iconos } from '../../../enums/iconos.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private userService:userService,  private boletasXVerificar:BoletasXVerificarService,private elementRef: ElementRef){}
  boletas:number=0;
  private peticionesEnviadas:number=0;
  verificacionActiva: boolean = false;
  private usuario:string = this.userService.obtenerUsuario();
  private tipoUsuario:string = this.userService.obtenerTipoUsuario();
  public  iconos=Iconos
  public numeroPeticiones:number =0
  private logueado:boolean = false
  showSelect: boolean = false;
  animationClass: string = '';

 
  toggleSelect() {
    if (this.showSelect) {
      // Si el select está visible, activa la animación de salida
      this.startFadeOut();
    } else {
      // Si el select está oculto, muestra con animación de entrada
      this.showSelect = true;
      this.animationClass = 'animate__animated animate__bounceIn';
    }
  }

  startFadeOut() {
    // Agrega la clase de salida
    this.animationClass = 'animate__animated animate__bounceOut';
    // Después de la duración de la animación (0.5s), oculta el select
    setTimeout(() => {
      this.showSelect = false;
      this.animationClass = '';
    }, 500); // Duración de la animación de salida
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.showSelect) {
      this.startFadeOut();
    }
  }
  cerrarSesion(){
    this.userService.cerrarSesion()
  }
  ngOnInit(){
    // this.boletasPorVerificar()
    this.contarBoletas()
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
  if(token!=""){
    this.boletasXVerificar.numeroBoletasXVerificar(data).subscribe(response =>{
      if(!response.error){
        this.boletas=response.data['numero_boletas']
        this.numeroPeticiones++;
    }
    else if(response.error && ! response.isValidToken){
      this.logueado=false
    this.userService.tokenInvalido("Su inicio de Sesion ha caducado")
    }
    })

  }
  }
  
  

}
