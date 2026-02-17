import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}
interface Profile {
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
export class UserService {

  constructor(private http: HttpClient) { }

  private create_apiUrl = 'https://socialapp-h5zu.onrender.com/profile/';

  private apiUrl = 'https://socialapp-h5zu.onrender.com/user/';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);

  }

  createUser(user: User): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }
  // createProfile(profile: Profile): Observable<any> {
  //   return this.http.post(this.create_apiUrl, profile);
  // }

}
