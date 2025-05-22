import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../components/header/header.component';
import { ButtonComponent } from '../../components/button/button.component';
import { TransferService } from '../../services/transfer.service';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-menu-user',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ButtonComponent],
  templateUrl: './menu-user.component.html',
  styleUrl: './menu-user.component.scss'
})
export class MenuUserComponent {
  user: string = '';
  amount: number = 0;
  accountNumber: string = '';
  transactions: Transaction[] = [];

  constructor(private http: HttpClient, private transferService: TransferService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // Paso 1: obtener nombre, saldo, y cuenta
    this.http.get<any>(`http://localhost:3000/user/${userId}`).subscribe({
      next: (userData) => {
        this.user = userData.name;
        this.amount = userData.money;
        this.accountNumber = userData.account_number;

        // Paso 2: cargar historial de transacciones
        this.transferService.getTransactionsByUser(this.accountNumber).subscribe({
          next: (txs) => this.transactions = txs,
          error: () => console.error('Error al cargar transacciones')
        });
      },
      error: () => console.error('Error al cargar datos del usuario')
    });
  }
}
