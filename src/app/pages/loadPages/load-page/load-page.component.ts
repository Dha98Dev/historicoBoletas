import { Component, SimpleChanges } from '@angular/core';
import { opciones } from '../../../componentes/componentesInputs/select-form/select-form.component';
import { HistorialBoletasGetService } from '../../../services/historial-boletas-get.service';
import { HistorialBoletasAgregarService } from '../../../services/historial-boletas-agregar.service';
import Swal from 'sweetalert2';
import { calificacionesPrimaria, calificacionesSecundaria, DatosGenerales } from '../../../interfaces/cargar-boleta';
import { CentroTrabajo, Persona } from '../../../interfaces/datosCct.interface';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, MinValidator, Validators } from '@angular/forms';
import { min } from 'rxjs';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';

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
  // variables de datos string o numeros
  
  // variables que son arreglos
  public calificacionesPrimaria:calificacionesPrimaria[]=[]
  public planesEstudio: opciones[]=[];
  public ciclosEscolares: opciones[]=[];
  private nivelesEducativos: opciones[]=[]
  public nivelEducativoSeleccionado:opciones[]=[]
  public  Turnos:opciones[]=[];
  public datosFormulario:DatosGenerales= {} as DatosGenerales;
  public datos:string[]=[]
  public Directores:opciones[]=[]
  public materias:opciones[]=[] 

  constructor(private historialServiceGet: HistorialBoletasGetService, private historialServiceAdd:HistorialBoletasAgregarService, private NotificacionesService:NotificacionesService, private fb: FormBuilder, private userService:userService){}

  datosGeneralesForm: FormGroup= {}  as FormGroup;
  calificacioneSecundaria:FormGroup= {} as FormGroup
  ngOnInit():void{


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
    if (nivelesEducativos != null) {
      this.nivelesEducativos=JSON.parse(nivelesEducativos);
      this.nivelEducativoSeleccionado=this.nivelesEducativos
    }else{
      this.getNivelesEducativos();
    }

    if (ciclosEscolares!= null) {
      this.ciclosEscolares=JSON.parse(ciclosEscolares);
      console.log(this.ciclosEscolares)
    }else{
      this.getCiclosEscolares();
    }

    this.getPlanesEstudio();

        this.datosGeneralesForm = this.fb.group({
      claveCct: ['', [Validators.required, Validators.pattern(/^18[A-Za-z]{3}[0-9]{4}[A-Za-z]$/)]],
      cicloEscolar: ['', Validators.required],
      nivelEducativo: ['', Validators.required],
      planEstudio: ['', Validators.required],
      zonaEscolar: ['', [Validators.required, Validators.min(1)]],
      nombreCct: ['', Validators.required],
      turno: ['', Validators.required],
      grupo: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      curp: ['', [ Validators.pattern(/^([A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2})$/)]],
      folioBoleta: ['', Validators.required],
      directorCorrespondiente: ['', ]
    });

    this.calificacioneSecundaria= this.fb.group({
      Primero:['',[Validators.required,Validators.min(1), Validators.max(10)]],
      Segundo:['',[Validators.required,Validators.min(1), Validators.max(10)]],
      Tercero:['',[Validators.required,Validators.min(1), Validators.max(10)]],
      calificacionFinal:['',[Validators.required]]
    })
  }


// Uso de la función para cada caso


  getNivelesEducativos(){
    let data={"token":this.userService.obtenerToken(), };
    this.historialServiceGet.getNivelesEducativos(data).subscribe(response =>{
      if(!response.error){
        this.nivelesEducativos=response.data;
        localStorage.setItem('nivelesEducativos', JSON.stringify(this.nivelesEducativos))
      }
    })
  }

  getPlanesEstudio(){
    let data={"token":this.userService.obtenerToken() }
    this.historialServiceGet.getPlanesEstudio(data).subscribe(response =>{
      if(!response.error){
      this.planesEstudio=response.data;
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
      console.log(response.data.centroTrabajo.claveCct)
      this.loader=false;
  // this.datosGeneralesForm.patchValue({nivelEducativo: response.data.centroTrabajo.id_nivel})
if (response.data.centroTrabajo.claveCct !=undefined) {
  this.datosGeneralesForm.patchValue({zonaEscolar: response.data.centroTrabajo.zonaEscolar})
  this.datosGeneralesForm.patchValue({nombreCct: response.data.centroTrabajo.nombreCt})
  this.datosGeneralesForm.controls['zonaEscolar'].markAsTouched()
  this.datosGeneralesForm.controls['nombreCct'].markAsTouched()
  
}

// contamos la longitud del arreglo y si es 0 es por que el centro de trabajo aun no se encuentra registrado y dejamos los dos niveles escolares
if (this.nivelEducativoSeleccionado.length == 0) {
  this.nivelEducativoSeleccionado=this.nivelesEducativos
}
  // this.datosGeneralesForm.patchValue({nivelEducativo: response.data.centroTrabajo.nivel})

      // creamos el arreglo de los directores
    let Directores:opciones[]=[];
    let Datadirectores=response.data.directores;
 for (let i = 0; i < Datadirectores.length; i++) {
  let newDirector={"nombre": Datadirectores[i].nombre + " "+ Datadirectores[i].apellidoPaterno + " " + Datadirectores[i].apellidoMaterno , "valor": Datadirectores[i].id_persona}
  Directores.push(newDirector);
    this.Directores=Directores
  }
  
  }else{
    this.nivelEducativoSeleccionado=this.nivelesEducativos
  }
  this.loader=false;
  })
}
}

// creamos el metodo  para filtrar el nivel que sera seleccionado dependiendo de la clave de centro de trabajo
filtrarNivel(){
if (this.datosGeneralesForm.controls['claveCct'].valid) {
  const clave = this.datosGeneralesForm.get('claveCct')?.value;
  const tipo = clave.substring(2, 5); 
  if (tipo == "DES" || tipo == "DST" || tipo == "EST") {
    this.nivelEducativoSeleccionado=this.nivelesEducativos.filter(nivel => nivel.nombre == 'SECUNDARIA');
}
else if(tipo == "DPB" || tipo == "DPR"){
  this.nivelEducativoSeleccionado=this.nivelesEducativos.filter(nivel => nivel.nombre == 'PRIMARIA');
}
}
}


// metodo de agregar un nuevo director
async agregarDirector(){
let disabled = false;
  if (this.datosGeneralesForm.get('claveCct')?.value != '' && this.datosGeneralesForm.controls['claveCct'].valid) {



  let html=      '<input id="swal-input1" class="swal2-input" placeholder="NOMBRE(S)">' +
  '<input id="swal-input2" class="swal2-input" placeholder="APELLIDO PATERNO">' +
  '<input id="swal-input3" class="swal2-input" placeholder="APELLIDO MATERNO">' +
  '<input id="swal-input4" class="swal2-input" placeholder="CURP (OPCIONAL)">';
 html+='<input id="swal-input5" [disabled]="'+disabled+'" value="'+this.datosGeneralesForm.get('claveCct')?.value.toUpperCase() +'" class="swal2-input" placeholder="CLAVE  DEL CENTRO DE TRABAJO">'
  
  const { value: formValues } = await Swal.fire({
    title: 'Información del nuevo director',
    html:
    html,
    focusConfirm: false,
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
  cct: this.datosGeneralesForm.get('claveCct')?.value,
  nombreCct: this.datosGeneralesForm.get('nombreCct')?.value,
  nivel: this.datosGeneralesForm.get('nivelEducativo')?.value,
  zonaEscolar:this.datosGeneralesForm.get('zonaEscolar')?.value,
  nombre:formValues[0],
  apellidoPaterno:formValues[1],
  apellidoMaterno:formValues[2],
  curp: formValues[3],
};
console.log(dataNewDirector)
this.guardarDirector(dataNewDirector)
  }
}else{
  this.NotificacionesService.mostrarAlertaSimple("Debes ingresar la clave del centro de trabajo para agregar un nuevo director")
}
}

guardarDirector(data:any){
this.historialServiceAdd.agregarDirector(data).subscribe(response =>{
  if(!response.error){
    if (response.data.length > 0) {
      this.Directores=response.data
      this.NotificacionesService.mostrarAlertaSimple("Director Agregado Correctamente")
    }
  }
  else{
    this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
  }
})
}
getMaterias(){
  
  if (this.datosGeneralesForm.get('nivelEducativo')?.value == '1') {
    
  let data={"token":this.userService.obtenerToken(), "idPlanEstudio":this.datosGeneralesForm.get("planEstudio")?.value}
  console.log(data)
  this.historialServiceGet.getMaterias(data).subscribe(response =>{
  if (!response.error) {
    this.materias= response.data;
    console.log(this.materias)
  }
  
  })
  }

}

calcularPromedioSecundaria(){
  let primero = isNaN(parseFloat(this.calificacioneSecundaria.get('Primero')?.value)) ? 0 : parseFloat(this.calificacioneSecundaria.get('Primero')?.value);
  let segundo = isNaN(parseFloat(this.calificacioneSecundaria.get('Segundo')?.value)) ? 0 : parseFloat(this.calificacioneSecundaria.get('Segundo')?.value);
  let tercero = isNaN(parseFloat(this.calificacioneSecundaria.get('Tercero')?.value)) ? 0 : parseFloat(this.calificacioneSecundaria.get('Tercero')?.value);
  
  console.log(primero, segundo, tercero);
  
  this.PromedioSecundaria = ((primero + segundo + tercero) / 3).toFixed(2); // Redondea a 2 decimales
  console.log(this.PromedioSecundaria);
  
}


enviarInfo(){

  if ((this.datosGeneralesForm.valid && this.calificacioneSecundaria.valid) || (this.datosGeneralesForm.valid && this.calificacionesPrimaria.length == this.materias.length)) {
    
  }else{
    this.NotificacionesService.mostrarAlertaSimple("Por favor, complete el formulario correctamente")
    this.datosGeneralesForm.markAllAsTouched()
  }

  this.datosFormulario.cicloEscolar=this.NotificacionesService.separarValor(this.datosGeneralesForm.get('cicloEscolar')?.value,' ')
  let data={}
  if (this.datosGeneralesForm.get('nivelEducativo')?.value == 1) {
    data={...this.datosGeneralesForm.value, "token":this.userService.obtenerToken(),"calPrimaria":this.calificacionesPrimaria, "calSecundaria":""}
    
  }
  else if(this.datosGeneralesForm.get('nivelEducativo')?.value == 2){
    this.calificacioneSecundaria.patchValue({calificacionFinal:this.PromedioSecundaria} )
     data={...this.datosGeneralesForm.value,  "token":this.userService.obtenerToken(),"calPrimaria":"", "calSecundaria":this.calificacioneSecundaria.value}
  }
  console.log(data)
  
  this.historialServiceAdd.cargarBoleta(data).subscribe(response =>{
    if(!response.error){
      this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
     this.datosGeneralesForm.reset()
     this.calificacioneSecundaria.reset()
     this.materias=[]
     this.calificacionesPrimaria=[]
     this.Directores=[]
    }
    else{
      this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
      // window.location.reload() 

    }
  })
  
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
 console.log(cicloEscolar)

 
  let cicloSeparado= cicloEscolar.split('-')
  let cicloInicio = parseInt(cicloSeparado[0])
  let cicloFin=cicloSeparado[1]
  let planesEstudio=[]

  let continuar=true
for (let i=this.planesEstudio.length -1; i>=0; i--) {
  let nombrePlan = this.planesEstudio[i].nombre.split(' ')
    let inicioPlan:any = nombrePlan[nombrePlan.length - 1]
  
    planesEstudio.push(this.planesEstudio[i])
    inicioPlan=parseInt(inicioPlan)
    if (continuar && inicioPlan <= cicloInicio) {
      this.planesEstudio[i].selected = true
      this.datosGeneralesForm.patchValue({planEstudio: this.planesEstudio[i].valor})
      this.datosGeneralesForm.controls['planEstudio'].markAsTouched()
      continuar = false;
    }
}

this.planesEstudio=planesEstudio;


}

recibirFolioYDirector(nombreCampo:string, event:any){
this.datosFormulario[nombreCampo] = event
}

recibirCalificacionesPrimaria(id: string, calificacion:any) {
let cal:calificacionesPrimaria={id_materia: parseInt(id), calificacion: parseFloat(calificacion)}
let suma=0;

this.calificacionesPrimaria.forEach((item, index) => {
  if (item.id_materia === cal.id_materia) {
    this.calificacionesPrimaria .splice(index, 1); // Eliminar el elemento
  }
});

console.log(this.calificacionesPrimaria)
this.calificacionesPrimaria.push(cal) ;
  
  this.calificacionesPrimaria.forEach(cal =>{
    suma+=cal.calificacion
  })
  console.log(suma)
  this.promedioPrimaria=(suma/this.materias.length).toString()


}
trackById(index: number, item: any): number {
  return item.id; // o alguna propiedad única
}

getFieldStatus(numero:number , field: string): number {
let  control;
  if(numero==1){
   control = this.datosGeneralesForm.get(field);

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


}
