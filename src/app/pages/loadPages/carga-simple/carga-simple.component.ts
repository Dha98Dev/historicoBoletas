import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { GetNombreService } from '../../../services/get-nombre.service';
import { opciones } from '../../../componentes/componentesInputs/select-form/select-form.component';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';
import { HistorialBoletasGetService } from '../../../services/historial-boletas-get.service';
import { ValidacionesService } from '../../../services/validaciones.service';
import { Iconos } from '../../../enums/iconos.enum';
import { archivos, hojaCertificado, toastData } from '../../../interfaces/archivo.interface';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { error } from 'jquery';
import { CardToastComponent } from '../../../componentes/componentesCards/card-toast/card-toast.component';
import { HistorialBoletasAgregarService } from '../../../services/historial-boletas-agregar.service';

@Component({
  selector: 'app-carga-simple',
  templateUrl: './carga-simple.component.html',
  styleUrl: './carga-simple.component.css'
})
export class CargaSimpleComponent {
  constructor(private tituloPagina: GetNombreService, private fb: FormBuilder, private userService: userService, private historialServiceGet: HistorialBoletasGetService, private Validaciones: ValidacionesService, private notificacionesService:NotificacionesService, private boletasAdd: HistorialBoletasAgregarService) { }

  datosGeneralesForm: FormGroup = {} as FormGroup
  calificacioneSecundaria: FormGroup = {} as FormGroup
  egresado: FormGroup = {} as FormGroup
  public loader: boolean = false
  public Turnos: opciones[] = []
  private planesEstudio: opciones[] = [];
  public planesEstudiosSelect: opciones[] = []
  public ciclosEscolares: opciones[] = [];
  public nivelesEducativos: opciones[] = []
  public nivelEducativoSeleccionado: opciones[] = []
  public Directores: opciones[] = []
  public fijarInformacion: boolean = false
  public animationClass: string = ''
  public iconos = Iconos
  public boletaGuardada: boolean = false;
  public archivoCargado: archivos = {} as archivos;
  public  hojaCertificado:hojaCertificado = {} as hojaCertificado
  public dataToast:toastData = {} as toastData;
  public EliminarArchivo:boolean=false
  public hojaCargada:boolean=false 

  @ViewChild('toast') toast!:CardToastComponent
  @ViewChild('file', { static: false }) fileInput!: ElementRef;

  ngOnInit(): void {

    this.tituloPagina.setNombre = 'Cargar certificado'

    // obtenemos la información de localStorage y si no hay nada hacemos las peticiones
    let Turnos = localStorage.getItem('Turnos')
    let nivelesEducativos = localStorage.getItem('nivelesEducativos')
    let planesEstudio = localStorage.getItem('planesEstudio')
    let ciclosEscolares = localStorage.getItem('ciclosEscolares')

    if (Turnos != null) {
      this.Turnos = JSON.parse(Turnos)
    }
    else {
      this.getTurnos();

    }

    if (ciclosEscolares != null) {
      this.ciclosEscolares = JSON.parse(ciclosEscolares);
    } else {
      this.getCiclosEscolares();
    }
    this.getPlanesEstudio();
    this.getNiveles()
    

    this.datosGeneralesForm = this.fb.group({
      claveCct: ['', [Validators.required, Validators.pattern(/^18[A-Za-z]{3}[0-9]{4}[A-Za-z]$/), Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/), Validators.maxLength(10)]],
      cicloEscolar: ['', Validators.required],
      nivelEducativo: ['', Validators.required],
      planEstudio: ['', Validators.required],
      zonaEscolar: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
      nombreCct: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s"']+$/), Validators.maxLength(100)]],
      turno: ['', Validators.required],
      grupo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-]+$/), Validators.maxLength(5)]],
      localidad: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(100)]],
      directorCorrespondiente: ['',]
    });

    this.calificacioneSecundaria = this.fb.group({
      Primero: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      Segundo: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      Tercero: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      calificacionFinal: ['', [Validators.required]]
    })

    this.egresado = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(60)]],
      apellidoPaterno: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/), Validators.maxLength(60)]],
      apellidoMaterno: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/), Validators.maxLength(60)]],
      curp: ['', [Validators.pattern(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TL|TS|VZ|YN|ZS){1}[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]{1}\d{1}$/)]],
      folioBoleta: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/), Validators.maxLength(60)]],
      promedioGral: ['', [Validators.required, Validators.pattern(/^[0-9]{1,2}(\.[0-9])?$/), Validators.max(10)]],

    });

    this.getNiveles()
    this.dataToast.mostrar=false;
  }

  getNiveles() {
 let data= {token: this.userService.obtenerToken()}
 this.historialServiceGet.getNivelesEducativos(data).subscribe(response => {
  if(!response.error){
   this.nivelesEducativos=response.data
  }
 })
  }

  


  getPlanesEstudio() {
    let data = { "token": this.userService.obtenerToken() }
    this.historialServiceGet.getPlanesEstudio(data).subscribe(response => {
      if (!response.error) {
        this.planesEstudio = response.data;
        this.ordernarPlanes(this.planesEstudio)
        this.planesEstudiosSelect = this.planesEstudio
      }
    })
  }

  getCiclosEscolares() {
    let data = { "token": this.userService.obtenerToken(), };
    this.historialServiceGet.getCiclosEscolares(data).subscribe(response => {
      if (!response.error) {
        this.ciclosEscolares = response.data;
        localStorage.setItem('ciclosEscolares', JSON.stringify(this.ciclosEscolares))
      }
    })
  }

  getTurnos() {
    let data = { "token": this.userService.obtenerToken(), }
    this.historialServiceGet.getTurnos(data).subscribe(response => {
      console.log(response.data)
      if (!response.error) {
        this.Turnos = response.data;
        localStorage.setItem('Turnos', JSON.stringify(this.Turnos));
      }
    })

  }

  getInfoCct() {
    let data = { "token": this.userService.obtenerToken(), "cctSeleccionado": this.datosGeneralesForm.get('claveCct')?.value }
    if (this.datosGeneralesForm.controls['claveCct'].valid) {
      this.historialServiceGet.getDatosCct(data).subscribe(response => {
        if (!response.error) {
          this.loader = false;
          // this.datosGeneralesForm.patchValue({nivelEducativo: response.data.centroTrabajo.id_nivel})
          if (response.data.centroTrabajo.claveCct != undefined) {
            this.datosGeneralesForm.patchValue({ zonaEscolar: response.data.centroTrabajo.zonaEscolar })
            this.datosGeneralesForm.patchValue({ nombreCct: response.data.centroTrabajo.nombreCt })
            this.datosGeneralesForm.patchValue({ localidad: response.data.centroTrabajo.localidad })
            this.datosGeneralesForm.patchValue({ nivelEducativo: response.data.centroTrabajo.id_nivel })
            this.datosGeneralesForm.controls['zonaEscolar'].markAsTouched()
            this.datosGeneralesForm.controls['nombreCct'].markAsTouched()
            this.datosGeneralesForm.controls['localidad'].markAsTouched()
            this.datosGeneralesForm.controls['nivelEducativo'].markAsTouched()
          }
          else {
            this.datosGeneralesForm.patchValue({ zonaEscolar: '' })
            this.datosGeneralesForm.patchValue({ nombreCct: '' })
            this.datosGeneralesForm.patchValue({ localidad: '' })
            this.datosGeneralesForm.patchValue({ nivelEducativo: '' })
            this.datosGeneralesForm.controls['zonaEscolar'].markAsUntouched()
            this.datosGeneralesForm.controls['nombreCct'].markAsUntouched()
            this.datosGeneralesForm.controls['localidad'].markAsUntouched()
            this.datosGeneralesForm.controls['nivelEducativo'].markAsUntouched()
          }

          // contamos la longitud del arreglo y si es 0 es por que el centro de trabajo aun no se encuentra registrado y dejamos los dos niveles escolares
          if (this.nivelEducativoSeleccionado.length == 0) {
            this.nivelEducativoSeleccionado = this.nivelesEducativos
          }
          // this.datosGeneralesForm.patchValue({nivelEducativo: response.data.centroTrabajo.nivel})

          // creamos el arreglo de los directores
          let Directores: opciones[] = [];
          let Datadirectores = response.data.directores;
          if (response.data.directores.length > 0) {
            for (let i = 0; i < Datadirectores.length; i++) {
              if (Datadirectores[i].nombre != null && Datadirectores[i].apellidoPaterno != null && Datadirectores[i].apellidoMaterno != null) {
                let newDirector = {
                  "nombre": Datadirectores[i].nombre + " " + Datadirectores[i].apellidoPaterno + " " + Datadirectores[i].apellidoMaterno,
                  "valor": Datadirectores[i].id_persona
                };
                Directores.push(newDirector);
              }
            }
            this.Directores = Directores;
          }

        } else {
          this.nivelEducativoSeleccionado = this.nivelesEducativos
        }
        this.loader = false;
      })
    }
  }

  // creamos el metodo  para filtrar el nivel que sera seleccionado dependiendo de la clave de centro de trabajo
  filtrarNivel() {
    if (this.datosGeneralesForm.controls['claveCct'].valid) {
      const clave = this.datosGeneralesForm.get('claveCct')?.value;

      if (clave && clave.length >= 5) {
        const tipo = clave.substring(2, 5); // Extrae el tipo de la clave

        if (["DES", "DST", "EST"].includes(tipo)) {
          this.nivelEducativoSeleccionado = this.nivelesEducativos.filter(
            nivel => nivel.nombre === "SECUNDARIA"
          );
        } else if (["DPB", "DPR"].includes(tipo)) {
          this.nivelEducativoSeleccionado = this.nivelesEducativos.filter(
            nivel => nivel.nombre === "PRIMARIA"
          );
        }

      }
    }
  }

  ordenarPlanesEstudioSelect() {
    // extraemos el pla de estudios que fue seleccionado
    let planesEstudiosPermitidos: opciones[] = []
    let planSeleccionado = ''
    this.planesEstudio.forEach(plan => {
      if (plan.selected) {
        planSeleccionado = plan.nombre
      }
    })

    // obtenemos su valor numerico del año
    let planSeparado = planSeleccionado.split(' ')
    let anioPlanSeleccionado: number = parseInt(planSeparado[1])
    // filtramos por los planes de estudios cuyo año

    for (let i = this.planesEstudio.length - 1; i >= 0; i--) {
      let nombrePlan = this.planesEstudio[i].nombre.split(' ')
      // aqui vamos a obtener el numero siguiente  a plan 
      let inicioPlan: any = nombrePlan[1]
      if (inicioPlan <= anioPlanSeleccionado) {
        planesEstudiosPermitidos.push(this.planesEstudio[i])
      }
    }
    this.planesEstudiosSelect = planesEstudiosPermitidos



  }
  filtrarPlanEstudioByCiclo(){
    let cicloEscolar:any=''
    this.planesEstudio.forEach(plan => {
      plan.selected=false;
    })
  
   this.ciclosEscolares.forEach(plan => {
    if (plan.valor == this.datosGeneralesForm.get('cicloEscolar')?.value) {
      cicloEscolar=plan.nombre
    }
   })
  
   
    let cicloSeparado= cicloEscolar.split('-')
    let cicloInicio = parseInt(cicloSeparado[0])
    let cicloFin=cicloSeparado[1]
    let planesEstudio=[]
  
    let continuar=true
  for (let i=this.planesEstudio.length -1; i>=0; i--) {
    let nombrePlan = this.planesEstudio[i].nombre.split(' ')
    // aqui vamos a obtener el numero siguiente  a plan 
      let inicioPlan:any = nombrePlan[1]
    
      planesEstudio.push(this.planesEstudio[i])
      inicioPlan=parseInt(inicioPlan)
      if (continuar && inicioPlan <= cicloInicio) {
        this.planesEstudio[i].selected = true
        this.datosGeneralesForm.patchValue({planEstudio: this.planesEstudio[i].valor})
        this.datosGeneralesForm.controls['planEstudio'].markAsTouched()
        continuar = false;
        this.loader
      }
  }
  
  // this.ordernarPlanes(planesEstudio)
  this.ordenarPlanesEstudioSelect()
  }
  

  // estos siguentes dos metodos son para la animacion de cuando se fija la informacion de la cabecera
  toggleSelect() {
    if (this.fijarInformacion) {
      // Si el select está visible, activa la animación de salida
      this.startFadeOut();
    } else {
      // Si el select está oculto, muestra con animación de entrada
      this.fijarInformacion = true;
      this.animationClass = 'animate__animated animate__bounceIn';
    }
  }

  startFadeOut() {
    // Agrega la clase de salida
    this.animationClass = 'animate__animated animate__bounceOut';
    // Después de la duración de la animación (0.5s), oculta el select
    setTimeout(() => {
      this.fijarInformacion = false;
      this.animationClass = '';
    }, 500); // Duración de la animación de salida
  }


  ordernarPlanes(planesEstudios: opciones[]) {
    let planesEducIndigena: opciones[] = []
    let planesGenerales: opciones[] = []

    planesEstudios.forEach(plan => {
      if (plan.educacion_indigena == '1') {
        planesEducIndigena.push(plan)
      }
      else {
        planesGenerales.push(plan)
      }
    })

    let planesOrdenados = planesEducIndigena.reverse().concat(planesGenerales.reverse())

    this.planesEstudio = planesOrdenados
  }

  getFieldStatus(numero: number, field: string): number {
    let control;
    if (numero == 1) {
      control = this.datosGeneralesForm.get(field);

    }
    else if (numero == 3) {
      control = this.egresado.get(field)
    }
    else {
      control = this.calificacioneSecundaria.get(field);
    }
    if (!control) return 0; // Si no existe el campo, retorna 0.

    if (control.valid && !control.touched) {
      return 0
    }
    else if (control.valid) {
      return 1; // El campo es válido.
    } else if (control.invalid && control.touched) {
      return 2; // El campo es inválido y fue tocado.
    } else if (control.invalid && !control.touched) {
      return 0; // El campo es inválido pero no ha sido tocado.
    }

    return 0;
  }

  eliminarEspaciosBlancos(numeroFormulario: number, nombreCampo: string, tipoLimpieza: number) {
    let formulario;
    if (numeroFormulario == 1) {
      formulario = this.datosGeneralesForm;
    }
    else if (numeroFormulario == 2) {
      formulario = this.egresado
    }

    if (tipoLimpieza == 1) {
      formulario!.patchValue({ [nombreCampo]: this.Validaciones.normalizeSpacesToUpperCase(formulario!.get(nombreCampo)?.value) })
    }
    else {
      formulario!.patchValue({ [nombreCampo]: this.Validaciones.normalizeSpaces(formulario!.get(nombreCampo)?.value) })
    }

  }

  cargarArchivos(event: any) {
    let archivo = event.target.files[0];
    if(!archivo){
      this.archivoCargado = {} as archivos
    }
    let nombre = archivo.name;
    let type = archivo.type;
    let subtipo = type.split('/');
    type = subtipo[0]
    subtipo = subtipo[1]
    // vamos a filtrar los documentos para cuando se suban 2 del mismo input se reemplacen

    let reader = new FileReader();

    reader.onload = () => {
      const base64Url = reader.result as string;
      let url=base64Url.split(',')
      let url64=url[1]
      let tipoDocumento = event.target.name.split('-')
      tipoDocumento = tipoDocumento[0]
      
      const  documento: archivos = {
        "nombreArchivo": nombre.toString(),
        "tipo": type,
        "extension":subtipo,
        "base64TextFile": url64,
        "base64url":base64Url,
        "isValid": false,
        "idFile": uuidv4(),

      };

      this.hojaCertificado={
        "url_path": base64Url,
        "nombre_hoja": nombre.toString(),
        "tipo_archivo": type,
        "extension_archivo": subtipo,
        "fecha_registro": new Date().toISOString(),
      }
      this.mostrarToast(5)

      this.archivoCargado = documento;
      this.imageFileValidator(this.archivoCargado);
    };
    reader.readAsDataURL(archivo);   
    this.EliminarArchivo=true; 
  }

  imageFileValidator(control: archivos) {
    const extension = control.extension;
    
    if (extension != '') {
      const validExtensions = ['jpg', 'jpeg', 'png'];
      if (validExtensions.includes(extension)) {
        control.isValid = true;
        this.dataToast={
          titulo: 'Archivo subido',
          mensaje: `El archivo ${control.nombreArchivo} se ha subido correctamente`,
          icono: Iconos.UploadFile,
          valido: true,
          mostrar: true
        }
      }
      else{
        control.isValid = false;
        this.dataToast={
          titulo: 'Archivo invalido',
          mensaje: `El archivo ${control.nombreArchivo} debe ser una imagen con extension jpg, jpeg o png`,
          icono: Iconos.Exclamation,
          valido: false,
          mostrar: true
        }
      }
    }

  }
  guardarBoleta(){
    const isObjectEmpty = (obj: object): boolean => {
      return Object.keys(obj).length === 0;
    };
    
  if((this.datosGeneralesForm.valid && this.egresado.valid) && (!isObjectEmpty(this.archivoCargado ) || this.hojaCargada) ){    
  let data = {...this.egresado.value, ...this.datosGeneralesForm.value,...this.archivoCargado, token:this.userService.obtenerToken() }

    let descripcionIds = this.getDatosDeIdentificadores( data.cicloEscolar, data.turno)
    data = {...data,...descripcionIds}

    this.boletasAdd.cargarBoletaSoloPromedio(data).subscribe(response =>{
      if(!response.error){
        this.notificacionesService.mostrarAlertaConIcono('boleta agregada', 'La boleta ha sido agregada correctamente', 'success')
        this.EliminarArchivo=false
        if(this.fijarInformacion) {
          this.egresado.reset()
          this.hojaCertificado=response.data
          this.hojaCertificado.url_path= this.tituloPagina.urlImagenes+ this.hojaCertificado.url_path
        }else{
          this.datosGeneralesForm.reset()
          this.egresado.reset()
          this.archivoCargado={} as archivos
          this.hojaCertificado= {} as hojaCertificado
        }
      }else{
        this.notificacionesService.mostrarAlertaConIcono('error al agregar boleta', response.mensaje +response.data, 'error' )
      }
    })
  }
  else{
    this.notificacionesService.mostrarAlertaConIcono('llenado de formulario', 'todos los campos son requeridos', 'error' )
  }
  }

  getDatosDeIdentificadores(cicloEscolarId: string,turnoId:string,  ){
    let turno = this.Turnos.filter((turno) => turno.valor == turnoId)
    let cicloEscolar = this.ciclosEscolares.filter((cicloEscolar) => cicloEscolar.valor == cicloEscolarId)
    return {turnoDes: turno[0].nombre, cicloDes: cicloEscolar[0].nombre}
  }
  getHojaCertificado(){
    let form = this.datosGeneralesForm 
    if (this.datosGeneralesForm.valid) {
      let data = {"ctClave": form.get('claveCct')?.value, "idCiclo": form.get('cicloEscolar')?.value, 'idTurno': form.get('turno')?.value,  'grupo': form.get('grupo')?.value,'token' : this.userService.obtenerToken()}
      this.historialServiceGet.getHojaCertificado(data).subscribe(response =>{
        if(!response.error){
          let dataToast:toastData ={
            titulo:'hoja de certificados encontrada',
            mensaje:'La fotografia de la hoja  perteneciente a la informacion ingresada ya se encuentra en el servidor',
            icono:this.iconos.Check,
            valido:true,
            mostrar:true
          } 
          this.hojaCargada=true
          this.dataToast=dataToast
          this.hojaCertificado=response.data
          this.hojaCertificado.url_path= this.tituloPagina.urlImagenes+ this.hojaCertificado.url_path
          this.EliminarArchivo = false
          this.mostrarToast(7)
        }
        else{
          let dataToast:toastData ={
            titulo:'Error al buscar hoja de certificado',
            mensaje: 'Aun no hay fotografia de los certificados de la información ingresada',
            icono:this.iconos.XToCloseRounded,
            valido:false,
            mostrar:true
          
          }
          this.hojaCargada=false
          this.hojaCertificado={} as hojaCertificado
          this.dataToast=dataToast
          this.mostrarToast(7)
        }
      })
    }
  }

  mostrarToast(tiempo:number){
    this.dataToast.mostrar=true;
    setTimeout(() => {
      this.dataToast.mostrar=false;
    }, tiempo*1000);
  }
  eliminarHojaCargada(){
    this.archivoCargado={} as archivos
    this.hojaCertificado={} as hojaCertificado
    this.fileInput.nativeElement.value=''
  }

}
