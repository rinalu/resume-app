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
            ref.where('name', '==', companyName.toLowerCase()).limit(1))
            .snapshotChanges().pipe(map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
            })));
    }

    updateUsage(): void {
        this.db.doc('companies/' + this.docId).update({
            usage: this.usage + 1
        });
    }
}
