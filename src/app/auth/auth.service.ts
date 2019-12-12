import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    redirectUrl: string;
    docId: string;
    usage: number;

    authenticated = false;
    constructor(private db: AngularFirestore) {}

    getCompany(companyName: string): Observable<any> {
        return this.db.collection('companies', ref =>
            ref.where('name', '==', companyName.toLowerCase()).limit(1)).get()
            .pipe(map(snapshot => {
                snapshot.forEach(e => {
                    const data = e.data();
                    const id = e.id;
                    this.usage = data.usage;
                    this.docId = id;
                    this.authenticated = true;
                    return { id, ...data }
                })
            }));
    }

    updateUsage(): void {
        if (this.authenticated) {
            this.db.doc('companies/' + this.docId).update({
                usage: this.usage + 1
            });
        }
    }
}
