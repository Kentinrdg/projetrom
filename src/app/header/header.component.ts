import { Component, OnInit } from '@angular/core';
import { MyAuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { User } from '../models/user.models';

  @Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
  })
export class HeaderComponent implements OnInit {

  isAuth: boolean;
  myUser: User;

  constructor(private router: Router, private authService: MyAuthService) { }

  ngOnInit() {
    // Savoir si auth est connecté
    // Si true auth
    // Sinon false non co
    // Observable dectect utilisateur retourner par serveur.
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.isAuth = true;

           /**    // Updates the user attributes:

              user.updateProfile({ // <-- Update Method here

                displayName: 'NEW USER NAME',
                photoURL: 'none'

              }).then(function() {

                // Profile updated successfully!
                //  "NEW USER NAME"

                var displayName = user.displayName;
                // "https://example.com/jane-q-user/profile.jpg"
              //  var photoURL = user.photoURL;

              }, function(error) {
                // An error happened.
              });**/
              this.myUser = this.authService.getCustomUser();
             // const email = this.myUser.email;
             // const city = this.myUser.city;
             // const pseudo = this.myUser.pseudo;

              firebase.database().ref('/users').child(user.uid).set(this.myUser);

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

  mySpace() {
    this.router.navigate(['myaccount']);
  }

}