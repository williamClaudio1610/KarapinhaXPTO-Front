import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Utilizador, UtilizadorServicoService } from 'src/app/Services/utilizador-servico.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-listar-utilizadores',
  templateUrl: './listar-utilizadores.component.html',
  styleUrls: ['./listar-utilizadores.component.css'],
  providers: [ConfirmationService, MessageService, ]

})
export class ListarUtilizadoresComponent {
  @ViewChild('table') table: Table;
  users: Utilizador[] = [];
  userData: any| null = null; 
  inactiveUsersCount: number = 0;

  constructor(private route: Router, private userService: UtilizadorServicoService,    private messageService: MessageService,  ) {}

  ngOnInit() {
    this.userData =this.userService.getToken() ;
   
      this.loadUsers();


 }

  logout() {
    this.userService.logoutUser();
    this.route.navigate(['/login']); 
  }
  loadUsers(): void {
    this.userService.getUsers().subscribe((data: Utilizador[]) => {
      this.users = data.filter(user => user.id != 36);
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
}
