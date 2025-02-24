import { Component, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userService } from '../../Autenticacion1/servicios/user-service.service';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { HistorialBoletasUpdateService } from '../../services/historial-boletas-update.service';
import { datosFiltro } from '../../interfaces/filtros.interface';
import { Boleta, Calificacion, calificacionesPrimaria, calificacionesSecundaria } from '../../interfaces/cargar-boleta';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { opciones } from '../../componentes/componentesInputs/select-form/select-form.component';
import { Iconos } from '../../enums/iconos.enum';
import { min } from 'rxjs';
import { GetNombreService } from '../../services/get-nombre.service';
import { ValidacionesService } from '../../services/validaciones.service';

@Component({
  selector: 'app-editar-boleta',
  templateUrl: './editar-boleta.component.html',
  styleUrl: './editar-boleta.component.css'
})
export class EditarBoletaComponent {

  constructor(private route: ActivatedRoute, private userService: userService, private _route: Router, private historialGet: HistorialBoletasGetService, private notificacionesService: NotificacionesService, private serviceUpdate: HistorialBoletasUpdateService, private fb: FormBuilder,  private tituloPagina:GetNombreService,  private Validaciones:ValidacionesService) { }

  public idBoleta: number = 0;
  public datosCaptura: Boleta = {} as Boleta
  public loader: boolean = false;
  public datosBoleta: Boleta = {} as Boleta;
  public ciclosEscolares: opciones[] = []
  public turnos: opciones[] = []
  private calificacionesPrimaria: Calificacion[] = []

  // estas variables son para controlar si mostrar o no el mensaje de notificacion despues de confirmar o no la informacion 
  public mostrarConfirmacion: boolean = false
  public mensajeNotificacion:string=''



  public promedioPrimaria: string = '0';
  public iconos = Iconos
  public calificacionesValidas: boolean = true
  public completo: boolean = false
  public promedioSecundaria: number = 0
  public mostrarCalificaciones: boolean = false

  datosCct: FormGroup = {} as FormGroup
  persona: FormGroup = {} as FormGroup
  calificacionesSecundaria: FormGroup = {} as FormGroup

  ngOnInit() {
    this.tituloPagina.setNombre='Editar Certificado'
    this.route.paramMap.subscribe(params => {
      let idBoleta = params.get('idBoleta');
      let datosCaptura;

      // Verificar si 'datosCaptura' existe en localStorage
      if (localStorage.getItem('datosCaptura') && localStorage.getItem('datosCaptura') != undefined) {
        datosCaptura = JSON.parse(localStorage.getItem('datosCaptura')!);
        this.datosCaptura = datosCaptura;
        this.calificacionesPrimaria = datosCaptura.calificacionesPrimaria

        // // Si no hay idBoleta en la URL o no coincide con el id_boleta en 'datosCaptura'
        if (this.datosCaptura.id_boleta != this.userService.Desencriptar(idBoleta?.toString()!) || this.datosCaptura.estado_boleta == '') {
          this._route.navigate(['verificacion']);
        } else {
        }
      } else {
        // Si no existe 'datosCaptura' en localStorage
        this._route.navigate(['verificacion']);
      }
    });


    this.datosCct = this.fb.group({
      claveCt: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(3)], ],
      nombreCt: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]],
      grupo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-]+$/)]],
      turno: ['', [Validators.required]],
      ciclo: ['', [Validators.required]],
      nivel: ['', [Validators.required]],
      zona: ['', [Validators.required,  Validators.pattern(/^\d{1,4}$/)]],
      localidad: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      folio: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-]+$/)]],
      idBoleta: ['', [Validators.required]],
      idCt: ['', [Validators.required]],
    });

    this.persona = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      apellidoPaterno: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      apellidoMaterno: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      curp: ['', [Validators.pattern(
        /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TL|TS|VZ|YN|ZS){1}[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]{1}\d{1}$/i
      )]],
      promedioGral:['', [Validators.required, Validators.min(0), Validators.max(10)]]
    });

    this.calificacionesSecundaria = this.fb.group({
      Primero: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
      Segundo: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
      Tercero: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
      calificacionFinal: [0, [Validators.required, Validators.min(1), Validators.max(10)]]
    });


    this.asignarValores();
    this.getCiclosEscolares()
    this.getCiclosTurnos()
  }

  asignarValores() {
    if (this.datosCaptura.calificacionesPrimaria.length > 0 && this.datosCaptura.calificacionesPrimaria[0].calificacion != null) {
     this.mostrarCalificaciones=true;
    }

    if (this.datosCaptura.nivel == 'SECUNDARIA') {
      if (this.datosCaptura.calificacionesSecundaria.Primero > 0) {
        this.mostrarCalificaciones=true;
      }
      this.calificacionesSecundaria.patchValue({
        Primero: this.datosCaptura.calificacionesSecundaria.Primero,
        Segundo: this.datosCaptura.calificacionesSecundaria.Segundo,
        Tercero: this.datosCaptura.calificacionesSecundaria.Tercero,
        calificacionFinal: this.datosCaptura.promedioGral
      });


    }
    this.persona.patchValue({
      nombre: this.datosCaptura.nombre,
      apellidoPaterno: this.datosCaptura.apellido_paterno,
      apellidoMaterno: this.datosCaptura.apellido_materno,
      curp: this.datosCaptura.curp,
      promedioGral:this.datosCaptura.promedioGral
    })
    this.datosCct.patchValue({
      claveCt: this.datosCaptura.clave_centro_trabajo,
      nombreCt: this.datosCaptura.nombre_cct,
      grupo: this.datosCaptura.grupo,
      turno: this.datosCaptura.turno,
      ciclo: this.datosCaptura.ciclo,
      nivel: this.datosCaptura.nivel,
      zona: this.datosCaptura.zona,
      localidad: this.datosCaptura.localidad,
      folio: this.datosCaptura.folio,
      idBoleta: this.datosCaptura.id_boleta,
      idCt: this.datosCaptura.id_ct
    })
  }




  getInfoCaptura() {
    let data: datosFiltro = { folio: "", curp: "", localidad: "", cct: "", boleta: this.idBoleta.toString(), numeroFiltro: "7", estado: "", token: this.userService.obtenerToken(), idCiclo: "", nombre: "" }
    this.historialGet.getDatosBoleta(data).subscribe(response => {
      if (!response.error) {
        this.datosBoleta = response.data[0]
      }
      else {
        this.loader = false;
      }
    })
  }

  ngOnDestroy() {
    localStorage.removeItem('datosCaptura');
  }

  getCiclosEscolares() {
    let data = { token: this.userService.obtenerToken() }
    this.historialGet.getCiclosEscolares(data).subscribe(response => {
      if (!response.error) {
        this.ciclosEscolares = response.data
      }
    })
  }

  getCiclosTurnos() {
    let data = { token: this.userService.obtenerToken() }
    this.historialGet.getTurnos(data).subscribe(response => {
      if (!response.error) {
        this.turnos = response.data
        this.turnos.forEach(turno =>{
          if (turno.nombre == this.datosCaptura.turno) {
            this.datosCct.patchValue({turno:turno.nombre})
          }
        })
      }
    })
  }

  trackById(index: number, item: any): number {
    return item.id; // o alguna propiedad única
  }
  ReemplazarCalificacion(id_calificacion_primaria: number, event: Event) {
    // Convertir el EventTarget en un HTMLInputElement para acceder a su valor
    const inputElement = event.target as HTMLInputElement;
  let  valor:number;
    if(inputElement.value == ""){
      valor= 5
    }else{
      valor = parseFloat(inputElement.value)
    }

    if (valor < 1 || valor > 10) {
      this.calificacionesValidas = false
      this.marcarValidezCalificacion(false, inputElement)
    }
    else {
      this.marcarValidezCalificacion(true, inputElement)
      this.datosCaptura.calificacionesPrimaria.forEach(cal => {
        if (cal.id_calificacion_primaria == id_calificacion_primaria) {
          cal.calificacion = valor.toString()
        } this.calificacionesValidas = true
      })
    }
    let suma = 0;
    this.datosCaptura.calificacionesPrimaria.forEach(cal => {
      suma += parseFloat(cal.calificacion)
    })
    this.promedioPrimaria = (suma / this.datosCaptura.calificacionesPrimaria.length).toFixed(1).toString()

    // aqui verificamos que to

  }

  validarCalificacionesSecundaria(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const valor = parseFloat(inputElement.value)

    if (valor < 1 || valor > 10) {
      this.calificacionesValidas = false
      this.marcarValidezCalificacion(false, inputElement)
    }
    else {
      this.marcarValidezCalificacion(true, inputElement)
      let suma = parseFloat(this.calificacionesSecundaria.get('Segundo')?.value) + parseFloat(this.calificacionesSecundaria.get('Primero')?.value) + parseFloat(this.calificacionesSecundaria.get('Tercero')?.value)
      let promedio = parseFloat((suma / 3).toFixed(2))
      this.calificacionesSecundaria.patchValue({ calificacionFinal: promedio })
    }
  }

  marcarValidezCalificacion(valid: boolean, inputElement: any) {
    if (valid) {
      inputElement.classList.remove('invalid')
      inputElement.classList.add('valid')
    }
    else {
      inputElement.classList.remove('valid')
      inputElement.classList.add('invalid')
    }
  }

  getFieldStatus(field: string, numForm: number): number {
    let control;

    // Detectar qué formulario utilizar
    if (numForm === 1) {
      control = this.persona.controls[field]; // Formulario 1
    } else if (numForm === 2) {
      control = this.datosCct.controls[field]; // Formulario 2
    }
    else if (numForm === 3) {
      control = this.calificacionesSecundaria.controls[field]; // Formulario 3
    }

    if (!control) return 0; // Si no existe el campo, retorna 0.

    // Estado del campo
    if (control.valid && !control.touched) {
      return 0; // Campo válido pero no tocado.
    } else if (control.valid) {
      return 1; // El campo es válido.
    } else if (control.invalid && control.touched) {
      return 2; // El campo es inválido y fue tocado.
    } else if (control.invalid && !control.touched) {
      return 0; // El campo es inválido pero no ha sido tocado.
    }

    return 0;
  }

  getFieldError(field: string, numForm: number): string | null {
    let control;

    // Detectar qué formulario utilizar
    if (numForm === 1) {
      control = this.persona.controls[field]; // Formulario 1
    } else if (numForm === 2) {
      control = this.datosCct.controls[field]; // Formulario 2
    } else if (numForm === 3) {
      control = this.calificacionesSecundaria.controls[field]; // Formulario 3
    }

    if (!control) return null;

    const errors = control.errors || {};

    // Revisar los errores y devolver el mensaje correspondiente
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


  actualizarInformacion() {

    if (this.datosCaptura.nivel== 'SECUNDARIA') {
      this.calificacionesSecundaria.patchValue({calificacionFinal:this.persona.get('promedioGral')?.value})
    }

    if ((this.datosCct.valid && this.persona.valid && this.calificacionesValidas) || (this.datosCct.valid && this.persona.valid && this.calificacionesSecundaria.valid)) {

      let data = { token: this.userService.obtenerToken(), ...this.persona.value, ...this.datosCct.value, calificacionesSecundaria: this.calificacionesSecundaria.value, calificacionesPrimaria: this.calificacionesPrimaria,updateCalificaciones:this.mostrarCalificaciones }
      
      this.serviceUpdate.updateInfoBoleta(data).subscribe(response => {
        console.log(data)
        if (!response.error) {
          this.notificacionesService.mostrarAlertaConIcono('Actualizar informacion', response.mensaje,'success')
          this.mostrarCalificaciones=false;
          this.getInfoCaptura()
        }
        else{
          this.notificacionesService.mostrarAlertaConIcono("Correccion de la información", response.mensaje, 'error');
        }
      })

      }
      else {
        this.notificacionesService.mostrarAlertaConIcono('Actualizar informacion', 'Verifique que la informacion que ingreso sea valida', 'error')
      }

  }

  recibirConfirmacion(event:any){
if (event) {
  let data = {token: this.userService.obtenerToken(), idBoleta: this.datosCaptura.id_boleta}
  this.serviceUpdate.updateEstadoBoleta(data).subscribe(res =>{
    if (!res.error) {
      // this.notificacionesService.mostrarAlertaSimple("Boleta marcada como Revisada")
      this.mensajeNotificacion=res.mensaje
      this.mostrarConfirmacion=true

      this._route.navigate(['verificarCaptura',this.userService.Encriptar(this.datosCaptura.id_boleta.toString())])
    }
  });
}
else{
  this.mensajeNotificacion='La informacion fue Actualizada correctamente pero sigue en estado "En Captura"'
  this.mostrarConfirmacion=true
  setTimeout(() => {
    this.mostrarConfirmacion=false
  }, 3000);
}
  }

  eliminarEspaciosBlancos(numeroFormulario:number, nombreCampo:string, tipoLimpieza:number){
    let formulario;
      if(numeroFormulario==1){
        formulario = this.datosCct;
      }
      else if(numeroFormulario == 2){
        formulario=this.persona
      }
      else if(numeroFormulario == 3){
        formulario=this.calificacionesSecundaria
      }
    
     if (tipoLimpieza== 1) {
      formulario!.patchValue({[nombreCampo]: this.Validaciones.normalizeSpacesToUpperCase(formulario!.get(nombreCampo)?.value)})
     }
     else{
      formulario!.patchValue({[nombreCampo]: this.Validaciones.normalizeSpaces(formulario!.get(nombreCampo)?.value)})
     }
    
    }

}
