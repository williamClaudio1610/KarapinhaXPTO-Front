import { Component, OnInit,ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';

import 'bootstrap';
import { UtilizadorServicoService } from 'src/app/Services/utilizador-servico.service'; 

import { HttpClient } from '@angular/common/http';
import { FormGroup,FormBuilder,Validators  } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';

import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  

  registerForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = 'Fotografia'; 
  @ViewChild('fileUploadComponent') fileUploadComponent: FileUpload;


  

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService, 
    private utilizadorServicoService: UtilizadorServicoService,
    private http: HttpClient



  ) 
  {  }




   value: string;
   senha: string;
   mostrarSenha: boolean = false;
   checked: boolean = true;
   showModal: boolean = false;

   toggleMostrarSenha() {
     this.mostrarSenha = !this.mostrarSenha;

   }
   blockChars: RegExp = /^[^!«»£€§@#$%^&*ºª()_+=\-´´`~\\[\]{};:"',<.>/?|]+$/;
   blockCharsN: RegExp =/^[^ !«»£€§#$%^&*ºª()_+=\-´´`~\\[\]{};:"',<>/?|]+$/;
   blockChars1: RegExp = /^[^!1234567890«»£€§@#$%^&*ºª()_+=\-´´`~\\[\]{};:"',<.>/?|]+$/;

  botaoDesabilitado = true;

  bloquear(): void {

    this.botaoDesabilitado = true;

  }

  enforceNineChars(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 9) {
      input.value = input.value.slice(0, 9);
      this.registerForm.get('telefone')?.setValue(input.value);
    }
  }


   

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      username: ['', Validators.required],
      bi: ['', [Validators.required, this.validarBI ]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }



  get f() { return this.registerForm.controls; }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }


  onSubmit() {
    this.registerForm.markAllAsTouched(); 

    if (this.registerForm.invalid || this.registerForm.value.telefone.length !== 9 ) {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'O número de telefone deve ter exatamente 9 dígitos.'});
      return;
    }
    else if(!this.selectedFile){
      return;
    }
    else{
      this.botaoDesabilitado = true;
    }
    const formData = new FormData();
    formData.append('nomeCompleto', this.registerForm.value.nomeCompleto);
    formData.append('email', this.registerForm.value.email);
    formData.append('telefone', this.registerForm.value.telefone);
    formData.append('username', this.registerForm.value.username);
    formData.append('bi', this.registerForm.value.bi);
    formData.append('password', this.registerForm.value.password);
    formData.append('confirmPassword', this.registerForm.value.confirmPassword);

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile, this.selectedFile.name);
    }

    this.utilizadorServicoService.registerUser(formData).subscribe(
      response => {
          if (response.success) {
              this.messageService.add({severity: 'success', summary: 'Sucesso', detail: response.message});
              this.registerForm.reset();
              this.selectedFile = null;
              this.botaoDesabilitado = true;
              setTimeout(() => {
                location.reload();
              }, 1000); 

          } else {
              this.messageService.add({severity: 'error', summary: 'Erro', detail: response.message});
              this.botaoDesabilitado = false;

          }
      },
      error => {
          const errorMessage = error.error?.message || 'Ocorreu um erro ao registrar o usuário. Por Causa da Conexão com a Rede';
          this.messageService.add({severity: 'error', summary: 'Erro', detail: errorMessage});
          this.botaoDesabilitado = false;


      }
  );
}

get truncatedFileName(): string {
  return this.selectedFileName.length > 25 
    ? this.selectedFileName.slice(0, 12) + '...' + this.selectedFileName.slice(-10) 
    : this.selectedFileName;
}


onFileSelect(event: any, fileUpload: FileUpload) {
  const file = event.files[0];
  if (file) {
    this.selectedFile = file;
    this.selectedFileName = file.name; 
    console.log('Arquivo selecionado:', file);

    this.selectedFileName = file.name.length > 25 
        ? file.name.slice(0, 12) + '...' + file.name.slice(-10) 
        : file.name; // Truncar o nome do arquivo se for muito longo
      console.log('Arquivo selecionado:', file);

    setTimeout(() => {
      fileUpload.clear(); 
    }, 500); 

    setTimeout(() => {
      const inputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = ''; 
      }
    }, 500); 
  }
}




  validarBI(control: AbstractControl): ValidationErrors | null {
    const bi = control.value;

    if (!/^\d{9}[A-Za-z0-9]{2}\d{3}$/.test(bi)) {
      return { invalidBI: true, message: 'O número de BI deve seguir o formato: 9 dígitos, 2 caracteres alfanuméricos, e 3 dígitos finais.' };
    }

    return null; 
}

  

  
}
