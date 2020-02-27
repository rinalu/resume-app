import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot, RouterStateSnapshot, Router
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JournalAuthGuard implements CanActivate {
    constructor(private afAuth: AngularFireAuth, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
            let url: string = state.url;
            return this.checkAuth(url);
    }

    checkAuth(url: string): boolean {
        if (this.afAuth.auth.currentUser) {
            return true;
        }
        this.router.navigate(['journal']);
        return false;
    }
}
