import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RespuestaPeticionHistorial } from '../interfaces/respuesta.interface';

@Injectable({
  providedIn: 'root'
})
export class HistorialBoletasAgregarService {

  private UrlHistorialBoletas:string='https://srv37app003.sepen.gob.mx/historicosCertificadosBackend/api/';
  constructor(private http:HttpClient) { }

  agregarMateria(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'agregar/agregarMateria.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          // this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }    
  agregarDirector(data:any):Observable<any>{
    return this.http.post<any>(`${this.UrlHistorialBoletas}`+'agregar/agregarDirector.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          // this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }  
  
  asignarMaterias(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'agregar/asignarMaterias.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          // this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }  
  cargarBoleta(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'agregar/agregarBoleta.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          // this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }  

  agregarPlan(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'agregar/agregarPlanEstudio.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          // this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }  

  
  cargarBoletaExcel(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'agregar/agregarBoletasExcel.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          // this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }  

  cargarBoletaSoloPromedio(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'agregar/agregarBoletaSimple.php', JSON.stringify(data)).pipe(
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
