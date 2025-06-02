import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from '../../services/users.service';

@Component({
  selector: 'app-employee-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-home.html',
  styleUrl: './employee-home.scss'
})
export class EmployeeHome {
  username: string = '';
  role: string = 'Employee';
  id_employee: number = 0;
  id_sale: number = 1;
  total_sale: number = 0;
  newSaleForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private userService: Users) {
    this.username = this.router.url.split('/')[3].split('-').join(' ');
    this.userService.getUserByName(this.username).subscribe(user => {
      this.id_employee = user.id;
    });
    this.newSaleForm = this.fb.group({
      id_sale: [this.id_sale],
      total_sale: [this.total_sale],
      sale_date: [new Date().toLocaleDateString('es-Es', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })],
      id_employee: [this.id_employee],
      products: this.fb.array([]),
    });
  }
}
