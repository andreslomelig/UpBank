import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AllUsersService } from '../../services/all_users.service';
import { UpdateBlockedStatusService } from '../../services/update_blocked_status.service'

@Component({
  selector: 'app-menu-admin',
  imports: [HeaderComponent, CommonModule, FormsModule, ButtonComponent],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.scss'
})

export class MenuAdminComponent implements OnInit {
  userName: string = '';
  users: any[] = [];

  constructor(private allUsersService: AllUsersService, private updateBlockedStatusService: UpdateBlockedStatusService) {}

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

  toggleUserBlockedStatus(user: any) {
    this.updateBlockedStatusService.updateUserBlockedStatus(user.email, !user.status).subscribe({
      next: () => {
        console.log(`User ${user.email} status updated`);
      },
      error: (err) => {
        console.error('Failed to update user status', err);
      }
    });
  }
  
  logOut() {
    this.router.navigate(['login'])
  }
}
