import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

import { AuthService } from './auth.service';

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['../../assets/scss/auth.scss']
})

export class AuthComponent {
    @ViewChild('authModal', {static: true}) private authModal;

    faQuestionCircle = faQuestionCircle;
    companyName: string;
    explainText: string;
    modalInstance: any;
    items: Observable<any[]>;
    constructor(
        private authService: AuthService, private db: AngularFirestore,
        private modalService: NgbModal, public router: Router
    ) {
        this.explainText = "This authentication is used to limit access to \
            resume view to companies only, while the content matches exactly\
            with the submitted application."
    }

    ngOnInit() {
        this.modalInstance = this.modalService.open(this.authModal, {
            centered: true,
            keyboard: false,
            backdrop: 'static'
        });
    }

    login() {
        this.authService.getCompany(this.companyName).subscribe(
            (res:any) => {
                if (res.length == 1) {
                    let redirectUrl = this.authService.redirectUrl ?
                    this.router.parseUrl(this.authService.redirectUrl) : '/home';

                    this.authService.docId = res.id;
                    this.authService.usage = res.usage;
                    this.authService.authenticated = true;

                    this.modalInstance.close();
                    this.router.navigateByUrl(redirectUrl);
                }
            },
            (err) => {},
            () => {
                // this.authService.updateUsage();
            }
        );
    }
}
