import { Injectable } from '@angular/core';
import { archivos, hojaCertificado, toastData } from '../interfaces/archivo.interface';
import { v4 as uuidv4 } from 'uuid';
import { Iconos } from '../enums/iconos.enum';

export interface ResponseGetFile{
  hojaCertificado:hojaCertificado;
  archivoCargado: archivos;
  dataToast:toastData
}

@Injectable({
  providedIn: 'root'
})



export class GetFilesService {
  public archivoCargado: archivos = {} as archivos;
  public hojaCertificado: hojaCertificado = {} as hojaCertificado;
  public iconos = Iconos;
  
  constructor() {}
  
  cargarArchivos(event: any, esImagen: boolean): Promise<ResponseGetFile> {
    return new Promise((resolve, reject) => {
        const archivo = event.target.files[0];

        if (!archivo) {
            reject(new Error("No se ha seleccionado ningún archivo."));
            return;
        }

        const nombre = archivo.name;
        const type = archivo.type;
        const [tipo, subtipo] = type.split('/');

        const reader = new FileReader();

        reader.onload = () => {
            const base64Url = reader.result as string;
            const [_, url64] = base64Url.split(',');

            const tipoDocumento = event.target.name.split('-')[0];

            const documento: archivos = {
                nombreArchivo: nombre,
                tipo: tipo,
                extension: subtipo,
                base64TextFile: url64,
                base64url: base64Url,
                isValid: false,
                idFile: uuidv4(),
            };

            this.hojaCertificado = {
                url_path: base64Url,
                nombre_hoja: nombre,
                tipo_archivo: tipo,
                extension_archivo: subtipo,
                fecha_registro: new Date().toISOString(),
            };

            const dataToast: toastData = this.imageFileValidator(documento);
            documento.isValid = dataToast.valido;

            const data: ResponseGetFile = {
                hojaCertificado: this.hojaCertificado,
                archivoCargado: documento,
                dataToast: dataToast,
            };

            resolve(data); // Resuelve la promesa con los datos
        };

        reader.onerror = (error) => {
            reject(new Error("Error al leer el archivo: " + error));
        };

        reader.readAsDataURL(archivo);
    });
}
  
  imageFileValidator(control: archivos): toastData {
      const { extension, nombreArchivo } = control;
      let dataToast: toastData = {} as toastData;
  
      if (!extension) {
          throw new Error("La extensión del archivo no está definida.");
      }
  
      const validExtensions = ['jpg', 'jpeg', 'png'];
  
      if (validExtensions.includes(extension)) {
          control.isValid = true;
          dataToast = {
              titulo: 'Archivo subido',
              mensaje: `El archivo ${nombreArchivo} se ha subido correctamente.`,
              icono: Iconos.UploadFile,
              valido: true,
              mostrar: true,
          };
      } else {
          control.isValid = false;
          dataToast = {
              titulo: 'Archivo inválido',
              mensaje: `El archivo ${nombreArchivo} debe ser una imagen con extensión jpg, jpeg o png.`,
              icono: Iconos.Exclamation,
              valido: false,
              mostrar: true,
          };
      }
  
      return dataToast;
  }
}
