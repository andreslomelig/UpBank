import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { TableItemComponent } from "../../table-item/table-item.component";
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../components/button/button.component";
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-admin',
  imports: [HeaderComponent, CommonModule, FormsModule, ButtonComponent],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.scss'
})
export class MenuAdminComponent {
  constructor(private router: Router){}
  users: any[] = [
    { text: 'Kevin Escobedo', status: true },
    { text: 'Alan López', status: true },
    { text: 'Brandon Martínez', status: false },
    { text: 'Kevin Escobedo', status: true },
    { text: 'Alan López', status: true },
    { text: 'Brandon Martínez', status: false },
    { text: 'Kevin Escobedo', status: true },
    { text: 'Alan López', status: true },
    { text: 'Brandon Martínez', status: false },
  ]

  logOut() {
    this.router.navigate(['login'])
  }
}
