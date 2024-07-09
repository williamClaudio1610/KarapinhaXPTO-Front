import { Time } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { jsPDF } from "jspdf";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImageService } from '../../../menu/image.service';
import { UtilizadorServicoService } from 'src/app/Services/utilizador-servico.service';
import { CategoriaServicoService } from 'src/app/Services/categoria-servico.service';
import { Categoria } from 'src/app/Services/categoria-servico.service';
import { ServicoxptoService } from 'src/app/Services/servicos/servicoxpto.service';
import { ServicoDTO } from 'src/app/Services/servicos/servicoxpto.service';
import { ProfissionalServiceService } from 'src/app/Services/profissional/profissional-service.service';
import { ProfissionalDTO } from 'src/app/Services/profissional/profissional-service.service';
import { formatDate } from '@angular/common';
import { HorarioDTO } from 'src/app/Services/profissional/profissional-service.service';
import {  ServicoMarcacaoDTO} from 'src/app/Services/marcacao/marcacao-service.service';
import autoTable from 'jspdf-autotable';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MarcacaoDTO, MarcacaoDTOListar, MarcacaoServiceService } from 'src/app/Services/marcacao/marcacao-service.service';

interface ServicoMarcado {
  categoria: Categoria;
  servico: ServicoDTO;
  profissional: ProfissionalDTO;
  data: Date;
  hora: String;
  preco: number;
  estado: string;
}

@Component({
  selector: 'app-marcacoes',
  templateUrl: './marcacoes.component.html',
  styleUrls: ['./marcacoes.component.css'],
  providers: [ConfirmationService, MessageService, ]

})
export class MarcacoesComponent implements OnInit {
  @ViewChild('tabelaServicos') tabelaServicos: ElementRef;
   marcacoes: MarcacaoDTOListar[] = [];
  marcacaoCount: number = 0;
  categoria: string | null = null; 
  servico: string | null = null;
  categorias: Categoria[] = [];
  servicos: ServicoDTO[] = []; 
  profissionais: ProfissionalDTO[] = [];
  private servicosMarcadosSubject = new BehaviorSubject<ServicoMarcado[]>([]);
  servicosMarcados$ = this.servicosMarcadosSubject.asObservable();

  categoriaSelecionada: Categoria |null = null;
  servicoSelecionado: ServicoDTO = null;
  profissionalSelecionado: ProfissionalDTO = null;
  dataSelecionada: Date = null;
  horaSelecionada: string; 
  horariosDisponiveis: { /*id: number,*/ hora: string }[] = [];
  profissionaisFiltrados: ProfissionalDTO[] = [];

  servicosMarcados: ServicoMarcado[] = [];
  logoBase64: string;
  Estado: string = "Pendente"; 

  constructor(
    private imageService: ImageService, 
    private utilizadorServico: UtilizadorServicoService,
    private categoriaService: CategoriaServicoService,
    private servicoService: ServicoxptoService,
    private profissionalService: ProfissionalServiceService,
    private confirmationService: ConfirmationService, 
    private marcacaoService: MarcacaoServiceService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadLogo();
    this.carregarCategorias();
    this.carregarServicos();
    this.loadProfissionais();
    this.fetchMarcacoes();

    this.carregarServicosDoSessionStorage();

    this.categoria = this.route.snapshot.paramMap.get('categoria');
    this.servico = this.route.snapshot.paramMap.get('servico');

    // Ou inscrição para mudanças nos parâmetros usando paramMap.subscribe
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria');
     // this.categoriaSelecionada = params.get('categoria');
      this.servico = params.get('servico');
    });

   // alert( this.categoria );
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

  filtrarServicosPorCategoria(): ServicoDTO[] {
    if (!this.categoriaSelecionada) {
      this.limparSelecoes();
      return [];
    }
    return this.servicos.filter(servico => servico.categoriaId === this.categoriaSelecionada.id);
  }
 
  filtrarProfissionaisPorServico(): void {
    if (!this.servicoSelecionado) {
      this.limparSelecoes(false, false, false);
      return;
    }

    this.profissionaisFiltrados = this.profissionais.filter(profissional =>
      profissional.profissionalCategorias.some(pc => pc.categoriaId === this.servicoSelecionado.categoriaId)
    );

  }

  filtrarHorariosPorProfissional(): void {
    if (this.profissionalSelecionado && this.dataSelecionada) {
      
      const dataSelecionada = new Date(this.dataSelecionada); // Data selecionada pelo usuário
      this.horariosDisponiveis = this.profissionalSelecionado.horarios.map(horarioProfissional => {
        
        const horarioDisponivel = {
          // id: horarioProfissional.id,
          hora: horarioProfissional.horario.hora,
          disabled: false  // Inicialmente, assume que o horário está habilitado
        };
  
        console.log(`Verificando horário disponível: ${horarioDisponivel.hora}`);
     
        // Verifica se há marcações confirmadas para este horário na data selecionada
        const possuiMarcacaoConfirmada = this.marcacoes.some(marcacao =>
          marcacao.status && marcacao.servicosMarcados.some(servico =>
            servico.profissionalId === this.profissionalSelecionado.id &&
            servico.hora === horarioDisponivel.hora &&
            this.compararDatas(new Date(servico.data), dataSelecionada) === 0 // Comparar datas sem considerar hora
          )
        );
  
        if (possuiMarcacaoConfirmada) {
          console.log(`Horário ${horarioDisponivel.hora} possui marcação confirmada na data selecionada.`);
          horarioDisponivel.disabled = true; // Desabilitar o horário no dropdown
        } else {
          console.log(`Horário ${horarioDisponivel.hora} não possui marcação confirmada na data selecionada.`);
        }
  
        return horarioDisponivel;
      });
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
  

 isDataValida(data: Date): boolean {
  if (!data || isNaN(data.getTime())) {
    return false;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataAjustada = new Date(data);
  dataAjustada.setHours(0, 0, 0, 0);

  return dataAjustada >= hoje;
}

  onCategoriaChange(): void {
    this.limparSelecoes(true, true, true);
    this.filtrarServicosPorCategoria();
  }

  onServicoChange(): void {
    this.limparSelecoes(false, true, true);
    this.filtrarProfissionaisPorServico();
  }

  limparSelecoes(limparServicos = true, limparProfissionais = true, limparHorarios = true): void {
    if (limparServicos) {
      this.servicoSelecionado = null;
    }
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

  adicionarServico() {
    if (this.categoriaSelecionada && this.servicoSelecionado && this.profissionalSelecionado && this.dataSelecionada && this.horaSelecionada) {
      
      const dataSelecionadaDate = new Date(this.dataSelecionada);

      console.log(dataSelecionadaDate);

      if (!this.isDataValida(dataSelecionadaDate)) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Data inválida. Por favor, selecione uma data futura ou a data de hoje.' });
        //alert('Data inválida. Por favor, selecione uma data futura ou a data de hoje.');
        return;
      }

      const servicoMarcado: ServicoMarcado = {
        categoria: this.categoriaSelecionada,
        servico: this.servicoSelecionado,
        profissional: this.profissionalSelecionado,
        data: this.dataSelecionada,
        hora: this.horaSelecionada, 
        preco: this.servicoSelecionado.preco,
        estado: 'Pendente'
      };

      this.servicosMarcados.push(servicoMarcado);
      this.salvarServicosNoSessionStorage();
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Servico Adicionado Com Sucesso'  });
      this.limparSelecoes(true, true, true);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos antes de adicionar o serviço.' });
    }
  }
  finalizarMarcacoes() {
   
    if (this.servicosMarcados.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Nenhum serviço foi selecionado para agendamento.' });
      // alert('Nenhum serviço foi selecionado para agendamento.');
      return;
  }
    
    const utilizadorId = this.utilizadorServico.getUserId();
    const dataRegistro = new Date();
    
    // Construir o objeto DTO da marcação
    const marcacaoDto: any = {
      id: 0, // ID inicial, pode ser 0 ou removido se não necessário
      utilizadorId: utilizadorId,
      dataRegistro: dataRegistro.toISOString(), // Formato ISO 8601
      totalPagar: this.calcularTotalPreco(),
      status: false,
      servicosMarcados: this.servicosMarcados.map(servico => ({
        id: 0, // ID inicial, pode ser 0 ou removido se não necessário
        servicoId: servico.servico.id,
        profissionalId: servico.profissional.id,
        data: new Date(servico.data), // Convertendo para Date
        hora: this.formatarHora1(servico.hora) // Tratando hora corretamente
      })) as ServicoMarcacaoDTO[]
    };
    
    console.log(marcacaoDto);

    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja Finalizar a Marcação?',
      header: 'Finalizar Marcação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
            
              this.marcacaoService.createMarcacao(marcacaoDto).subscribe(
                response => {
                  this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Marcação realizada com sucesso'  });
                  this.gerarPDF();
                  this.limparTabela();
                },
                error => {
                  console.error('Erro ao agendar a marcação:', error);
                  if (error.error && error.error.errors) {
                    const errorMessage = Object.values(error.error.errors).join('\n');
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail:`Erro ao agendar a marcação:\n${errorMessage}`});
                    console.log("Erro ao agendar a marcação:\n" + errorMessage);
                  } else {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail:'Ocorreu um erro ao tentar agendar a marcação. Tente novamente mais tarde.'});
                    console.log("Ocorreu um erro ao tentar agendar a marcação. Tente novamente mais tarde.");
                  }
                }
              );
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail:'A Marcação foi cancelada.' });
      }
    });

    
   
  }

  onHorarioChange(event: any) {
    console.log('Horário selecionado:', this.horaSelecionada);
  }

  limparTabela() {
    this.servicosMarcados = [];
    sessionStorage.removeItem('servicosMarcados');

  }
  eliminarServico(index: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja eliminar este serviço?',
      header: 'Confirmação de Eliminação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.servicosMarcados.splice(index, 1);
        this.salvarServicosNoSessionStorage();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço Eliminao Com Sucesso'   });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail:'A eliminação foi cancelada.' });
      }
    });
  }
  salvarServicosNoSessionStorage(): void {
    sessionStorage.setItem('servicosMarcados', JSON.stringify(this.servicosMarcados));
  }
  carregarServicosDoSessionStorage(): void {
    const dadosSalvos = sessionStorage.getItem('servicosMarcados');
    if (dadosSalvos) {
      this.servicosMarcados = JSON.parse(dadosSalvos);
    }
  }

  calcularTotalPreco(): number {
    return this.servicosMarcados.reduce((total, servico) => total + servico.preco, 0);
  }
  
  gerarPDF(): void {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let linhaY = 20; // Começamos com um valor maior para a tabela da empresa

    const margin = 10;

    // Adicionando o logotipo se ele estiver carregado
    if (this.logoBase64) {
        const imgWidth = 30; // Largura da imagem
        const imgHeight = 30; // Altura da imagem
        const pageWidth = doc.internal.pageSize.getWidth(); // Largura da página
        const pageHeight = doc.internal.pageSize.getHeight(); // Altura da página
      
        // Calcula as coordenadas para centralizar a imagem
        const x = (pageWidth - imgWidth) / 2;

        // Define a coordenada y para posicionar a imagem no topo da página
        const y = 10;
        // Adiciona a imagem centrada
        doc.addImage(this.logoBase64, 'PNG', x, y, imgWidth, imgHeight);
    }

    


    // Linha horizontal abaixo da tabela de empresa
    linhaY += 10;

    const tableEmpresa = [
      ['Nome da Empresa', 'Endereço', 'Telefone', 'Email'],
      ['Karapinha-XPTO', 'Benfica-Kifica Rua 21', '(+244) 929-628-405', 'karapinhaxpto@gmail.com']
    ];
    autoTable(doc, {
      startY: linhaY,
      head: tableEmpresa.slice(0, 1),
      body: tableEmpresa.slice(1),
      theme: 'plain'
    });
    linhaY += tableEmpresa.length * 10 + 10;

    // Detalhes dos serviços marcados
    if (this.servicosMarcados.length === 0) {
      doc.text('Nenhuma marcação registrada.', margin, linhaY);
    } else {
      // Captura e converte a tabela HTML para o PDF usando jspdf-autotable
      const tabelaElement = this.tabelaServicos.nativeElement;
      autoTable(doc, { html: tabelaElement });

    }

    // Adiciona o total ao final do PDF
    if (linhaY > pageHeight - 30) { // Verifica se há espaço suficiente para o total
      doc.addPage();
      linhaY = 20;
    }
    doc.setFontSize(14);

    doc.save('Detalhes_Marcacao.pdf');
  }

  private formatarHora1(hora: any): string {
    if (typeof hora === 'string') {
      return hora; // Se já é string, assumimos que está no formato correto
    } else if (typeof hora === 'object' && hora !== null && hora.hora) {
      return hora.hora; // Se é um objeto e possui uma propriedade hora
    }
    return "00:00:00"; // Valor padrão ou lidar com tipos inesperados
  }
  private formatarData1(data: any): string {
    if (typeof data === 'string') {
      return new Date(data).toISOString(); // Convertendo string para Date e depois para ISO 8601
    } else if (data instanceof Date) {
      return data.toISOString(); // Se já é Date, converte para ISO 8601
    } else {
      return new Date().toISOString(); // Valor padrão ou lidar com tipos inesperados
    }
  }

  formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  formatarHora(hora: string): string {
    return hora;
  }

  getMinDate(): string {
    return formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  }

  // Métodos para carregar dados
  carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(categorias => this.categorias = categorias);
  }

  carregarServicos(): void {
    this.servicoService.listarServicos().subscribe(servicos => {
      this.servicos = servicos;
    });
  }

  loadProfissionais() {
    this.profissionalService.getAllProfissionais().subscribe((data: ProfissionalDTO[]) => {
      this.profissionais = data;
    });
  }

  // Método para carregar logotipo
  async loadLogo() {
    try {
      this.logoBase64 = await this.imageService.getBase64ImageFromURL('assets/images/logotipo/logotipo.png');
    } catch (error) {
      console.error('Erro ao carregar o logotipo: ', error);
    }
  }



  
  
}
