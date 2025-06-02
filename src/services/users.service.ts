import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users`);
  }

  getUserByName(username: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/${username}`);
  }

  logInUser(user: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/login`, { user });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/register`, { user });
  }
}
