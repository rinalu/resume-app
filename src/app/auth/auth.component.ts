import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

import { AuthService } from './auth.service';

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['../../assets/scss/auth.scss']
})

export class AuthComponent {
    items: Observable<any[]>;
    constructor(
        private authService: AuthService, private db: AngularFirestore,
        public router: Router
    ) {}

    ngOnInit() {
        this.items= this.db.collection('/users').valueChanges();
    }

    login() {
        this.authService.login().subscribe(() => {

            if (this.authService.authenticated) {
                let redirectUrl = this.authService.redirectUrl ?
                this.router.parseUrl(this.authService.redirectUrl) : '/home';

                this.router.navigateByUrl(redirectUrl);
            }
        });
    }
}
