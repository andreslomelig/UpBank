import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Obtener historial de transacciones por número de cuenta
  getTransactionsByUser(accountNumber: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions?account=${accountNumber}`);
  }

  // Realizar una transferencia
  makeTransfer(data: {
    from_account: string;
    to_account: string;
    amount: number;
    description?: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, data);
  }
}
