import { Artist } from "./Artist";
import { Images } from "./Images";
import { Tracks } from "./Tracks";

export class Album{
    id:number = 0;
    name: string ="";
    images: Images[] = [];
    artists: Artist[] = [];
    tracks: any;
    release_date: string = "";
    external_urls: any;
}