import { Component, OnInit } from '@angular/core';
import { UtilizadorServicoService } from 'src/app/Services/utilizador-servico.service';
import { ServicoxptoService } from 'src/app/Services/servicos/servicoxpto.service';
import { CategoriaServicoService } from 'src/app/Services/categoria-servico.service';
import { Categoria } from 'src/app/Services/categoria-servico.service';
import { ServicoDTO } from 'src/app/Services/servicos/servicoxpto.service';
import * as $ from 'jquery';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagina-servicos',
  templateUrl: './pagina-servicos.component.html',
  styleUrls: ['./pagina-servicos.component.css']
})
export class PaginaServicosComponent implements OnInit {

  categorias: Categoria[] = [];
  servicos: ServicoDTO[] = []; 
  selectedCategory: Categoria | null = null;
  currentPage: number = 1;
  pageSize: number = 5; // Altere conforme necessário
  categoria: string | null = null;
  servico: string | null = null;
  // Variáveis de controle da paginação de categorias
  currentPageCategories: number = 1;
  categoriesPageSize: number = 10; // Altere conforme necessário

  valorBotao: number | null = null; // Altere o tipo de String para number
  valorBotao1: number = 1;

  constructor(
    private servicoService: ServicoxptoService,
    private categoriaService: CategoriaServicoService, 
    private messageService: MessageService,
    private userServico: UtilizadorServicoService, 
    private router: Router,    
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute
  ) {}

  

  // Método para carregar os serviços do backend
  carregarServicos(): void {
    this.servicoService.listarServicos().subscribe(servicos => {
      this.servicos = servicos;
    });
  }

  carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
      if (this.categorias.length > 0) {
        this.selectedCategory = this.categorias[0];
      }
    });
  }
  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarServicos();
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria');
      this.servico = params.get('servico');

      // Utilize categoria e servico conforme necessário
      console.log('Categoria:', this.categoria);
      console.log('Serviço:', this.servico);
    });
  }

  // Método para obter a lista de categorias paginada
  getPaginatedCategories() {
    const startIndex = (this.currentPageCategories - 1) * this.categoriesPageSize;
    const endIndex = startIndex + this.categoriesPageSize;
    return this.categorias.slice(startIndex, endIndex);
  }

  selectCategory(category: Categoria) {
    this.selectedCategory = category;
    this.currentPage = 1; // Reinicia a página ao selecionar uma nova categoria
    
  }

  clearSelection() {
    this.selectedCategory = null;
  }

  armazenarValorBotao(valor: string) {
    this.valorBotao = parseInt(valor, 10);
  }
  onSaberMaisClick(event: Event, service: ServicoDTO) {
    this.categoria = this.selectedCategory?.nome;
    this.servico = service.nome;
  
    if (this.categoria && this.servico && this.isLoggedIn() ) {
      this.router.navigate(['/marcacoes', this.categoria ,  this.servico]);
    } 
     else {
       alert("Faça o Login para poder agendar um servicos");
    }
  }
  isLoggedIn(): boolean {
    return this.userServico.isLoggedIn(); 
  }
}
