import { Persona } from "./datosCct.interface";

export interface listadoUsuarios {
id_usuario:number | string,
nombre:string,
apellido_paterno:string,
apellido_materno:string,
usuario:string,
estado:string,
tipo_usuario:string,
fecha_registro_user:string
}