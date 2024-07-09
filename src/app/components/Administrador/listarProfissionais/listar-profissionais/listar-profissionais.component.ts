import { Component, OnInit } from '@angular/core';
import { Time } from '@angular/common';
import 'bootstrap';
import { jsPDF } from 'jspdf';
import { ProfissionalDTO } from 'src/app/Services/profissional/profissional-service.service';
import { ProfissionalServiceService } from 'src/app/Services/profissional/profissional-service.service';
import { ServiceResponse } from 'src/app/Services/servicos/servicoxpto.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ServiceResponseProfissional } from 'src/app/Services/profissional/profissional-service.service';
@Component({
  selector: 'app-listar-profissionais',
  templateUrl: './listar-profissionais.component.html',
  styleUrls: ['./listar-profissionais.component.css'],
  providers: [ConfirmationService, MessageService, ]

})
export class ListarProfissionaisComponent implements OnInit {
  
  profissionais: ProfissionalDTO[] = [];

  constructor(private profissionalService: ProfissionalServiceService, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private confirmationService1: ConfirmationService
) {}

  ngOnInit(): void {
    this.loadProfissionais();
  }

  loadProfissionais() {
    this.profissionalService.getAllProfissionais().subscribe((data: ProfissionalDTO[]) => {
      this.profissionais = data;
    });
  }

  limparTabela() {
    this.profissionais = [];
  }

  eliminar(index: number) {
    this.profissionais.splice(index, 1);
  }
  // Componente Angular para confirmar a exclusão de um profissional
deleteProfissional(profissionalId: number, forceDelete: boolean = false): void {
  
  this.confirmationService.confirm({
    message: 'Você tem certeza que deseja excluir este profissional?',
    header: 'Confirmação de Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim',
    rejectLabel: 'Não',
    accept: () => {
      // Primeira tentativa de exclusão, sem forceDelete
      this.executeDelete(profissionalId, false);
    },
    reject: () => {
      this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Exclusão cancelada.' });
    }
  });
}
confirmationInProgress = false;

executeDelete(profissionalId: number, forceDelete: boolean): void {
  this.profissionalService.deleteProfissional(profissionalId, forceDelete).subscribe(
   
    (response: any) => {
      if (response && response.success) {
        this.profissionais = this.profissionais.filter(prof => prof.id !== profissionalId);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response.message });
      } else if (response && response.message && response.message.includes('Deseja continuar com a exclusão?')) {
            
            if (window.confirm(response.message)) {
              this.executeDelete(profissionalId, true);
            } else {
              this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Exclusão cancelada.' });
            }
      
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: response.message });
      }
    },
    (error) => {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir profissional. Por favor, tente novamente.' });
    }
  );
}

}

