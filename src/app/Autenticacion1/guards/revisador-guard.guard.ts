import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { userService } from '../servicios/user-service.service';

import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})


export class AuthRevisadorGuard implements CanActivate {
  constructor(private router: Router,private userService:userService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
const tipoUsuario= parseInt(this.userService.obtenerTipoUsuario())
const isLoggedIn =this.userService.isLoggedIn();
    console.log(isLoggedIn)
    if (isLoggedIn && (tipoUsuario == 3 || tipoUsuario == 1)) {
      return true; // si esta logueado no lo dejara entrar al login de nuevo
    } else {
      // Redirigir a la página de inicio de sesión si no cumple las condiciones
      
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}