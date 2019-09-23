import { Component } from '@angular/core';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'header-comp',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent {
  faUser = faUserCircle;
}
