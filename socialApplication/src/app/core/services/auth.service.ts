import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface User {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post('https://socialapp-h5zu.onrender.com/auth/login/', { username, password })
  }
  getCurrentUser(): Observable<User> {
    return this.http.get<User>('https://socialapp-h5zu.onrender.com/current_user/');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if token exists in localStorage
  }
}