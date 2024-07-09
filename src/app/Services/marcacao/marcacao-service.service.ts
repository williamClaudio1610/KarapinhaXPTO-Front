import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse ,HttpHeaders  } from '@angular/common/http';
import { Timestamp } from 'rxjs';
import { Time } from '@angular/common';
import { Observable, of } from 'rxjs'; 
import { catchError } from 'rxjs/operators';


export interface ServicoMarcacaoUpdateDTO {
  servicoMarcacaoId: number;
  novaData: string;
  novaHora: string;
}
export interface MarcacaoDTO {
  dataRegistro: Date;
  totalPagar: number;
  status: boolean;
  utilizadorId: number | null;
  servicosMarcados: ServicoMarcacaoDTO[];
}
export interface MarcacaoDTOListar {
  id: number;
  dataRegistro: Date;
  totalPagar: number;
  status: boolean;
  utilizadorId?: number;
  servicosMarcados: ServicoMarcacaoDTOListar[];
}

export interface ServicoMarcacaoDTO {
  id: number; 
  servicoId: number;
  profissionalId: number;
  data: Date; 
  hora: string; 
}
export interface ServicoMarcacaoDTOListar {
  id: number;
  servicoId: number;
  marcacaoId: number;
  profissionalId: number;
  data: Date;
  hora: string; 
  dataAnterior:String
  horaAnterior:String

}

@Injectable({
  providedIn: 'root'
})
export class MarcacaoServiceService {

  private apiUrl = 'https://localhost:7063/api/Marcacao';

  constructor(private http: HttpClient) {}

  createMarcacao(marcacaoDto: any) {
    return this.http.post(this.apiUrl, marcacaoDto);
  } 

  getAllMarcacoes(): Observable<MarcacaoDTOListar[]> {
    return this.http.get<MarcacaoDTOListar[]>(`${this.apiUrl}`);
  }
  confirmarMarcacao(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}/confirmar`;
    return this.http.post(url, {}).pipe(
      catchError(error => {
        throw error; // Lança o erro para ser tratado pelo componente que chama este serviço
      })
    );
  }

  deletarMarcacao(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(
        catchError(this.handleError<any>('deletarMarcacao'))
      );
  }

  private handleError<T>(operation = 'operação', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falhou: ${error.message}`);
      // Retorna um resultado vazio para que a aplicação continue funcionando.
      return of(result as T);
    };
  }
  atualizarServicoMarcacao(dto: ServicoMarcacaoUpdateDTO): Observable<any> {
    const url = `${this.apiUrl}/atualizar`;
  
    // Prepare as opções de cabeçalho
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'  // Espera a resposta como texto
    };
  
    return this.http.put<any>(url, dto, httpOptions);
  }

}
