import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {

  email: any;
  username: any;
  city: any;

  constructor() { }

  ngOnInit() {
    var userId = firebase.auth().currentUser.uid;

    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/users/' + userId).once('value').then(
          (snapshot) => {
            var username = (snapshot.val() && snapshot.val().pseudo);
            var email = (snapshot.val() && snapshot.val().email);
            var city = (snapshot.val() && snapshot.val().city);

            console.log('trrryy');
            console.log(username);
            console.log(email);
            console.log(city);
      
            this.username = username;
            this.email = email;
            this.city = city;

            resolve(snapshot.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  trySomething() {

  }

}
