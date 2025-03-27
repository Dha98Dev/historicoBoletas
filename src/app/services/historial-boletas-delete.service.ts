import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { userService } from '../Autenticacion1/servicios/user-service.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RespuestaPeticionHistorial } from '../interfaces/respuesta.interface';

@Injectable({providedIn: 'root'})
export class historialBoletasDeleteService {

    private UrlHistorialBoletas:string='https://srv37app003.sepen.gob.mx/historicosCertificadosBackend/api/';
      constructor(private http:HttpClient, private userService:userService) { }

      DeleteBoleta(data:any):Observable<RespuestaPeticionHistorial>{
        return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'delete/deleteBoleta.php', JSON.stringify(data)).pipe(
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