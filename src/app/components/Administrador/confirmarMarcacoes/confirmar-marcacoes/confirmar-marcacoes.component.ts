import { Component,HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserData, UtilizadorServicoService } from 'src/app/Services/utilizador-servico.service';
import { Utilizador } from 'src/app/Services/utilizador-servico.service';
import { UserRoles } from 'src/app/models/user-roles';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MarcacaoDTO, MarcacaoDTOListar, MarcacaoServiceService, ServicoMarcacaoUpdateDTO } from 'src/app/Services/marcacao/marcacao-service.service';
import { Categoria, CategoriaServicoService } from 'src/app/Services/categoria-servico.service';
import { ServicoDTO, ServicoxptoService } from 'src/app/Services/servicos/servicoxpto.service';
import { ProfissionalServiceService, ProfissionalDTO } from 'src/app/Services/profissional/profissional-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-confirmar-marcacoes',
  templateUrl: './confirmar-marcacoes.component.html',
  styleUrls: ['./confirmar-marcacoes.component.css']
})
export class ConfirmarMarcacoesComponent {
  @ViewChild('table') table: Table;
  globalFilter: string = '';
  displayUpdateDialog: boolean = false;
  marcacoes: MarcacaoDTOListar[] = [];
  marcacaoCount: number = 0;
  marcado:boolean = false;
  servicos: ServicoDTO[] = []; 
  categorias: Categoria[];
  profissionais: ProfissionalDTO[] = [];
  profissionalSelecionado: ProfissionalDTO | null = null;

  userData: any| null = null; 
  isFixed: boolean = false;
  users: Utilizador[] = [];
  inactiveUsersCount: number = 0;

  dataSelecionada: string;
  horaSelecionada: string; 
  horariosDisponiveis: { /*id: number,*/ hora: string }[] = [];
  profissionaisFiltrados: ProfissionalDTO[] = [];
  profissionalId:number;
  servicoMarcadoId:number;
    constructor(
        private profissionalService: ProfissionalServiceService, 
        private marcacaoService: MarcacaoServiceService, 
        private route: Router,
        private userService: UtilizadorServicoService, 
        private messageService: MessageService,
        private servicoService: ServicoxptoService, 
        private categoriaService: CategoriaServicoService,
        private confirmationService: ConfirmationService,
      ) {}

      dto: ServicoMarcacaoUpdateDTO = {
        servicoMarcacaoId: 0,
        novaData: '',
        novaHora: ''
      };
    @HostListener('window:scroll', [])
    onWindowScroll() {
      if (window.scrollY > 0) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    }
    ngOnInit() {
        this.userData =this.userService.getToken() ;
        this.loadUsers();
        this.fetchMarcacoes();
        this.carregarCategorias();
        this.carregarServicos();
        this.loadProfissionais();

        if (this.profissionais.length > 0) {
          this.profissionalSelecionado = this.profissionais[0]; // Seleciona o primeiro profissional da lista
          this.filtrarHorariosPorProfissional(); // Filtra os horários disponíveis para o profissional inicial
        }
        this.atualizarServicoMarcacao(this.dto);

   }
   
   abrirModalAtualizacao(profissionalId: number, servicoMarcacaoId:number): void {
    this.displayUpdateDialog = true;
    this.profissionalId = profissionalId;
    this.servicoMarcadoId = servicoMarcacaoId;

    // Encontrar o profissional correspondente ao ID
    this.profissionalSelecionado = this.profissionais.find(p => p.id === profissionalId) || null;
  }
  


  
  limparSelecoes( limparProfissionais = true, limparHorarios = true): void {
    if (limparProfissionais) {
      this.profissionalSelecionado = null;
    }
    if (limparHorarios) {
      this.dataSelecionada = null;
      this.horaSelecionada = null;
    }
    this.profissionaisFiltrados = [];
    this.horariosDisponiveis = [];

  }

  
loadProfissionais() {
  this.profissionalService.getAllProfissionais().subscribe((data: ProfissionalDTO[]) => {
    this.profissionais = data;
  });
}

   carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(categorias => this.categorias = categorias);
  }
   // Método para carregar os serviços do backend
   carregarServicos(): void {
    this.servicoService.listarServicos().subscribe(servicos => {
      this.servicos = servicos;
    });
  }
  fetchMarcacoes(): void {
    this.marcacaoService.getAllMarcacoes()
      .subscribe(
        (data: MarcacaoDTOListar[]) => {
          // Filtra as marcações com status igual a false
          this.marcacoes = data;
          // Atualiza a contagem de marcações com o status false
          this.marcacaoCount = this.marcacoes.length;
        },
        (error) => {
          console.error('Erro ao buscar marcações:', error);
        }
      );
  }

    logout() {
      this.userService.logoutUser();
      this.route.navigate(['/login']); 
    }

    isAdmin(): boolean {

      return this.userData?.role === UserRoles.Administrador;
    }


    loadUsers(): void {
      this.userService.getUsers().subscribe((data: Utilizador[]) => {
        this.users = data.filter(user => user.role === "Registado");
        this.inactiveUsersCount = this.userService.getInactiveUsersCount(data);
      });
    }

    toggleActivation(userId: number): void {
      const user = this.users.find(user => user.id === userId);
      const confirmAction = confirm(`Tem certeza de que deseja ${user.status ? 'desativar' : 'ativar'} este usuário?`);
      
      if (confirmAction) {
        this.userService.toggleActivation(userId).subscribe(() => {
          this.loadUsers(); // Recarregar a lista de usuários após a alteração
          
          this.messageService.add({
            severity: 'success', 
            summary: 'Sucesso', 
            detail: `Usuário ${user.status ? 'desativado' : 'ativado'} com sucesso!`
          });
        });
      }
    }

    applyFilterGlobal(event: any) {
      const filterValue = event.target.value;
      this.table.filterGlobal(filterValue, 'contains');
    }

   // Métodos para buscar as informações
      getCategoria(servicoId: number): string {
        const servico = this.servicos.find(s => s.id === servicoId);
        const categoria = servico ? this.categorias.find(c => c.id === servico.categoriaId) : null;
        return categoria ? categoria.nome : 'Categoria Desconhecida';
      }

      getServico(servicoId: number): string {
        const servico = this.servicos.find(s => s.id === servicoId);
        return servico ? servico.nome : 'Serviço Desconhecido';
      }

      getProfissional(profissionalId: number): string {
        const profissional = this.profissionais.find(p => p.id === profissionalId);
        return profissional ? profissional.nome : 'Profissional Desconhecido';
      }

      getPreco(servicoId: number): number {
        const servico = this.servicos.find(s => s.id === servicoId);
        return servico ? servico.preco : 0;
      }

      confirmarMarcacao(id: number) {
        this.marcado = true;
        
        this.marcacaoService.confirmarMarcacao(id).subscribe(
          (response: any) => {
            this.messageService.add({
              severity: 'success', 
              summary: 'Sucesso', 
              detail: response.message
              
            });
            this.marcado = false;
            this.fetchMarcacoes();
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.message});
          }
        );
      }


      confirmarDelecao(id: number): void {
        this.confirmationService.confirm({
          message: 'Tem certeza de que deseja excluir esta Marcação?',
          header: 'Confirmação',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.deletarMarcacao(id);
          },
          reject: () => {
            this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Ação de exclusão cancelada' });
          }
        });
      }
    
      deletarMarcacao(id: number): void {
        this.marcacaoService.deletarMarcacao(id).subscribe(
          resposta => {
            console.log('Entidade excluída com sucesso', resposta);
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Marcação excluída com sucesso'
            });
            this.fetchMarcacoes(); // Método para atualizar a lista de marcações
          },
          erro => {
            console.error('Ocorreu um erro!', erro);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro!' });
          }
        );
      }
      fecharModalAtualizacao(): void {
        this.displayUpdateDialog = false;
        
      }
      


          compareProfissional(p1: ProfissionalDTO, p2: ProfissionalDTO): boolean {
            return p1 && p2 ? p1.id === p2.id : p1 === p2;
          }
          filtrarProfissionaisPorServico(): ProfissionalDTO[] {
            if (!this.profissionalId) {
              this.limparSelecoes();
              return [];
            }
          
            // Filtrar os profissionais pelo ID selecionado
            return this.profissionais.filter(profissional => profissional.id ===  this.profissionalId);
          }

          filtrarHorariosPorProfissional(): void {
          

            if (this.profissionalSelecionado && this.dataSelecionada) {
              const dataSelecionada = new Date(this.dataSelecionada);
       
              if (this.profissionalSelecionado.horarios && Array.isArray(this.profissionalSelecionado.horarios)) {
                this.horariosDisponiveis = this.profissionalSelecionado.horarios.map(horarioProfissional => {
                  const horarioDisponivel = {
                    hora: horarioProfissional.horario.hora,
                    disabled: false
                  };
          
                  console.log(`Verificando horário disponível: ${horarioDisponivel.hora}`);
          
                  const possuiMarcacaoConfirmada = this.marcacoes.some(marcacao =>
                    marcacao.status && marcacao.servicosMarcados.some(servico =>
                      servico.profissionalId === this.profissionalSelecionado.id &&
                      servico.hora === horarioDisponivel.hora &&
                      this.compararDatas(new Date(servico.data), dataSelecionada) === 0
                    )
                  );
          
                  if (possuiMarcacaoConfirmada) {
                    console.log(`Horário ${horarioDisponivel.hora} possui marcação confirmada na data selecionada.`);
                    horarioDisponivel.disabled = true;
                  } else {
                    console.log(`Horário ${horarioDisponivel.hora} não possui marcação confirmada na data selecionada.`);
                  }
          
                  return horarioDisponivel;
                });
          
                console.log('Horários disponíveis:', this.horariosDisponiveis); // Verifique se os horários estão sendo populados corretamente
              } else {
                console.warn('Profissional selecionado não possui uma lista válida de horários.');
                this.horariosDisponiveis = [];
              }
            } else {
              this.horariosDisponiveis = [];
            }
          }
          
          
          
      
      compararDatas(data1: Date, data2: Date): number {
        // Função para comparar datas sem considerar hora
        const data1SemHora = new Date(data1.getFullYear(), data1.getMonth(), data1.getDate());
        const data2SemHora = new Date(data2.getFullYear(), data2.getMonth(), data2.getDate());
      
        if (data1SemHora < data2SemHora) {
          return -1;
        } else if (data1SemHora > data2SemHora) {
          return 1;
        } else {
          return 0;
        }
      }
      
      getMinDate(): string {
        return formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      }



  atualizarServicoMarcacao(servicoForm: any) {
    if (servicoForm.invalid) {
      return;
    }
    if (this.formatarHora1(this.horaSelecionada) === '00:00:00') {
      servicoForm.controls['horaSelecionada'].setErrors({ invalidTime: true });
      return;
    }

    if (servicoForm.valid) {
      const dto: ServicoMarcacaoUpdateDTO = {
        servicoMarcacaoId: this.servicoMarcadoId,
        novaData: this.dataSelecionada,
        novaHora:this.formatarHora1(this.horaSelecionada)
      };
  
      this.marcacaoService.atualizarServicoMarcacao(dto).subscribe(
        response => {
          console.log('Resposta do servidor:', response);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail:  response });

          this.fetchMarcacoes();
          this.fecharModalAtualizacao();
        },
        error => {
          console.error('Erro ao atualizar o serviço de marcação:', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: error });

        }
      );
    }
  }

  formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
     
      
      private formatarHora1(hora: any): string {
        if (typeof hora === 'string') {
          return hora; // Se já é string, assumimos que está no formato correto
        } else if (typeof hora === 'object' && hora !== null && hora.hora) {
          return hora.hora; // Se é um objeto e possui uma propriedade hora
        }
        return "00:00:00"; // Valor padrão ou lidar com tipos inesperados
      }
    
      
}
