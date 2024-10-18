import { opciones } from "../componentes/componentesInputs/select-form/select-form.component";

export interface DatosGenerales {
    claveCct:string,
    cicloEscolar:string |number,
    nivelEducativo:string |number,
    planEstudio:string |number,
    zonaEscolar:number,
    nombreCct:string,
    turno:string |number,
    grupo:string |number,
    nombre:string,
    apellidoPaterno:string,
    apellidoMaterno:string,
    curp:string,
    folioBoleta:string,
    directorCorrespondiente:string | number,
    [key: string]: any;
}

export interface calificacionesPrimaria{
    id_materia:number,
    calificacion:number
}
export interface calificacionesSecundaria {
    Primero: number,
    Segundo: number,
    Tercero: number,
    calificacionFinal: number,
    [key: string]: any;
}


export interface Calificacion {
    nombre_materia: string;
    calificacion: string;
  }
  
  export interface Boleta {
    id_boleta: number | string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    capturado_por: string;
    nivel: string;
    plan_estudio: string;
    ciclo: string;
    clave_centro_trabajo: string;
    nombre_cct: string;
    folio: string;
    grupo: string;
    turno: string;
    zona: string;
    estado_boleta: string;
    localidad: string;
    verificado:string ;
    calificacionesPrimaria: Calificacion[];
    calificacionesSecundaria: calificacionesSecundaria;
    [key: string]: any;
  }
 
  export interface listadoPlanesEstudios extends opciones{
    numero_materias:number;
    periodo_aplicacion:string
  }