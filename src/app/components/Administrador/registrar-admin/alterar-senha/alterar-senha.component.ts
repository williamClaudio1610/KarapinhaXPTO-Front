import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilizadorServicoService } from 'src/app/Services/utilizador-servico.service';
import { ToastrService } from 'ngx-toastr';
import { AlterarSenhaDTO } from 'src/app/Services/utilizador-servico.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css']
})
export class AlterarSenhaComponent {
  alterarSenhaForm: FormGroup;
  valorID: number | undefined;
  isVisivel: boolean = false;
   
  
  constructor(
    private fb: FormBuilder,
    private userServico: UtilizadorServicoService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.alterarSenhaForm = this.fb.group({
      userId: [null, Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      senhaAntiga: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.valorID = this.getIduser();
    this.alterarSenhaForm.patchValue({ userId: this.valorID });
    this.alterarSenhaForm.markAllAsTouched(); 
  }

  getIduser(): number {
    if (this.userServico && this.userServico.getUserId) {
      return this.userServico.getUserId();
    } else {
      console.error('userServico não está disponível ou não possui getUserId');
      return -1; 
    }
  }
  

  onSubmit(): void {
    if (this.alterarSenhaForm.valid) {
      const alterarSenhaDTO: AlterarSenhaDTO = this.alterarSenhaForm.value;

      this.userServico.alterarSenha(alterarSenhaDTO).subscribe(

        (response: any) => {

            if (response.success) {
             
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response.message });

                setTimeout(() => {
                  this.userServico.logoutUser();
                }, 1000);
                        
            } else {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: response.message });
            
            }
          
        },
        (error) => {
          const errorMessage = error.error?.message || 'Ocorreu um erro ao alterar a Senha. Por favor verifique a Conexão com a Rede';
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });   
         }
        

      );
    }
  }


  isCampoValido(campo: string): boolean {
    const formControl = this.alterarSenhaForm.get(campo);
    return formControl?.valid || formControl?.untouched;
  }

  isCampoInvalido(campo: string): boolean {
    const formControl = this.alterarSenhaForm.get(campo);
    return formControl?.invalid && formControl?.touched;
  }
}
