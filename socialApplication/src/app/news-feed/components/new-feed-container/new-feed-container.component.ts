import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../core/services/article.service';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  user: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}
interface UserProfile {
  id: number;
  bio: string;
  location: string;
  birth_date: string;
  profile_pic: string;
  user: number;
}



@Component({
  selector: 'app-new-feed-container',
  templateUrl: './new-feed-container.component.html',
  styleUrl: './new-feed-container.component.css'
})

export class NewFeedContainerComponent implements OnInit {

  sanitizedImages: SafeUrl[] = [];

  searchQuery: string = '';
  searchResults: any[] = [];
  users: User[] = [];
  profiles: UserProfile[] = [];

  articles: Article[] = [];
  articleForm: FormGroup;
  selectedArticle?: Article;
  file: File | any = null;
  us: string = "";

  isEditMode: boolean = false;
  currentUser?: User;
  isAllowed: boolean = false;


  constructor(private articleService: ArticleService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService
  ) {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      image: ['']
    });

  }


  ngOnInit(): void {

    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      console.log('Logged-in user:', this.currentUser);
    });

    this.loadArticles();


    // If there's an ID in the route, fetch that specific article
    // const articleId = this.route.snapshot.paramMap.get('id');
    // if (articleId) {
    //   this.loadArticleById(parseInt(articleId, 10));
    // }
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe(data => {
      this.articles = data;
      console.log("fetched response", this.articles);

    });
  }

  loadArticleById(id: number): void {

    this.articleService.getArticleById(id).subscribe((article) => {
      console.log("id", id);
      this.selectedArticle = article;
      this.isEditMode = true;
      this.articleForm.patchValue(article);
    });

  }

  onFileSelected(event: any): void {
    this.file = <File>event.target.files[0];
  }


  // Create a new article or update an existing one
  submitArticle(): void {
    if (this.isEditMode && this.selectedArticle) {
      this.updateArticle();
    } else {
      this.createArticle();
    }
  }

  private updateArticle(): void {
    if (this.selectedArticle) {
      this.articleService.updateArticle(this.selectedArticle.id, this.articleForm.value).subscribe({
        next: () => {

          this.loadArticles();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating article:', error);
        }
      });
    }
  }

  private createArticle(): void {
    if (this.file) {
      const formData = new FormData();
      formData.append('title', this.articleForm.get('title')?.value);
      formData.append('content', this.articleForm.get('content')?.value);
      formData.append('image', this.file, this.file.name);

      this.articleService.createArticle(formData).subscribe({
        next: () => {

          this.loadArticles();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating article:', error);

        }
      });
    } else {
      console.error('No file selected');

    }
  }

  chat() {
    this.router.navigate(["chat"]);
  }

  // Delete an article
  deleteArticle(id: number): void {
    this.articleService.deleteArticle(id).subscribe(() => {
      this.loadArticles();
    });
  }

  get_profile() {
    this.router.navigate(["profile"]);
  }
  searchFriends() {
    this.router.navigate(["friends"]);
  }
  resetForm(): void {
    this.articleForm.reset();
    this.isEditMode = false;
    this.selectedArticle = undefined;

  }
  logout() {

    localStorage.clear();
    sessionStorage.clear();

    this.router.navigate(['/login']);
  }
}


