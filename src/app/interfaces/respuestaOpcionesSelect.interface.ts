import { opciones } from "../componentes/componentesInputs/select-form/select-form.component";
import { Boleta } from "./cargar-boleta";
import { RespuestaPeticionHistorial } from "./respuesta.interface";

export interface RespuestaOpciones extends RespuestaPeticionHistorial{
    data: opciones[]
}
export interface AsignarMateriasPlan{
    idPlanEstudio:number,
    idNivel:number,
    materias:string[],
    [key: string]: any;
}

export interface RespuestaGetCalificaciones extends RespuestaPeticionHistorial{
    data:Boleta[]
}