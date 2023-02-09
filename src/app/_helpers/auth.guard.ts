import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@app/_services/authentication.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  public token = localStorage.getItem('token');
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const isAuthenticated = this.authenticationService.isLoggedIn;
    if (isAuthenticated) {
      const currentTime = Math.floor((new Date()).getTime() / 1000);
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const { exp } = payload;
      if (exp > currentTime) {
        return true
      } else {
        this.authenticationService.logout();
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
