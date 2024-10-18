import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryPageComponent } from './pages/queryPages/query-page/query-page.component';
import { LoadPageComponent } from './pages/loadPages/load-page/load-page.component';
import { PlanesEstudiosComponent } from './pages/planes-estudios/planes-estudios.component';
import { AgregarPlanComponent } from './pages/agregar-plan/agregar-plan.component';
import { AsignarMateriasPlanComponent } from './pages/asignar-materias-plan/asignar-materias-plan.component';
import { LoginComponent } from './Autenticacion1/login/login.component';
import { AuthLoggedInGuard } from './Autenticacion1/guards/auth-guard.guard';
import { AuthLoggedOutGuard } from './Autenticacion1/guards/auth-logout.guard';
import { RegisterComponent } from './Autenticacion1/register/register.component';
import { RevisarPageComponent } from './pages/loadPages/revisar-page/revisar-page.component';
import { VerificarCapturaComponent } from './pages/verificar-captura/verificar-captura.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'registro', component: RegisterComponent,canActivate:[AuthLoggedInGuard]},
  {path: 'verificacion', component:RevisarPageComponent, canActivate:[AuthLoggedInGuard]},
  { path: 'login', component: LoginComponent, canActivate:[AuthLoggedOutGuard] },
  { path: 'consulta', component: QueryPageComponent,canActivate:[AuthLoggedInGuard]},
  { path: 'cargarInformacion', component: LoadPageComponent, canActivate:[AuthLoggedInGuard]},
  { path: 'verificarCaptura/:idBoleta', component: VerificarCapturaComponent, canActivate:[AuthLoggedInGuard]},
  {
    path: 'planesEstudio',
    component: PlanesEstudiosComponent,
    canActivate:[AuthLoggedInGuard],
    children: [
      { path: 'agregarPlan', component: AgregarPlanComponent },
      { path: 'asignarMaterias', component: AsignarMateriasPlanComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
