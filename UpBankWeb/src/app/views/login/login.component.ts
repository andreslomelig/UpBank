import { Component } from '@angular/core';
import { InputComponent } from "../../components/input/input.component";
import { ButtonComponent } from "../../components/button/button.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router: Router){}

  form = new FormGroup({
      strEmail: new FormControl('', [Validators.required, Validators.email]),
      strPassword: new FormControl('', [Validators.required])
  })

  login() {
    if (this.form.valid) {
      Swal.fire({
        title: 'Access Granted',
        icon: 'success'
      }).then(() => {
        this.router.navigate(['menu-admin']);
      });
    } else {
      Swal.fire({
        title: 'Access Denied',
        icon: 'error',
        allowOutsideClick: false
      });
    }
  }

}
