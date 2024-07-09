import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import ptLocale from '@fullcalendar/core/locales/pt'; 
import { MarcacaoDTOListar, MarcacaoServiceService } from 'src/app/Services/marcacao/marcacao-service.service';
import { ChangeDetectorRef } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { ProfissionalDTO, ProfissionalServiceService } from 'src/app/Services/profissional/profissional-service.service';
import { Router } from '@angular/router';
import { Utilizador, UtilizadorServicoService } from 'src/app/Services/utilizador-servico.service';
import { MessageService } from 'primeng/api';
import { ServicoDTO, ServicoxptoService } from 'src/app/Services/servicos/servicoxpto.service';
import { Categoria, CategoriaServicoService } from 'src/app/Services/categoria-servico.service';

interface CalendarEvent {
  title: string;
  start: string; // Data e hora no formato ISO
  end?: string; // Data e hora no formato ISO, opcional
  allDay?: boolean;
  extendedProps?: any; // Para propriedades adicionais
}

@Component({
  selector: 'app-agenda-marcacoes',
  templateUrl: './agenda-marcacoes.component.html',
  styleUrls: ['./agenda-marcacoes.component.css']
})
export class AgendaMarcacoesComponent implements OnInit {
  marcacoes: MarcacaoDTOListar[] = [];
  marcacaoCount: number = 0;
  marcado:boolean = false;
  servicos: ServicoDTO[] = []; 
  categorias: Categoria[];
  profissionais: ProfissionalDTO[] = [];

  userData: any| null = null; 
  isFixed: boolean = false;
  users: Utilizador[] = [];
  inactiveUsersCount: number = 0;


  displayUpdateDialog: boolean = false;


  displayEventDialog: boolean = false;
  selectedEvent = {
    title: '',
    start: '',
    end: '',
    extendedProps: {
      SerivoIdM: '',
      ProfissionalIdM: '',
      clienteId: '',
      totalPagar: '',
      Hora: '',
      dataRegistro: ''
    }
  };

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    events: [], // Inicialmente vazio, será preenchido dinamicamente
    editable: true,
    eventClick: this.handleEventClick.bind(this),
    locale: ptLocale,
    buttonText: { // Personaliza os textos dos botões
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      list: 'Lista'
    },
    titleFormat: { // Formata o título para mostrar o nome do mês em português
      month: 'long',
      year: 'numeric',
      day: 'numeric'
    },
    dayHeaderFormat: { // Formata os dias da semana em português
      weekday: 'long'
    },
  };
  constructor(
    private profissionalService: ProfissionalServiceService, 
    private marcacaoService: MarcacaoServiceService, 
    private route: Router,
     private userService: UtilizadorServicoService, 
      private messageService: MessageService,
      private servicoService: ServicoxptoService, 
      private categoriaService: CategoriaServicoService, private cdr: ChangeDetectorRef) {}


  ngOnInit(): void {


       this.userData =this.userService.getToken() ;
        this.loadUsers();
        this.carregarCategorias();
        this.carregarServicos();
        this.loadProfissionais();
        this.fetchMarcacoes();
        

  }
  
  loadUsers(): void {
    this.userService.getUsers().subscribe((data: Utilizador[]) => {
      this.users = data.filter(user => user.role === "Registado");
      this.inactiveUsersCount = this.userService.getInactiveUsersCount(data);
    });
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

  handleEventClick(arg: any) {
    this.selectedEvent = {
      title: arg.event.title,
      start: arg.event.start.toISOString(),
      end: arg.event.end ? arg.event.end.toISOString() : '',
      extendedProps: {
        SerivoIdM: arg.event.extendedProps.SerivoIdM,
        ProfissionalIdM:  arg.event.extendedProps.ProfissionalIdM,
        clienteId: arg.event.extendedProps.clienteId,
        totalPagar: arg.event.extendedProps.totalPagar,
        Hora: arg.event.extendedProps.Hora,
        dataRegistro: arg.event.extendedProps.dataRegistro
      }
    };
    this.displayEventDialog = true;
  }

  fetchMarcacoes(): void {
    this.marcacaoService.getAllMarcacoes()
      .subscribe(
        (data: MarcacaoDTOListar[]) => {
          console.log('Dados recebidos:', data);
  
          // Filtra as marcações com status igual a true
          const filteredMarcacoes = data.filter(marcacao => marcacao.status);
          console.log('Marcações filtradas:', filteredMarcacoes);
  
          // Transforma as marcações no formato esperado pelo FullCalendar
          const events: CalendarEvent[] = filteredMarcacoes.flatMap(marcacao => {
            console.log('Serviços marcados para a marcação:', marcacao.servicosMarcados);
            return marcacao.servicosMarcados.map(servicoMarcacao => {
              // Obtém o nome do serviço e do profissional
              const servicoNome = this.getServico(servicoMarcacao.servicoId);
              const profissionalNome = this.getProfissional(servicoMarcacao.profissionalId);
              
              return {
                title: `Serviço: ${servicoNome} - Profissional: ${profissionalNome}`,
                start: `${new Date(servicoMarcacao.data).toISOString().split('T')[0]}T${servicoMarcacao.hora}`,
                extendedProps: {
                  SerivoIdM: servicoNome,
                  ProfissionalIdM:profissionalNome,
                  clienteId: this.getUsuario(marcacao.utilizadorId),
                  totalPagar: marcacao.totalPagar,
                  status: marcacao.status,
                  Hora: servicoMarcacao.hora,
                  dataRegistro:`${new Date(servicoMarcacao.data).toISOString().split('T')[0]}`
                }
              };
            });
          });
          console.log('Eventos formatados:', events);
  
          // Atualiza os eventos do calendário
          this.calendarOptions.events = events;
          
          // Força a detecção de mudanças para garantir que o calendário é atualizado
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Erro ao buscar marcações:', error);
        }
      );
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
  getUsuario(userId: number): string {
    const usuario = this.users.find(user => user.id === userId);
    return usuario ? usuario.nomeCompleto : 'Usuário Desconhecido';
  }
  formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
}
