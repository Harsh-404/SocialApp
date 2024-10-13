import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  user: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://127.0.0.1:8000/articles/';  // Django backend URL
  private idUrl = ''
  constructor(private http: HttpClient) { }

  // Helper function to get the token from session storage
  // private getAuthToken(): string | null {
  //   return sessionStorage.getItem('authToken');
  // }

  // // Function to create HTTP headers with the auth token
  // private createAuthHeaders(): HttpHeaders {
  //   const token = this.getAuthToken();
  //   let headers = new HttpHeaders();


  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
    return '';
  }

  public uploadfile(file: File) {
    let formParams = new FormData();
    formParams.append('image', file)
    return this.http.post('http://127.0.0.1:8000/articles/', formParams)
  }


  private getOptions() {
    return {
      // withCredentials: true,
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': this.getCookie('csrftoken')
      })
    };
  }

  // Fetch all articles (no authentication required)
  getArticles(): Observable<Article[]> {
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.get<Article[]>(this.apiUrl, options);
  }

  // Fetch a specific article (authenticated)
  getArticleById(id: number): Observable<Article> {
    //const headers = this.createAuthHeaders();
    return this.http.get<Article>(`${this.apiUrl}${id}/`);
  }


  // Create a new article (authenticated)
  createArticle(article: FormData): Observable<Article> {
    //const csrfToken = this.getCsrfToken();
    return this.http.post<Article>(this.apiUrl, article, this.getOptions())
  }



  // Update an article (authenticated)
  updateArticle(id: number, article: FormData): Observable<Article> {
    //const headers = this.createAuthHeaders();
    return this.http.patch<Article>(`${this.apiUrl}update/${id}/`, article);
  }

  // Delete an article (authenticated)
  deleteArticle(id: number): Observable<any> {
    //const headers = this.createAuthHeaders();
    return this.http.delete(`${this.apiUrl}user/${id}/`);
  }
}

