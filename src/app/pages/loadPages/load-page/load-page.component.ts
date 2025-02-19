import { Component, ElementRef, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { opciones } from '../../../componentes/componentesInputs/select-form/select-form.component';
import { HistorialBoletasGetService } from '../../../services/historial-boletas-get.service';
import { HistorialBoletasAgregarService } from '../../../services/historial-boletas-agregar.service';
import Swal from 'sweetalert2';
import { calificacionesPrimaria, calificacionesSecundaria, DatosGenerales } from '../../../interfaces/cargar-boleta';
import { CentroTrabajo, Persona } from '../../../interfaces/datosCct.interface';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, MinValidator, Validators } from '@angular/forms';
import { max, min } from 'rxjs';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';
import { Iconos } from '../../../enums/iconos.enum';
import { GetNombreService } from '../../../services/get-nombre.service';
import sanitizeHtml from 'sanitize-html';
import { ValidacionesService } from '../../../services/validaciones.service';
import { TextBoxComponent } from '../../../componentes/componentesInputs/text-box/text-box.component';
import { ModalConfirmacionComponent } from '../../../componentes/componentesModales/modal-confirmacion/modal-confirmacion.component';
import { GetFilesService, ResponseGetFile } from '../../../services/get-files.service';
import { archivos, hojaCertificado, toastData } from '../../../interfaces/archivo.interface';

@Component({
  selector: 'app-load-page',
  templateUrl: './load-page.component.html',
  styleUrl: './load-page.component.css'
})
export class LoadPageComponent {

  // declaramos las variables booleanas
  public loader:boolean = false;
  public nuevoDirector:Persona= {} as Persona
  // public calificacionesSecundaria:calificacionesSecundaria= {} as calificacionesSecundaria
  public PromedioSecundaria:string = ''
  public promedioPrimaria:string = ''
  public boletaGuardada:boolean= false
  public iconos=Iconos
  public repetirInformacion:boolean = false
  public fijarInformacion:boolean = false
  // variables de datos string o numeros
  
  // variables que son arreglos
  public calificacionesPrimaria:calificacionesPrimaria[]=[]
  
  private  planesEstudio: opciones[]=[];
  public planesEstudiosSelect:opciones[]=[]
  public ciclosEscolares: opciones[]=[];
  private nivelesEducativos: opciones[]=[]
  public nivelEducativoSeleccionado:opciones[]=[]
  public  Turnos:opciones[]=[];
  public datosFormulario:DatosGenerales= {} as DatosGenerales;
  public datos:string[]=[]
  public Directores:opciones[]=[]
  public materias:opciones[]=[] 
  public animationClass:string =''
  public completoPrimaria:boolean=true
  public desmarcar:boolean=false
  private redondeado:boolean=false
  public archivoCargado:archivos={} as archivos
  public hojaCertificado:hojaCertificado= {} as hojaCertificado
  public toastData = {} as toastData
  public hojaCargada:boolean=false
  public EliminarArchivo:boolean=false


  @ViewChildren('inputBox') inputBoxes!: QueryList<TextBoxComponent>;
  @ViewChild('presentacionPromedio') checkbox!: ElementRef<HTMLInputElement>;
  @ViewChild('file') fileInput!: ElementRef
  constructor(private historialServiceGet: HistorialBoletasGetService, private historialServiceAdd:HistorialBoletasAgregarService, private NotificacionesService:NotificacionesService, private fb: FormBuilder, private userService:userService,  private tituloPagina:GetNombreService, private Validaciones:ValidacionesService,  private renderer:Renderer2, private getFileSErvice:GetFilesService){}

  datosGeneralesForm: FormGroup= {}  as FormGroup;
  calificacioneSecundaria:FormGroup= {} as FormGroup
  egresado:FormGroup= {} as FormGroup
  @ViewChild('modalSeleccionarTipoPromedio') modalSeleccionarTipoPromedio!: ModalConfirmacionComponent;
  ngOnInit():void{
    this.tituloPagina.setNombre='Cargar certificado'

    // obtenemos la información de localStorage y si no hay nada hacemos las peticiones
    let Turnos= localStorage.getItem('Turnos')
    let nivelesEducativos= localStorage.getItem('nivelesEducativos')
    let planesEstudio= localStorage.getItem('planesEstudio')
    let ciclosEscolares= localStorage.getItem('ciclosEscolares')

    if(Turnos != null){
      this.Turnos=JSON.parse(Turnos)
    }
    else{
      this.getTurnos();
    }
    // if (nivelesEducativos != null) {
    //   // this.nivelesEducativos=JSON.parse(nivelesEducativos);
    //   this.nivelEducativoSeleccionado=this.nivelesEducativos
    // }else{
      this.getNivelesEducativos();
    // }

    if (ciclosEscolares!= null) {
      this.ciclosEscolares=JSON.parse(ciclosEscolares);
    }else{
      this.getCiclosEscolares();
    }

    this.getPlanesEstudio();
    this.getNivelesEducativos()

        this.datosGeneralesForm = this.fb.group({
      claveCct: ['', [Validators.required, Validators.pattern(/^18[A-Za-z]{3}[0-9]{4}[A-Za-z]$/),  Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/), Validators.maxLength(10)]],
      cicloEscolar: ['', Validators.required],
      nivelEducativo: ['', Validators.required],
      planEstudio: ['', Validators.required],
      zonaEscolar: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
      nombreCct: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s"']+$/), Validators.maxLength(100)]],
      turno: ['', Validators.required],
      grupo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-]+$/), Validators.maxLength(5)]],
      localidad: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(100)]],
      directorCorrespondiente: ['', ]
    });

    this.calificacioneSecundaria= this.fb.group({
      Primero:['',[Validators.required,Validators.min(1), Validators.max(10)]],
      Segundo:['',[Validators.required,Validators.min(1), Validators.max(10)]],
      Tercero:['',[Validators.required,Validators.min(1), Validators.max(10)]],
      calificacionFinal:['',[Validators.required, Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(10)]]
    })

    this.egresado= this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/),  Validators.maxLength(60)]],
      apellidoPaterno: ['', [Validators.required,  Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),  Validators.maxLength(60)] ],
      apellidoMaterno: ['', [Validators.required,  Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),  Validators.maxLength(60)]],
      curp: ['', [  Validators.pattern(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TL|TS|VZ|YN|ZS){1}[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]{1}\d{1}$/)]],
      folioBoleta: ['', [Validators.required,  Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-]+$/),  Validators.maxLength(60)] ],
      promedioGral: ['',[Validators.required, Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(10)]]
    });  


  }

  ngAfterViewChecked(): void {
    if (this.datosGeneralesForm.get('nivelEducativo')?.value === 'fFC1jKUVKAMqnqYtpc9LRw==' && this.completoPrimaria) {
      console.log('Referencias inicializadas:', this.inputBoxes.toArray());
    }
  }
  // ngAfterViewInit() {
  //   this.modalSeleccionarTipoPromedio.mostrar()
  // }
// Uso de la función para cada caso


  getNivelesEducativos(){
    let data={"token":this.userService.obtenerToken(), };
    this.historialServiceGet.getNivelesEducativos(data).subscribe(response =>{
      if(!response.error){
        this.nivelesEducativos=response.data;
        console.log(this.nivelesEducativos);
      }
    })
  }

  getPlanesEstudio(){
    let data={"token":this.userService.obtenerToken() }
    this.historialServiceGet.getPlanesEstudio(data).subscribe(response =>{
      if(!response.error){
      this.planesEstudio=response.data;
      this.ordernarPlanes(this.planesEstudio)
      this.planesEstudiosSelect=this.planesEstudio
      }
    })
  }

  getCiclosEscolares(){
    let data={"token":this.userService.obtenerToken(), };
    this.historialServiceGet.getCiclosEscolares(data).subscribe(response=>{
      if(!response.error){
        this.ciclosEscolares=response.data;
       localStorage.setItem('ciclosEscolares', JSON.stringify(this.ciclosEscolares))
      }
    })
}

getTurnos(){
  let data={"token":this.userService.obtenerToken(),}
  this.historialServiceGet.getTurnos(data).subscribe(response =>{
    if(!response.error){
      this.Turnos=response.data;
      localStorage.setItem('Turnos', JSON.stringify(this.Turnos));
    }
  })
  
}

getInfoCct(){
  let data={"token":this.userService.obtenerToken(),"cctSeleccionado":this.datosGeneralesForm.get('claveCct')?.value}
if (this.datosGeneralesForm.controls['claveCct'].valid) {
  this.historialServiceGet.getDatosCct(data).subscribe(response => {
    if(!response.error){
      this.loader=false;
  // this.datosGeneralesForm.patchValue({nivelEducativo: response.data.centroTrabajo.id_nivel})
if (response.data.centroTrabajo.claveCct !=undefined) {
  this.datosGeneralesForm.patchValue({zonaEscolar: response.data.centroTrabajo.zonaEscolar})
  this.datosGeneralesForm.patchValue({nombreCct: response.data.centroTrabajo.nombreCt})
  this.datosGeneralesForm.patchValue({localidad: response.data.centroTrabajo.localidad})
  this.datosGeneralesForm.patchValue({nivelEducativo: response.data.centroTrabajo.id_nivel})
  this.datosGeneralesForm.controls['zonaEscolar'].markAsTouched()
  this.datosGeneralesForm.controls['nombreCct'].markAsTouched()
  this.datosGeneralesForm.controls['localidad'].markAsTouched()
  this.datosGeneralesForm.controls['nivelEducativo'].markAsTouched()
}
else{
this.datosGeneralesForm.patchValue({zonaEscolar: ''})
  this.datosGeneralesForm.patchValue({nombreCct: ''})
  this.datosGeneralesForm.patchValue({localidad: ''})
  this.datosGeneralesForm.patchValue({nivelEducativo: ''})
  this.datosGeneralesForm.controls['zonaEscolar'].markAsUntouched()
  this.datosGeneralesForm.controls['nombreCct'].markAsUntouched()
  this.datosGeneralesForm.controls['localidad'].markAsUntouched()
  this.datosGeneralesForm.controls['nivelEducativo'].markAsUntouched()
}

// contamos la longitud del arreglo y si es 0 es por que el centro de trabajo aun no se encuentra registrado y dejamos los dos niveles escolares
if (this.nivelEducativoSeleccionado.length == 0) {
  this.nivelEducativoSeleccionado=this.nivelesEducativos
}
  // this.datosGeneralesForm.patchValue({nivelEducativo: response.data.centroTrabajo.nivel})

      // creamos el arreglo de los directores
    let Directores:opciones[]=[];
    let Datadirectores=response.data.directores;
    console.log(response.data.directores)
  if(response.data.directores.length > 0) {
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
  
  }else{
    this.nivelEducativoSeleccionado=this.nivelesEducativos
  }
  this.loader=false;
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
      } else if (["DPB", "DPR", "DZC"].includes(tipo)) {
        this.nivelEducativoSeleccionado = this.nivelesEducativos.filter(
          nivel => nivel.nombre === "PRIMARIA"
        );
      } 

    } 
  } 
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


// metodo de agregar un nuevo director
async agregarDirector(){
let disabled = false;
  if (this.datosGeneralesForm.get('claveCct')?.value != '' && this.datosGeneralesForm.controls['claveCct'].valid) {



  let html=      '<input id="swal-input1" class="swal2-input" placeholder="NOMBRE(S)">' +
  '<input id="swal-input2" class="swal2-input" placeholder="APELLIDO PATERNO">' +
  '<input id="swal-input3" class="swal2-input" placeholder="APELLIDO MATERNO">' +
  '<input id="swal-input4" class="swal2-input" placeholder="CURP (OPCIONAL)">';
 html+='<input id="swal-input5" disabled value="'+this.datosGeneralesForm.get('claveCct')?.value.toUpperCase() +'" class="swal2-input" placeholder="CLAVE  DEL CENTRO DE TRABAJO">'
  
  const { value: formValues } = await Swal.fire({
    title: 'Información del nuevo director',
    html:
    html,
    focusConfirm: true,
    showCancelButton: true,
    preConfirm: () => {
      const input1 = (document.getElementById('swal-input1') as HTMLInputElement).value.toUpperCase();
      const input2 = (document.getElementById('swal-input2') as HTMLInputElement).value.toUpperCase();
      const input3 = (document.getElementById('swal-input3') as HTMLInputElement).value.toUpperCase();
      const input4 = (document.getElementById('swal-input4') as HTMLInputElement).value.toUpperCase();
      const input5 = (document.getElementById('swal-input5') as HTMLInputElement).value.toUpperCase();
  
      // Validar que todos los campos estén llenos
      if (!input1 || !input2 || !input3 ) {
        Swal.showValidationMessage('Por favor, completa todos los campos');
        return false;
      }
  
      return [input1, input2, input3, input4];
    }
  });
  
  if (formValues) {

let dataNewDirector={
  token:this.userService.obtenerToken(),
  cct: this.Validaciones.normalizeSpacesToUpperCase(this.Validaciones.limpiarParaSQL(this.datosGeneralesForm.get('claveCct')?.value)),
  nombreCct: this.Validaciones.normalizeSpacesToUpperCase(this.Validaciones.limpiarParaSQL(this.datosGeneralesForm.get('nombreCct')?.value)),
  nivel: this.Validaciones.limpiarParaSQL(this.datosGeneralesForm.get('nivelEducativo')?.value),
  zonaEscolar:this.Validaciones.limpiarParaSQL(this.datosGeneralesForm.get('zonaEscolar')?.value),
  nombre:this.Validaciones.normalizeSpacesToUpperCase(this.Validaciones.limpiarParaSQL(formValues[0])),
  apellidoPaterno:this.Validaciones.normalizeSpacesToUpperCase(this.Validaciones.limpiarParaSQL(formValues[1])),
  apellidoMaterno:this.Validaciones.normalizeSpacesToUpperCase(this.Validaciones.limpiarParaSQL(formValues[2])),
  curp:this.Validaciones.normalizeSpacesToUpperCase( this.Validaciones.limpiarParaSQL(formValues[3])),
  localidad:this.Validaciones.normalizeSpacesToUpperCase(this.Validaciones.limpiarParaSQL(this.datosGeneralesForm.get('localidad')?.value)),
  cicloEscolar:this.Validaciones.normalizeSpacesToUpperCase(this.datosGeneralesForm.get('cicloEscolar')?.value),
};
this.guardarDirector(dataNewDirector)
  }
}else{
  this.NotificacionesService.mostrarAlertaSimple("Debes ingresar la clave del centro de trabajo para agregar un nuevo director")
}
}



guardarDirector(data:any){
  console.log(data)
this.historialServiceAdd.agregarDirector(data).subscribe(response =>{
  if(!response.error){
    if (response.data.length > 0) {
      this.Directores=response.data
      this.NotificacionesService.mostrarAlertaSimple("Director Agregado Correctamente")
      console.log(this.Directores)
    }
  }
  else{
    this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
  }
})
}
getMaterias(){
  this.promedioPrimaria='0'
  if (this.datosGeneralesForm.get('nivelEducativo')?.value == 'fFC1jKUVKAMqnqYtpc9LRw==' ) {
    this.calificacionesPrimaria=[]
    
    let data={"token":this.userService.obtenerToken(), "idPlanEstudio":this.datosGeneralesForm.get("planEstudio")?.value}
    this.historialServiceGet.getMaterias(data).subscribe(response =>{
      if (!response.error) {
        this.materias= response.data;  
        this.desmarcar=true
  }
  
  })
  }
this.desmarcar=false
}

calcularPromedioSecundaria(){
  let primero = isNaN(parseFloat(this.calificacioneSecundaria.get('Primero')?.value)) ? 0 : parseFloat(this.calificacioneSecundaria.get('Primero')?.value);
  let segundo = isNaN(parseFloat(this.calificacioneSecundaria.get('Segundo')?.value)) ? 0 : parseFloat(this.calificacioneSecundaria.get('Segundo')?.value);
  let tercero = isNaN(parseFloat(this.calificacioneSecundaria.get('Tercero')?.value)) ? 0 : parseFloat(this.calificacioneSecundaria.get('Tercero')?.value);
  
  
  this.PromedioSecundaria = ((primero + segundo + tercero) / 3).toFixed(2); // Redondea a 2 decimales
  
}

agregarPromedio(){
  this.egresado.patchValue({promedioGral: this.calificacioneSecundaria.get('calificacionFinal')?.value} )
}

enviarInfo(){
  this.egresado.patchValue({promedioGral:this.calificacioneSecundaria.get('calificacionFinal')?.value} )

  if ((this.datosGeneralesForm.valid && this.calificacioneSecundaria.valid && this.egresado.valid ) || (this.datosGeneralesForm.valid && this.calificacionesPrimaria.length == this.materias.length && this.egresado.valid && this.datosGeneralesForm.get('nivelEducativo')?.value == 'fFC1jKUVKAMqnqYtpc9LRw==')) {
    
    
  this.datosFormulario.cicloEscolar=this.NotificacionesService.separarValor(this.datosGeneralesForm.get('cicloEscolar')?.value,' ')
  let data={}
  // esto es si el nivel es primaria
  if (this.datosGeneralesForm.get('nivelEducativo')?.value == 'fFC1jKUVKAMqnqYtpc9LRw==') {
    data={...this.datosGeneralesForm.value,...this.egresado.value, "token":this.userService.obtenerToken(),"calPrimaria":this.calificacionesPrimaria, "calSecundaria":"", "promedio": this.promedioPrimaria}
    
  }
  // esto es si el nivel es secundaria
  else if(this.datosGeneralesForm.get('nivelEducativo')?.value == 'LEqkvDj0WZNGZXc28I79mQ=='){

    
     data={...this.datosGeneralesForm.value,...this.egresado.value,  "token":this.userService.obtenerToken(),"calPrimaria":"", "calSecundaria":this.calificacioneSecundaria.value}
  }
  let descripcionIds = this.getDatosDeIdentificadores( this.datosGeneralesForm.get('cicloEscolar')?.value, this.datosGeneralesForm.get('turno')?.value)
    data = {...data,...descripcionIds, ...this.archivoCargado}


  console.log(data)
  
  this.historialServiceAdd.cargarBoleta(data).subscribe(response =>{
    if(!response.error){
      this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
      if (!this.repetirInformacion) {
        this.datosGeneralesForm.reset()
        this.calificacioneSecundaria.reset()
        this.materias=[]
        this.calificacionesPrimaria=[]
        this.Directores=[] 
        this.egresado.reset()
        this.promedioPrimaria='0'
        this.PromedioSecundaria='0' 
        this.completoPrimaria=false 
        setTimeout(() => {
          this.completoPrimaria=true
        }, 1000);
      }
      else{
        this.calificacioneSecundaria.reset()
        this.calificacionesPrimaria=[]
        this.egresado.reset()
        this.promedioPrimaria='0'
        this.PromedioSecundaria='0'
        this. completoPrimaria=false
        setTimeout(() => {
          this.completoPrimaria=true
        }, 1000);
      }
    }
    else{
      this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
      // window.location.reload() 

    }
  })
  // this.historialServiceAdd.cargarBoletaSoloPromedio(data).subscribe(response =>{
  //   if(!response.error){
  //     this.NotificacionesService.mostrarAlertaConIcono('boleta agregada', 'La boleta ha sido agregada correctamente', 'success')
  //     console.log()
  //     this.EliminarArchivo=false
  //     if(this.fijarInformacion) {
  //       this.egresado.reset()
  //       this.hojaCertificado=response.data
  //       this.hojaCertificado.url_path= this.tituloPagina.urlImagenes+ this.hojaCertificado.url_path
  //     }else{
  //       this.datosGeneralesForm.reset()
  //       this.egresado.reset()
  //       this.archivoCargado={} as archivos
  //       this.hojaCertificado= {} as hojaCertificado
  //     }
  //   }else{
  //     this.NotificacionesService.mostrarAlertaConIcono('error al agregar boleta', response.mensaje +response.data, 'error' )
  //   }
  // })
  }else{
    this.NotificacionesService.mostrarAlertaSimple("Por favor, complete el formulario correctamente")
    this.datosGeneralesForm.markAllAsTouched()
  }

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

ordenarPlanesEstudioSelect(){
  // extraemos el pla de estudios que fue seleccionado
  let planesEstudiosPermitidos:opciones[]=[]
  let planSeleccionado=''
  this.planesEstudio.forEach(plan => {
    if (plan.selected) {
      planSeleccionado = plan.nombre
    }
  })

  // obtenemos su valor numerico del año
  let planSeparado= planSeleccionado.split(' ')
  let anioPlanSeleccionado:number = parseInt(planSeparado[1])
  // filtramos por los planes de estudios cuyo año

  for (let i=this.planesEstudio.length -1; i>=0; i--) {
    let nombrePlan = this.planesEstudio[i].nombre.split(' ')
    // aqui vamos a obtener el numero siguiente  a plan 
      let inicioPlan:any = nombrePlan[1]
    if (inicioPlan <= anioPlanSeleccionado) {
      planesEstudiosPermitidos.push(this.planesEstudio[i])
    }
      }
      this.planesEstudiosSelect= planesEstudiosPermitidos

    
   
}


ordernarPlanes(planesEstudios:opciones[]){
  let planesEducIndigena:opciones[]=[]
  let planesGenerales:opciones[]=[]
  
  planesEstudios.forEach(plan =>{
    if (plan.educacion_indigena =='1') {
      planesEducIndigena.push(plan)
    }
    else{
      planesGenerales.push(plan)
    }
  })
  
  let planesOrdenados=planesEducIndigena.reverse().concat(planesGenerales.reverse())
  
  this.planesEstudio= planesOrdenados
  }


recibirFolioYDirector(nombreCampo:string, event:any){
this.datosFormulario[nombreCampo] = event
}

recibirCalificacionesPrimaria(id: string, calificacion:any) {
let cal:calificacionesPrimaria={id_materia:id, calificacion: parseFloat(calificacion)}
let suma=0;

this.calificacionesPrimaria.forEach((item, index) => {
  if (item.id_materia === cal.id_materia) {
    this.calificacionesPrimaria .splice(index, 1); // Eliminar el elemento
  }
});

this.calificacionesPrimaria.push(cal) ;
  
  this.calificacionesPrimaria.forEach(cal =>{
    suma+=cal.calificacion
  })
  if (this.redondeado) {
    this.promedioPrimaria = Math.round(suma / this.materias.length).toFixed(0);
  } else {
    this.promedioPrimaria = (suma / this.materias.length).toFixed(1);
  }


}

trackById(index: number, item: any): number {
  return item.id; // o alguna propiedad única
}

getFieldStatus(numero:number , field: string): number {
let  control;
  if(numero==1){
   control = this.datosGeneralesForm.get(field);

} 
else if(numero==3){
control=this.egresado.get(field)
} 
else{
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
getFieldError(field: string): string | null {
  if (!this.datosGeneralesForm.controls[field]) return null;
  const errors = this.datosGeneralesForm.controls[field].errors || {};
  for (const key of Object.keys(errors)) {
    switch (key) {
      case 'required':
        return '* Este campo es requerido';
      case 'minlength':
        return `Minimo ${errors['minlength'].requiredLength} caracters`;
      case 'maxlength':
        return `maximo ${errors['maxlength'].requiredLength} caracters`;
      case 'pattern':
        return '* la informacion ingresada no es valida'
    }
  }
  return 'campo completado correctamente'
}
mantenerInfo(){
  if (this.repetirInformacion) {
    this.repetirInformacion = false;
  }
  else{
    this.repetirInformacion = true
  }
}


eliminarEspaciosBlancos(numeroFormulario:number, nombreCampo:string, tipoLimpieza:number){
let formulario;
  if(numeroFormulario==1){
    formulario = this.datosGeneralesForm;
  }
  else if(numeroFormulario == 2){
    formulario=this.egresado
  }

 if (tipoLimpieza== 1) {
  formulario!.patchValue({[nombreCampo]: this.Validaciones.normalizeSpacesToUpperCase(formulario!.get(nombreCampo)?.value)})
 }
 else{
  formulario!.patchValue({[nombreCampo]: this.Validaciones.normalizeSpaces(formulario!.get(nombreCampo)?.value)})
 }

}


moveFocus(event: KeyboardEvent, nextIndex: number): void {
  if (event.key === 'Enter') {
    const textBoxArray = this.inputBoxes.toArray();
    if (textBoxArray[nextIndex]) {
      textBoxArray[nextIndex].inputElement.nativeElement.focus();
    }
    event.preventDefault(); // Evitar el comportamiento predeterminado
  }
}


verificarCheckbox() {
  let suma=0;
  this.calificacionesPrimaria.forEach(cal =>{
    suma+=cal.calificacion
  })
  if (this.checkbox.nativeElement.checked) {
    this.redondeado=true
    this.promedioPrimaria = Math.round(suma / this.materias.length).toFixed(0);
  } else {
    this.redondeado=false
    this.promedioPrimaria = (suma / this.materias.length).toFixed(1);
  }
}
async cargarArchivos(event: any) {
  try {
      // Usamos await para esperar a que la promesa se resuelva
      const data: ResponseGetFile = await this.getFileSErvice.cargarArchivos(event, true);

      // Accedemos a los datos una vez que la promesa se ha resuelto
      this.toastData = data.dataToast;
      this.hojaCertificado = data.hojaCertificado;
      this.archivoCargado = data.archivoCargado;

      // Verificamos si el archivo se cargó correctamente
      this.hojaCargada = !!this.hojaCertificado.nombre_hoja;

      console.log("Datos cargados:", data);
  } catch (error) {
      console.error("Error:");
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
        this.toastData=dataToast
        this.hojaCertificado=response.data
        this.hojaCertificado.url_path= this.tituloPagina.urlImagenes+ this.hojaCertificado.url_path
        this.EliminarArchivo = false
        this.mostrarToast(7)
        console.log(this.hojaCertificado.url_path)
      }
      else{
        let toastData:toastData ={
          titulo:'Error al buscar hoja de certificado',
          mensaje: 'Aun no hay fotografia de los certificados de la información ingresada',
          icono:this.iconos.XToCloseRounded,
          valido:false,
          mostrar:true
        
        }
        this.hojaCargada=false
        this.hojaCertificado={} as hojaCertificado
        this.toastData=toastData
        this.mostrarToast(7)
      }
    })
  }
}

mostrarToast(tiempo:number){
  this.toastData.mostrar=true;
  setTimeout(() => {
    this.toastData.mostrar=false;
  }, tiempo*1000);
}
eliminarHojaCargada(){
  this.archivoCargado={} as archivos
  this.hojaCertificado={} as hojaCertificado
  this.fileInput.nativeElement.value=''
}
}

