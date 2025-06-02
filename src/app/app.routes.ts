import { Routes } from '@angular/router';
import { Login } from './login/login';
import { EmployeeHome } from './employee-home/employee-home';
import { AdminHome } from './admin-home/admin-home';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: Login,
        title: 'Login',
    },
    {
        path: 'home/employee/:username',
        component: EmployeeHome,
        title: 'Employee Home',
    },
    {
        path: 'home/admin/:username',
        component: AdminHome,
    }
];
