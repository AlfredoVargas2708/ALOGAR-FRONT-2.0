import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviromentCloud } from '../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get(`${enviromentCloud.apiUrl}/products`);
  }
  getProductByCode(code: string): Observable<any> {
    return this.http.get(`${enviromentCloud.apiUrl}/products/${code}`);
  }

}
