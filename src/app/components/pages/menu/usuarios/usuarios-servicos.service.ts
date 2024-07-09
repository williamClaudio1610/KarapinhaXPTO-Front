import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosServicosService {
  private userData = {
    fullName: 'valdir Simões',
    email: 'valdir.simoes@example.com',
    phone: '923-600-216',
    photo: 'https://via.placeholder.com/150',
    idCard: '1',
    username: 'valdirsimoes',
    password: '123',
    confirmPassword: '123',
    preferences: {
      notifications: true,
      favoriteCategories: ['Corte de cabelo', 'Manicure']
    }
  };

  private serviceHistory = [
    { date: '2023-05-01', service: 'Corte de cabelo', provider: 'Carlos' },
    { date: '2023-06-15', service: 'Manicure', provider: 'Ana' }
  ];

  constructor() { }

  getUserData() {
    return this.userData;
  }

  updateUserData(updatedData: any) {
    this.userData = { ...this.userData, ...updatedData };
  }

  getServiceHistory() {
    return this.serviceHistory;
  }


}
