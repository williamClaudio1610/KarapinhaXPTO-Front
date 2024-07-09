import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';


import { catchError, throwError, tap } from 'rxjs';

export interface AlterarSenhaDTO {
  userId: number;
  novaSenha: string;
  senhaAntiga?: string; // Senha antiga é opcional
}
export interface ServiceResponse {
  success: boolean;
  message: string;
}
export interface UserData {
  id: string;
  username: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  foto: string;
  bi: string;
  status: boolean;
  nbf: number;
  exp: number;
  iat: number;
}


export interface Utilizador {
  id: number;
  nomeCompleto: string;
  email: string;
  telefone: string;
  foto: string;
  bi: string;
  userName: string;
  password: string;
  status: boolean;
  role: string;
}

interface UserRegistration {
  nomeCompleto: string;
  email: string;
  telefone: string;
  foto: string;
  bi: string;
  username: string;
  password: string;
  confirmPassword: string;
}
export interface UserLogin {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilizadorServicoService {

  private apiUrl = 'https://localhost:7063/api/Utilizador'; 
  private currentUser: any = null;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  

  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, formData);
  }

  registerAdministrativo(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registerAdministrativo`, formData);
  }

  
  loginUser(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
}

alterarSenha(alterarSenhaDTO: AlterarSenhaDTO): Observable<ServiceResponse> {
  return this.http.post<ServiceResponse>(`${this.apiUrl}/alterar-senha`, alterarSenhaDTO);
}

 
  getUsers(): Observable<Utilizador[]> {
    return this.http.get<Utilizador[]>(`${this.apiUrl}/list`);
  }

  toggleActivation(userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/toggle-activation/${userId}`, {});
  }

  

  getInactiveUsersCount(users: Utilizador[]): number {
    return users.filter(user => !user.status && user.role==="Registado").length;
  }
  updateUser(userId: number, userData: any): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put(url, userData);
  }
  logoutUser() {
    localStorage.removeItem('token');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  getToken() {
    return  this.currentUser;
  }
  getUserId(){
    return  this.currentUser.nameid;
  }

  
  setToken(token: string) {
    localStorage.setItem('token', token);
    // Decodificar o token para extrair a role
    this.currentUser =  jwtDecode(token);
  }

  getUserRole(): string | null {
    if (!this.currentUser) {
      const token = this.getToken();
      if (token) {
        this.currentUser = jwtDecode(token);
      }
    }
    return this.currentUser?.role || null;
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
  atualizarUtilizador(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/atualizarUtilizador`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Erro no servidor';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro ocorreu no lado do servidor
      if (error.status === 400 && error.error && typeof error.error === 'string') {
        errorMessage = error.error; // Mensagem de erro específica do backend
      } else if (error.status === 400 && error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message; // Mensagem de erro específica do backend (pode variar conforme sua API)
      } else {
        errorMessage = `Código de erro: ${error.status}\nMensagem: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }

}
