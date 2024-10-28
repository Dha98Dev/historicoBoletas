import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { userService } from '../servicios/user-service.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class AuthCapturistaGuard implements CanActivate {
  constructor(private router: Router,private userService:userService) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const tipoUsuario = parseInt(this.userService.obtenerTipoUsuario());
    const isLoggedIn = this.userService.isLoggedIn();
    console.log(isLoggedIn, tipoUsuario);

    if (isLoggedIn && (tipoUsuario ==1 || tipoUsuario == 2 || tipoUsuario == 3)) {
      return true;
    } else {
      return this.router.createUrlTree(['/auth/login']);
    }
  }
  }