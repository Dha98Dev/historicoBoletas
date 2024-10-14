import { RespuestaPeticionHistorial } from "./respuesta.interface";

export interface Persona {
    id_persona?:number
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    cicloEscolarId?: number;
    curp?:string
  }
  
  // Interfaz para representar la información de un centro de trabajo
  export interface CentroTrabajo {
      idCentroTrabajo: number,
      claveCct: string ,
      nombreCt:string,
      zonaEscolar:string,
      nivel:string,
      id_nivel:string
    }


  export interface InfoCctDirectores extends RespuestaPeticionHistorial{
    data:{
      directores:Persona[],
      centroTrabajo:CentroTrabajo
    }
  }