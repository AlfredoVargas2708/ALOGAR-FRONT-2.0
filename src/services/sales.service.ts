import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviromentCloud} from '../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  getAllSales(): Observable<any> {
    return this.http.get(`${enviromentCloud.apiUrl}/sales`);
  }
}
