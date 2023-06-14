import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.services';
import { Artist } from 'src/Artist';
import { Album } from 'src/Album';
import { ActivatedRoute} from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-artist',
  templateUrl: 'artist.component.html',
  styles: [
    '.genre-span {position:relative; margin: 0.1em}'
  ]
})
export class ArtistComponent implements OnInit{
  id:string = "";
  artist: Artist = new Artist;
  albums: Album[] =[];


  constructor(private _spotifyService:SpotifyService, private _route:ActivatedRoute){
    
  }

  ngOnInit(){
    const initMap = this._route.params.pipe(map(params => params['id']));
    initMap.subscribe(id => {
            this._spotifyService.getArtist(id.toString())
                .subscribe(artist => {
                    this.artist = JSON.parse(artist);
                })
                
            this._spotifyService.getAlbums(id.toString())
                .subscribe(albums => {
                    this.albums = JSON.parse(albums).items;
                })
        })
  }
}
