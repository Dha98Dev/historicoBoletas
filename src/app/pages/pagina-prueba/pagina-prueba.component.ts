import { Component, ElementRef, ViewChild } from '@angular/core';
import { Iconos } from '../../enums/iconos.enum';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { userService } from '../../Autenticacion1/servicios/user-service.service';
import { opciones } from '../../componentes/componentesInputs/select-form/select-form.component';
import { AnimacionesServiceService } from '../../services/animaciones-service.service';
import Swal from 'sweetalert2';
import { GetNombreService } from '../../services/get-nombre.service';
@Component({
  selector: 'app-pagina-prueba',
  templateUrl: './pagina-prueba.component.html',
  styleUrl: './pagina-prueba.component.css'
})
export class PaginaPruebaComponent {
  public iconos=Iconos
  public resultadoFormato :string=''
  public organizarNombres:boolean=false
  public organizarCalificaciones:boolean=true
  public nombresOrganizados:{ organizados: any[], compuestos: string[] }={} as { organizados: any[], compuestos: string[] }
  public arregloCalificaciones:(string |number)[][] =[]
  public planesEstudio:opciones[]=[]
  public listadoMaterias:opciones[]=[]
  public planesEstudioSeleccionado=false
  constructor(private NotificacionesService:NotificacionesService, private animacionesService:AnimacionesServiceService, private historialServiceGet:HistorialBoletasGetService, private userService:userService,  private tituloPagina:GetNombreService){}

  @ViewChild('textArea') 
  public textArea!:ElementRef;

  @ViewChild('textareaNombres') 
  public textareaNombres!:ElementRef;

  @ViewChild('textareaCalificaciones') 
  public textareaCalificaciones!:ElementRef;

  @ViewChild('selectPlanEstudio') 
  public selectPlanEstudio!:ElementRef;
  ngOnInit(){
    this.tituloPagina.setNombre='Herramientas de Captura'
    this.getPlanesEstudio()
  }

  formatearParaExcel(listado: string):string {
    // Divide el texto por saltos de línea, filtra vacíos y regresa el arreglo limpio
return listado
    .split('\n')
    .filter(curp => curp.trim() !== '') // Elimina líneas vacías
    .join('\n'); // Une las CURPs con un solo salto de línea
  }
  copiarParaExcel(toFormat:string) {
    const textoFormateado = this.formatearParaExcel(toFormat);

    if (textoFormateado != "") {
      // Copiar el texto al portapapeles
      navigator.clipboard.writeText(textoFormateado).then(() => {
        this.NotificacionesService.Toastify("Datos copiados en formato para Excel",'success');
      });
    }
    else{
      this.NotificacionesService.Toastify("No hay informacion para copiar",'error');
    }
  }

limpiarTextArea(){
  if (this.textArea != null) {
    this.textArea.nativeElement.value = '';
  }
  if (this.textareaNombres != null) {
    this.textareaNombres.nativeElement.value = ''
    this.nombresOrganizados.organizados=[]
    this.nombresOrganizados.compuestos=[]
  }
  if (this.textareaCalificaciones != null) {
    this.textareaCalificaciones.nativeElement.value = ''
    this.arregloCalificaciones=[]
    this.nombresOrganizados={} as { organizados: any[], compuestos: string[] }
    this.selectPlanEstudio.nativeElement.value='' 
  
  }
}
mostrarOrganizarNombres(organizarCalificaciones:boolean){
  if (organizarCalificaciones) {
    this.organizarNombres=false;
    this.organizarCalificaciones= true;
  }
  else{
    this.organizarCalificaciones=false;
    this.organizarNombres= this.organizarNombres ? false : true;
  }
}

preguntarOrden(nombres:string): void {
 if (nombres!= "") { // verificamos que los nombres no esten vacios 
  Swal.fire({
    title: 'Seleccionar tipo de organización',
    html: `
      <div style="text-align: left;">
        <label>
          <input type="radio" name="orden" value="normal" checked>
          <strong>Normal:</strong> Apellido Paterno, Apellido Materno, Nombre(s)
        </label>
        <br>
        <label>
          <input type="radio" name="orden" value="reverso">
          <strong>Reverso:</strong> Nombre(s) , Apellido Paterno, Apellido Materno.
        </label>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const selectedOption = (document.querySelector('input[name="orden"]:checked') as HTMLInputElement)?.value;
      if (!selectedOption) {
        Swal.showValidationMessage('Debes seleccionar un tipo de organización.');
      }
      return selectedOption;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const tipoOrden = result.value; // 'normal' o 'reverso'
   this.nombresOrganizados= this.procesarNombres(nombres,tipoOrden)
    }
  });
 }
//  mostramos una alerta si los nombres estan vacios
 else{
this.NotificacionesService.mostrarAlertaConIcono('Campos Obligatorios','Agregue valores al campo de texto para organizarlos','info')
 }
}



// imprimirValores(nombres: string) {
//   if (nombres !== '') {
//     const listadoNombres = this.procesarNombres(nombres);
//     this.nombresOrganizados = listadoNombres;
//   } else {
//     this.NotificacionesService.Toastify('No hay información para organizar', 'error');
//   }
// }

procesarNombres(nombres: string,orden: 'normal' | 'reverso'): { organizados: any[], compuestos: string[] } {
  const listaNombres = nombres
    .split('\n')
    .map(linea => linea.replace(/[/*]/g, ' ').trim()) // Reemplazar '/' y '*' por espacios
    .filter(linea => linea !== ''); // Filtrar líneas vacías

  const organizados: any[] = [];
  const compuestos: string[] = [];

  listaNombres.forEach((nombre, index) => {
    const palabras = nombre.split(/\s+/); // Dividir por espacios múltiples

    if (palabras.length > 4) {
      compuestos.push(nombre); // Nombres con más de 4 palabras
      organizados.push({ apellidoPaterno: '', apellidoMaterno: '', nombres: '' }); // Agregar fila vacía
    } else {
      let apellidoPaterno = '';
      let apellidoMaterno = '';
      let nombres = '';

      if (orden === 'normal') {
        apellidoPaterno = palabras[0] || '';
        apellidoMaterno = palabras[1] || '';
        nombres = palabras.slice(2).join(' ') || ''; // Resto como nombres
      } else if (orden === 'reverso') {
        apellidoMaterno = palabras[palabras.length - 1] || '';
        apellidoPaterno = palabras[palabras.length - 2] || '';
        nombres = palabras.slice(0, -2).join(' ') || ''; // Resto como nombres
      }

      organizados.push({ apellidoPaterno, apellidoMaterno, nombres });
    }
  });

  if (compuestos.length > 0) {
    this.NotificacionesService.mostrarAlertaConIcono(
      'Alerta de organización',
      'Favor de revisar la lista de nombres con palabras compuestas, esta se encuentra al final del listado de los nombres organizados',
      'info'
    );
  }

  return { organizados, compuestos };
}


copiarNombres() {
  const nombres = this.nombresOrganizados.organizados
    .map(item => item.nombres)
    .join('\n'); // Cada nombre en una nueva línea
  this.copiarAlPortapapeles(nombres);
}

copiarApellidos() {
  const apellidos = this.nombresOrganizados.organizados
    .map(item => `${item.apellidoPaterno}\t${item.apellidoMaterno}`) // Separar apellidos por tabuladores
    .join('\n'); // Cada registro en una nueva línea
  this.copiarAlPortapapeles(apellidos);
}

copiarAlPortapapeles(texto: string) {
  const textarea = document.createElement('textarea');
  textarea.value = texto;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('Texto copiado al portapapeles');
}

async ordenarCalificaciones(listadoCalificaciones: string) {
  if (this.planesEstudioSeleccionado && listadoCalificaciones.trim() !== '') {
    try {
      this.arregloCalificaciones = await this.separarCalificaciones(listadoCalificaciones); // Esperar el resultado
      console.log(this.arregloCalificaciones)
    } catch (error) {

    }
  } else {
    this.NotificacionesService.mostrarAlertaConIcono(
      'Organizar Calificaciones',
      'Debe seleccionar un plan de estudio e ingresar calificaciones',
      'info'
    );
  }
}


seleccionarMateriasOmitir(): Promise<{ materiasOmitidas: number[], incluyePromedio: boolean }> {
  return Swal.fire({
    title: 'Selecciona las materias a omitir',
    html: `
     <div style="margin-top: 10px;">
        <label>
          <input type="checkbox" id="incluyePromedio">
          ¿Las calificaciones incluyen el promedio?
        </label>
      </div>
      <hr class="divider">
      <div>
        ${this.listadoMaterias
          .map(
            (materia, index) =>
              `<label>
                <input type="checkbox" value="${index}">
                ${materia.nombre} <!-- Usar el nombre de la materia -->
              </label><br>`
          )
          .join('')}
      </div>
     
    `,
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const checkboxes = document.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:checked'
      );
      const indices = Array.from(checkboxes)
        .filter(checkbox => checkbox.id !== 'incluyePromedio') // Excluir el checkbox de promedio
        .map(checkbox => parseInt(checkbox.value, 10));

      const incluyePromedio = (
        document.getElementById('incluyePromedio') as HTMLInputElement
      )?.checked;

      return { materiasOmitidas: indices, incluyePromedio: !!incluyePromedio };
    }
  }).then(result => (result.isConfirmed ? result.value : { materiasOmitidas: [], incluyePromedio: false }));
}



// separarCalificaciones(calificaciones: string): (number | string)[][] {
//   // Limpiar y dividir las calificaciones
//   const calificacionesLimpias = calificaciones
//     .replace(/[:]/g, '.') // Reemplazar ':' por '.'
//     .split('\n') // Dividir por saltos de línea
//     .map(calificacion => calificacion.trim()) // Eliminar espacios y caracteres invisibles
//     .filter(calificacion => calificacion !== ''); // Filtrar líneas vacías
  
//   let calificacionesRegistro: (number | string)[] = [];
//   let calificacionesOrdenadas: (number | string)[][] = [];
//   let numeroRegistros = 0;




//   let residuo = calificacionesLimpias.length % this.listadoMaterias.length;
  
//   if (residuo !== 0) {
//     this.NotificacionesService.mostrarAlertaConIcono(
//       'Cantidad de materias',
//       '¿Está seguro(a) que las materias son las mismas que las del certificado?',
//       'question'
//     );
//   } else {

//       calificacionesLimpias.length / this.listadoMaterias.length +
//       ' es el número de registros que deberían de ser'
//     );

//     for (let i = 0; i < calificacionesLimpias.length; i++) {
//       // Convertir a número si es posible, de lo contrario conservar como texto
//       const calificacion = isNaN(Number(calificacionesLimpias[i]))
//         ? calificacionesLimpias[i]
//         : parseFloat(calificacionesLimpias[i]);

//       calificacionesRegistro.push(calificacion);

//       if (calificacionesRegistro.length === this.listadoMaterias.length) {
//         calificacionesOrdenadas.push(calificacionesRegistro);
//         calificacionesRegistro = [];

//       }
//     }

//     // Agregar el último grupo si no se añadió
//     if (calificacionesRegistro.length > 0) {
//       calificacionesOrdenadas.push(calificacionesRegistro);
//     }
//   }


//   return calificacionesOrdenadas;
// }

async separarCalificaciones(calificaciones: string): Promise<(number | string)[][]> {
  // Limpiar y convertir calificaciones
  const calificacionesLimpias = calificaciones
    .replace(/[:]/g, '.')
    .split('\n')
    .map(calificacion => calificacion.trim())
    .filter(calificacion => calificacion !== '')
    .map(calificacion => (isNaN(Number(calificacion)) ? calificacion : parseFloat(calificacion)));

  // Obtener materias omitidas y verificar si incluye promedio
  const materiasOmitidas = await this.seleccionarMateriasOmitir();
  const omitePromedio = materiasOmitidas.incluyePromedio; // Saber si se debe omitir el promedio
  const materiasAExcluir = materiasOmitidas.materiasOmitidas;

  if (!materiasAExcluir) return [];

  const totalMaterias = this.listadoMaterias.length;
  const materiasValidas = totalMaterias - materiasAExcluir.length;

  // Validar divisibilidad considerando el promedio
  const divisor = omitePromedio ? materiasValidas + 1 : materiasValidas;
  if (calificacionesLimpias.length % divisor !== 0) {
    this.NotificacionesService.mostrarAlertaConIcono(
      'Cantidad de materias',
      '¿Está seguro(a) que las materias son las mismas que las del certificado?',
      'question'
    );
    return [];
  }

  // Crear bloques de registros
  const calificacionesOrdenadas: (number | string)[][] = [];
  for (let i = 0; i < calificacionesLimpias.length; i += divisor) {
    const bloque = calificacionesLimpias.slice(i, i + divisor);

    // Si incluye el promedio, quitarlo del bloque
    if (omitePromedio) bloque.pop();

    const registroCompleto = Array.from({ length: totalMaterias }, (_, index) =>
      materiasAExcluir.includes(index) ? 0 : bloque.shift()!
    );

    calificacionesOrdenadas.push(registroCompleto);
  }

  return calificacionesOrdenadas;
}






getPlanesEstudio(){
  let data= {token:this.userService.obtenerToken()}
this.historialServiceGet.getPlanesEstudio(data).subscribe(response =>{
  if (!response.error) {
    this.planesEstudio= response.data

  }
})
}

changePlanesEstudio(idPlanEstudio:string){
  this.planesEstudioSeleccionado= false;
  let data ={token: this.userService.obtenerToken(), idPlanEstudio}
if (idPlanEstudio != "") {
  this.historialServiceGet.getMaterias(data).subscribe(response =>{
    if(!response.error){
      this.listadoMaterias= response.data
      this.planesEstudioSeleccionado=true
    }
  })
}
}

copiarCalificacionesAlPortapapeles(): void {

  if (this.arregloCalificaciones.length > 0) {
      // Convertir el arreglo de calificaciones a texto tabular (filas y columnas)
  const texto = this.arregloCalificaciones
  .map(fila => fila.join('\t')) // Convertir cada fila a una línea con valores separados por tabulaciones
  .join('\n'); // Unir las filas con saltos de línea

// Crear un elemento temporal para copiar al portapapeles
const textarea = document.createElement('textarea');
textarea.value = texto;
document.body.appendChild(textarea);

// Seleccionar el texto y copiarlo
textarea.select();
document.execCommand('copy');

// Eliminar el elemento temporal
document.body.removeChild(textarea);

// Confirmar al usuario
this.NotificacionesService.Toastify('¡Copiado al portapapeles!', 'success');
  }
  else{
    this.NotificacionesService.Toastify('Primero debe de Cargar las calificaciones a organizar','error')
  }

}

  
}
