import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  loginForm!: FormGroup;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  login() {
    const formValue = this.loginForm.value
    this.loginService.login(formValue.username, formValue.password).subscribe({
      next: (res) => {

        localStorage.setItem('token', res.access)
        this.router.navigate(['/feed'])
        console.log(res.access)
      }, error: (err) => {
        this.message = 'Wrong username or password!!'
      }
    })
  }
  register() {
    this.router.navigate(["register"])
  }

}