import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { AboutService } from './about.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['../../assets/scss/about.scss']
})

export class AboutComponent {
    faCaretRight = faCaretRight;

    constructor(public aboutService: AboutService, private db: AngularFirestore) {
        aboutService.getSkills();
        aboutService.getExperiences();
    }

    ngOnDestroy() {
        this.aboutService.subscriptions.map(e => e.unsubscribe());
    }
}
