import {Album} from './Album';
import { Images } from './Images';

export class Artist{
    id: number = 0;
    name: string ="";
    images: Images[] = [];
    genres:any;
    albums: Album[] = [];
}