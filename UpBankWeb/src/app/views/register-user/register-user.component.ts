import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-user',
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent {
  constructor(private router: Router){}

  form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      userName: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
  })

  register() {
    this.router.navigate(['/login'])
  }
}
