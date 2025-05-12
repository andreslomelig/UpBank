import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { RegisterUserComponent } from './views/register-user/register-user.component';
import { MenuAdminComponent } from './views/menu-admin/menu-admin.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register-user', component: RegisterUserComponent },
    { path: 'menu-admin', component: MenuAdminComponent }
];
