import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export class ServiceResponse {
  success: boolean;
  message: string;
}
export class ServicoDTO {
  id:number;
  nome: string;
  descricao: string;
  imagem: string;
  categoriaId: number;
  preco: number;
}
export class ServicoDTOAtualizar{
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  categoriaId: number;
  preco: number;
}

@Injectable({
  providedIn: 'root'
})

export class ServicoxptoService {

  private apiUrl = 'https://localhost:7063/api/Servico';

  constructor(private http: HttpClient) { }

  cadastrarServico(servicoData: FormData): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.apiUrl}/registrarServicos`, servicoData);
  }
  listarServicos(): Observable<ServicoDTO[]> {
    return this.http.get<ServicoDTO[]>(`${this.apiUrl}/listarServicos`);
  }
  eliminarServico(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.apiUrl}/eliminarServico/${id}`);
  }
  
  atualizarServico(servico: ServicoDTOAtualizar, imagem?: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', servico.id.toString());
    if (servico.nome) formData.append('nome', servico.nome);
    if (servico.descricao) formData.append('descricao', servico.descricao);
    if (servico.preco) formData.append('preco', servico.preco.toString());
    if (servico.categoriaId) formData.append('categoriaId', servico.categoriaId.toString());
    if (imagem) formData.append('imagem', imagem);

    return this.http.put(`${this.apiUrl}/atualizarServico`, formData);
  }
}
