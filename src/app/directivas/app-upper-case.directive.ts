import { Directive,  HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[AppUpperCase]'
})
export class AppUpperCaseDirective {

  constructor(private control: NgControl) {}
  @HostListener('input', ['$event.target.value'])
  onInput(value:string):void{
    const valorEnMayusculas=value.toLocaleUpperCase();
    this.control.control?.setValue(valorEnMayusculas, { emitEvent: false })
  }
}
