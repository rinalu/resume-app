import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-regular-svg-icons'

import { JournalService } from './journal.service';
import { stateChangeAnimation } from '../animations';

@Component({
    selector: 'journal',
    templateUrl: './journal.component.html',
    styleUrls: ['../../assets/scss/journal.scss'],
    animations: stateChangeAnimation
})

export class JournalComponent {
    faPlus = faPlus;
    faSave = faSave;
    faTrashAlt = faTrashAlt;

    tasksSaved:Observable<any[]>;
    userState:Boolean = false;
    constructor(private afAuth:AngularFireAuth, public journalService:JournalService) {
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
        this.userState = true;
        if (this.journalService.sessionTasks.length === 0)
            this.tasksSaved = this.journalService.getTasks(uid);
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
        this.journalService.subscriptions.map(s => s.unsubscribe());
    }
}
