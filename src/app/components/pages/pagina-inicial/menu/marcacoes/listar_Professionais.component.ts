import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import 'bootstrap';
import { jsPDF } from 'jspdf';
import { ImageService } from '../../../menu/image.service';

@Component({
  selector: 'app-listar_Professionais',
  templateUrl: './listar_Professionais.component.html',
  styleUrls: ['./listar_Professionais.component.css']
})
export class Listar_ProfessionaisComponent implements OnInit {
  categorias = [
    { nome: 'Cabelo', servicos: [{ nome: 'Corte', profissionais: [{ nome: 'Profissional 1' }], preco:50 }] },
    { nome: 'Estética', servicos: [{ nome: 'Manicure', profissionais: [{ nome: 'Profissional 2' }], preco: 40}] }
  ];

  categoriaSelecionada: any;
  servicoSelecionado: any;
  profissionalSelecionado: any;
  dataSelecionada: Date;
  horaSelecionada: string;
  Estado: string = "Pendente";
  servicosMarcados: any[] = [];
  logoBase64: string;

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    this.loadLogo();
  }

  async loadLogo() {
    try {
      this.logoBase64 = await this.imageService.getBase64ImageFromURL('assets/images/logotipo/logotipo.png');
    } catch (error) {
      console.error('Erro ao carregar o logotipo: ', error);
    }
  }

  adicionarServico() {
    if (
      this.categoriaSelecionada &&
      this.servicoSelecionado &&
      this.profissionalSelecionado &&
      this.dataSelecionada &&
      this.horaSelecionada 
    ) {
      const servicoMarcado = {
        categoria: this.categoriaSelecionada,
        servico: this.servicoSelecionado,
        profissional: this.profissionalSelecionado,
        data: this.dataSelecionada,
        hora: this.horaSelecionada,
        preco: this.servicoSelecionado.preco

      };

      this.servicosMarcados.push(servicoMarcado);

      this.categoriaSelecionada = null;
      this.servicoSelecionado = null;
      this.profissionalSelecionado = null;
      this.dataSelecionada = null;
      this.horaSelecionada = null;
 
    } else {
      console.error('Por favor, preencha todos os campos antes de adicionar o serviço.');
    }
  }

  limparTabela() {
    this.servicosMarcados = [];
  }

  finalizarMarcacoes() {
    console.log('Marcações finalizadas:', this.servicosMarcados);
    this.gerarPDF();
  }

  Eliminar(index: number) {
    this.servicosMarcados.splice(index, 1);
  }
  calcularTotalPreco(): number {
    return this.servicosMarcados.reduce((total, servico) => total + servico.preco, 0);
  }

  gerarPDF() {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let linhaY = 60;
    const margin = 10;

    // Adicionando o logotipo se ele estiver carregado
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', 10, 10, 30, 30);
    }

    // Cabeçalho
    doc.setFontSize(18);
    doc.text('Detalhes da Marcação', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Nome da Empresa: Karapinha-XPTO', 105, 30, { align: 'center' });
    doc.text('Endereço da Empresa: Benfica-Kifica Rua 21', 105, 35, { align: 'center' });
    doc.text('Telefone: (+244) 929-628-405', 105, 40, { align: 'center' });
    doc.text('Email: karapinhaxpto@gmail.com', 105, 45, { align: 'center' });

    doc.line(10, 50, 200, 50);

    if (this.servicosMarcados.length === 0) {
      doc.text('Nenhuma marcação registrada.', margin, linhaY);
    } else {
      this.servicosMarcados.forEach((servico, index) => {
        if (linhaY > pageHeight - 70) {
          doc.addPage();
          linhaY = 20; // nova margem para a próxima página
        }

        doc.setFontSize(12);
        doc.text(`Serviço ${index + 1}:`, margin, linhaY);
        doc.text(`Categoria: ${servico.categoria.nome}`, margin + 10, linhaY + 10);
        doc.text(`Serviço: ${servico.servico.nome}`, margin + 10, linhaY + 20);
        doc.text(`Profissional: ${servico.profissional.nome}`, margin + 10, linhaY + 30);

        const dataFormatada = this.formatarData(new Date(servico.data));
        const horaFormatada = this.formatarHora(servico.hora);
        doc.text(`Data: ${dataFormatada}`, margin + 10, linhaY + 40);
        doc.text(`Hora: ${horaFormatada}`, margin + 10, linhaY + 50);
        doc.text(`Preço: ${servico.preco.toFixed(2)} KZ`, margin + 10, linhaY + 60);

        doc.text('----------------------------------------', margin, linhaY + 70);
        linhaY += 80;
      });

      // Adiciona o total ao final do PDF
      if (linhaY > pageHeight - 30) { // Verifica se há espaço suficiente para o total
        doc.addPage();
        linhaY = 20;
      }
      doc.setFontSize(14);
      doc.text(`Valor Total a Pagar: ${this.calcularTotalPreco().toFixed(2)} KZ`, margin, linhaY + 20);

      doc.save('Detalhes_Marcacao.pdf');


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
}
