import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../menu/photo.service';
import { UtilizadorServicoService } from 'src/app/Services/utilizador-servico.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Categoria, CategoriaServicoService } from 'src/app/Services/categoria-servico.service';
import { ServicoDTO, ServicoxptoService } from 'src/app/Services/servicos/servicoxpto.service';
import { ProfissionalDTO, ProfissionalServiceService } from 'src/app/Services/profissional/profissional-service.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  profissionais: ProfissionalDTO[] = [];
  profissionaisGrupos: { foto: string, nome: string, categorias: string[] }[][] = [];

  images: any[] | undefined;
  categorias: Categoria[] = [];
  servicos: ServicoDTO[] = []; 
  servicosGrupos: (ServicoDTO & { categoriaNome?: string })[][] = []; 

  responsiveOptions: any[] = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];
  constructor(private servicoService: ServicoxptoService, 
    private categoriaService: CategoriaServicoService, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    private userServico: UtilizadorServicoService,
    private photoService: PhotoService,private router: Router,
    private profissionalService: ProfissionalServiceService ) {}



  ngOnInit() {
    this.carregarCategorias();
    this.carregarServicos();
    this.loadProfissionais();

    this.photoService.getImages().then((images) => {
        this.images = images;
    });
}


loadProfissionais(): void {
  this.profissionalService.getAllProfissionais().subscribe((data: ProfissionalDTO[]) => {
    this.profissionais = data;

    // Mapear os profissionais para extrair as categorias
    const profissionaisComCategorias = this.profissionais.map(prof => ({
      foto: prof.foto,
      nome: prof.nome,
      categorias: prof.profissionalCategorias.map(pc => pc.categoria.nome)
    }));

    // Dividir em grupos de 4
    this.profissionaisGrupos = this.dividirEmGruposProfissionais(profissionaisComCategorias, 4);
  });
}

dividirEmGruposProfissionais(array: any[], tamanhoGrupo: number): any[][] {
  const grupos: any[][] = [];
  for (let i = 0; i < array.length; i += tamanhoGrupo) {
    grupos.push(array.slice(i, i + tamanhoGrupo));
  }
  return grupos;
}


carregarCategorias(): void {
  this.categoriaService.getCategorias().subscribe(categorias => this.categorias = categorias);
}
carregarServicos(): void {
  this.servicoService.listarServicos().subscribe(servicos => {
    // Ordena os serviços por ID de forma decrescente e pega os últimos 6
    const ultimosServicos = servicos.sort((a, b) => b.id - a.id).slice(0, 6);

    // Mapeia o ID da categoria para o nome da categoria
    const servicosComCategoria = ultimosServicos.map(servico => {
      const categoria = this.categorias.find(cat => cat.id === servico.categoriaId);
      return { ...servico, categoriaNome: categoria ? categoria.nome : 'Categoria Desconhecida' };
    });

    // Divide os serviços em grupos de 3
    this.servicosGrupos = this.dividirEmGrupos(servicosComCategoria, 3);
  });
}

dividirEmGrupos(array: any[], tamanhoGrupo: number): any[][] {
  const grupos: any[][] = [];
  for (let i = 0; i < array.length; i += tamanhoGrupo) {
    grupos.push(array.slice(i, i + tamanhoGrupo));
  }
  return grupos;
}
onSaberMaisClick(event: Event, servico: ServicoDTO) {
 
  const categoria = this.categorias.find(cat => cat.id === servico.categoriaId);
  if (categoria) {
    this.router.navigate(['/marcacoes', categoria.nome, servico.nome]);
  } else {
    alert("Categoria não encontrada para o serviço selecionado");
  }
}


isLoggedIn(): boolean {
    return this.userServico.isLoggedIn();
  }
  
   

}
