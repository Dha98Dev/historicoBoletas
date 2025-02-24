import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Iconos } from '../../../enums/iconos.enum';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-previsualizador-pdf',
  templateUrl: './previsualizador-pdf.component.html',
  styleUrl: './previsualizador-pdf.component.css'
})
export class PrevisualizadorPdfComponent {
  constructor(private sanitizer: DomSanitizer) { }

  @Input() pdfUrl: string = "";
  safeUrl!: SafeResourceUrl;
  public iconos = Iconos;
  private rotate:number =0 

  @Output() limpiar: EventEmitter<void> = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    
      if (changes['pdfUrl'] && changes['pdfUrl'].currentValue) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);

      }
    }

}
