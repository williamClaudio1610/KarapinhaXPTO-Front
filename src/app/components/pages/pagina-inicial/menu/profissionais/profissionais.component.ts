import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProfissionalServiceService, ProfissionalDTO } from 'src/app/Services/profissional/profissional-service.service';
import { UtilizadorServicoService, UserData } from 'src/app/Services/utilizador-servico.service';

@Component({
  selector: 'app-profissionais',
  templateUrl: './profissionais.component.html',
  styleUrls: ['./profissionais.component.css']
})
export class ProfissionaisComponent implements OnInit {
  userData: UserData | null = null;
  profissionais: ProfissionalDTO[] = [];
  selectedProfessional: ProfissionalDTO | null = null;

  constructor(
    private profissionalService: ProfissionalServiceService, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router,
    private userService: UtilizadorServicoService
  ) {}

  ngOnInit() {
    this.userData = this.userService.getToken();
    this.loadProfissionais();
  }

  loadProfissionais() {
    this.profissionalService.getAllProfissionais().subscribe((data: ProfissionalDTO[]) => {
      this.profissionais = data;
    });
  }

  selectProfessional(professional: ProfissionalDTO) {
    if (this.selectedProfessional && this.selectedProfessional.id === professional.id) {
      this.selectedProfessional = null;
    } else {
      this.selectedProfessional = professional;
    }
  }

  logout() {
    this.userService.logoutUser();
    this.route.navigate(['/login']); 
  }
}
