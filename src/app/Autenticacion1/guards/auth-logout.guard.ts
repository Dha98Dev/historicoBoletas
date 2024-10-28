import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { userService } from '../servicios/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLoggedOutGuard implements CanActivate {
  constructor(private router: Router,private userService:userService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isLoggedIn =this.userService.isLoggedIn();
    if (!isLoggedIn) {
      return true; // si esta logueado no lo dejara entrar al login de nuevo
    } else {
      // Redirigir a la página de inicio de sesión si no cumple las condiciones
      
      return this.router.createUrlTree(['/cargarInformacion']);
    }
  }
}
