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
import { GraficaAvanceComponent } from './pages/grafica-avance/grafica-avance.component';
import { EditarBoletaComponent } from './pages/editar-boleta/editar-boleta.component';
import { PaginaPruebaComponent } from './pages/pagina-prueba/pagina-prueba.component';
import { AuthCapturistaGuard } from './Autenticacion1/guards/capturista-guard.guard';
import { AuthAdminGuard } from './Autenticacion1/guards/admin-guard.guard';
import { AuthRevisadorGuard } from './Autenticacion1/guards/revisador-guard.guard';
import { ListadoUsuariosComponent } from './pages/listado-usuarios/listado-usuarios.component';
import { CargaMasivaComponent } from './pages/loadPages/carga-masiva/carga-masiva.component';
import { PageNotFoundComponent } from './componentes/banners/page-not-found/page-not-found.component';
import { CargaSimpleComponent } from './pages/loadPages/carga-simple/carga-simple.component';
import { DeleteRegistroComponent } from './pages/delete-registro/delete-registro.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'registro', component: RegisterComponent,canActivate:[AuthAdminGuard]},
  { path: 'avance', component: GraficaAvanceComponent, canActivate:[AuthRevisadorGuard] },
  { path: 'verificacion', component:RevisarPageComponent, canActivate:[AuthRevisadorGuard]},
  { path: 'login', component: LoginComponent, canActivate:[AuthLoggedOutGuard] },
  { path: 'consulta', component: QueryPageComponent,canActivate:[AuthRevisadorGuard]},
  { path: 'cargarInformacion', component: LoadPageComponent, canActivate:[AuthCapturistaGuard]},
  // { path: 'cargaMasiva', component: CargaMasivaComponent, canActivate:[AuthCapturistaGuard]},
  { path: 'verificarCaptura/:idBoleta', component: VerificarCapturaComponent, canActivate:[AuthRevisadorGuard]},
  { path: 'editarBoleta/:idBoleta', component: EditarBoletaComponent, canActivate:[AuthRevisadorGuard]},
  { path: 'cargarCertificado', component: CargaSimpleComponent, canActivate:[AuthCapturistaGuard]},
  { path: 'userList', component:ListadoUsuariosComponent, canActivate:[AuthAdminGuard]},
  { path: 'EliminarRegistro', component:DeleteRegistroComponent, canActivate:[AuthAdminGuard]},
  // {path:  'prueba', component: PaginaPruebaComponent},
  {path: 'notFound', component:PageNotFoundComponent},
  {
    path: 'planesEstudio',
    component: PlanesEstudiosComponent,
    canActivate:[AuthAdminGuard],
    children: [
      { path: 'agregarPlan', component: AgregarPlanComponent },
      { path: 'asignarMaterias', component: AsignarMateriasPlanComponent }
    ]
  },
  { path: '**', redirectTo: 'notFound' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
