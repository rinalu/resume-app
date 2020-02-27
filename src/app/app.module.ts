import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { JournalModule } from './journal/journal.module';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        AboutComponent,
        HomeComponent,
        PageNotFoundComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        NgbModule,
        FontAwesomeModule,
        JournalModule,
        AngularFireAuthModule,
        AngularFireModule.initializeApp(environment.firebase, 'resume-app'),
        AngularFirestoreModule,
        AppRoutingModule,
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
