import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { TableItemComponent } from "../../table-item/table-item.component";
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../components/button/button.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-admin',
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.scss'
})
export class MenuAdminComponent {
  users: any[] = [
    { text: 'Kevin Escobedo', status: true },
    { text: 'Alan López', status: true },
    { text: 'Brandon Martínez', status: false },
  ]
}
