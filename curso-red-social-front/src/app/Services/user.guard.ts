import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let identity = this.userService.parseStoredUser();
    if (identity && (identity.role == 'ROLE_USER')) return true;
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
