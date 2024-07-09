import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';


export interface Horario {
  id: number;
  hora: string; 
}

@Injectable({
  providedIn: 'root'
})
export class HorarioServicoService {

  
  private apiUrl = 'https://localhost:7063/api/Horario';

  constructor(private http: HttpClient) { }


  obterTodosHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/todosHorarios`);
  }

}
