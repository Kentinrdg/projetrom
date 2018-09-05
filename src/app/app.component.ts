import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ShareYourSpot !';
  description = 'Le seul site permettant de partagez ces bons spots.';
  isAuth: boolean;

  constructor() {
    var config = {
      apiKey: "AIzaSyCbbXj1-y5fQ_olBabmMM-69DTHwq9Hbb0",
      authDomain: "projectrom-214211.firebaseapp.com",
      databaseURL: "https://projectrom-214211.firebaseio.com",
      projectId: "projectrom-214211",
      storageBucket: "projectrom-214211.appspot.com",
      messagingSenderId: "374490757855"
    };
    firebase.initializeApp(config);
  }
}
