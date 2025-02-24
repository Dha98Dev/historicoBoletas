import { Component, ElementRef, viewChild, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Iconos } from '../../../enums/iconos.enum';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { userService } from '../../../Autenticacion1/servicios/user-service.service';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrl: './modal-change-password.component.css'
})
export class ModalChangePasswordComponent {
  public iconos = Iconos
  public verPassword: boolean = false
  public passwordValidas: boolean = false
  public verMensaje: boolean = false
  public animationClass:string=''



  constructor(private fb: FormBuilder, private notificationService:NotificacionesService, private userService:userService) { }

  @ViewChild('password') pass!: ElementRef;
  @ViewChild('confirmPassword') passConfirm!: ElementRef
  @ViewChild('requisitosPassword') passwordMesage!: ElementRef

  newPassword: FormGroup = {} as FormGroup;

  ngOnInit() {
    this.newPassword = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')]],
       confirmPassword: ['', 
        [Validators.required,
        Validators.minLength(8)]],
        currentPassword: ['', [Validators.required,Validators.minLength(8)]]
    });
  }


  showPassword() {
    this.verPassword = this.verPassword ? false : true
    this.pass.nativeElement.type = this.pass.nativeElement.type === 'password' ? 'text' : 'password'
    this.passConfirm.nativeElement.type = this.passConfirm.nativeElement.type === 'password' ? 'text' : 'password'
  }


  toggleSelect() {
    if (this.verMensaje) {
      // Si el select está visible, activa la animación de salida
      this.startFadeOut();
    } else {
      // Si el select está oculto, muestra con animación de entrada
      this.verMensaje = true;
      this.animationClass = 'animate__animated animate__bounceIn';
    }
  }

  startFadeOut() {
    // Agrega la clase de salida
    this.animationClass = 'animate__animated animate__bounceOut';
    // Después de la duración de la animación (0.5s), oculta el select
    setTimeout(() => {
      this.verMensaje = false;
      this.animationClass = '';
    }, 500); // Duración de la animación de salida
  }

  cambiarPassword() {
    if (this.newPassword.valid && this.passwordValidas) {
      let newPasswordB64= btoa(this.newPassword.get('password')?.value)
      let passwordActualB64= btoa(this.newPassword.get('currentPassword')?.value)
      let data={token:this.userService.obtenerToken(), passwordActual:passwordActualB64, passwordNueva:newPasswordB64}
      this.userService.cambiarPassword(data).subscribe(response =>{
        if (!response.error) {
          this.notificationService.mostrarAlertaConIcono('Cambio de Contraseña', response.mensaje, 'success');
        }
        else{
          this.notificationService.mostrarAlertaConIcono('Cambio de Contraseña', response.mensaje, 'error');
        }
      })
    } else {
      this.notificationService.mostrarAlertaSimple('Debe de llenar todos los campos Correctamente')
    }
  }

  limpiarFormulario() {
   this.newPassword.reset();
  }

  getFieldStatus(field: string): number {
    const control = this.newPassword.get(field);
    if (!control) return 0;

    if (control.valid && !control.touched) return 0;
    if (control.valid) return 1;
    if (control.invalid && control.touched) return 2;
    if (control.invalid && !control.touched) return 0;

    return 0;
  }



  getFieldError(field: string): string | null {
    const control = this.newPassword.get(field);

    if (!control) return null;

    // Verifica el error `passwordsMismatch` para `confirmPassword`
    if (field === 'confirmPassword' && this.newPassword.hasError('passwordsMismatch')) {
      return '* Las contraseñas no coinciden';
    }

    const errors = control.errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return '* Este campo es requerido';
        case 'minlength':
          return `* Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `* Máximo ${errors['maxlength'].requiredLength} caracteres`;
        case 'pattern':
          return '* La información ingresada no es válida';
      }
    }

    return 'Campo completado correctamente';
  }

  validarPasswords() {
    let pass1 = this.newPassword.get('password')?.value;
    let pass2 = this.newPassword.get('confirmPassword')?.value;
    // primero verificamos que las contraseñas no esten vacias
    if (pass1 != '' && pass2 != '') {
      // despues vrificamos que las contraseñas sean iguales y que los campos del formulario ya sean validos
      if ((this.newPassword.valid) && (pass1 === pass2)) {
        this.passwordValidas = true
      }
      else {
        this.passwordValidas = false
      }
    }


  }

}
