import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  // Form fields
  username = '';
  password = '';
  rememberMe = false;

  submitted = false;
  message = '';

  constructor(
    private loginService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.loginService.login(this.username, this.password).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.access);
          this.router.navigate(['/feed']);
        },
        error: (err) => {
          this.message = 'Wrong username or password!!';
        }
      });
    }
  }

  register() {
    this.router.navigate(['register']);
  }
}