import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';



@Component({
  selector: 'app-previsualizador-archivos',
  templateUrl: './previsualizador-archivos.component.html',
  styleUrl: './previsualizador-archivos.component.css'
})


export class PrevisualizadorArchivosComponent {
 
  @Input()
  public imageUrl: string="";
  
  @Input()
  public pdfUrl:string="";
  
  safeUrl!: SafeResourceUrl;
  
  @Output() limpiar: EventEmitter<void> = new EventEmitter<void>();
  
  constructor(private sanitizer: DomSanitizer) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfUrl'] && changes['pdfUrl'].currentValue) {
      const pdfBase64 = this.pdfUrl;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfBase64);
    }
  }
  limpiarUrl(): void {
    this.safeUrl = '';
    this.limpiar.emit(); // Emitir el evento limpiar
  }
  ngOnDestroy() {
    const modalElement = document.getElementById('miModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement); // Accede a bootstrap desde window
      if (modal) {
        modal.hide(); // Cierra el modal
      }
    }
  }
}
