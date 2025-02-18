import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild, AfterViewChecked } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Iconos } from '../../../enums/iconos.enum';
import mediumZoom from 'medium-zoom';

@Component({
  selector: 'app-previsualizador-archivos',
  templateUrl: './previsualizador-archivos.component.html',
  styleUrls: ['./previsualizador-archivos.component.css']
})
export class PrevisualizadorArchivosComponent {
  
  @ViewChild('imageElement') imageElement!: ElementRef;
  
  @Input() imageUrl: string = "";

  safeUrl!: SafeResourceUrl;
  public iconos = Iconos;
  private rotate:number =0 
  private imgTemporal=''
  private pdfTemporal=''
  @Output() limpiar: EventEmitter<void> = new EventEmitter<void>();

  private zoomInstance: any;
  rotation = 0; // Rotación inicial
scale = 1; // Zoom inicial
isDragging = false; // Estado del arrastre
startX = 0;
startY = 0;
translateX = 0;
translateY = 0;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(){
    console.log('inicializando visor imagenes')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl'] && changes['imageUrl'].currentValue) {
      this.imageUrl= this.imgTemporal != ''? this.imgTemporal : this.imageUrl
      console.log('la url de la imagen es ' +  this.imageUrl);
    }
  }


  limpiarUrl(): void {
    this.safeUrl = '';
    this.imageUrl = '';
    this.limpiar.emit();
  }

  dragging = false;
  offsetX = 0;
  offsetY = 0;
  lastX = 0;
  lastY = 0;
  
  rotateImage(degrees: number): void {
    this.rotation += degrees;
  }
  
  zoomImage(amount: number): void {
    this.scale = Math.max(0.5, Math.min(3, this.scale + amount));
  }
  
  // Restablecer la imagen
  resetImage(): void {
    this.scale = 1;
    this.rotation = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }
  
  // Métodos para arrastrar la imagen
  startDrag(event: MouseEvent): void {
    this.dragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }
  
  endDrag(): void {
    this.dragging = false;
  }
  
  dragImage(event: MouseEvent): void {
    if (this.dragging) {
      this.offsetX += event.clientX - this.lastX;
      this.offsetY += event.clientY - this.lastY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      const img = document.querySelector('.img-zoom') as HTMLElement;
      img.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale}) rotate(${this.rotation}deg)`;
    }
  }
  

}
