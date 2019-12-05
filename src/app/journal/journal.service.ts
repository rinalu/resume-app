import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class JournalService {
    sessionTasks:any[] = [];
    uid:string = '';
    subscriptions:Subscription[] = [];
    private collectionRef:AngularFirestoreCollection<any>;
    constructor(private db: AngularFirestore, private afAuth:AngularFireAuth) {}

    getTasks(uid:string):void {
        this.uid = uid;
        this.collectionRef = this.db.collection('notes').doc(uid).collection('tasks');
        this.subscriptions.push(this.collectionRef.get().pipe(
            map(snapshot => {
                snapshot.forEach(e => {
                    this.sessionTasks.push({ docId: e.id, ...e.data() });
                });
            }),
        ).subscribe());
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
