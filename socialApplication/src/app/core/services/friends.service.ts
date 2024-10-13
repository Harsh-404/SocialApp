import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


interface User {
  id: number;
  username: string;
  email: string;
}


@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private apiUrl = 'http://127.0.0.1:8000/user/';
  private baseUrl = 'http://127.0.0.1:8000/';


  constructor(private http: HttpClient) { }

  search(query: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users: User[]) => users.filter((user: User) =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }
  // getUserById(id: number): Observable<User> {
  //   return this.http.get<User>(`${this.apiUrl}${id}/`);
  // }

  // Send friend request
  sendFriendRequest(profileId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}friend-request/send/${profileId}/`, {});
  }

  // Accept friend request
  acceptFriendRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}friend-request/accept/${requestId}/`, {});
  }

  // Decline friend request
  declineFriendRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}friend-request/decline/${requestId}/`, {});
  }

  //remove Friend
  removeFriend(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}friend-request/remove/${requestId}/`, {});
  }

  //cancel request
  cancelFriendRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}friend-request/cancel/${requestId}/`, {});
  }

  // Get incoming and outgoing friend requests
  getFriendRequests(): Observable<any> {
    return this.http.get(`${this.baseUrl}friend-request/notification/`);
  }

  // Get list of all friends
  getFriendList(): Observable<any> {
    return this.http.get(`${this.baseUrl}friend-request/friendsList/`)
  }
}
