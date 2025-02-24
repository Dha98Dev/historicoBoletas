import { Component, EventEmitter, input, Input, Output, SimpleChanges } from '@angular/core';
import { ValidacionesService } from '../../../services/validaciones.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.css'
})
export class InputNumberComponent {

  constructor(private Validaciones:ValidacionesService, private fb: FormBuilder) { }

  public campoTocado: boolean = false;
  public valorCajaTexto: string | number = '';

  @Output()
  public onEmitValueInput: EventEmitter<string> = new EventEmitter();

  @Input()
  placeholder: string = '';

  @Input()
  smallIndicator: boolean = false;

  @Input()
  public Valor: string = '';

  @Input()
  public validadorCurp: boolean = false;

  @Input()
  public validadorCct: boolean = false;

  @Input()
  public mostrarValidacion: boolean = false;

  @Input() eliminarCaracteresEspeciales:boolean = true;

  public campoValido: boolean = true;
  public valorNoVacio: boolean = true; // Nuevo estado para verificar si el campo no está vacío

  texto:FormGroup={} as FormGroup

  ngOnInit(){
    this.texto= this.fb.group({
      texto:['',[Validators.required]]
    })
  }

  // Este método se encarga de enviar el valor solo si es válido.
  enviarValorIngresado(valor: string) {
  
    let valido = this.validarCampo();
    if (!valido && valor != "") {
      this.campoValido = false;
      this.campoTocado = true;
    } else {
      this.onEmitValueInput.emit(this.Validaciones.limpiarParaSQL(valor));
      this.campoValido = true;
    }
  }

  // Método para marcar el campo como tocado y validar cuando se pierde el foco (blur).


  // Método de validación que verifica CURP, CCT y que el campo no esté vacío.
  validarCampo(): boolean {
    let valor=this.texto.get('texto')?.value.trim()
    this.texto.patchValue({texto: this.Validaciones.normalizeSpacesToUpperCase(valor.toString())}) 
    // Validación para campo no vacío
    if (!valor || valor.toString().trim() === '') {
      this.valorNoVacio = false;
      return false;
    } else {
      this.valorNoVacio = true;
    }

    // Validación de CURP
    if (this.validadorCurp && !this.validarCurp(valor.toString())) {
      return false;
    }

    // Validación de CCT
    if (this.validadorCct && !this.validarCct(valor.toString())) {
      return false;
    }
    return true;
  }

  // Convierte el valor a mayúsculas automáticamente.
  convertirMayusculas(valor: string | number) {
    this.valorCajaTexto = valor.toString().toUpperCase();
  }

  // Detecta cambios en los inputs para revalidar o resetear el estado.
  ngOnChanges(changes: SimpleChanges) {
    if (changes['Valor'] && this.Valor !== "") {
      this.campoTocado = true;
      this.campoValido = this.validarCampo();
      this.enviarValorIngresado(changes['Valor'].currentValue);
    } else if (changes['Valor'] && this.Valor === "") {
      this.campoTocado = false;
    }
  }

  // Validador para el formato de CURP.

  validarCurp(valor: string): boolean {
    const patronCurp = /^([A-Za-z]{4}\d{6}[HhMm][A-Za-z]{5}[A-Za-z0-9]{2})$/;
    return patronCurp.test(valor);
  }
  

  // Validador para el formato de CCT.
  validarCct(valor: string): boolean {
    const patronCct = /^18[A-Za-z]{3}[0-9]{4}[A-Za-z]$/;
    return patronCct.test(valor);
  }



}
