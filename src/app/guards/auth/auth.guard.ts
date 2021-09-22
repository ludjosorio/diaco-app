import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    /* if (!this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      this.events.publish('session:auth', { auth: 'logout' });
      return false;
    } */
    return true;
  }

}
