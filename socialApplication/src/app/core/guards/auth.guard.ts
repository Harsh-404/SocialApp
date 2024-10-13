import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const isAuthenticated = this.authService.isLoggedIn(); // Assuming isLoggedIn() returns a boolean

        if (!isAuthenticated) {
            this.router.navigate(['/login']); // Redirect to login page if not authenticated
            alert("Sign In first!!");
            return false;
        }
        return true;
    }
}
