import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrl: './text-box.component.css'
})
export class TextBoxComponent {

public campoTocado:boolean = false;
public valorCajaTexto:string|number='';

  @Output()
public  onEmitValueInput:EventEmitter<string>  = new EventEmitter

@Input()
placeholder:string = ''

@Input()
type:string = 'text'

@Input()
valorMinimo:number = 0

@Input()
valorMaximo:number = 0

@Input()
smallIndicator:boolean = false

@Input()
public Valor:string = ''

@Input()
public disabled:boolean = false

@Input()
public desmarcar:boolean = false

@Input()
public mostrarValidacion:boolean = true


public campoValido:boolean =true


enviarValorIngresado(valor:string){
let valido = this.validaciones(valor)
if(!valido){
  this.campoValido=false;}
else{
  this.onEmitValueInput.emit(valor);
  this.campoValido=true
}


}

validaciones(valor:string | number){
if ((this.type == "number") && (this.valorMaximo != 0)  && (parseFloat(valor.toString()) < this.valorMinimo || parseFloat(valor.toString()) > this.valorMaximo)) {
  this.campoValido= false;
  return false;
}

else{
  this.campoValido= true;
  return true;
}
}


marcarTocado(valor:string|number){
  this.campoTocado=true;
  // console.log("el campo datepickr fue tocado y el valor es:  " + valor)
this.validarCampo(valor)
}

validarCampo(valor: string|number){
  if (valor=='' && this.campoTocado) {
    this.campoValido=false;
  }

}

convertirMayusculas(valor:string|number){
  this.valorCajaTexto=valor.toString().toUpperCase()
  // console.log(this.valorCajaTexto)
}
ngOnChanges(changes: SimpleChanges){
if (changes['Valor'] && this.Valor != "" ) {
  this.campoTocado=true;
  this.campoValido=true;
  this.enviarValorIngresado(changes['Valor'].currentValue)
}
else if (changes['Valor'] && this.Valor == "" ) {
this.campoTocado=false;
}

if (changes['desmarcar'] && this.desmarcar) {
  this.desmarcarCampo()
}
}

desmarcarCampo(){
  alert()
  this.campoTocado=false;
  this.campoValido=true;
  this.Valor=''
}


}
