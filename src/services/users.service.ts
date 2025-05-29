import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Users {
  api_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.api_URL}/users`);
  }

  logInUser(user: any): Observable<any> {
    return this.http.post(`${this.api_URL}/users/login`, { user });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.api_URL}/users/register`, { user });
  }
}
