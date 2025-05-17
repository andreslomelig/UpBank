import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction';
import { ButtonComponent } from "../../components/button/button.component";

@Component({
  selector: 'app-menu-user',
  imports: [HeaderComponent, CommonModule, ButtonComponent],
  templateUrl: './menu-user.component.html',
  styleUrl: './menu-user.component.scss'
})
export class MenuUserComponent {
  amount: string = "200"
  user: string = "Rene Pérez"
  transactions: Transaction[] = [
    {
    ID: "TXN001",
    senderID: "USR123",
    receiverID: "USR456",
    amount: "150.00",
    type: "Transferencia",
    description: "Pago por servicios",
    timestamp: "2025-05-16T10:30:00Z"
  },
  {
    ID: "TXN002",
    senderID: "USR789",
    receiverID: "USR321",
    amount: "500.00",
    type: "Depósito",
    description: "Depósito en cuenta de ahorro",
    timestamp: "2025-05-16T14:15:00Z"
  },
  {
    ID: "TXN003",
    senderID: "USR456",
    receiverID: "USR123",
    amount: "75.50",
    type: "Compra",
    description: "Pago de suscripción mensual",
    timestamp: "2025-05-16T18:45:00Z"
  },
  {
    ID: "TXN004",
    senderID: "USR456",
    receiverID: "USR789",
    amount: "2000.00",
    type: "Retiro",
    description: "Retiro de efectivo en cajero",
    timestamp: "2025-05-16T20:00:00Z"
  },
  {
    ID: "TXN004",
    senderID: "USR456",
    receiverID: "USR789",
    amount: "2000.00",
    type: "Retiro",
    description: "Retiro de efectivo en cajero",
    timestamp: "2025-05-16T20:00:00Z"
  },
  {
    ID: "TXN004",
    senderID: "USR456",
    receiverID: "USR789",
    amount: "2000.00",
    type: "Retiro",
    description: "Retiro de efectivo en cajero",
    timestamp: "2025-05-16T20:00:00Z"
  }

  ]
}
