export class User {
    photo: string;

    public email: string;
    public pseudo: string;
    public city: string;

   constructor(email: string, pseudo: string, city: string) {
        this.email = email;
        this.pseudo = pseudo;
        this.city = city;
    }
}