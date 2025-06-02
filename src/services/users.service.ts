import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviromentCloud } from '../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get(`${enviromentCloud.apiUrl}/users`);
  }

  getUserByName(username: string): Observable<any> {
    return this.http.get(`${enviromentCloud.apiUrl}/users/${username}`);
  }

  logInUser(user: any): Observable<any> {
    return this.http.post(`${enviromentCloud.apiUrl}/users/login`, { user });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${enviromentCloud.apiUrl}/users/register`, { user });
  }
}
