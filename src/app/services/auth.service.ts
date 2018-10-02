import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from '../models/user.models';
import { Subject } from 'rxjs';

@Injectable()
export class MyAuthService {

  user: User[] = [];
  userSubject = new Subject<User[]>();
  constructor() { }

  // Creation d'un nouvel utilisateur.
  createNewUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        // Méthode FireBase permettant l'auth avec email et mot de passe.
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
}

// Connexion d'un utilisateur existant.
signInUser(email: string, password: string) {
  return new Promise(
    (resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    }
  );
}

// Méthode pour la déconnexion de l'utilisateur.
signOutUser() {
  firebase.auth().signOut();
}

// Personnal connexion
saveUser() {
  firebase.database().ref('/users').set(this.user);
}

createNewPersonnalUser(newUser: User) {
  this.user.push(newUser);
  this.saveUser();
  this.emitUser();
}

emitUser() {
  this.userSubject.next(this.user);
}

}
