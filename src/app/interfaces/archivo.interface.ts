import { Iconos } from "../enums/iconos.enum";

export interface archivos {
    nombreArchivo: string;
    tipo: string;
    extension:string,
    base64TextFile: string;
    isValid?: boolean,
    idFile:string,
    base64url:string,
  }

  export interface toastData{
    titulo:string,
    mensaje:string,
    icono:Iconos,
    valido:boolean,
    mostrar:boolean
  }

  export interface hojaCertificado{
    url_path: string;
    nombre_hoja: string;
    tipo_archivo: string;
    extension_archivo: string;
    fecha_registro?: string;
  }