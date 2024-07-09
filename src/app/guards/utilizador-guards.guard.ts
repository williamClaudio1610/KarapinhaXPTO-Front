import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilizadorServicoService } from '../Services/utilizador-servico.service';
import { Router } from '@angular/router';
import { UserRoles } from '../models/user-roles';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilizadorGuardsGuard implements CanActivate  {

  constructor(private utilizadorServico: UtilizadorServicoService, private router: Router , private location: Location) {
    
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.utilizadorServico.isLoggedIn()) {
  
   

      const userRoleString = this.utilizadorServico.getUserRole();
      const userRole: UserRoles = userRoleString as UserRoles; 
      const allowedRoles = route.data['role'] as UserRoles | UserRoles[];

     //alert("Tipo de Usuario: "+ userRole);
     //alert("Tipo de Roles Da rota: "+ allowedRoles);

          if (Array.isArray(allowedRoles)) {
            if (allowedRoles.includes(userRole)) {
              return true; 
            } else {
              return false;
            }
          } else {
            if (allowedRoles === userRole) {
              return true; 
            } else {
              return false;
            }
          }

    } else {


      
             // Usuário não autenticado é considerado "NãoRegistado"
             const userRole: UserRoles = UserRoles.NaoRegistado;

             const allowedRoles = route.data['role'] as UserRoles | UserRoles[];
             //alert("Tipo de Usuario: "+ userRole);
             //alert("Tipo de Roles Da rota: "+ allowedRoles);

             if (Array.isArray(allowedRoles)) {

              if (allowedRoles.includes(userRole)) {
                return true; 
              } else {
                return false;
              }
            } else {
              if (allowedRoles === userRole) {
                return true; 
              } else {
                return false;
              }
            }
     
    }
  }
  
}  
