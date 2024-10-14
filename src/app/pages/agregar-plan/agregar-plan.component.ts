import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HistorialBoletasAgregarService } from '../../services/historial-boletas-agregar.service';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { listadoPlanesEstudios } from '../../interfaces/cargar-boleta';
import { userService } from '../../Autenticacion1/servicios/user-service.service';

@Component({
  selector: 'app-agregar-plan',
  templateUrl: './agregar-plan.component.html',
  styleUrl: './agregar-plan.component.css'
})
export class AgregarPlanComponent {
  constructor(private fb: FormBuilder, private HistorialServiceAdd:HistorialBoletasAgregarService, private historialServiceGet:HistorialBoletasGetService, private notificacionesService:NotificacionesService, private userService:userService){}

  agregarPlan:FormGroup={} as  FormGroup;

  public hoy:string='';
  public fechaLimite:string='1979-01-01';
  public listadoPlanesEstudio: listadoPlanesEstudios[] = [];

  ngOnInit(){
    let fechaActual = new Date();

let año = fechaActual.getFullYear();
let mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2); // Los meses van de 0 a 11, por eso sumamos 1
let dia = ('0' + fechaActual.getDate()).slice(-2);

this.hoy = `${año}-${mes}-${dia}`;
console.log(this.hoy)

this.agregarPlan=this.fb.group({
  nombrePlan: ['',[Validators.required]],
  periodoInicio:['',[Validators.required]],
  periodoFin:['',[Validators.required]]
})
this.getPlanesEstudios()
  }

  getPlanesEstudios(){
    let data={"token":this.userService.obtenerToken()}
    console.log(data)
    this.historialServiceGet.getPlanesEstudio(data).subscribe(response=>{
      if (!response.error) {
        this.listadoPlanesEstudio=response.data
        console.log(this.listadoPlanesEstudio)
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
      console.log(nombre, event);
      this.agregarPlan.patchValue({[nombre]:event})
      this.agregarPlan.controls[nombre].markAllAsTouched()
    }

    guardarPlan(){
      console.log(this.agregarPlan.value) // Obtiene los valores del formulario.
      if (this.agregarPlan.valid){
        let data= {...this.agregarPlan.value, token:this.userService.obtenerToken()}
        this.HistorialServiceAdd.agregarPlan(data).subscribe(response => {
          if (!response.error) {
            this.notificacionesService.mostrarAlertaSimple(response.mensaje)
            this.listadoPlanesEstudio=response.data
          }
          else{
            console.log(response)
          }
        })
      }
    } 
}
