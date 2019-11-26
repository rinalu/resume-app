import { Injectable } from '@angular/core';
import { Observable, Subscription, merge } from 'rxjs';
import { flatMap, concatMap, map, groupBy, mergeMap, scan, tap, filter } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AboutService {
    skillList: string[] = [];
    experienceList: any[] = [];
    subscriptions: Subscription[] = [];

    private expIds:string[] = [];
    constructor(private db: AngularFirestore) {}

    getSkills(): void {
        if (this.skillList.length > 0)
            return;
        this.subscriptions.push(this.db.collection('skills', ref =>
            ref.where('type', '==', 'software').orderBy('importance'))
            .valueChanges().subscribe((res:any) => {
                res.forEach(e => {
                    e.skills.unshift(e.tag);
                    this.skillList.push(e.skills);
                });
            })
        );
    }

    getExperiences(): void {
        // do nothing if experienceList contains data
        if (this.experienceList.length > 0)
            return;

        let d_len = 0;
        this.subscriptions.push(this.db.collectionGroup('details', ref => ref.orderBy('rank')).snapshotChanges().pipe(
            flatMap(actions => actions.map((a:any) => {
                const id = a.payload.doc.ref.parent.parent.id;
                const data = a.payload.doc.data();
                if (data.details_length)
                    d_len = data.details_length + 1;
                return { id, ...data };
            })),
            groupBy(p => p.id, p => p.detail),
            mergeMap(group$ => group$.pipe(
                // reduce: outputs on stream complete, but snapshotChanges doesn't complete
                scan((acc, cur) => [...acc, cur], [group$.key]),
            )),
            map((arr:string[]) => {
                if (arr.length == d_len)
                    return { id: arr[0], details: arr.slice(1) };
            }),
            // output only data with id attribute set to find parent doc data
            filter((res:any) => res && res.id),
            concatMap((details:any) => {
                if (details) {
                    const curId = details.id;
                    if (this.expIds.findIndex(e => e === curId) === -1) {
                        this.expIds.push(curId);
                        return merge(this.db.collection('experiences').doc(curId).get())
                            .pipe(map(doc => {
                                let data = doc.data();
                                data.start_date = new Date(data.start_date.seconds*1000);
                                data.end_date = new Date(data.end_date.seconds*1000);
                                return { ...details, ...data };
                            }));
                    }
                }
            }),
        ).subscribe(res => {
            this.experienceList.splice(res.importance - 1, 0, res);
        }));
    }
}
