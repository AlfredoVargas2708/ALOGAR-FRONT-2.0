import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { SalesService } from '../../services/sales.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-employee-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-home.html',
  styleUrl: './employee-home.scss'
})
export class EmployeeHome implements OnInit, AfterViewInit {
  username: string = '';
  role: string = 'Employee';
  id_employee: number = 0;
  id_sale: number = 1;
  total_sale: number = 0;
  newSaleForm: FormGroup;
  productForm: FormGroup;
  isLoading: boolean = true;

  @ViewChild('codeInput') codeInput!: ElementRef;
  @ViewChild('quantityInput') quantityInput!: ElementRef;

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (this.codeInput?.nativeElement) {
        this.codeInput.nativeElement.focus();
        clearInterval(interval);
      }
    }, 100);
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UsersService,
    private salesService: SalesService,
    private productService: ProductsService,
  ) {
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
    this.productForm = this.fb.group({
      code: [''],
      product: [''],
      price: [''],
      quantity: [''],
    });
  }

  ngOnInit() {
    this.salesService.getAllSales().subscribe((data) => {
      this.id_sale = data.length + 1;
      this.newSaleForm.patchValue({ id_sale: this.id_sale });
      this.isLoading = false;
    })
  }

  onCodeInput(event: any) {
    const code = event.target.value;
    this.productService.getProductByCode(code).subscribe(product => {
      if (product.length > 1) {
        return
      } else if (product.length === 0) {
        this.productForm.patchValue({
          code: '',
          product: '',
          price: '',
          quantity: ''
        });
        return;
      } else if (product.length === 1) {
        this.productForm.patchValue({
          product: product[0].product,
          price: product[0].price,
        });
        this.quantityInput.nativeElement.focus();
      }
    })
  }
}
