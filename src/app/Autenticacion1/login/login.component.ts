import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { userService } from '../servicios/user-service.service';
import { GetNombreService } from '../../services/get-nombre.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private fb:FormBuilder, private userService:userService, private router:Router,  private tituloPagina:GetNombreService){}
  
  
  public error:boolean=false;
  public loader: boolean = false;
  public recuperarPassword:string=this.userService.Encriptar('0')

  login:FormGroup={} as FormGroup;
  ngOnInit(){
    this.tituloPagina.setNombre='Iniciar Sesion'
    this.login= this.fb.group({
      usuario:['', [Validators.required ]],
      password:['',[Validators.required]]
    })
  } 

  iniciarSesion(){
    if (this.login.valid) {
      const datos= {usuario:this.login.get('usuario')?.value, password:this.login.get('password')?.value}
      console.log(datos)
      this.userService.iniciarSesion(datos).subscribe(data=>{

        console.log(datos)
        if(!data.error){
          this.userService.guardarDatosUsuario(data.data.usuario, data.data.token, data.data.fk_tipo_usuario.toString())
          
          if(data.data.fk_tipo_usuario ==1 || data.data.fk_tipo_usuario==3 || data.data.fk_tipo_usuario== 2){
            this.router.navigate(['/cargarInformacion'])
            this.sweetAlerta('Bienvenido',data.mensaje,"success")  
          }
        }
        else{
          this.sweetAlerta('error',data.mensaje,"error")
        }
      })
    }
  }

  getFieldError(field:string): string|null{
    if(!this.login.controls[field]) return null;
    const errors= this.login.controls[field].errors || {};
    for(const key  of Object.keys(errors))
    {
      switch(key){
        case 'required':
          return 'este campo es requerido';
        case 'minlength':
          return `Minimo ${errors['minlength'].requiredLength} caracters`;
          case 'maxlength':
            return `maximo ${errors['maxlength'].requiredLength} caracters`;
      }
    }
    return 'campo completado correctamente'
  }
  isValidField(field:string){
    return this.login.controls[field].errors && this.login.controls[field].touched
  }
  
  sweetAlerta(titulo:string,mensaje:string,icon:any){
      Swal.fire({
      title: `${titulo}`,
      text: `${mensaje}`,
      icon: icon
    });
  }
  
}
