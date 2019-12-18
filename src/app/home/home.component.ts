import { Component } from '@angular/core';
import { growthAnimation } from '../animations';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['../../assets/scss/home.scss'],
    animations: growthAnimation
})
export class HomeComponent {
    growthState:number = 1;
    timeoutVal:number = 1000;
    urlConstructor:string[] = ['url(\'../../assets/image/welcome_', '.png\')'];
    imageUrl:string = '';
    backImageUrl:string = '';

    timeoutCtrl = function() {
        setTimeout(() => {
            this.growthState += 1;
            this.imageUrl = this.urlConstructor.join(this.growthState);
            if (this.growthState == 2)
                this.timeoutVal = 2500;
            if (this.growthState < 4)
                this.timeoutCtrl();
        }, this.timeoutVal);
    }

    constructor() {}

    ngOnInit () {
        this.timeoutCtrl();
    }

    setBackImage() {
        if (this.growthState > 1) {
            setTimeout(() => this.backImageUrl = this.imageUrl, 200);
        }
    }
}
