export class Spot {
    photo: string;

    public titleSpot: string;
    public description: string;
    public typeSpot: string;
    public latitude: number;
    public longitude: number;

    constructor(titleSpot: string, description: string, typeSpot: string, latitude: number, longitude: number) {
        this.titleSpot = titleSpot;
        this.description = description;
        this.typeSpot = typeSpot;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}