import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  foto: string; 
}



@Injectable({
  providedIn: 'root'
})
export class CategoriaServicoService {

  private apiUrl = 'https://localhost:7063/api/Categoria';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

 
  // Obter uma categoria pelo ID
  getCategoriaById(id: number): Observable<Categoria> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Categoria>(url);
  }

  adicionarCategoria(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrarCategoria`, formData);
  }

  // Atualizar uma categoria existente
  atualizarCategoria(categoria: Categoria): Observable<Categoria> {
    const url = `${this.apiUrl}/${categoria.id}`;
    return this.http.put<Categoria>(url, categoria);
  }

  deletarCategoria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  

}
