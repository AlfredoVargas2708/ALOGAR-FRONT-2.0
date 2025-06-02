import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Users {
  private api_URL = 'http://localhost:3000/api';
  private api_URL_Cloud = "https://alogar-back-2-0.onrender.com/api";

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.api_URL}/users`);
  }

  getUserByName(username: string): Observable<any> {
    return this.http.get(`${this.api_URL}/users/${username}`);
  }

  logInUser(user: any): Observable<any> {
    return this.http.post(`${this.api_URL}/users/login`, { user });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.api_URL}/users/register`, { user });
  }
}
