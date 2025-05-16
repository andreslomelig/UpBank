import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllUsersService } from '../../services/all_users.service';

@Component({
  selector: 'app-menu-admin',
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.scss'
})
export class MenuAdminComponent implements OnInit {
  userName: string = '';
  users: any[] = [];

  constructor(private allUsersService: AllUsersService) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('loggedInUser') ?? 'Guest';

    this.allUsersService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
      }
    });
  }
}
