import { Component, OnInit } from '@angular/core';
import { MyAuthService } from '../services/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;

  constructor(private authService: MyAuthService) { }

  ngOnInit() {
    // Savoir si auth est connecté
    // Si true auth
    // Sinon false non co
    // Observable dectect utilisateur retourner par serveur.
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );
  }

  // Permet de ce déconnecté
  // Appel du service
  onSignOut() {
    this.authService.signOutUser();
  }

}