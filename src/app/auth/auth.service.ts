import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    authenticated = false;
    redirectUrl: string;

    login(): Observable<boolean> {
        return of(false).pipe(
            delay(1000),
            tap(val => this.authenticated = false)
        );
    }

    logout(): void {
        this.authenticated = false;
    }
}
