import { Injectable } from '@angular/core';
import { Observable, Subscription, merge, from } from 'rxjs';
import { flatMap, concatMap, map, groupBy, mergeMap, scan, tap, filter, reduce } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AboutService {
    skillList: any[] = [];
    experienceList: any[] = [];
    subscriptions: Subscription[] = [];

    constructor(private db: AngularFirestore) {}

    getSkills(): void {
        if (this.skillList.length > 0)
            return;
        this.subscriptions.push(this.db.collection('skills', ref =>
            ref.where('type', '==', 'software').orderBy('importance')).get()
            .pipe(map(snapshot => snapshot.docs.map(e => {
                    const data = e.data();
                    return [data.tag, ...data.skills];
                }))
            ).subscribe(res => this.skillList = res)
        );
    }

    getExperiences():void {
        // do nothing if experienceList contains data
        if (this.experienceList.length > 0)
            return;
        let expSub = this.db.collection('experiences', ref => ref.orderBy('importance')).get()
            .pipe(flatMap(snapshot => {
                let exps = snapshot.docs.map(doc => {
                    let data = doc.data();
                    data.start_date = new Date(data.start_date.seconds*1000);
                    data.end_date = new Date(data.end_date.seconds*1000);
                    return { id: doc.id, ...data, details: [] };
                });
                return this.db.collectionGroup('details', ref => ref.orderBy('rank')).get()
                    .pipe(map(snapshot =>
                        snapshot.docs.map(doc => {
                            const parent = doc.ref.parent.parent.id;
                            const detail = doc.data().detail;
                            return { parent, detail };
                        }).reduce((acc, cur) => {
                            const id = cur.parent;
                            const index = acc.findIndex(e => e.id === id);
                            if (~index) {
                                acc[index].details.push(cur.detail);
                            }
                            return acc;
                        }, exps)
                    ));
                }),
            ).subscribe(res => this.experienceList = res);
        this.subscriptions.push(expSub);
    }
}
