export class Spot {
    photo: string;
    photos: string[];

    public index: number;
    public titleSpot: string;
    public description: string;
    public typeSpot: string;
    public latitude: number;
    public longitude: number;
    public author: string; 

   constructor(index: number, titleSpot: string, description: string, typeSpot: string, latitude: number, longitude: number,
    author: string) {
        this.index = index;
        this.titleSpot = titleSpot;
        this.description = description;
        this.typeSpot = typeSpot;
        this.latitude = latitude;
        this.longitude = longitude;
        this.author = author;
    }
}