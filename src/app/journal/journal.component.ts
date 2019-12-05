import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-regular-svg-icons'

import { JournalService } from './journal.service';

@Component({
  selector: 'journal',
  templateUrl: './journal.component.html',
  styleUrls: ['../../assets/scss/journal.scss']
})

export class JournalComponent {
    faPlus = faPlus;
    faSave = faSave;
    faTrashAlt = faTrashAlt;

    tasksSaved:Observable<any[]>;
    constructor(private afAuth:AngularFireAuth, private db: AngularFirestore,
        private journalService:JournalService) {
            const user = this.afAuth.auth.currentUser;
            if (user) {
                this.getUserTasks(user.uid);
            }
        }

    login() {
        this.afAuth.auth.signInAnonymously();
        this.afAuth.auth.onAuthStateChanged(user => {
            if (user)
                this.getUserTasks(user.uid);
        });
    }

    getUserTasks(uid:string) {
        this.tasksSaved = this.db.collection('notes').doc(uid).collection('tasks')
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const docId = a.payload.doc.id;
                    const data = a.payload.doc.data();
                    return { docId, ...data }
                }))
            );
        if (this.journalService.sessionTasks.length === 0)
            this.journalService.getTasks(uid);
    }

    markDone(docId:string) {
        const data = {
            accomplished: true
        }
        this.journalService.updateTask(docId, data);
    }

    saveBlock(input:any) {
        const docId = input.docId;
        if (docId) {
            const obj = {
                task: input.task
            }
            this.journalService.updateTask(docId, obj);
        } else {
            this.journalService.saveTask(input.task);
        }
    }

    addNewBlock() {
        this.journalService.addEmptyTask();
    }

    deleteBlock(i:number, docId:any) {
        this.journalService.removeTask(i, docId);
    }

    trackByFn(index:number, item:any) {
        return index;
    }

    ngOnDestroy() {
        this.journalService.subscriptions.forEach(s => s.unsubscribe());
    }
}
