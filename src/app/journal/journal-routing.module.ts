import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JournalAuthGuard } from './journal-auth/journal-auth.guard';
import { JournalAuthComponent } from './journal-auth/journal-auth.component';
import { JournalEditComponent } from './journal-edit/journal-edit.component';
import { JournalComponent } from './journal.component';

const journalRoutes: Routes = [
    {
        path: 'journal',
        component: JournalComponent,
        children: [
            {
                path: '',
                component: JournalAuthComponent,
            },
            {
                path: 'edit',
                component: JournalEditComponent,
                canActivate: [ JournalAuthGuard ]
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(journalRoutes)
    ],
    exports: [ RouterModule ]
})
export class JournalRoutingModule {}
