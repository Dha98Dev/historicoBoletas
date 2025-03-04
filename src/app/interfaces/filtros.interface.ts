export interface  cctYCiclo{
cct: string;
idCiclo: string;
[key: string]: any;
}

export interface  nombreCct{
    nombre:string;
    cct:string
    [key: string]: any;
}

export interface datosFiltro extends cctYCiclo, nombreCct {
numeroFiltro:string;
folio:string;
curp:string;
localidad:string;
token:string;
estado:string;
boleta:string
  }

export interface tUsuarios{
  id_tipo_usuario:string;
  tipo_usuario:string;
}