import { Component, ElementRef, ViewChild } from '@angular/core';
import { opciones } from '../../componentes/componentesInputs/select-form/select-form.component';
import Swal from 'sweetalert2';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { HistorialBoletasAgregarService } from '../../services/historial-boletas-agregar.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { AsignarMateriasPlan } from '../../interfaces/respuestaOpcionesSelect.interface';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { userService } from '../../Autenticacion1/servicios/user-service.service';
import { GetNombreService } from '../../services/get-nombre.service';

@Component({
  selector: 'app-asignar-materias-plan',
  templateUrl: './asignar-materias-plan.component.html',
  styleUrl: './asignar-materias-plan.component.css'
})
export class AsignarMateriasPlanComponent {


  constructor(private historialServiceGet: HistorialBoletasGetService, private historialServiceAdd:HistorialBoletasAgregarService, private NotificacionesService:NotificacionesService, private _router:Router, private fb:FormBuilder, private userService:userService,  private tituloPagina:GetNombreService){}

  public planesEstudio:opciones[]=[]
  public materias:opciones[]=[]
  public nivelesEducativos:opciones[] = []
  public materiaSeleccionadas:AsignarMateriasPlan= {} as AsignarMateriasPlan
  public materiasGuardadas:boolean=false
  public btnGuardar:boolean = false

  datosPlan:FormGroup={} as FormGroup
  ngOnInit():void{
    this.tituloPagina.setNombre='Asignar Materias'
    this.datosPlan=this.fb.group({
    idPlanEstudio:['', [Validators.required]],
    idNivel:['', [Validators.required]],
    materias:['', [Validators.required]]
    })

    // this.getNivelesEducativos();
    this.getPlanesEstudio();
    // this.getCiclosEscolares();
    // this.getTurnos()

    this.getMaterias()
    // obtenemos la información de localStorage y si no hay nada hacemos las peticiones
    let Turnos= localStorage.getItem('Turnos')
    let nivelesEducativos= localStorage.getItem('nivelesEducativos')
    let ciclosEscolares= localStorage.getItem('ciclosEscolares')

   
    if (nivelesEducativos != null) {
      this.nivelesEducativos=JSON.parse(nivelesEducativos);
    }else{
      this.getNivelesEducativos();
    }
    this.getPlanesEstudio();
  
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
  getMaterias(){
    let data={"token":this.userService.obtenerToken(), "idPlanEstudio":"" }

this.historialServiceGet.getMaterias(data).subscribe(response =>{
if (!response.error) {
this.materias=response.data
this.materias.forEach(materia =>{
  materia.valor=materia.valor +"-" + materia.nombre;
})
}
else{

}
})

  }

  obtenerValor(valor:string){
    let arr=valor.split("-");

    return arr[0];
  }
  obtenerOpcionSeleccionada(seleccion:string){
    let arr=seleccion.split("-");
    return arr[1];
  }



  async AddMateria() {
    const { value: materia } = await Swal.fire({
      title: 'Ingrese la Nueva Materia',
      input: 'text',
      inputLabel: 'Nueva Materia',
      inputPlaceholder: 'Ingrese la Nueva Materia',
      inputAttributes: {
        maxlength: '30',
        autocapitalize: 'off',
        autocorrect: 'off'
      }
    });
  
    if (materia) {
  this.agregarMateria(materia.toUpperCase());
    } //${password}
  }

  agregarMateria(materia:string){
    let data ={"token": this.userService.obtenerToken(), "materia":materia}
  this.historialServiceAdd.agregarMateria(data).subscribe(response =>{
    if (!response.error) {
      this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
      this.materias.push(response.data)
    }
    else{
      this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
    }
  })
  }

  recivirValores(nombreCampo:string, event:any){
    if (!this.materiaSeleccionadas.materias) {
      this.materiaSeleccionadas.materias = [];
    }
    if (nombreCampo == 'materias') {
      // Verifica si 'materias' está inicializada, si no lo está, inicialízala como un arreglo vacío
    
      const index = this.materiaSeleccionadas.materias.indexOf(event);
    
      if (index > -1) {
        // Si el valor ya existe, lo eliminamos (fue deseleccionado)
        this.materiaSeleccionadas.materias.splice(index, 1);
      } else {
        // Si el valor no existe, lo agregamos (fue seleccionado)
        this.materiaSeleccionadas.materias.push(event);
        this.datosPlan.patchValue({materias:this.materiaSeleccionadas.materias})
      }
    } else {
      this.materiaSeleccionadas[nombreCampo] = event;
    }

    // verificamos que todos los campos ya se encuentren llenos 

    if (this.materiaSeleccionadas.idPlanEstudio != undefined && this.materiaSeleccionadas.materias.length > 0 ) {
      this.btnGuardar= true
    }
    
  }

  guardarMateriasSeleccionadas(){

    let materiasSelecciondas:string[]=[];
    let valorMateriasSeleccionadas:string[]=[]
    this.materiaSeleccionadas.materias.forEach(materia => {
      let v=this.obtenerValor(materia)
      valorMateriasSeleccionadas.push(v)

      let m=this.obtenerOpcionSeleccionada(materia)
      materiasSelecciondas.push(m)
    });
    let planSeleccionado= ''

    this.planesEstudio.forEach(plan =>{
      if(plan.valor == this.datosPlan.get('idPlanEstudio')?.value){
        planSeleccionado=plan.nombre
      }
    })

    let listaMaterias="";
    materiasSelecciondas.forEach(m =>{
      listaMaterias+='<li class="list-group-item">'+m+'</li>'
    })


    Swal.fire({
      title: 'Confirmación de  Materias a Agregar al ' + planSeleccionado,
      html: `<ul class="list-group mt-4">${listaMaterias}</ul>`,
      icon: 'question',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      // Verificar si el usuario hizo clic en "Aceptar"
      if (result.isConfirmed) {
      let data={"token": this.userService.obtenerToken(), "materias":valorMateriasSeleccionadas, "idPlanEstudio":this.datosPlan.get("idPlanEstudio")?.value, "nivel":this.datosPlan.get("nivel")?.value}
      this.historialServiceAdd.asignarMaterias(data).subscribe(response => {
        if (!response.error) {
          this.NotificacionesService.mostrarAlertaSimple(response.mensaje)
          this.materiasGuardadas=true;
          this.datosPlan.reset();
          setTimeout(() =>{
            this.materiaSeleccionadas= {} as AsignarMateriasPlan
            this.materiasGuardadas=false;
            this.desmarcarCasillas()
          },500)
          // this._router.navigate(['planesEstudio/agregarPlan'])
        }
        else{
          this.NotificacionesService.mostrarAlertaSimple(response.mensaje)

        }
      })
      }
    });
  }

desmarcarCasillas(){
  let planesEstudio:opciones[]=[]
  let nivelesEducativos:opciones[]=[]
  this.nivelesEducativos.forEach(nivel =>{
    nivel.selected=false
    nivelesEducativos.push(nivel)
  }) 

  this.planesEstudio.forEach(plan =>{
  plan.selected=false
  planesEstudio.push(plan)
  })

}
  }





