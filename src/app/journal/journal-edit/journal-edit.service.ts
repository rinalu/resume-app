import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class JournalEditService {
    sessionTasks:any[] = [];
    subscriptions:Subscription[] = [];

    private uid:string = '';
    private collectionRef:AngularFirestoreCollection<any>;
    constructor(private db: AngularFirestore) {}

    getTasks(uid:string): Observable<any[]> {
        this.uid = uid;
        this.collectionRef = this.db.collection('notes').doc(uid).collection('tasks');
        this.subscriptions.push(this.collectionRef.get().pipe(map(snapshot =>
            snapshot.docs.map(e => ({ docId: e.id, ...e.data() })))
        ).subscribe(res => this.sessionTasks = res));
        return this.collectionRef.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const docId = a.payload.doc.id;
                const data = a.payload.doc.data();
                return { docId, ...data }
            }))
        );
    }

    removeTask(i:number, docId:any):void {
        this.sessionTasks.splice(i, 1);
        // if task has id, remove from database as well
        if (docId) {
            this.collectionRef.doc(docId).delete();
        }
    }

    updateTask(id:string, obj:any):void {
        this.collectionRef.doc(id).update(obj);
    }

    saveTask(text:string):void {
        const newTask = {
            created_by: this.uid,
            task: text,
            timestamp: new Date(),
            accomplished: false,
        }
        this.collectionRef.add(newTask);
    }

    addEmptyTask():void {
        this.sessionTasks.push({
            task: ''
        });
    }
}
