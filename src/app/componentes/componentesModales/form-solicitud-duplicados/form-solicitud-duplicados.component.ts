import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Iconos } from '../../../enums/iconos.enum';
import { ValidacionesService } from '../../../services/validaciones.service';
import { NotificacionesService } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-form-solicitud-duplicados',
  templateUrl: './form-solicitud-duplicados.component.html',
  styleUrl: './form-solicitud-duplicados.component.css'
})
export class FormSolicitudDuplicadosComponent {
  constructor(private  fb:FormBuilder, private validaciones:ValidacionesService,  private notificacionesService:NotificacionesService){} 
  
  municipios: string[] = [
    'Acaponeta',
    'Ahuacatlán',
    'Amatlán de Cañas',
    'Bahía de Banderas',
    'Compostela',
    'Del Nayar',
    'Huajicori',
    'Ixtlán del Río',
    'Jala',
    'La Yesca',
    'Rosamorada',
    'Ruiz',
    'San Blas',
    'San Pedro Lagunillas',
    'Santa María del Oro',
    'Santiago Ixcuintla',
    'Tecuala',
    'Tepic',
    'Tuxpan',
    'Xalisco'
  ];
  public destruirForm:boolean = false;
  public porcentajeLlenado: number = 0;
  public  iconos=Iconos
  SolicitudCertificado:FormGroup = {} as  FormGroup
ngOnInit(): void {
  this.SolicitudCertificado = this.fb.group({
    municipio: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s"']+$/), Validators.minLength(4)]],
    localidad: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s"']+$/), Validators.minLength(4)]],
    domicilio: ['',[, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ#°\s"']+$/), Validators.minLength(4)]],
    telefono: ['',[Validators.required, Validators.pattern(/^\d{10}$/)]],
  })
}
mostrarModal: boolean = false;

// estos son los inputs 
@Input()
public titulo:string = 'Ingrese la información adicional para la solicitud del certificado'


@Output() accionConfirmada = new EventEmitter<boolean>();
@Output() OnEmitInformacion = new EventEmitter<any>();


mostrar(): void {
    this.mostrarModal = true; // Activa la visibilidad y las animaciones
}

ocultar(): void {
    this.mostrarModal = false; // Desactiva las animaciones y oculta el modal
}

confirmar(): void {
    this.accionConfirmada.emit(true);
    this.ocultar();
}

cancelar(): void {
    this.accionConfirmada.emit(false);
    this.ocultar();
    this.SolicitudCertificado.reset()
}



verificarEstadoFormulario(){
  let camposLlenos = 0;
  const totalCampos = Object.keys(this.SolicitudCertificado.controls).length;

  for (const control in this.SolicitudCertificado.controls) {
    if (this.SolicitudCertificado.controls[control].valid) {
      camposLlenos++;
    }
  }

  this. porcentajeLlenado =   ((camposLlenos / totalCampos) * 100)
}

eliminarEspaciosBlancos(nombreCampo:string, tipoLimpieza:number){
  let   formulario = this.SolicitudCertificado;
 

  
   if (tipoLimpieza== 1) {
    formulario!.patchValue({[nombreCampo]: this.validaciones.normalizeSpacesToUpperCase(formulario!.get(nombreCampo)?.value)})
   }
   else{
    formulario!.patchValue({[nombreCampo]: this.validaciones.normalizeSpaces(formulario!.get(nombreCampo)?.value)})
   }
  this.verificarEstadoFormulario()
  }

  EmitirDatos(){
    if (this.SolicitudCertificado.valid) {
      let data=this.SolicitudCertificado.value
      data.municipio = this.validaciones.normalizeSpacesToUpperCase(data.municipio) 
      this.OnEmitInformacion.emit(data)
      this.ocultar()
      this.SolicitudCertificado.reset()
    }
    else{
      this.notificacionesService.mostrarAlertaSimple('Debe de llenar todos los campos del formulario')
    }
  }


}
