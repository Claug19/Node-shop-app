import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { map } from 'rxjs/operators';


import { SpotifyService } from 'src/app/services/spotify.services';
import { Album } from 'src/Album';

@Component({
    selector: 'album',
    templateUrl: 'album.component.html',
    styles:[
      'h1 {color: #00cc66; font-size: 40px; font-weight: bold}',
      'h2 {color: #0066ff; top: +0.5em; font-size: 30px; font-weight: bold}',
      '.list-entry {position:relative; margin: 0.3em}',
    ]
})
export class AlbumComponent { 
    id: string = "";
    album: Album = new Album;
    
    constructor(private _spotifyService:SpotifyService, private _route:ActivatedRoute){
        
    }
    
     ngOnInit(){
      const initMap = this._route.params.pipe(map(params => params['id']));
        initMap.subscribe((id) => {
                this._spotifyService.getAlbum(id)
                    .subscribe(album => {
                        this.album = JSON.parse(album);
                    })                               
            })
    }
}
