import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable , throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export interface ProfissionalDTO {
  id: number;
  nome: string;
  email: string;
  foto: string;
  bi: string;
  telemovel: string;
  horarios: ProfissionalHorarioDTO[];
  profissionalCategorias: ProfissionalCategoriaDTO[];
}
export interface ProfissionalHorarioDTO {
  id: number;
  horarioID: number;
  horario: HorarioDTO;
}

export interface HorarioDTO {
  id: number;
  hora: string;
}
export interface ProfissionalCategoriaDTO {
  profissionalId: number;
  categoriaId: number;
  categoria: CategoriaDTO;
}

export interface CategoriaDTO {
  id: number;
  nome: string;
}
 export interface ServiceResponseProfissional {
  success: boolean;
  message: string;
  data?: any;
}
@Injectable({
  providedIn: 'root'
})
export class ProfissionalServiceService {

  private apiUrl = 'https://localhost:7063/api/Profissionais';

  constructor(private http: HttpClient) { }


  registrarProfissional(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrarProfissional`, formData);
  }

  getAllProfissionais(): Observable<ProfissionalDTO[]> {
    return this.http.get<ProfissionalDTO[]>(`${this.apiUrl}/listarProfissionais`);
  }

  deleteProfissional(profissionalId: number, forceDelete: boolean = false): Observable<ServiceResponseProfissional> {
    const url = `${this.apiUrl}/eliminarProfissional/${profissionalId}?forceDelete=${forceDelete}`;
    
    return this.http.delete<ServiceResponseProfissional>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400 && error.error.message.includes('marcações')) {
            return throwError({ success: false, message: error.error.message } as ServiceResponseProfissional);
          } else {
            let errorMessage = 'Erro ao excluir profissional. Por favor, tente novamente.';
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            return throwError({ success: false, message: errorMessage } as ServiceResponseProfissional);
          }
        })
      );
  }

}







