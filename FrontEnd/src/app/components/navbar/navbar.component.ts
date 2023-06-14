import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styles: [
    '.logo { position: relative; top: -5px; }'
  ]
})
export class NavbarComponent {
  title = 'spotify-angular';
}
