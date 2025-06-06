import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
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
      productForm: this.fb.group({
        code: [''],
        product: [''],
        price: [''],
        quantity: [''],
      }),
    });

  }

  ngOnInit() {
    this.salesService.getAllSales().subscribe((data) => {
      this.id_sale = data.length + 1;
      this.newSaleForm.patchValue({ id_sale: this.id_sale });
    })
  }

  get productForm() {
    return this.newSaleForm.get('productForm') as FormGroup;
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

  addProductToSale() {
    const productForm = this.productForm;
    const code = productForm.get('code')?.value;
    const product = productForm.get('product')?.value;
    const price = productForm.get('price')?.value;
    const quantity = productForm.get('quantity')?.value;

    if (code && product && price && quantity) {
      (this.newSaleForm.get('products') as FormArray).push(this.fb.group({
        code: [code],
        product: [product],
        price: [price],
        quantity: [quantity],
      }));
      this.total_sale += price * quantity;
      this.newSaleForm.patchValue({ total_sale: this.total_sale });
      productForm.reset();
      this.codeInput.nativeElement.focus();
    }
  }

  createNewSale() {
    const products = (this.newSaleForm.get('products') as FormArray).value;
    if (products.length === 0) {
      alert('No products added to the sale.');
      return;
    }
  }
}
