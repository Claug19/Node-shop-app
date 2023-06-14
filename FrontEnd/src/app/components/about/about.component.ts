import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styles:[
    'h1 {color: #00ccff; top: +0.5em; font-size: 45px; font-weight: bold}',
  ]
})
export class AboutComponent {
  title = 'shop app about';
}
