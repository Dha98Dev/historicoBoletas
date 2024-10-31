import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { userService } from '../servicios/user-service.service';
import { HistorialBoletasAgregarService } from '../../services/historial-boletas-agregar.service';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { min } from 'rxjs';
import { NotificacionesService } from '../../services/notificaciones.service';
import { tUsuarios } from '../../interfaces/filtros.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private fb:FormBuilder, private userService:userService, private historialAdd: HistorialBoletasAgregarService, private historialGet:HistorialBoletasGetService, private notificacionesService:NotificacionesService){}
public listadoTUsuarios:tUsuarios[] = []
  newUser:FormGroup={} as FormGroup;

  ngOnInit(){
    this.newUser = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidoP: ['', [Validators.required, Validators.minLength(3)]],
      apellidoM: ['', [Validators.required, Validators.minLength(3)]],
      curp: ['', [Validators.required,   Validators.pattern(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TL|TS|VZ|YN|ZS){1}[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]{1}\d{1}$/)]],
      usuario: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
      t_usuario: ['', [Validators.required]]

    });
    this.getTiposUsuarios()
  }

  getFieldStatus( field: string): number {

       const control = this.newUser.get(field);
 
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
      if (!this.newUser.controls[field]) return null;
      const errors = this.newUser.controls[field].errors || {};
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

    guardarNewUser(){
      if (this.newUser.valid) {
        let data ={...this.newUser.value, "token":this.userService.obtenerToken()}
        console.log(data)
        this.userService.agregarUsuario(data).subscribe(response =>{
          if (!response.error) {
            this.notificacionesService.mostrarAlertaConIcono("Agregar Usuario",response.mensaje,'success' )
            this.newUser.reset()
          }
          else{
            this.notificacionesService.mostrarAlertaConIcono("Agregar Usuario",response.mensaje,'error' )
            console.log(response)
          }
        })
      }
      else{
        this.newUser.markAllAsTouched()
        this.notificacionesService.mostrarAlertaSimple('Debe de llenar todos los campos')
      }
    }

    getTiposUsuarios(){
let data={token:this.userService.obtenerToken()}
this.historialGet.getTiposUsuarios(data).subscribe(response => {
  if (!response.error) {
    this.listadoTUsuarios = response.data
  }
  else{
    console.log(response)
  }
})
    }

}

  export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.value;
  
      // Expresión regular para verificar:
      // - Al menos una letra mayúscula
      // - Al menos un número
      // - Al menos un carácter especial
      // - Longitud mínima de 8 caracteres
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  
      // Si la contraseña no cumple con el patrón, retornamos un objeto con el error.
      return password && !passwordPattern.test(password)
        ? { 'invalidPassword': true }
        : null;
    };
  }

