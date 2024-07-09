import { Component, OnInit } from '@angular/core';
import { UtilizadorServicoService } from 'src/app/Services/utilizador-servico.service'; 
import { UserLogin } from 'src/app/Services/utilizador-servico.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';
import { UserRoles } from 'src/app/models/user-roles';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit{
   

  user: UserLogin = {
    username: '',
    password: ''
  };

  blockChars: RegExp = /^[^!«»£€§@#$%^&*ºª()_+=\-´´`~\\[\]{};:"',<.>/?|]+$/;
  blockCharsN: RegExp =/^[^ !«»£€§#$%^&*ºª()_+=\-´´`~\\[\]{};:"',<.>/|]+$/;


   value: string;
   senha: string;
   mostrarSenha: boolean = false;
   checked: boolean = true;

   toggleMostrarSenha() {
     this.mostrarSenha = !this.mostrarSenha;

   }

   constructor(private router: Router, private utilizadorService: UtilizadorServicoService, private messageService: MessageService ) { }

  ngOnInit() {
   
  }




  fazerLogin() {
    const { username, password } = this.user; // Extrai o nome de usuário e a senha do objeto this.user
    
    this.utilizadorService.loginUser(username, password).subscribe(
        (response: any) => {
            if (response.success) {
                if (response.requiresPasswordChange) {

                  const token = response.data.token; 
                  const user = jwtDecode(response.data.token);
                  // Armazenar o token em localStorage para uso posterior
                  this.utilizadorService.setToken(token);
                  this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response.message });

                    // Redirecionar para a página de alteração de senha
                    this.router.navigate(['/alterar-senha'], { state: { user } });

                } else {
                      const token = response.data.token; 
                      const user = jwtDecode(response.data.token); 
                      // Armazenar o token em localStorage para uso posterior
                      this.utilizadorService.setToken(token);
                      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response.message });
              
                      // Navegar para a rota desejada com base na role do usuário
                      const userRole = this.utilizadorService.getUserRole();

                      if (userRole === UserRoles.Administrador) {
                        this.router.navigate(['/dashboard'], { state: { user } });
                      } else if (userRole === UserRoles.Administrativo) {
                        this.router.navigate(['/dashboard'], { state: { user } });
                      } else if (userRole === UserRoles.Registado) {
                        this.router.navigate(['/menu'], { state: { user } });
                      } 
                }
            } else {

                this.messageService.add({ severity: 'error', summary: 'Erro', detail: response.message });
              }
        },
        (error) => {
            const errorMessage = error.error?.message || 'Ocorreu um erro ao fazer o login. Por favor verifique a Conexão com a Rede';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
        }
    );
}

  voltarParaPaginaInicial(): void {
    this.router.navigate(['/menu']);
  }


  
}
