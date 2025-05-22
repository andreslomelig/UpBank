import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router: Router, private loginService: LoginService) {}

  form = new FormGroup({
    strEmail: new FormControl('', [Validators.required, Validators.email]),
    strPassword: new FormControl('', [Validators.required])
  });

  login() {
    if (this.form.valid) {
      const email = this.form.value.strEmail!;
      const password = this.form.value.strPassword!;
      this.loginService.login(email, password).subscribe({
        next: (res) => {
          localStorage.clear();
          localStorage.setItem('loggedInUser', res.name);
          localStorage.setItem('userId', res.id);
          Swal.fire({ title: 'Access Granted', icon: 'success' }).then(() => {
            if (res.role === 'admin') {
              this.router.navigate(['menu-admin']);
            } else {
              this.router.navigate(['menu-user']); //TODO: Create menu-user view.
            }
          });
        },
        error: () => {
          Swal.fire({ title: 'Access Denied', icon: 'error', allowOutsideClick: false });
        }
      });
    }
  }
}
