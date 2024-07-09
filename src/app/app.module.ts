import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService } from 'primeng/api';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FileUploadModule } from 'primeng/fileupload';
import { RouterModule, Routes } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogService } from 'primeng/dynamicdialog';
import { UtilizadorGuardsGuard } from './guards/utilizador-guards.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegistroComponent } from './components/pages/registro/registro.component';
import { PaginaInicialComponent } from './components/pages/pagina-inicial/pagina-inicial.component';
import { MenuComponent } from './components/pages/pagina-inicial/menu/menu.component';
import { FooterComponent } from './components/pages/pagina-inicial/footer/footer.component';
import { PaginaServicosComponent } from './components/pages/pagina-inicial/menu/pagina-servicos/pagina-servicos.component';
import { MarcacoesComponent } from './components/pages/pagina-inicial/menu/marcacoes/marcacoes.component';
import { FieldsetModule } from 'primeng/fieldset';
import { MultiSelectModule } from 'primeng/multiselect';
import { PerfilComponent } from './components/pages/pagina-inicial/perfil/perfil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfissionaisComponent } from './components/pages/pagina-inicial/menu/profissionais/profissionais.component';
import { SobreComponent } from './components/pages/pagina-inicial/menu/sobre/sobre.component';
import { ContactosComponent } from './components/pages/pagina-inicial/menu/contactos/contactos.component';
import { ToastModule } from 'primeng/toast';
import { UtilizadorServicoService } from './Services/utilizador-servico.service';
import * as jwt_decode from 'jwt-decode';
import { UserRoles } from './models/user-roles';
import { MenuLateralComponent } from './components/Administrador/menu-lateral/menu-lateral.component';
import { DashboardComponent } from './components/Administrador/dashboard/dashboard.component'; 
import { CardModule } from 'primeng/card';
import { RegistrarAdminComponent } from './components/Administrador/registrar-admin/registrar-admin.component';
import { ToastrModule } from 'ngx-toastr';
import { AlterarSenhaComponent } from './components/Administrador/registrar-admin/alterar-senha/alterar-senha.component';
import { RegistrarProfissionaisComponent } from './components/Administrador/registrar-profissionais/registrar-profissionais.component';
import { GerirServicosComponent } from './components/Administrador/gerir-servicos/gerir-servicos.component';
import { AdicionarcategoriaComponent } from './components/Administrador/adicionarcategoria/adicionarcategoria.component';
import { ListarProfissionaisComponent } from './components/Administrador/listarProfissionais/listar-profissionais/listar-profissionais.component';
import { jsPDF } from 'jspdf';
import { ListarUtilizadoresComponent } from './components/Administrador/listarUtilizadores/listar-utilizadores/listar-utilizadores.component';
import { ConfirmarMarcacoesComponent } from './components/Administrador/confirmarMarcacoes/confirmar-marcacoes/confirmar-marcacoes.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AgendaMarcacoesComponent } from './components/Administrador/AgendaMarcacoes/agenda-marcacoes/agenda-marcacoes.component'; // Import FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';
import { GalleryPhotosComponent } from './components/pages/gallery-photos/gallery-photos.component';



const routes: Routes = [
  // Administrador Rotas 
   {path: 'dashboard', component: DashboardComponent, canActivate: [UtilizadorGuardsGuard], data: { role: [ UserRoles.Administrador, UserRoles.Administrativo]} },
   { path: 'registrar-admin', component: RegistrarAdminComponent , canActivate: [UtilizadorGuardsGuard], data:{ role: UserRoles.Administrador} },
   { path: 'alterar-senha', component: AlterarSenhaComponent , canActivate: [UtilizadorGuardsGuard], data:{ role: UserRoles.Administrativo} },
   { path: 'registrar-profissionais', component: RegistrarProfissionaisComponent , canActivate: [UtilizadorGuardsGuard], data:{ role: [ UserRoles.Administrador, UserRoles.Administrativo]} },
   { path: 'gerir-servicos', component: GerirServicosComponent , canActivate: [UtilizadorGuardsGuard], data:{ role: [ UserRoles.Administrador, UserRoles.Administrativo]} },
   { path: 'adicionarcategoria', component: AdicionarcategoriaComponent , canActivate: [UtilizadorGuardsGuard], data:{ role: [ UserRoles.Administrador, UserRoles.Administrativo]} },
   { path: 'listar-profissionais', component: ListarProfissionaisComponent , canActivate: [UtilizadorGuardsGuard], data:{ role: [ UserRoles.Administrador, UserRoles.Administrativo]} },
   { path: 'listar-utilizadores', component: ListarUtilizadoresComponent , canActivate: [UtilizadorGuardsGuard], data:{ role: [ UserRoles.Administrador, UserRoles.Administrativo]} },
   { path: 'confirmar-marcacoes', component: ConfirmarMarcacoesComponent , canActivate: [UtilizadorGuardsGuard], data:{ role: [ UserRoles.Administrador, UserRoles.Administrativo]} },
   { path: 'agenda-marcacoes', component: AgendaMarcacoesComponent , canActivate: [UtilizadorGuardsGuard], data:{ role: [ UserRoles.Administrador, UserRoles.Administrativo]} },



   //Cliente Rotas 
    { path: 'login', component: LoginComponent , canActivate: [UtilizadorGuardsGuard], data:{ role: UserRoles.NaoRegistado} },
    { path: 'registro', component: RegistroComponent,  canActivate: [UtilizadorGuardsGuard], data: { role: UserRoles.NaoRegistado} },
    {path: 'pagina-inicial', component: PaginaInicialComponent, canActivate: [UtilizadorGuardsGuard], data: { role: UserRoles.Registado } },
    {path:'pagina-servicos', component: PaginaServicosComponent, canActivate: [UtilizadorGuardsGuard],  data: { role:[ UserRoles.NaoRegistado, UserRoles.Registado]  }},
    { path: 'menu', component: MenuComponent, canActivate: [UtilizadorGuardsGuard], data: { role: [UserRoles.NaoRegistado, UserRoles.Registado] } },
    {path: 'marcacoes', component:MarcacoesComponent, canActivate: [UtilizadorGuardsGuard],  data: { role: UserRoles.Registado }},
    {path: 'marcacoes/:categoria/:servico', component:MarcacoesComponent, canActivate: [UtilizadorGuardsGuard],  data: { role: UserRoles.Registado }},
    {path: 'perfil', component: PerfilComponent, canActivate: [UtilizadorGuardsGuard],  data: { role:[ UserRoles.Registado,UserRoles.Administrador, UserRoles.Administrativo ] }},
    {path: 'profissionais', component:ProfissionaisComponent, canActivate: [UtilizadorGuardsGuard],  data: { role: [UserRoles.NaoRegistado, UserRoles.Registado] }},
    {path: 'sobre', component:SobreComponent, canActivate: [UtilizadorGuardsGuard],  data: { role: [UserRoles.NaoRegistado, UserRoles.Registado] }},
    {path: 'contactos', component:ContactosComponent, canActivate: [UtilizadorGuardsGuard],  data: { role: [UserRoles.NaoRegistado, UserRoles.Registado] } },

    { path: '', redirectTo: '/menu', pathMatch: 'full'  }, 
  ];

@NgModule({
      exports: [RouterModule],

    declarations: [
        AppComponent,
        LoginComponent,
        RegistroComponent,
        PaginaInicialComponent,
        MenuComponent,
        FooterComponent,
        PaginaServicosComponent,
        MarcacoesComponent,
        PerfilComponent,
        ProfissionaisComponent,
        SobreComponent,
        ContactosComponent,
        MenuLateralComponent,
        DashboardComponent,
        RegistrarAdminComponent,
        AlterarSenhaComponent,
        RegistrarProfissionaisComponent,
        GerirServicosComponent,
        AdicionarcategoriaComponent,
        ListarProfissionaisComponent,
        ListarUtilizadoresComponent,
        ConfirmarMarcacoesComponent,
        AgendaMarcacoesComponent,
        GalleryPhotosComponent,

    ],
    imports: [
        RouterModule.forRoot(routes),
        ToastrModule.forRoot({
          timeOut: 5000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
          closeButton: true,
          progressBar: true,
          
        }),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        TableModule,
        HttpClientModule,
        InputTextModule,
        DialogModule,
        ToolbarModule,
        ConfirmDialogModule,
        RatingModule,
        InputNumberModule,
        InputTextareaModule,
        RadioButtonModule,
        DropdownModule,
        ButtonModule,
        InputMaskModule,
        PasswordModule,
        FileUploadModule,
        KeyFilterModule,
        ImageModule,
        GalleriaModule,
        InplaceModule,
        BadgeModule,
        AvatarModule,
        AvatarGroupModule,
        FieldsetModule,
        MultiSelectModule,
        ReactiveFormsModule,
        ToastModule,
        CardModule,
        FullCalendarModule


       
    ],
    providers: [ConfirmationService, UtilizadorServicoService, UtilizadorGuardsGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
