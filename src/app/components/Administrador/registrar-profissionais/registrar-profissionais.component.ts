import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder,FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProfissionalServiceService } from 'src/app/Services/profissional/profissional-service.service';
import { Horario } from 'src/app/Services/Horario/horario-servico.service';
import { HorarioServicoService } from 'src/app/Services/Horario/horario-servico.service';
import { SelectItem } from 'primeng/api';
import { ServicoxptoService } from 'src/app/Services/servicos/servicoxpto.service';
import { CategoriaServicoService } from 'src/app/Services/categoria-servico.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-registrar-profissionais',
  templateUrl: './registrar-profissionais.component.html',
  styleUrls: ['./registrar-profissionais.component.css']
})
export class RegistrarProfissionaisComponent implements OnInit {
  profissional: any = {};
  profissionalForm: FormGroup;
  selectedFileName: string = 'Fotografia'; 
  @ViewChild('fileUploadComponent') fileUploadComponent: FileUpload;

  profissionalData: any = {}; 

  horarios: any[] = [];
  selectedHorarios: string[] = [];

  categorias: any [] = [];
  categoriasSelecionadas: number[] = []; 

  selectedServicos: any[] = [];
  selectedFile: File | null = null;

  


  value: string;
  senha: string;
  mostrarSenha: boolean = false;
  checked: boolean = true;
  showModal: boolean = false;

  toggleMostrarSenha() {
    this.mostrarSenha = !this.mostrarSenha;

  }
 blockChars: RegExp = /^[^<>*""!#$%&=()/?;'«»|*/*]+$/;
 blockCharsN: RegExp = /^[^<>*""!#$%&=()/?;.'«»|*/*]+$/;
 blockChars1: RegExp = /^[^!1234567890«»£€§@#$%^&*ºª()_+=\-´´`~\\[\]{};:"',<.>/?|]+$/;


 constructor(private profissionaisService: ProfissionalServiceService, 
  private fb: FormBuilder, private messageService: MessageService, 
  private horarioService: HorarioServicoService,
   private servicoService: ServicoxptoService, 
   private categoriaService: CategoriaServicoService,
   private formBuilder: FormBuilder,
  private router: Router ) {
 
}
onFileChange(event: any) {
  this.selectedFile = event.target.files[0];
}

onUpload(event: any) {
  this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
}

 ngOnInit(): void {
  this.profissionalForm = new FormGroup({
    nomeCompleto: new FormControl('', Validators.required),
    categoriaId: new FormControl([], Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    bi: new FormControl('',[Validators.required, this.validarBI ]),
    telefone: new FormControl('', [Validators.required, Validators.maxLength(9), Validators.pattern('^[0-9]*$')]),
    horariosId: new FormControl([], Validators.required),
  });
  this.obterTodosHorarios();
  this.carregarCategorias();
 }


 botaoDesabilitado = false;

 bloquear(): void {

   this.botaoDesabilitado = true;

 }

 
 servicoSelecionado: any;
 


obterTodosHorarios(): void {
  this.horarioService.obterTodosHorarios()
    .subscribe(
      horarios => {

        this.horarios = horarios.map(h => ({ label: h.hora, value: h.id }));
      },
      error => {
        console.error('Erro ao obter os horários', error);
      }
    );
}



carregarCategorias(): void {
  this.categoriaService.getCategorias()
    .subscribe(
      categorias => {
        this.categorias = categorias.map(categoria => ({
          label: categoria.nome,
          value: categoria.id
        }));
      },
      error => {
        console.error('Erro ao carregar categorias', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar categorias. Por favor, tente novamente.'
        });
      }
    );
}
onSubmit() {
  this.profissionalForm.markAllAsTouched(); 

  if (this.profissionalForm.invalid) {

    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos obrigatórios.' });
    return;
  }
  else if(this.profissionalForm.value.bi.errors?.invalidBI){
    this.messageService.add({severity: 'error', summary: 'Erro', detail: 'O número de BI deve seguir o formato: 9 dígitos, 2 caracteres alfanuméricos, e 3 dígitos finais.'});
    return;
  }
  else if(this.profissionalForm.value.telefone.length !== 9){
    this.messageService.add({severity: 'error', summary: 'Erro', detail: 'O número de telefone deve ter exatamente 9 dígitos.'});
    return;

  }
  else{
    this.botaoDesabilitado = true;
  }

  
  const formData: FormData = new FormData();
  
  formData.append('Nome', this.profissionalForm.get('nomeCompleto').value);
  formData.append('Email', this.profissionalForm.get('email').value);
  formData.append('BI', this.profissionalForm.get('bi').value);
  formData.append('Telemovel', this.profissionalForm.get('telefone').value);
  
  if (this.selectedFile) {
    formData.append('Foto', this.selectedFile, this.selectedFile.name);
  }

  const horariosSelecionados = this.profissionalForm.get('horariosId').value;
  horariosSelecionados.forEach(horario => {
    formData.append('HorariosId', horario);
  });

  const servicosSelecionados = this.profissionalForm.get('categoriaId').value;
  servicosSelecionados.forEach(servico => {
    formData.append('CategoriasId', servico);
  });

  this.profissionaisService.registrarProfissional(formData).subscribe(
    response => {
        if (response.success) {
          this.selectedFile = null;
          this.botaoDesabilitado = false;
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: response.message});
            this.profissionalForm.reset();

         
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


enforceNineChars(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.value.length > 9) {
    input.value = input.value.slice(0, 9);
    this.profissionalForm.get('telefone')?.setValue(input.value);
  }
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
