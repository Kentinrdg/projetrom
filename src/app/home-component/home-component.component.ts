import { Component, OnInit } from '@angular/core';
import { MyAuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  isAuth: boolean;

  constructor(private authService: MyAuthService, private router: Router) { }

  ngOnInit() {
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

  goToSignUp() {
    this.router.navigate(['signup']);
  }

  goToConnexion() {
    this.router.navigate(['authentification']);
  }

}
