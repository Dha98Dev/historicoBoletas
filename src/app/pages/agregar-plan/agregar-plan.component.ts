import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HistorialBoletasAgregarService } from '../../services/historial-boletas-agregar.service';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { listadoPlanesEstudios } from '../../interfaces/cargar-boleta';
import { userService } from '../../Autenticacion1/servicios/user-service.service';
import { GetNombreService } from '../../services/get-nombre.service';

@Component({
  selector: 'app-agregar-plan',
  templateUrl: './agregar-plan.component.html',
  styleUrl: './agregar-plan.component.css'
})
export class AgregarPlanComponent {
  constructor(private fb: FormBuilder, private HistorialServiceAdd:HistorialBoletasAgregarService, private historialServiceGet:HistorialBoletasGetService, private notificacionesService:NotificacionesService, private userService:userService, private tituloPagina:GetNombreService){}

  agregarPlan:FormGroup={} as  FormGroup;

  public hoy:string='';
  public fechaLimite:string='1979-01-01';
  public listadoPlanesEstudio: listadoPlanesEstudios[] = [];

  ngOnInit(){

    this.tituloPagina.setNombre='Planes de Estudios'
  
    let fechaActual = new Date();
let año = fechaActual.getFullYear();
let mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2); // Los meses van de 0 a 11, por eso sumamos 1
let dia = ('0' + fechaActual.getDate()).slice(-2);

this.hoy = `${año}-${mes}-${dia}`;

this.agregarPlan=this.fb.group({
  nombrePlan: ['',[Validators.required]],
  periodoInicio:['',],
  periodoFin:['',]
})
this.getPlanesEstudios()
  }

  getPlanesEstudios(){
    let data={"token":this.userService.obtenerToken()}
    this.historialServiceGet.getPlanesEstudio(data).subscribe(response=>{
      if (!response.error) {
        this.listadoPlanesEstudio=response.data
      }
      else{
        this.notificacionesService.mostrarAlertaSimple('Error al obtener planes de estudio');
      }
    })
  }

  getFieldStatus( field: string): number {
    let  control=this.agregarPlan.controls[field];
  
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
      if (!this.agregarPlan.controls[field]) return null;
      const errors = this.agregarPlan.controls[field].errors || {};
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

    recibirFechas(nombre:string, event:any){
      this.agregarPlan.patchValue({[nombre]:event})
      this.agregarPlan.controls[nombre].markAllAsTouched()
    }

    guardarPlan(){
      if (this.agregarPlan.valid){
        let data= {...this.agregarPlan.value, token:this.userService.obtenerToken()}
        this.HistorialServiceAdd.agregarPlan(data).subscribe(response => {
          if (!response.error) {
            this.notificacionesService.mostrarAlertaSimple(response.mensaje)
            this.listadoPlanesEstudio=response.data
          }
          else{
          }
        })
      }
      else{
        this.notificacionesService.mostrarAlertaSimple("DEBE DE LLENAR LOS CAMPOS QUE SON REQUERIDOS COMO EL NOMBRE DEL PLAN DE ESTUDIOS")
      }
    } 
}
