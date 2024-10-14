import { Component } from '@angular/core';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private userService:userService){}

  cerrarSesion(){
    this.userService.cerrarSesion()
  }

}
