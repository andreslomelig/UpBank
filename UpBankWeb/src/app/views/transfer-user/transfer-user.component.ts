import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import Swal from 'sweetalert2';
import { TransferService } from '../../services/transfer.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer-user',
  standalone: true,
  imports: [HeaderComponent, FormsModule, ButtonComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './transfer-user.component.html',
  styleUrl: './transfer-user.component.scss'
})
export class TransferUserComponent implements OnInit {
  user: string = '';
  balance: number = 0;

  form = new FormGroup({
    origin: new FormControl({ value: '', disabled: true }, Validators.required),
    recipient: new FormControl('', Validators.required),
    amount: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/)
    ]),
    concept: new FormControl('', Validators.required),
    transactionType: new FormControl('Transfer', Validators.required) // default
  });

  constructor(
    private transferService: TransferService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.get<any>(`http://localhost:3000/user/${userId}`).subscribe({
      next: (user) => {
        this.user = user.name;
        this.balance = user.money;
        this.form.get('origin')?.setValue(user.account_number);
        this.form.get('origin')?.disable();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error loadind user data'
        });
      }
    });
  }

  register() {
    if (this.form.valid) {
    const origin = this.form.get('origin')?.value || '';
    const data = {
      from_account: origin,
      to_account: this.form.get('recipient')?.value || '',
      amount: parseFloat(this.form.get('amount')?.value || '0'),
      description: this.form.get('concept')?.value || ''
    };
    if (this.form.get('origin')?.value === this.form.get('recipient')?.value) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Transfer',
          text: 'Cannot send to yourself',
          confirmButtonColor: '#d33'
        });
        return;
    }
      this.transferService.makeTransfer(data).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Transfer Success',
            text: res.message,
            confirmButtonColor: '#c8a977'
          }).then(() => this.router.navigate(['/menu-user']));
        },
        error: (err) => {
          const msg = err.error?.error || 'Unexpected Error';
          Swal.fire({
            icon: 'error',
            title: 'Error in transfer',
            text: msg,
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      this.form.markAllAsTouched();

      const invalidFields: string[] = [];

      if (this.form.get('recipient')?.invalid) invalidFields.push('Cuenta destino');
      if (this.form.get('amount')?.invalid) invalidFields.push('Monto válido (número hasta 2 decimales)');
      if (this.form.get('concept')?.invalid) invalidFields.push('Concepto');
      if (this.form.get('transactionType')?.invalid) invalidFields.push('Tipo');

      Swal.fire({
        icon: 'error',
        title: 'Inclomplete Information',
        html: `<ul style="text-align: left;">${invalidFields.map(f => `<li>${f}</li>`).join('')}</ul>`,
        confirmButtonColor: '#d33'
      });
    }
  }

goBackToUserTable() {
    this.router.navigate(['menu-user']); 
  }

}

