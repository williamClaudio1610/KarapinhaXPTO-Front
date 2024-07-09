import { Component } from '@angular/core';
import { PhotoService } from '../../pages/menu/photo.service';
import { UtilizadorServicoService } from 'src/app/Services/utilizador-servico.service';
import { Router } from '@angular/router';
import { MarcacaoDTOListar, MarcacaoServiceService } from 'src/app/Services/marcacao/marcacao-service.service';
import { ProfissionalDTO, ProfissionalServiceService } from 'src/app/Services/profissional/profissional-service.service';
import { ServicoDTO, ServicoxptoService } from 'src/app/Services/servicos/servicoxpto.service';
import { MaracaoServiceService } from 'src/app/Services/marcacao/maracao-service.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userData: any; 

faturamentoHoje: number = 0;
faturamentoOntem: number = 0;
faturamentoMesCorrente: number = 0;
faturamentoMesPassado: number = 0;
servicoMaisSolicitado: ServicoDTO | undefined;
servicoMenosSolicitado: ServicoDTO | undefined;
top5Profissionais: { nome: string, solicitacoes: number }[] = [];

marcacoes: MarcacaoDTOListar[] = [];
profissionais: ProfissionalDTO[] = [];
servicos: ServicoDTO[] = [];

constructor(
private route: Router,
 private userService: UtilizadorServicoService,private photoService: PhotoService,
  private marcacaoService: MarcacaoServiceService,
  private profissionalService: ProfissionalServiceService,
  private servicoService: ServicoxptoService
) {}

ngOnInit(): void {
  this.carregarDados();
  this.userData =this.userService.getToken() ;
}

carregarDados(): void {
this.carregarServicos();
  this.fetchMarcacoes();
  this.loadProfissionais();
 
}

fetchMarcacoes(): void {
  this.marcacaoService.getAllMarcacoes()
    .subscribe(
      (data: MarcacaoDTOListar[]) => {
        this.marcacoes = data.filter(marcacao => marcacao.status);
        this.calcularFaturamento();
        this.calcularEstatisticas();
      },
      (error) => {
        console.error('Erro ao buscar marcações:', error);
      }
    );
}

loadProfissionais(): void {
  this.profissionalService.getAllProfissionais().subscribe((data: ProfissionalDTO[]) => {
    this.profissionais = data;
    this.calcularTopProfissionais();
  });
}

carregarServicos(): void {
  this.servicoService.listarServicos().subscribe(servicos => {
    this.servicos = servicos;
  });
}
calcularFaturamento() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    // Faturamento de Hoje
    this.faturamentoHoje = this.marcacoes
      .flatMap(marcacao => marcacao.servicosMarcados) // Explode servicosMarcados
      .filter(servicoMarcado => this.isSameDay(servicoMarcado.data, today))
      .reduce((total, servicoMarcado) => total + this.getMarcacaoTotal(servicoMarcado.marcacaoId), 0);
  
    // Faturamento de Ontem
    this.faturamentoOntem = this.marcacoes
      .flatMap(marcacao => marcacao.servicosMarcados)
      .filter(servicoMarcado => this.isSameDay(servicoMarcado.data, yesterday))
      .reduce((total, servicoMarcado) => total + this.getMarcacaoTotal(servicoMarcado.marcacaoId), 0);
  
    // Faturamento do Mês Corrente
    this.faturamentoMesCorrente = this.marcacoes
      .flatMap(marcacao => marcacao.servicosMarcados)
      .filter(servicoMarcado => new Date(servicoMarcado.data).getMonth() === today.getMonth() &&
                                new Date(servicoMarcado.data).getFullYear() === today.getFullYear())
      .reduce((total, servicoMarcado) => total + this.getMarcacaoTotal(servicoMarcado.marcacaoId), 0);
  
    // Faturamento do Mês Passado
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    this.faturamentoMesPassado = this.marcacoes
      .flatMap(marcacao => marcacao.servicosMarcados)
      .filter(servicoMarcado => {
        const data = new Date(servicoMarcado.data);
        return data.getMonth() === lastMonth.getMonth() && data.getFullYear() === lastMonth.getFullYear();
      })
      .reduce((total, servicoMarcado) => total + this.getMarcacaoTotal(servicoMarcado.marcacaoId), 0);
  }
  
  // Função auxiliar para obter o total de pagamento de uma marcação a partir do ID
  getMarcacaoTotal(marcacaoId: number): number {
    const marcacao = this.marcacoes.find(m => m.id === marcacaoId);
    return marcacao ? marcacao.totalPagar : 0;
  }
  

calcularEstatisticas(): void {
  const servicoCount: { [key: number]: number } = {};

  this.marcacoes.forEach(marcacao => {
    marcacao.servicosMarcados.forEach(servicoMarcado => {
      servicoCount[servicoMarcado.servicoId] = (servicoCount[servicoMarcado.servicoId] || 0) + 1;
    });
  });

  const servicosOrdenados = Object.keys(servicoCount)
    .map(servicoId => ({
      servicoId: Number(servicoId),
      count: servicoCount[servicoId]
    }))
    .sort((a, b) => b.count - a.count);

  if (servicosOrdenados.length > 0) {
    const servicoMaisId = servicosOrdenados[0].servicoId;
    const servicoMenosId = servicosOrdenados[servicosOrdenados.length - 1].servicoId;
    this.servicoMaisSolicitado = this.servicos.find(servico => servico.id === servicoMaisId);
    this.servicoMenosSolicitado = this.servicos.find(servico => servico.id === servicoMenosId);
  }
}

calcularTopProfissionais(): void {
  const profissionalCount: { [key: number]: number } = {};

  this.marcacoes.forEach(marcacao => {
    marcacao.servicosMarcados.forEach(servicoMarcado => {
      profissionalCount[servicoMarcado.profissionalId] = (profissionalCount[servicoMarcado.profissionalId] || 0) + 1;
    });
  });

  const profissionaisOrdenados = Object.keys(profissionalCount)
    .map(profissionalId => ({
      profissionalId: Number(profissionalId),
      solicitacoes: profissionalCount[profissionalId]
    }))
    .sort((a, b) => b.solicitacoes - a.solicitacoes)
    .slice(0, 5);

  this.top5Profissionais = profissionaisOrdenados.map(ordem => {
    const profissional = this.profissionais.find(prof => prof.id === ordem.profissionalId);
    return {
      nome: profissional?.nome || 'Desconhecido',
      foto: profissional?.foto,
      solicitacoes: ordem.solicitacoes
    };
  });
}

isSameDay(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
}
}
