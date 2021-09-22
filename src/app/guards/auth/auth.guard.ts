import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public router: Router,
  ) { }


  canActivate(): boolean {
    const auth = JSON.parse(window.localStorage.getItem('auth'));
    if (!auth || !auth?.id) {
      this.router.navigateByUrl('/auth/signin');
      return false;
    }
    return true;
  }

}
