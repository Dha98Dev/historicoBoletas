import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Para la localización en español

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.css'
})
export class InputDateComponent {
public esCampoValido:boolean=true;
public campoTocado:boolean=false;
  @ViewChild('datepicker') datepickerElement!: ElementRef;
  @Input()
  public minDate:string= '';
  @Input()
  public maxDate:string= '';

  @Input()
  public smallIndicator:boolean=false;
  
  @Output()
  public OnEmitFecha: EventEmitter<any> = new EventEmitter;


  ngAfterViewInit() {
let fechaInicio:Date= new Date(this.maxDate); 
let fechaFinal:Date= new Date(this.minDate)

    // const minDate = new Date(today.setDate(today.getDate() - 5));
    // const maxDate = new Date(today.setDate(today.getDate() + 25));
       flatpickr(this.datepickerElement.nativeElement, {
      dateFormat: "Y-m-d",
      defaultDate: '',
      locale: Spanish, // Para el idioma español
      minDate:fechaInicio,
      maxDate: fechaFinal,
    });
  }



  emitirFechaInicio(fecha:string){
if(fecha != "" && this.campoTocado){
  this.OnEmitFecha.emit(fecha)
  this.esCampoValido = true 
}
else{
  this.esCampoValido=false 
}

  }

  marcarTocado(valor:string|number){
    this.campoTocado=true;
  this.validarCampo(valor)
  }
  
  validarCampo(valor: string|number){
    if (valor=='' && this.campoTocado) {
      this.esCampoValido=false;
    }
    else{
      this.esCampoValido=true;
    }
  }
}
