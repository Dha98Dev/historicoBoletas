import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RespuestaGetCalificaciones } from '../interfaces/respuestaOpcionesSelect.interface';
import { RespuestaPeticionHistorial } from '../interfaces/respuesta.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { userService } from '../Autenticacion1/servicios/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class HistorialBoletasUpdateService {

  private UrlHistorialBoletas:string='http://localhost/historicoCalificaciones/api/';
  constructor(private http:HttpClient, private userService:userService) { }

  updateEstadoBoleta(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaGetCalificaciones>(`${this.UrlHistorialBoletas}`+'update/cambiarEstadoCaptura', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }
  updateInformacionComplementaria(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaGetCalificaciones>(`${this.UrlHistorialBoletas}`+'update/updateDatosPersona', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }

  updateInfoBoleta(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaGetCalificaciones>(`${this.UrlHistorialBoletas}`+'update/updateInfoBoleta', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }



  private handleError(error: HttpErrorResponse): Observable<any> {
      let errorMessage = 'Error desconocido';
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // El servidor devolvió un código de error
        errorMessage = `Código de error ${error.status}, mensaje: ${error.error}`;
      }
      // Devuelve un observable que emite el error para que el flujo continúe
      return throwError(errorMessage);
    }

}
