import { Component } from '@angular/core';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent {


  
  submitForm() {
    alert('Formulário enviado com sucesso!');
  }

}
