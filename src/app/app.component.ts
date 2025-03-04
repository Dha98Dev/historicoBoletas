import { Component } from '@angular/core';
import { userService } from './Autenticacion1/servicios/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private userService: userService){}
  
  title = 'HistoricosCalificaciones';
  loggedIn = false;
ngOnInit() {
  this.userService.getLoggedInStatus().subscribe(status => {
    this.loggedIn = status;  // Actualiza el estado de loggedIn según el estado de autenticación
  });
}

get loggedInValidator(): boolean {
  return this.loggedIn;
}
}
