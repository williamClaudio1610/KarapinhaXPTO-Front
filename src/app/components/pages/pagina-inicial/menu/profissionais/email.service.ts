import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://api.example.com/email'; // Substitua pela URL da sua API

  constructor(private http: HttpClient) {}

  enviarEmail(emailData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, emailData);
  }
}
