import { Injectable } from "@angular/core"; 
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http"
import { map } from "rxjs/operators"

@Injectable()
export class SpotifyService{
    private searchUrl: string= "";
    private artistUrl: string= "";
    private albumsUrl: string= "";
    private albumUrl: string= "";
    
    private token: string= "Bearer BQCGPgyjT8a0pHop2O4vynQCD5huEqAs0NoPgyMZc179Oms2HA43VmE6dN3nwDVN2UAROL69KjM0J4rvZg8mGqRAspa51Neg9KIjD1fsGfbQat78UFK6CTB_kSJ8NPypZi8Az7pVraGuTjR7bIRU2gUuZTqKnGBBognejuQ";

    private headers = new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', this.token);

    private market: string= "RO";
    private limit: number= 10;
    private offset: number= 0;


    constructor(private _http:HttpClient){      
    }
    
    searchMusic(str:string, type='track,artist'){
        console.log('https://api.spotify.com/v1/search?q=' + str + '&type='+ type +'&market=' + this.market + '&limit=' + this.limit + '&offset=' + this.offset);
        this.searchUrl = 'https://api.spotify.com/v1/search?q=' + str + '&type='+ type +'&market=' + this.market + '&limit=' + this.limit + '&offset=' + this.offset;
        return this._http
        .get<any>(this.searchUrl, { headers: this.headers })
        .pipe(map(res => JSON.stringify(res)));
    }
    
    getArtist(id:string){
        console.log('https://api.spotify.com/v1/artists/'+id);
        this.artistUrl = 'https://api.spotify.com/v1/artists/'+id;
        return this._http
        .get<any>(this.artistUrl, { headers: this.headers })
        .pipe(map(res => JSON.stringify(res)));
    }
    
    getAlbums(artistId:string){
        console.log('https://api.spotify.com/v1/artists/'+artistId+'/albums');
        this.albumsUrl = 'https://api.spotify.com/v1/artists/'+artistId+'/albums';
        return this._http
        .get<any>(this.albumsUrl, { headers: this.headers })
        .pipe(map(res => JSON.stringify(res)));
    }
    
    getAlbum(id:string){
        console.log('https://api.spotify.com/v1/albums/'+id);
        this.albumUrl = 'https://api.spotify.com/v1/albums/'+id;
        return this._http
        .get<any>(this.albumUrl, { headers: this.headers })
        .pipe(map(res => JSON.stringify(res)));
    }
}