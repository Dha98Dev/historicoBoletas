import { Component, ElementRef, ViewChild } from '@angular/core';
import { Iconos } from '../../../enums/iconos.enum';
import * as XLSX from 'xlsx'
import { Boleta, boletaPrimaria, boletaSecundaria, listadoMaterias, listadoPlanesEstudios, materiaItem, materias } from '../../../interfaces/cargar-boleta';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';
import Toastify from 'toastify-js'
import { NotificacionesService } from '../../../services/notificaciones.service';
import { HistorialBoletasAgregarService } from '../../../services/historial-boletas-agregar.service';
import { HistorialBoletasGetService } from '../../../services/historial-boletas-get.service';
import { opciones } from '../../../componentes/componentesInputs/select-form/select-form.component';
import { listadoErrores } from '../../../interfaces/errores.interface';
import { Errores } from '../../../enums/erroresCargaExcel.enum';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrl: './carga-masiva.component.css'
})
export class CargaMasivaComponent {

  constructor(private userService: userService, private notificacionesService: NotificacionesService, private historialServiceAdd: HistorialBoletasAgregarService, private historialServiceGet:HistorialBoletasGetService) { }
  public iconos = Iconos
  private listaErrores=Errores
  public excelData: any

  public archivoCargado: boolean = false
  public mostrarTabla: boolean = false
  public mostrarMensaje: boolean = false
  public mostrarError: boolean = false
  public mostrarListadoErrores: boolean = false
  public guardadoCompleto: boolean = false
  private numeroHojaSeleccionada:number = 0
  public seleccionoHojado: boolean = false
  public listadoMateriasPlan:listadoMaterias[]=[]

  public nivelSeleccionado: string = ''
  public nombreFile: string = ''
  public materias: materias[] = []
  public BoletasPrimaria: boletaPrimaria[] = []
  public listadoErroresEncontrados: listadoErrores[]=[]
  public BoletasSecundaria: boletaSecundaria[] = []
  public listadoMaterias: string[] = []
  public planesEstudio:string[]=[]
  public listadoCiclos:string[]=[]
  // aqui vamos a guardar las boletas que si se hayan cargado de manera correcta en una variable y en otra las que no se guardaron para mostrarlas en forma de que contenian errores
  public boletasGuardadas: any = []
  public boletasNoGuardadas: any = []
  // esta variable es para saber si ya se termino el proceso de guardado 
  
  public contadorFila:number = 0

  public File:File | null= null



  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('mensaje') mensaje!: ElementRef
  @ViewChild('iconoMensaje') icono!: ElementRef

  ngOnInit(){
    this.getPlanesEstudio()
    this.getCiclosEscolares()
    // this.seleccionarRangoAnios()
  }

  handleFiles(files: FileList) {
    if (files.length > 0) {
      const file = files[0];
      // Validar que el archivo sea de tipo Excel
      if (this.isExcelFile(file)) {
        this.seleccionarRangoAnios()
        this.File=file
        // this.leerExcel(file); // Llama a la función leerExcel solo si es un archivo de Excel
      } else {
        this,this.notificacionesService.mostrarAlertaConIcono('Archivos validos', 'Por favor, sube solo archivos de Excel (.xls, .xlsx)', 'error')
      }
    }
  }

  isExcelFile(file: File): boolean {
    this.File=null
    const allowedExtensions = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(file.type) && (fileExtension === 'xls' || fileExtension === 'xlsx');
  }

  getPlanesEstudio(){
    let data={token:this.userService.obtenerToken()}
    this.historialServiceGet.getPlanesEstudio(data).subscribe(response =>{
      if (!response.error) {
        let planes:listadoPlanesEstudios[] = response.data
        planes.forEach(plan =>{
          this.planesEstudio.push(plan.nombre.trim())
        })
      }
    })
  }
  getCiclosEscolares(){
    let data={token:this.userService.obtenerToken()}
    this.historialServiceGet.getCiclosEscolares(data).subscribe(response =>{
      if (!response.error) {
        let ciclos:opciones[] = response.data
        ciclos.forEach(ciclo =>{
          this.listadoCiclos.push(ciclo.nombre.trim())
        })
      }
    })
  }

  leerExcel(file: File) {
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
        // Leer el archivo en formato binario
        const workBook = XLSX.read(fileReader.result, { type: 'binary' });
        const sheetsNames = workBook.SheetNames; // Nombres de las hojas disponibles
        // Verificar si se ha seleccionado un número de hoja válido
        if (this.numeroHojaSeleccionada >= 0 && this.numeroHojaSeleccionada < sheetsNames.length) {
            // Convertir la hoja seleccionada a JSON
            this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetsNames[this.numeroHojaSeleccionada]]);
            this.nivelSeleccionado = this.excelData[0].nivel;
            let planesEstudioExcel:string[]=[];

            for (let i = 0; i < this.excelData.length; i++) {
           if(this.excelData[i].plan_estudio != undefined)
            { planesEstudioExcel.push(this.excelData[i].plan_estudio)}
            }
            let result = planesEstudioExcel.filter((item,index)=>{
              return planesEstudioExcel.indexOf(item) === index;
            })

            // mandamos a traer las materias de cada plan de estudio
            for (let i = 0; i < result.length; i++) {
              this.getMateriasPlanEstudio(result[i])
              
            }

            this.nombreFile = file.name;
            this.archivoCargado = true;
        } else {
            alert("Por favor selecciona una hoja válida.");
        }
    };

    // Iniciar la lectura del archivo como binario
    fileReader.readAsBinaryString(file);
}
  

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileInput.nativeElement.parentElement!.style.borderColor = '#ccc';

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFiles(event.dataTransfer.files); // Procesa los archivos arrastrados
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files); // Procesa el archivo seleccionado
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.fileInput.nativeElement.parentElement!.style.borderColor = '#000';
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.fileInput.nativeElement.parentElement!.style.borderColor = '#ccc';
  }

  limpiarData() {
    this.excelData = [];
    this.archivoCargado = false;
    this.nombreFile = '';
    this.BoletasPrimaria = []
    this.BoletasSecundaria = []
    this.mostrarTabla = false;
    this.mostrarError = false;
    this.boletasGuardadas=[];
    this.boletasNoGuardadas=[];
    this.guardadoCompleto = false;
  }
  // verificar los campos que todos esten llenos 
  mostrarData() {
    this.BoletasPrimaria = [];
    this.BoletasSecundaria = [];
    this.materias = [];
    // this.nivelSeleccionado = this.excelData[0].nivel;
    this.mostrarTabla = true;
    this.contadorFila = 0;
    this.listadoErroresEncontrados = []; // Limpiamos el listado de errores encontrados
    
    if (this.nivelSeleccionado.toUpperCase() === 'PRIMARIA') {
        for (let i = 0; i < this.excelData.length; i++) {
            const registro = this.excelData[i];
            if (registro.folio_boleta && registro.folio_boleta !== '') {
                this.contadorFila = this.BoletasPrimaria.length + 1;


               
                const materias: materias[] = this.extraerCalificacionesMateria(registro.plan_estudio,registro)

                // const materias: materias[] = [
                //     { materia: 'Español', calificacion: parseFloat((registro.Español || 0).toFixed(1)) },
                //     { materia: 'Matemáticas', calificacion: parseFloat((registro.Matematicas || 0).toFixed(1)) },
                //     { materia: 'Ciencias Naturales', calificacion: parseFloat((registro.Ciencias_naturales || 0).toFixed(1)) },
                //     { materia: 'Ciencias Sociales', calificacion: parseFloat((registro.Ciencias_sociales || 0).toFixed(1)) },
                //     { materia: 'Educación Física', calificacion: parseFloat((registro.Educacion_fisica || 0).toFixed(1)) },
                //     { materia: 'Educación Artística', calificacion: parseFloat((registro.Educacion_artistica || 0).toFixed(1)) },
                //     { materia: 'Educación Tecnológica', calificacion: parseFloat((registro.Educacion_tecnologica || 0).toFixed(1)) },
                // ];

                let data: boletaPrimaria = {
                    nombre: registro.nombre,
                    apellido_paterno: registro.apellido_paterno,
                    apellido_materno: registro.apellido_materno,
                    curp: registro.curp,
                    folio: registro.folio_boleta,
                    clave_ct: registro.clave_ct,
                    nombre_ct: registro.nombre_ct,
                    ciclo: registro.ciclo,
                    nivel: registro.nivel,
                    plan_estudio: registro.plan_estudio,
                    zona: registro.zona_escolar,
                    localidad: registro.localidad,
                    turno: registro.turno,
                    grupo: registro.grupo,
                    materias: materias,
                    promedio_general: parseFloat((registro.Promedio_general || 0).toFixed(1)),
                    valido: false
                };

                let curpValida = data.curp ? this.validarCURP(data.curp) : true;
                let planValido = this.validarPlanEstudio(data.plan_estudio);
                let cicloValido = this.validarCicloEscolar(data.ciclo.trim());
                let boletaValida = true;

                // validamos la longitud del  arreglo de materias 
                if (materias.length== 0) {
                  boletaValida = false;
                  this.listadoErroresEncontrados.push({
                    numeroRegistro: this.contadorFila,
                    descripcion: 'EL CAMPO(S) DE CALIFICACIóN'+ this.listaErrores.ERROR_CAMPO_FALTANTE
                });
                }

                // Validación de calificaciones dentro del rango
                for (let j = 0; j < materias.length; j++) {
                    const mat = materias[j];
                    if (mat.calificacion > 10 || mat.calificacion <= 0 || isNaN(mat.calificacion)) {
                        boletaValida = false;
                        this.mostrarError = true;
                        this.listadoErroresEncontrados.push({
                            numeroRegistro: this.contadorFila,
                            descripcion: this.listaErrores.ERROR_RANGO_CALIFICACIONES
                        });
                        break;
                    }
                }

                data.valido = this.validarBoletaPrimaria(data) && curpValida && planValido && cicloValido && boletaValida;
                this.BoletasPrimaria.push(data);
            }
        }
    } else if (this.nivelSeleccionado.toUpperCase() === 'SECUNDARIA') {
        // Código para el nivel Secundaria
    }

    this.mostrarError = this.listadoErroresEncontrados.length > 0 ? true : false;
}




  // obtenerNombresMaterias(excelData: materias) {
  //   if (!excelData) this.listadoMaterias = []

  //   // Suponemos que las materias están definidas como claves en el primer registro
  //   const primerRegistro = excelData;
  //   let listado = []


  //   // Detectar materias buscando palabras clave o criterios específicos
  //   for (const key in primerRegistro) {
  //     if (key.toLowerCase().includes("español") ||
  //       key.toLowerCase().includes("matematicas") ||
  //       key.toLowerCase().includes("ciencias") ||
  //       key.toLowerCase().includes("educacion") ||
  //       key.toLowerCase().includes("tecnologica")||
  //       key.toLowerCase().includes("lengua")) {
  //       listado.push(key);
  //     }
  //   }
  //   if (this.listadoMaterias.length == 0) {
  //     this.listadoMaterias = listado
  //   }
  // }

  openModal() {
    const modalElement = this.modal.nativeElement;
    const mensajeElement = this.mensaje.nativeElement;

    modalElement.classList.remove('animate__fadeOut')
    mensajeElement.classList.remove('animate__fadeOutUp')
    modalElement.style.display = 'flex'; // Muestra el contenedor del modal
    modalElement.classList.add('animate__animated', 'animate__fadeIn'); // Anima el contenedor
    mensajeElement.classList.add('animate__animated', 'animate__fadeInDown'); // Anima el mensaje

    setTimeout(() => {
      const iconoElement = this.icono.nativeElement
      iconoElement.classList.add('animate__shakeX')
    }, 800);
  }

  closeModal() {
    const modalElement = this.modal.nativeElement;
    const mensajeElement = this.mensaje.nativeElement;
    const iconoElement = this.icono.nativeElement

    // Primero anima el mensaje de salida
    mensajeElement.classList.remove('animate__fadeInDown');
    mensajeElement.classList.add('animate__fadeOutUp');

    // Espera a que la animación del mensaje termine para ocultar el contenedor
    mensajeElement.addEventListener('animationend', () => {
      modalElement.classList.remove('animate__fadeIn');
      modalElement.classList.add('animate__fadeOut'); // Anima el contenedor de salida
      iconoElement.classList.remove('animate__shakeX')


      // Cuando el contenedor termina de animar, ocúltalo
      modalElement.addEventListener('animationend', () => {
        modalElement.style.display = 'none';
      }, { once: true });
    }, { once: true });
  }

  async guardarCaptura() {
    let boletasValidasPrimaria: boletaPrimaria[] = []
    let boletasInvalidasPrimaria: boletaPrimaria[] = []

    let boletasValidasSecundaria: boletaSecundaria[] = []
    let boletasInvalidasSecundaria: boletaSecundaria[] = []

    if (this.nivelSeleccionado == 'PRIMARIA') {
      this.BoletasPrimaria.forEach(bol => {
        if (bol.valido) {
          boletasValidasPrimaria.push(bol)
        }
        else {
          this.boletasNoGuardadas.push(bol)

        }
      })
      




      for (let i = 0; i < boletasValidasPrimaria.length; i++) {
        let bol = boletasValidasPrimaria[i]
        let calSecundaria = { Primero: 0, Segundo: 0, Tercero: 0, calificacionFinal: 0 }
        let data = { "token": this.userService.obtenerToken(), "calPrimaria": bol.materias, calSecundaria, "claveCct": bol.clave_ct, "nombreCct": bol.nombre_ct, "cicloEscolar": bol.ciclo, "zonaEscolar": bol.zona, "planEstudio": bol.plan_estudio, "nivelEducativo": bol.nivel, "localidad": bol.localidad, "turno": bol.turno, "grupo": bol.grupo, "folioBoleta": bol.folio, "directorCorrespondiente": "", "nombre": bol.nombre, "apellidoPaterno": bol.apellido_paterno, "apellidoMaterno": bol.apellido_materno, "curp": bol.curp }

        await this.enviarBoletaPrimaria(data, bol);

        // Esperamos 1 segundo antes de pasar a la siguiente boleta
        await new Promise(resolve => setTimeout(resolve, 1000));
      }




    } else if (this.nivelSeleccionado == 'SECUNDARIA') {
      this.BoletasSecundaria.forEach(bol => {
        
        if (bol.valido) {
          boletasValidasSecundaria.push(bol)
        }
        else {
          this.boletasNoGuardadas.push(bol)
        }
      });

      // mostramos el listado de errores 
      
      
      
      for (let i = 0; i < boletasValidasSecundaria.length; i++) {
        let bol = boletasValidasSecundaria[i]
        let calSecundaria = { Primero: bol.calificacion_primero, Segundo: bol.calificacion_segundo, Tercero: bol.calificacion_tercero, calificacionFinal: bol.promedio_general }
        let data = { "token": this.userService.obtenerToken(), "calPrimaria": [], calSecundaria, "claveCct": bol.clave_ct, "nombreCct": bol.nombre_ct, "cicloEscolar": bol.ciclo, "zonaEscolar": bol.zona, "planEstudio": bol.plan_estudio, "nivelEducativo": bol.nivel, "localidad": bol.localidad, "turno": bol.turno, "grupo": bol.grupo, "folioBoleta": bol.folio, "directorCorrespondiente": "", "nombre": bol.nombre, "apellidoPaterno": bol.apellido_paterno, "apellidoMaterno": bol.apellido_materno, "curp": bol.curp }

        if (data.curp === undefined || !data.curp) {
          data.curp =''
        }
    
    
        this.historialServiceAdd.cargarBoletaExcel(data).subscribe(response => {
          if (!response.error) {
            this.notificacionesService.Toastify(response.mensaje, 'success');
            this.boletasGuardadas.push(bol)
          }
          else {
            this.notificacionesService.Toastify(response.mensaje, 'error');
            this.boletasNoGuardadas.push(bol)
          }
        })
      }
      // this.boletasNoGuardadas = boletasInvalidasSecundaria

    }
    this.mostrarTabla=false;
    this.guardadoCompleto=true
  }


  async enviarBoletasConDelay(boletasValidasPrimaria: boletaPrimaria[]) {
    for (let i = 0; i < boletasValidasPrimaria.length; i++) {
      const bol = boletasValidasPrimaria[i];
      const calSecundaria = { Primero: 0, Segundo: 0, Tercero: 0, calificacionFinal: 0 };
      const data = {
        token: this.userService.obtenerToken(),
        calPrimaria: bol.materias,
        calSecundaria,
        claveCct: bol.clave_ct,
        nombreCct: bol.nombre_ct,
        cicloEscolar: bol.ciclo,
        zonaEscolar: bol.zona,
        planEstudio: bol.plan_estudio,
        nivelEducativo: bol.nivel,
        localidad: bol.localidad,
        turno: bol.turno,
        grupo: bol.grupo,
        folioBoleta: bol.folio,
        directorCorrespondiente: "",
        nombre: bol.nombre,
        apellidoPaterno: bol.apellido_paterno,
        apellidoMaterno: bol.apellido_materno,
        curp: bol.curp,
      };
  
  
      // Llamamos al método `enviarBoletaPrimaria` y esperamos que termine
      await this.enviarBoletaPrimaria(data, bol);
  
      // Esperamos 1 segundo antes de pasar a la siguiente boleta
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  async enviarBoletaPrimaria(data: any, boleta: boletaPrimaria) {
    try {
      const response = await firstValueFrom(this.historialServiceAdd.cargarBoletaExcel(data));
      if (!response.error) {
        this.notificacionesService.Toastify(response.mensaje, 'success');
        this.boletasGuardadas.push(boleta);
      } else {
        this.notificacionesService.Toastify(response.mensaje, 'error');
        this.boletasNoGuardadas.push(boleta);
      }
    } catch (error) {
      this.notificacionesService.Toastify('Error inesperado', 'error');
      this.boletasNoGuardadas.push(boleta);
    }
  }
  


  // ---------------------- ESTAS SON LAS VALIDACIONES CORRESPONDIENTES ------------------------




// Función de validación para boletaPrimaria
validarBoletaPrimaria(data: boletaPrimaria): boolean {
  const camposObligatorios = [
      data.nombre, data.apellido_paterno, data.folio, data.clave_ct,
      data.ciclo, data.nivel, data.plan_estudio, data.zona, data.localidad
  ];

  for (const campo of camposObligatorios) {
      if (!campo || campo === '') {
          this.mostrarError = true;
          this.listadoErroresEncontrados.push({
              numeroRegistro: this.contadorFila,
              descripcion: 'El campo ' + campo + ' ' + this.listaErrores.ERROR_CAMPO_FALTANTE
          });
          return false; // Campo vacío, boleta no es válida
      }
  }
  return true;
}

// Función de validación para boletaSecundaria
validarBoletaSecundaria(data: boletaSecundaria): boolean {
  let esValido = true;

  // Verificar que todos los campos de `data` estén completos
  for (const key in data) {
      if (key !== 'curp' && (!data[key] || data[key] === '')) {
          esValido = false;
          this.mostrarError = true;
          this.listadoErroresEncontrados.push({
              numeroRegistro: this.contadorFila,
              descripcion: 'El campo ' + key + ' ' + this.listaErrores.ERROR_CAMPO_FALTANTE
          });
          break;
      }
  }

  // Validar que las calificaciones estén en el rango válido (1 a 10)
  const calificaciones = [
      data.calificacion_primero,
      data.calificacion_segundo,
      data.calificacion_tercero,
      data.promedio_general
  ];

  for (const calificacion of calificaciones) {
      if (calificacion <= 0 || calificacion > 10 || isNaN(calificacion)) {
          esValido = false;
          this.mostrarError = true;
          this.listadoErroresEncontrados.push({
              numeroRegistro: this.contadorFila,
              descripcion: this.listaErrores.ERROR_RANGO_CALIFICACIONES
          });
          break;
      }
  }

  data.valido = esValido;
  return esValido;
}

validarCURP(curp: string): boolean {
  curp = curp.toUpperCase();
  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
  const validacionCurp = curpRegex.test(curp);

  if (!validacionCurp) {
      this.listadoErroresEncontrados.push({
          numeroRegistro: this.contadorFila,
          descripcion: this.listaErrores.ERROR_CURP
      });
  }

  return validacionCurp;
}

validarPlanEstudio(planEstudio: string): boolean {
  let planEstudioValido = false;

  this.planesEstudio.forEach(plan => {
      if (plan === planEstudio) {
          planEstudioValido = true;
      }
  });

  if (!planEstudioValido) {
      this.listadoErroresEncontrados.push({
          numeroRegistro: this.contadorFila,
          descripcion: this.listaErrores.ERROR_PLAN_ESTUDIO
      });
  }

  return planEstudioValido;
}

validarCicloEscolar(cicloEscolar: string): boolean {
  let cicloValido = false;

  this.listadoCiclos.forEach(ciclo => {
      if (ciclo === cicloEscolar) {
          cicloValido = true;
      }
  });

  if (!cicloValido) {
      this.listadoErroresEncontrados.push({
          numeroRegistro: this.contadorFila,
          descripcion: this.listaErrores.ERROR_CICLO
      });
  }

  return cicloValido;
}

seleccionarRangoAnios(){
  Swal.fire({
    title: '',
    html: `

        
        <hr>
        <strong>Seleccione el rango de años capturados</strong><br>
        
        <div class="d-flex justify-content-around mt-4">
        <label>
          <input type="radio" name="rangoAnos" value="0"> 1979-1991
        </label><br>
        
        <label>
          <input type="radio" name="rangoAnos" value="1"> 1992-2007
        </label><br>
        
        <label>
          <input type="radio" name="rangoAnos" value="2"> 2008-2017
        </label>
        </div>
        
      </div>
    `, showClass: {
      popup: `
        animate__animated
        animate__zoomIn
        animate__faster
      `
    },
    hideClass: {
      popup: `
        animate__animated
        animate__zoomOut
        animate__faster
      `
    },
    // showCancelButton: true,
    confirmButtonText: 'Aceptar',
    preConfirm: () => {
      // const educacionIndigena = (document.querySelector('input[name="educacionIndigena"]:checked') as HTMLInputElement)?.value;
      const rangoAnos = (document.querySelector('input[name="rangoAnos"]:checked') as HTMLInputElement)?.value;

      if (!rangoAnos) {
        Swal.showValidationMessage('Seleccione una opción en ambas preguntas.');
        return null;
      }
      // !educacionIndigena || 
      return {  rangoAnos };
    }
  }).then((result) => {
    if (result.isConfirmed) {
        let resultado = result.value // Puedes manejar los datos seleccionados aquí
        // this.EsEducacionIndigena = resultado.educacionIndigena == 'no'? false: true
        this.numeroHojaSeleccionada= resultado.rangoAnos
        this.leerExcel(this.File!)
    }
  });
}

getMateriasPlanEstudio(planEstudio: string): void {
  const data = {
    token: this.userService.obtenerToken(),
    idPlanEstudio: "",
    nombrePlanEstudio: planEstudio
  };

  this.historialServiceGet.getMaterias(data).subscribe(response => {
    if (!response.error && response.data) {
      // Extraer nombres de materias y formatearlas
      const materias:any = this.formatearNombreMaterias(
        response.data.map((mat: any) => mat['nombre'])
      );

      // Crear el objeto con las materias formateadas
      const objetoMaterias: listadoMaterias = {
        nombre_plan_estudio: planEstudio,
        materias
      };

      // Agregar al listado general
      this.listadoMateriasPlan.push(objetoMaterias);
    }
  });
}


formatearNombreMaterias(materias: string[]): string[] {
  if (!materias || materias.length === 0) {
    return [];
  }

  return materias.map(materia =>
    materia
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join('_')
  );
}
extraerCalificacionesMateria(planEstudio:string,registro:any): materias[]{
// creamo la variable donde guardaremos el arreglo de materias con su calificacion respectiva
  let materiasCalificaciones:materias[]=[]
// en esta variable guardaremos el listado de las materias de las cuales extraeremos las calificaciones
  let materias:string[]=[]
  // creamo el ciclo para saber que plan de estudios debemos de seleccionar y asignamos las mater a la variable materi

 for (let i = 0; i < this.listadoMateriasPlan.length; i++) {
  if (planEstudio == this.listadoMateriasPlan[i].nombre_plan_estudio) {
   materias = this.listadoMateriasPlan[i].materias
  }
  
}

//  generamos el siguiente ciclo para poder  generar un objeto de tipo materia con su calificacion y su nombre de materia
materias.forEach(materia=>{
  let data:materias

 if(materia != 'Lengua_que_habla' ){
  let cal:any = (`${registro[materia]}`).trim()
  cal=parseFloat(cal).toFixed(1)
    data={
      materia: `${materia}`,
      calificacion:parseFloat((cal || '0'))
    }
    materiasCalificaciones.push(data)
    
  }
  else{
    let cal:any = (`${registro[materia]}`).trim()
    if(cal == "A"){
      data={
        materia: `${materia}`,
        calificacion:1
      }
    materiasCalificaciones.push(data)
  
    }
    else if(cal == "B"){
      data={
        materia: `${materia}`,
        calificacion:2
      }
    materiasCalificaciones.push(data)
  
    }
  }

  


})
 return materiasCalificaciones
}
}
