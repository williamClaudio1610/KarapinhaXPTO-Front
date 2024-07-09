import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilizadorServicoService, UserData } from 'src/app/Services/utilizador-servico.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { UserRoles } from 'src/app/models/user-roles';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [MessageService]

})
export class PerfilComponent implements OnInit {
  userForm: FormGroup; 
  currentUserData: any | null = null; 
  selectedPhoto: File | null = null;
  photoPreview: string | ArrayBuffer | null = null;
  
blockChars: RegExp = /^[^!«»£€§@#$%^&*ºª()_+=\-´´`~\\[\]{};:"',<.>/?|]+$/;
blockCharsN: RegExp =/^[^ !«»£€§#$%^&*ºª()_+=\-´´`~\\[\]{};:"',<>/?|]+$/;
blockChars1: RegExp = /^[^!1234567890«»£€§@#$%^&*ºª()_+=\-´´`~\\[\]{};:"',<.>/?|]+$/;

  constructor(
    private userService: UtilizadorServicoService, 
    private fb: FormBuilder,
    private messageService: MessageService 
  ) {
    // Inicialização do formulário
    this.userForm = this.fb.group({
      fullName: [''],
      email: ['' ],
      phone: [''],
      photo: [''],
      idCard: [''],
      username: [''],
      password: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit() {
    // Obtendo os dados do usuário logado do serviço
    this.currentUserData = this.userService.getToken();

    console.log('Dados do usuário logado:', this.currentUserData);

    if (this.currentUserData) {
      this.userForm.patchValue({
        fullName: this.currentUserData.NomeCompleto, 
        email: this.currentUserData.Email,
        phone: this.currentUserData.Telefone,
        photo: this.currentUserData.Foto,
        idCard: this.currentUserData.Bi,
        username: this.currentUserData.unique_name,
        password: '', 
        confirmPassword: ''
      });
      console.log('Valores do formulário após patchValue:', this.userForm.value);
    }
  }

  
  isAdmin(): boolean {
    return this.currentUserData?.role === UserRoles.Administrador;
  }
  save() {
    if (this.userForm.valid) {
      const formData = new FormData();
      formData.append('Id', this.userService.getUserId());
      formData.append('NomeCompleto', this.userForm.get('fullName')?.value);
      formData.append('Email', this.userForm.get('email')?.value);
      formData.append('Telefone', this.userForm.get('phone')?.value);
      formData.append('Bi', this.userForm.get('idCard')?.value);
      formData.append('Username', this.userForm.get('username')?.value);
      formData.append('Password', this.userForm.get('password')?.value);
      formData.append('ConfirmPassword', this.userForm.get('confirmPassword')?.value);
        console.log(formData);
      if (this.selectedPhoto) {
        formData.append('foto', this.selectedPhoto, this.selectedPhoto.name);
      }

      this.userService.atualizarUtilizador(formData)
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response.message || 'Dados atualizados com sucesso!' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: response.message || 'Erro ao atualizar os dados.' });
          }
        },
        (error) => {
          let errorMessage = 'Erro ao atualizar os dados.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message; // Mensagem de erro específica do backend
          } else if (error.message) {
            errorMessage = error.message; // Mensagem de erro padrão do Angular HttpClient
          }
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
        }
      );
  
}
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;

      // Atualiza a visualização da foto
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
