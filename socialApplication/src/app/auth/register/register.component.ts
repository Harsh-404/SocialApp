import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { catchError, first, last, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  Register: regob;

  profileForm = {
    bio: '',
    location: '',
    profile_pic: ''
  };
  selectedFile: File | null = null;
  loginForm!: FormGroup;
  message = '';

  constructor(private formBuilder: FormBuilder, private loginService: AuthService, private router: Router, private userService: UserService, private http: HttpClient) {
    this.Register = new regob();
  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }


  createUser() {

    const user = {
      id: this.Register.id,
      username: this.Register.username,
      email: this.Register.email,
      password: this.Register.password,
      first_name: this.Register.first_name,
      last_name: this.Register.last_name,
    }
    this.userService.createUser(user).subscribe(
      response => {
        console.log('User created successfully', response);
        alert("User created Successfully!! Now Login below!")
      },
      error => {
        console.error('Error creating user', error);
      }
    );
  }

  login() {
    const formValue = this.loginForm.value
    this.loginService.login(formValue.username, formValue.password).subscribe({
      next: (res) => {
        alert("Now create a profile")
        localStorage.setItem('token', res.access)
        console.log(res.access)
      }, error: (err) => {
        this.message = 'Wrong username or password!!'
      }
    })
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
          this.router.navigate(["feed"]);
        }
      );
  }
}



export class regob {
  id: number;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  constructor() {
    this.id = 0;
    this.username = "";
    this.email = "";
    this.password = "";
    this.first_name = "";
    this.last_name = "";
  }
}



