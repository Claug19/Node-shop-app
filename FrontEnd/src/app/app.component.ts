import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<navbar></navbar>
  <div class="container">
	<router-outlet></router-outlet>
	</div>
  `,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spotify-angular';
}
