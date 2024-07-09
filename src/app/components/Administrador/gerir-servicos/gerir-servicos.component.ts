import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ServicoxptoService } from 'src/app/Services/servicos/servicoxpto.service';
import { ServicoDTO } from 'src/app/Services/servicos/servicoxpto.service';
import { ServiceResponse } from 'src/app/Services/servicos/servicoxpto.service';
import { CategoriaServicoService } from 'src/app/Services/categoria-servico.service';
import { Categoria } from 'src/app/Services/categoria-servico.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { ViewChild } from '@angular/core';
import { ServicoDTOAtualizar } from 'src/app/Services/servicos/servicoxpto.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-gerir-servicos',
  templateUrl: './gerir-servicos.component.html',
  styleUrls: ['./gerir-servicos.component.css']
})
export class GerirServicosComponent {
    displayUpdateDialog: boolean = false;
    selectedFileName: string = 'Fotografia'; 
    @ViewChild('fileUploadComponent') fileUploadComponent: FileUpload;
    
    isVisible: boolean = false; 
  newServico: ServicoDTO = new ServicoDTO();
  servicos: ServicoDTO[] = []; 
  response1: ServiceResponse;
  categorias: { label: string, valor: number }[] = [];
  displayAddDialog: boolean = false;
  servicoSelecionado: any = {
    id: 0,
    nome: '',
    descricao: '',
    imagem: '',
    preco: 0,
    categoriaId: 0
  };

  @ViewChild('table') table: Table;
  globalFilter: string = '';
  constructor(private servicoService: ServicoxptoService, 
              private categoriaService: CategoriaServicoService, 
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private http: HttpClient) {}


              applyFilterGlobal(event: any) {
                const filterValue = event.target.value;
                this.table.filterGlobal(filterValue, 'contains');
              }
  // Método para exibir o diálogo de adição
  showAddDialog(): void {
    this.displayAddDialog = true;
  }
  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarServicos();

  }
  
  onSubmit(servicoForm: NgForm): void {

    if (servicoForm.invalid || !this.newServico.imagem) {
      // Exibir mensagem de erro geral se o formulário estiver inválido
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }
    this.addServico();

  }
  obterNomeCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.valor === categoriaId);
    return categoria ? categoria.label : 'Desconhecida';
  }
    // Método para carregar as categorias do backend
    carregarCategorias(): void {
      this.categoriaService.getCategorias().subscribe({
        next: (categorias) => {
          // Formatar a lista de categorias para o p-dropdown
          this.categorias = categorias.map(categoria => ({
            label: categoria.nome, 
            valor: categoria.id    
          }));
        },
        error: (error) => {
          // Exibir mensagem de erro em caso de falha ao carregar as categorias
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar categorias. Por favor, tente novamente.'
          });
          console.error('Erro ao carregar categorias:', error); 
        }
      });
    }

  
    addServico(): void {
      const formData: FormData = new FormData();
  
    
      formData.append('nome', this.newServico.nome);
      formData.append('descricao', this.newServico.descricao);
      formData.append('preco', this.newServico.preco.toString());
      formData.append('categoriaId', this.newServico.categoriaId.toString());
      
     
      if (this.newServico.imagem) {
        const imageBlob = this.dataURItoBlob(this.newServico.imagem);
        formData.append('imagem', imageBlob, 'imagem.png'); 
      }
  
      this.servicoService.cadastrarServico(formData)
        .subscribe({
          next: (response) => {
            this.response1 = response;
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço cadastrado com sucesso!' });
            this.displayAddDialog = false;
            this.resetForm();
            this.carregarServicos(); 
          },
          error: (error) => {
            console.error('Erro ao cadastrar serviço:', error);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao cadastrar serviço. Por favor, tente novamente.' });
          }
        });
    }

    // Método para carregar os serviços do backend
    carregarServicos(): void {
      this.servicoService.listarServicos().subscribe(servicos => {
        this.servicos = servicos;
      });
    }
  
  // Método para resetar o formulário
  resetForm(): void {
    this.newServico = new ServicoDTO();
  }

  onFileSelect1(event: any, fileUpload: FileUpload,servicoProperty: string) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this[servicoProperty].imagem = reader.result as string;
      };

      this.selectedFileName = file.name; 
  
      this.selectedFileName = file.name.length > 25 
          ? file.name.slice(0, 12) + '...' + file.name.slice(-10) 
          : file.name; 
  
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
  selectedFile: File | null = null;

  onFileSelect(event: any, fileUpload: FileUpload, servicoProperty: string) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this[servicoProperty].imagem = reader.result as string;
      };
      this.selectedFileName = file.name.length > 25 
        ? file.name.slice(0, 12) + '...' + file.name.slice(-10) 
        : file.name;
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

  

    
  eliminarServico(id: number): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este serviço?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.servicoService.eliminarServico(id).subscribe({
          next: (response: ServiceResponse) => {
            if (response.success) {
              this.servicos = this.servicos.filter(servico => servico.categoriaId !== id);
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response.message });
              this.carregarServicos(); 
            } else {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: response.message });
            }
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Erro ao excluir o serviço. Verifique sua conexão com a rede.';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'A exclusão foi cancelada.' });
      }
    });
  }

  abrirModalAtualizacao(servico: ServicoDTOAtualizar): void {
    this.servicoSelecionado = { ...servico }; 
    this.displayUpdateDialog = true;
  }

  fecharModalAtualizacao(): void {
    this.displayUpdateDialog = false;
    this.servicoSelecionado = {
      id: 0,
      nome: '',
      descricao: '',
      imagem: '',
      preco: 0,
      categoriaId: 0
    };
  }

  atualizarServico(): void {
    if (!this.servicoSelecionado.id) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID do serviço é obrigatório.' });
      return;
    }
  
    this.servicoService.atualizarServico(this.servicoSelecionado, this.selectedFile).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço atualizado com sucesso!' });
        this.fecharModalAtualizacao();
        this.carregarServicos();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar serviço. Por favor, tente novamente.' });
      }
    });
  }

// Método para converter dataURI para Blob
dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
  
}

