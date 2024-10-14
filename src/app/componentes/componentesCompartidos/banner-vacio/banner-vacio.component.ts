import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-vacio',
  templateUrl: './banner-vacio.component.html',
  styleUrl: './banner-vacio.component.css'
})
export class BannerVacioComponent {

  @Input ()
  public texto:string = ''

  @Input()
  public subtexto:string = ''

}
