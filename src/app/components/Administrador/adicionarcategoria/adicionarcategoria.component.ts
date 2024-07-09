import { Component, OnInit ,ViewChild } from '@angular/core';
import { CategoriaServicoService } from 'src/app/Services/categoria-servico.service';
import { Categoria } from 'src/app/Services/categoria-servico.service';
import { MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import { FileUpload } from 'primeng/fileupload';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-adicionarcategoria',
  templateUrl: './adicionarcategoria.component.html',
  styleUrls: ['./adicionarcategoria.component.css'],
  providers: [MessageService] 

})
export class AdicionarcategoriaComponent implements OnInit {
  @ViewChild('table') table: Table;
  @ViewChild('fileUploadComponent') fileUploadComponent: FileUpload;
  selectedFileName: string = 'Fotografia'; 

  globalFilter: string = '';

  categorias: Categoria[];
  displayAddDialog: boolean = false;
  newCategoria: Categoria = {} as Categoria;
  selectedFile: File | null = null;
  selectedFileURL: any = null; 
  showValidationMessages: boolean = false;
  debounceTimer: any;

  constructor(private categoriaService: CategoriaServicoService, private messageService: MessageService, private sanitizer: DomSanitizer, private route:Router,    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(categorias => this.categorias = categorias);
  }

  showAddDialog(): void {
    this.displayAddDialog = true;
    this.resetForm();

  }

  onImageSelect(event: any): void {
    if (event.currentFiles && event.currentFiles.length > 0) {
      this.selectedFile = event.currentFiles[0];
      const objectURL = URL.createObjectURL(this.selectedFile);
      this.selectedFileURL = this.sanitizer.bypassSecurityTrustUrl(objectURL); 
    }
  }

  onFileSelect(event: any, fileUpload: FileUpload) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      const objectURL = URL.createObjectURL(this.selectedFile);
      this.selectedFileURL = this.sanitizer.bypassSecurityTrustUrl(objectURL); 

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
  
  
get truncatedFileName(): string {
  return this.selectedFileName.length > 25 
    ? this.selectedFileName.slice(0, 12) + '...' + this.selectedFileName.slice(-10) 
    : this.selectedFileName;
}

  
  
  addCategoria(): void {
    this.showValidationMessages = true;

    if (!this.newCategoria.nome || !this.newCategoria.descricao || !this.selectedFile) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('nome', this.newCategoria.nome);
      formData.append('descricao', this.newCategoria.descricao);
      formData.append('foto', this.selectedFile, this.selectedFile.name);

      this.categoriaService.adicionarCategoria(formData).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response.message });
            this.carregarCategorias(); 
            this.displayAddDialog = false; 
            this.resetForm(); 
            this.showValidationMessages = false;            
          } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: response.message });
          }
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Ocorreu um erro ao Registrar Categoria. Por favor verifique a Conexão com a Rede';
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, selecione uma imagem.' });
    }
}
  resetForm(): void {
    this.newCategoria = {} as Categoria;
    this.selectedFile = null;
    this.selectedFileURL = null;
    this.showValidationMessages = false; 

  }
 
  applyFilterGlobal(event: any) {
    const filterValue = event.target.value;
    this.table.filterGlobal(filterValue, 'contains');
  }
  deleteCategoria(id: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esta categoria?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
     rejectLabel: 'Não',
      accept: () => {
        this.categoriaService.deletarCategoria(id).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response.message });
              this.carregarCategorias();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: response.message });
            }
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Erro ao excluir a categoria. Verifique sua conexão com a rede.';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'A exclusão foi cancelada.' });
      }
    });
  }


}
