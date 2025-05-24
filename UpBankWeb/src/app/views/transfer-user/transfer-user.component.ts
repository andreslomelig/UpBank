import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-transfer-user',
  imports: [HeaderComponent, FormsModule, ButtonComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './transfer-user.component.html',
  styleUrl: './transfer-user.component.scss'
})

export class TransferUserComponent {

  constructor(private router: Router) {}

  form = new FormGroup({
    origin: new FormControl('', Validators.required),
    recipient: new FormControl('', Validators.required),
    amount: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/)  
    ]),
    concept: new FormControl('', Validators.required),
    transactionType: new FormControl('', Validators.required)
  });

  register() {
  if (this.form.valid) {
    Swal.fire({
      icon: 'success',
      title: 'Valid Transfer',
      text: '',
      confirmButtonColor: '#c8a977'
    });
    console.log('Transfer:', this.form.value);
  } else {
    this.form.markAllAsTouched();

    const invalidFields: string[] = [];

    if (this.form.get('origin')?.invalid) {
      invalidFields.push('Origin');
    }

    if (this.form.get('recipient')?.invalid) {
      invalidFields.push('Recipient');
    }

    if (this.form.get('amount')?.invalid) {
      invalidFields.push('Amount (must be a number with up to 2 decimals)');
    }

    if (this.form.get('concept')?.invalid) {
      invalidFields.push('Concept');
    }

    if (this.form.get('transactionType')?.invalid) {
      invalidFields.push('Transaction Type');
    }

    Swal.fire({
      icon: 'error',
      title: 'Error in Transfer',
      html: `<ul style="text-align: left;">${invalidFields.map(field => `<li>${field}</li>`).join('')}</ul>`,
      confirmButtonColor: '#d33'
    });
  }
}

goBackToUserTable() {
    this.router.navigate(['menu-user']); 
  }

}

