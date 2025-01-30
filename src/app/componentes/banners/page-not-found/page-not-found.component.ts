import { Component } from '@angular/core';
import { GetNombreService } from '../../../services/get-nombre.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
constructor(private getNombre:GetNombreService){}
ngOnInit(){
  this.getNombre.setNombre='Pagina 404';
 
}
}
