import { Component } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.services';
import { Artist } from 'src/Artist';

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styles: [
    'h1 { position: relative;  text-align: center; color: #00ccff; top: +0.5em; font-size: 45px; font-weight: bold}',
    'pre {position: relative; text-align: center; color: #d1e0e0; top: +1.5em; font-size: 15px; font-weight: bold}',
    'input {position: relative; width: 360px;}',
    'button {position:relative; top: +1.5em;}',
    '.search-div{width: 100%; text-align:center}',
    '#search{ margin-left: ; position: relative}',
    '.search-result {position:relative; top: +2em;}',
    '.list-entry {position:relative; margin: 0.3em}',
    '.genre-span {position:relative; margin: 0.1em}'
  ]
})

export class SearchComponent {
  searchStr:string = "";
  searchRes: Artist[] = [];


  constructor(private _SpotifyService:SpotifyService)
  {

  }

  searchMusic()
  {
    this._SpotifyService.
      searchMusic(this.searchStr)
        .subscribe((res => { this.searchRes = JSON.parse(res).artists.items}))
  };
  title = 'spotify-angular';
}
