import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { HelperService } from '../services/helper.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService, private helperService: HelperService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      let currentUserRole = this.helperService.getRole();
      if (route.data.permission) {
        if (this.helperService.hasViewPermission(route.data.permission)) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }

      if (route.data.roles && route.data.roles.indexOf(currentUserRole) === -1) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
