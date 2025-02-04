import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './componentes/componentesNavegacion/navbar/navbar.component';
import { QueryPageComponent } from './pages/queryPages/query-page/query-page.component';
import { LoadPageComponent } from './pages/loadPages/load-page/load-page.component';
import { ModalFiltroConsultaComponent } from './componentes/componentesModales/modal-filtro-consulta/modal-filtro-consulta.component';
import { TextBoxComponent } from './componentes/componentesInputs/text-box/text-box.component';
import { SelectFormComponent } from './componentes/componentesInputs/select-form/select-form.component';
import { PlanesEstudiosComponent } from './pages/planes-estudios/planes-estudios.component';
import { LoaderComponent } from './componentes/componentesCompartidos/loader/loader.component';
import { Page404Component } from './componentes/componentesCompartidos/page404/page404.component';
import { BannerVacioComponent } from './componentes/componentesCompartidos/banner-vacio/banner-vacio.component';
import { AsignarMateriasPlanComponent } from './pages/asignar-materias-plan/asignar-materias-plan.component';
import { AgregarPlanComponent } from './pages/agregar-plan/agregar-plan.component';
import { InputDateComponent } from './componentes/componentesInputs/input-date/input-date.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardPlanEstudioComponent } from './componentes/componentesCards/card-plan-estudio/card-plan-estudio.component';
import { CheckboxInputComponent } from './componentes/componentesInputs/checkbox-input/checkbox-input.component';
import { HttpClientModule } from '@angular/common/http';
import { LabelInputCompletoComponent } from './componentes/componentesInputs/label-input-completo/label-input-completo.component';
import { LabelInputIncompletoComponent } from './componentes/componentesInputs/label-input-incompleto/label-input-incompleto.component';
import { InputNumberComponent } from './componentes/componentesInputs/input-text/input-number.component';
import { ModalCalificacionesComponent } from './componentes/componentesModales/modal-calificaciones/modal-calificaciones.component';
import { LoginComponent } from './Autenticacion1/login/login.component';
import { Router, RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { RegisterComponent } from './Autenticacion1/register/register.component';
import { RevisarPageComponent } from './pages/loadPages/revisar-page/revisar-page.component';
import { TablaCatalogoCalificacionesComponent } from './componentes/componentesTablas/tabla-catalogo-calificaciones/tabla-catalogo-calificaciones.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularMaterialModule } from './componentes/angularMaterial/angular-material/angular-material.module';
import { VerificarCapturaComponent } from './pages/verificar-captura/verificar-captura.component';
import { CardDescripcionIconComponent } from './componentes/componentesCards/card-descripcion-icon/card-descripcion-icon.component';
import { ModalConfirmacionComponent } from './componentes/componentesModales/modal-confirmacion/modal-confirmacion.component';
import { PrevisualizadorArchivosComponent } from './componentes/componentesModales/previsualizador-archivos/previsualizador-archivos.component';
import { GraficaAvanceComponent } from './pages/grafica-avance/grafica-avance.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { EditarBoletaComponent } from './pages/editar-boleta/editar-boleta.component';
import { PaginaPruebaComponent } from './pages/pagina-prueba/pagina-prueba.component';
import { ListadoUsuariosComponent } from './pages/listado-usuarios/listado-usuarios.component';
import { ModalChangePasswordComponent } from './componentes/componentesModales/modal-change-password/modal-change-password.component';
import { CargaMasivaComponent } from './pages/loadPages/carga-masiva/carga-masiva.component';
import { ModalMensajeNotificacionComponent } from './componentes/componentesModales/modal-mensaje-notificacion/modal-mensaje-notificacion.component';
import { TablaBoletasPrimariaComponent } from './componentes/componentesTablas/tabla-boletas-primaria/tabla-boletas-primaria.component';
import { TablaBoletasSecundariaComponent } from './componentes/componentesTablas/tabla-boletas-secundaria/tabla-boletas-secundaria.component';
import { ListadoErroresCExcelComponent } from './componentes/componentesModales/listado-errores-cexcel/listado-errores-cexcel.component';
import { BannerMensajeComponent } from './componentes/banners/banner-mensaje/banner-mensaje.component';
import { SideBarComponent } from './componentes/componentesNavegacion/side-bar/side-bar.component';
import { AppUpperCaseDirective } from './directivas/app-upper-case.directive';
import { PageNotFoundComponent } from './componentes/banners/page-not-found/page-not-found.component';
import { FormSolicitudDuplicadosComponent } from './componentes/componentesModales/form-solicitud-duplicados/form-solicitud-duplicados.component';
import { CargaSimpleComponent } from './pages/loadPages/carga-simple/carga-simple.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    QueryPageComponent,
    LoadPageComponent,
    ModalFiltroConsultaComponent,
    TextBoxComponent,
    SelectFormComponent,
    PlanesEstudiosComponent,
    LoaderComponent,
    Page404Component,
    BannerVacioComponent,
    AsignarMateriasPlanComponent,
    AgregarPlanComponent,
    InputDateComponent,
    CardPlanEstudioComponent,
    CheckboxInputComponent,
    LabelInputCompletoComponent,
    LabelInputIncompletoComponent,
    InputNumberComponent,
    ModalCalificacionesComponent,
    LoginComponent,
    RegisterComponent,
    RevisarPageComponent,
    TablaCatalogoCalificacionesComponent,
    VerificarCapturaComponent,
    CardDescripcionIconComponent,
    ModalConfirmacionComponent,
    PrevisualizadorArchivosComponent,
    GraficaAvanceComponent,
    EditarBoletaComponent,
    PaginaPruebaComponent,
    ListadoUsuariosComponent,
    ModalChangePasswordComponent,
    CargaMasivaComponent,
    ModalMensajeNotificacionComponent,
    TablaBoletasPrimariaComponent,
    TablaBoletasSecundariaComponent,
    ListadoErroresCExcelComponent,
    BannerMensajeComponent,
    SideBarComponent,
    AppUpperCaseDirective,
    PageNotFoundComponent,
    FormSolicitudDuplicadosComponent,
    CargaSimpleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AngularMaterialModule,
    DataTablesModule,
    HighchartsChartModule,
  
  ],
  exports:[
    AppUpperCaseDirective
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
