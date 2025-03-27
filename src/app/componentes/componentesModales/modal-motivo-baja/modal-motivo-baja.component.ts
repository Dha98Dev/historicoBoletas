import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Iconos } from '../../../enums/iconos.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidacionesService } from '../../../services/validaciones.service';
import { NotificacionesService } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-modal-motivo-baja',
  templateUrl: './modal-motivo-baja.component.html',
  styleUrl: './modal-motivo-baja.component.css'
})
export class ModalMotivoBajaComponent {

   constructor(private  fb:FormBuilder, private validaciones:ValidacionesService,  private notificacionesService:NotificacionesService){} 
    
  
    public destruirForm:boolean = false;
    public  iconos=Iconos
    SolicitudCertificado:FormGroup = {} as  FormGroup

  mostrarModal: boolean = false;
  
  // estos son los inputs 
  @Input()
  public titulo:string = 'Ingrese la información adicional para la solicitud del certificado'
  
  
  @Output() accionConfirmada = new EventEmitter<boolean>();
  @Output() OnEmitInformacion = new EventEmitter<any>();
  
  @ViewChild('textArea') textArea! :ElementRef<HTMLTextAreaElement>
  
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
  
  
  

  eliminarEspaciosBlancos(nombreCampo:string, tipoLimpieza:number){
    let   formulario = this.SolicitudCertificado;
   
  
    
     if (tipoLimpieza== 1) {
      formulario!.patchValue({[nombreCampo]: this.validaciones.normalizeSpacesToUpperCase(formulario!.get(nombreCampo)?.value)})
     }
     else{
      formulario!.patchValue({[nombreCampo]: this.validaciones.normalizeSpaces(formulario!.get(nombreCampo)?.value)})
     }
    }
  
    EmitirDatos(){
     if (this.textArea.nativeElement.value != "") {
      this.OnEmitInformacion.emit(this.textArea.nativeElement.value)
      // console.log('motivo emitido')
     }
     else {
      this.notificacionesService.mostrarAlertaConIcono('Alerta','Debe ingresar un motivo  o en su caso agregar una calificacion mayor a 0 y aignarle un folio','warning')
    }
    }
  
  

}
