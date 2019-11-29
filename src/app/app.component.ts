import { Component, ViewChild, HostListener } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['../assets/scss/app.scss']
})

export class AppComponent {
    @ViewChild('stickyNav', {static: true}) public navbarElement;
    @HostListener('window:scroll', ['$event'])
    handleScroll(event:any) {
        const curPosition = window.pageYOffset;
        if (curPosition > 0 && curPosition >= this.navbarPosition) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    };

    navbarPosition: any;
    isSticky: boolean = false;
    navbarCollapsed: boolean = true;

    title = 'Rina\'s Playground';
    ngAfterViewInit() {
        this.navbarPosition = this.navbarElement.nativeElement.offsetTop;
    }
}
