import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RespuestaPeticionHistorial } from '../interfaces/respuesta.interface';

@Injectable({
  providedIn: 'root'
})
export class BoletasXVerificarService {

    private numeroBoletas: number = 0;
  private UrlHistorialBoletas:string='https://srv37app003.sepen.gob.mx/historicosCertificadosBackend/api/';
  constructor(private http:HttpClient) { }

  

  numeroBoletasXVerificar(data:any):Observable<RespuestaPeticionHistorial>{
 return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'get/getNumeroBoletasPorVerificar.php', JSON.stringify(data))

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
