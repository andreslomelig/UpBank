import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { RegisterUserComponent } from './views/register-user/register-user.component';
import { MenuAdminComponent } from './views/menu-admin/menu-admin.component';
import { TransferUserComponent } from './views/transfer-user/transfer-user.component';
import { MenuUserComponent } from './views/menu-user/menu-user.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register-user', component: RegisterUserComponent },
    { path: 'menu-admin', component: MenuAdminComponent },
    { path: 'transfer-user', component: TransferUserComponent },
    { path: 'menu-user', component: MenuUserComponent }
];
