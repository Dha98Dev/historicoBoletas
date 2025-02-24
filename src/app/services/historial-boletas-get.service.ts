import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RespuestaPeticionHistorial } from '../interfaces/respuesta.interface';
import { InfoCctDirectores } from '../interfaces/datosCct.interface';
import { RespuestaGetCalificaciones, RespuestaOpciones } from '../interfaces/respuestaOpcionesSelect.interface';
import { userService } from '../Autenticacion1/servicios/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class HistorialBoletasGetService {

  private UrlHistorialBoletas:string='https://srv37app003.sepen.gob.mx/historicosCertificadosBackend/api/';
  constructor(private http:HttpClient, private userService:userService) { }

  getNivelesEducativos(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'get/getNivelesEducativos.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }    

  getPlanesEstudio(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'get/getPlanesEstudios.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }    

  getCiclosEscolares(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'get/getCiclosEscolares.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }
  
  getTurnos(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'get/getTurnos.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }

  getDatosCct(data:any):Observable<InfoCctDirectores>{
    return this.http.post<InfoCctDirectores>(`${this.UrlHistorialBoletas}`+'get/getDatosCct.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }

  getMaterias(data:any):Observable<RespuestaOpciones>{
    return this.http.post<RespuestaOpciones>(`${this.UrlHistorialBoletas}`+'get/getMaterias.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }

  getDatosBoleta(data:any):Observable<RespuestaGetCalificaciones>{
    return this.http.post<RespuestaGetCalificaciones>(`${this.UrlHistorialBoletas}`+'get/getCalificaciones.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  }
  getTiposUsuarios(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'get/getTipoUsuarios.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  } 

  numeroBoletasXVerificar(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'get/getNumeroBoletasPorVerificar.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  } 


  getUsuarios(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'get/getListadoUsuarios.php', JSON.stringify(data)).pipe(
      tap(response =>{
        if(response.error && !response.isValidToken){
          this.userService.tokenInvalido(response.mensaje)
        }
      }),
      catchError(this.handleError)
      )
  } 

  getHojaCertificado(data:any):Observable<RespuestaPeticionHistorial>{
    return this.http.post<RespuestaPeticionHistorial>(`${this.UrlHistorialBoletas}`+'get/getImagenCertificado.php', JSON.stringify(data)).pipe(
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
