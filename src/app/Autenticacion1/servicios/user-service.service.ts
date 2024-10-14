import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

import Swal from 'sweetalert2'
import { RespuestaPeticionHistorial } from '../../interfaces/respuesta.interface';

@Injectable({providedIn: 'root'})
export class userService {
    constructor(private http:HttpClient, private router:Router, ) { }
 private url:string='http://localhost/historicoCalificaciones/Auth/'


 
    iniciarSesion(datos:any):Observable<any>{
        return this.http.post<any>(`${this.url}`+'login.php', JSON.stringify(datos)).pipe(
            catchError(this.handleError)
          )
    }
    registrarUsuario(datos:any):Observable<any>{
        return this.http.post<any>(`${this.url}`+'nuevaCuenta.php', JSON.stringify(datos)).pipe(
            catchError(this.handleError)
          )
    }

    private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  
    // Método para guardar los datos del usuario en localStorage
    guardarDatosUsuario(usuario: string, token: string, tipoUsuario: string) {
      localStorage.setItem('usuarioHistoricoCal', this.Encriptar(usuario));
      localStorage.setItem('tokenHistoricoCal', this.Encriptar(token));
      localStorage.setItem('tipoUsuarioHistoricoCal', this.Encriptar(tipoUsuario));
  
      // Actualizamos el estado de loggedIn
      this.loggedIn.next(true);
    }
  
    // Método para cerrar sesión
    cerrarSesion() {
      localStorage.clear();
      this.loggedIn.next(false); // Actualizamos el estado a no logueado
      this.router.navigate(['/auth/login']);
    }
  
    // Obtener estado reactivo de loggedIn
    getLoggedInStatus(): Observable<boolean> {
      return this.loggedIn.asObservable();
    }
  
    obtenerUsuario() {
      return this.Desencriptar(localStorage.getItem('usuarioHistoricoCal')!);
    }
  
    obtenerTipoUsuario() {
      const isLogged = this.isLoggedIn();
      if (isLogged) {
        const tipoUsuario = this.Desencriptar(localStorage.getItem('tipoUsuarioHistoricoCal')!);
        if (tipoUsuario) {
          return tipoUsuario;
        }
      }
      return '0';
    }
  
    obtenerToken() {
      return this.Desencriptar(localStorage.getItem('tokenHistoricoCal')!);
    }
  
    // SweetAlert
    mostrarSweetAlert(titulo: string, mensaje: string, icon: any) {
      Swal.fire({
        title: `${titulo}`,
        text: `${mensaje}`,
        icon: icon,
      });
    }
  
    // Método para verificar si el usuario está logueado
    isLoggedIn() {
      const usuario = localStorage.getItem('usuarioHistoricoCal');
      const token = localStorage.getItem('tokenHistoricoCal');
      const tipoUsuario = localStorage.getItem('tipoUsuarioHistoricoCal');
  
      return !!(usuario && token && tipoUsuario);
    }
  
    cambiarPassword(datos: any): Observable<any> {
      return this.http.post<any>(`${this.url}` + 'cambiarPassword.php', JSON.stringify(datos)).pipe(
        catchError(this.handleError)
      );
    }

    agregarUsuario(data:any):Observable<RespuestaPeticionHistorial>{
      return this.http.post<RespuestaPeticionHistorial>(`${this.url}`+'nuevaCuenta', JSON.stringify(data)).pipe(
        tap(response =>{
          if(response.error && !response.isValidToken){
            // this.userService.tokenInvalido(response.mensaje)
          }
        }),
        catchError(this.handleError)
        )
    }  
  
    private handleError(error: HttpErrorResponse): Observable<any> {
      let errorMessage = 'Error desconocido';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Código de error ${error.status}, mensaje: ${error.error}`;
      }
      return throwError(errorMessage);
    }
  
      private password:string='aeEAh1P_#C%&#4..RFR';

      Encriptar(toEncryp:string){
          const iv = CryptoJS.lib.WordArray.random(16);
          return CryptoJS.AES.encrypt(toEncryp,this.password,{iv}).toString();
      }
      Desencriptar(toDecript:string){
              return CryptoJS.AES.decrypt(toDecript,this.password).toString(CryptoJS.enc.Utf8);
      }

    //   metodos de recuperacion de contraseña

    // enviarCorreo(data:any):Observable<any>{
    //     return this.http.post<any>(`${this.api}`+'recuperarPassword.php', JSON.stringify(data)).pipe(
    //         catchError(this.handleError)
    //       )
    // }

    tokenInvalido(mensaje:string){
        this.mostrarSweetAlert("Token invalido",mensaje, 'error');
        this.cerrarSesion();
    }


}