import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('signupForm') signupForm!: NgForm;

  // User registration fields
  username = '';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  terms = false;

  // Profile fields
  profileForm = {
    bio: '',
    location: '',
    profile_pic: ''
  };
  selectedFile: File | null = null;

  submitted = false;
  message = '';
  userCreated = false;
  loggedIn = false;

  // Custom validation getters
  get passwordMismatch(): boolean {
    return this.password !== this.confirmPassword && this.confirmPassword.length > 0;
  }

  get passwordStrengthError(): boolean {
    if (!this.password) return false;
    const hasUpperCase = /[A-Z]/.test(this.password);
    const hasLowerCase = /[a-z]/.test(this.password);
    const hasNumber = /[0-9]/.test(this.password);
    return !(hasUpperCase && hasLowerCase && hasNumber);
  }

  constructor(
    private userService: UserService,
    private loginService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  onSubmit() {
    this.submitted = true;
    if (this.signupForm.valid && !this.passwordMismatch && !this.passwordStrengthError && this.terms) {
      this.createUser();
    }
  }

  createUser() {
    const user = {
      id: 0,
      username: this.username,
      email: this.email,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName,
    };
    this.userService.createUser(user).subscribe({
      next: (response) => {
        console.log('User created successfully', response);
        this.userCreated = true;
        this.message = 'User created successfully! Now log in below to create your profile.';
      },
      error: (error) => {
        console.error('Error creating user', error);
        this.message = 'Error creating user. Please try again.';
      }
    });
  }

  login() {
    this.loginService.login(this.username, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access);
        this.loggedIn = true;
        this.message = 'Logged in! Now create your profile.';
        console.log(res.access);
      },
      error: (err) => {
        this.message = 'Wrong username or password!!';
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.profileForm.profile_pic = file;
  }

  submitProfile(): void {
    if (!this.profileForm.location) {
      alert('Location is required');
      return;
    }

    const formData = new FormData();
    formData.append('bio', this.profileForm.bio);
    formData.append('location', this.profileForm.location);

    if (this.profileForm.profile_pic) {
      formData.append('profile_pic', this.profileForm.profile_pic);
    }

    this.http.post('http://127.0.0.1:8000/profile/', formData)
      .pipe(
        catchError(error => {
          console.error('Error submitting profile:', error);
          if (error.error && error.error.error) {
            alert(error.error.error);
          } else {
            alert('An unexpected error occurred. Please try again.');
          }
          return throwError(error);
        })
      )
      .subscribe(
        (response: any) => {
          console.log('Profile created/updated successfully:', response);
          this.router.navigate(['feed']);
        }
      );
  }
}
