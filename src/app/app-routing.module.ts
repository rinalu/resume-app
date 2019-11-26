import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { AboutComponent } from './about/about.component';
import { JournalComponent } from './journal/journal.component';
import { AuthComponent } from './auth/auth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent
    },
    {
        path: 'about',
        canActivate: [AuthGuard],
        component: AboutComponent
    },
    {
        path: 'journal',
        component: JournalComponent
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes,
            { enableTracing: false } //debug purpose
        )
    ],
    providers: [AuthGuard],
    exports: [RouterModule]
})
export class AppRoutingModule { }
