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
    id_materia:string,
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
    id_calificacion_primaria:number;
  }
  
  export interface Boleta {
    id_boleta: number | string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    curp: string;
    capturado_por: string;
    nivel: string;
    plan_estudio: string;
    ciclo: string;
    clave_centro_trabajo: string;
    nombre_cct: string;
    folio: string;
    fecha_registro_boleta: string;
    grupo: string;
    id_ct: number;
    turno: string;
    zona: string;
    estado_boleta: string;
    localidad: string;
    localidad_dom: string;
    domicilio_particular: string;
    municipio_dom: string;
    telefono:string;
    verificado:string ;
    boletaSolicitudServicio:string;
    calificacionesPrimaria: Calificacion[];
    calificacionesSecundaria: calificacionesSecundaria;
    director_ct: string;
    [key: string]: any;
  }
 
  export interface listadoPlanesEstudios extends opciones{
    numero_materias:number;
    periodo_aplicacion:string
  }

  export interface boletaSecundaria extends boletaExcel{

    calificacion_primero:number;
    calificacion_segundo:number;
    calificacion_tercero:number;
    promedio_general:number;
  }
  export interface boletaPrimaria extends boletaExcel{
materias:materias[]
  }
  
  export interface boletaExcel{
    nombre:string;
    apellido_paterno:string;
    apellido_materno:string;
    curp:string;
    folio:string;
    clave_ct:string;
    nombre_ct:string;
    ciclo:string;
    nivel:string;
    plan_estudio:string;
    zona:string;
    localidad:string;
    turno:string;
    grupo:string;
    valido:boolean;
    [key:string]:any;
  }

  // export interface materias{
  //   español?:number;
  //   matematicas?:number;
  //   ciencias_naturales?:number;
  //   ciencias_sociales?:number;
  //   educacion_fisica?:number;
  //   educacion_artistica?:number;
  //   educacion_tecnologica?:number;
  //   promedio_general?:number;
  //   [key :string] : any
  // }

  export interface materias{
    materia: string | materiaItem;
    calificacion: number ;
    [key :string]:any;
  }

  export interface materiaItem{
    nombre:string
  }
  export interface listadoMaterias {
    nombre_plan_estudio:string,
    materias: string[]
  }