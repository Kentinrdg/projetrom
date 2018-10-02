export class User {
    photo: string;
    photos: string[];

    public email: string;
    public password: string;
    public pseudo: string;

   constructor(email: string, password: string, pseudo: string) {
        this.email = email;
        this.password = password;
        this.pseudo = pseudo;
    }
}