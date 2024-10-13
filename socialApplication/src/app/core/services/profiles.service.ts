import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

interface UserProfile {
  id: number;
  bio: string;
  location: string;
  birth_date: string;
  profile_pic: string;
  user: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  private apiUrl = "http://127.0.0.1:8000/profile/";

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.apiUrl).pipe(
      tap(response => console.log('Server response:', response)),
      catchError(error => {
        console.error('Error fetching user profiles:', error);
        return throwError(error);
      })
    );
  }
}
