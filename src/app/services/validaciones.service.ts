import { Injectable, ɵ_sanitizeHtml } from '@angular/core';
import { isNumeric } from 'jquery';
import sanitizeHtml from 'sanitize-html';

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {

  constructor() { }

  limpiarParaSQL(input: string): string {
    return sanitizeHtml(input, {
      allowedTags: [], // No permitir etiquetas HTML
      allowedAttributes: {}, // No permitir atributos
      allowedSchemes: [], // No permitir URLs
      allowedSchemesByTag: {},
      textFilter: (text) => {
        // Expresión regular para eliminar palabras clave SQL y caracteres especiales
        const sqlKeywordsAndSpecialChars = /SELECT|INSERT|UPDATE|DELETE|DROP|--|#|;|['"<>%&()*+=~|{}[\]\\/:?!^$`]/gi;
        return text.replace(sqlKeywordsAndSpecialChars, '');
      },
    });
  }

  isNumber(aValidar: any): boolean {
    // Intenta convertir el valor a un número entero
    const numero = parseInt(aValidar, 10);
    
    if (!Number.isNaN(numero)) {
      console.log('Sí es un número');
      return true;
    } else {
      console.log('No es un número' + aValidar);
      return false;
    }
  }

  normalizeSpaces(str: string): string { 
    return str.replace(/^\s+/, '').replace(/\s+/g, ' ')
    }

    normalizeSpacesToUpperCase(str: string): string { 
      return str.replace(/^\s+/, '').replace(/\s+/g, ' ').toLocaleUpperCase()
      }

  


}
