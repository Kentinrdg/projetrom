import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { SpotService } from '../services/spot.service';
import { ActivatedRoute, Router, Resolve } from '@angular/router';
import { Spot } from '../models/spot.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-showactivity',
  templateUrl: './showactivity.component.html',
  styleUrls: ['./showactivity.component.css']
})

export class ShowactivityComponent implements OnInit {

  titleSpot: string;
  description: string;
  typeSpot: string;
  latitude: number;
  longitude: number;

  lat: any;
  lng: any;

  spot: Spot[];
  spotSubscription: Subscription;

  marker: any;

  myLat: number;
  myLng: number;

  public spots: Spot[] = [];

  currentSelectedValue: string;
  shapes = [
    {id: '0', name: 'Tous'},
    {id: '1', name: 'Marche'},
    {id: '2', name: 'Chill'},
    {id: '3', name: 'Peche'},
    {id: '4', name: 'Running'},
    {id: '5', name: 'Canoe'},
    {id: '6', name: 'Skate'},
    {id: '7', name: 'BMX'},
    {id: '8', name: 'VTT'},
    {id: '9', name: 'Autre'}
   ];


  constructor(private route: ActivatedRoute, private spotService: SpotService, private router: Router) {

  }

  initShape() {
    this.currentSelectedValue = this.shapes[0].name;
  }

  changeShape(shape) {
    this.currentSelectedValue = this.shapes[shape.value].name.toLowerCase();

    if (this.currentSelectedValue === 'tous') {
      this.getSpots();
    }
    this.getTypedSpot(this.currentSelectedValue);
  }

  getTypedSpot(name: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/spots/').once('value').then(
          (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
 
         /*
           console.log('Début de spot');
           console.log(childData.titleSpot);
           console.log(childData.description);
           console.log(childData.typeSpot);
           console.log(childData.latitude);
           console.log(childData.longitude);
           console.log('Fin de spot');
         */
        const spotType = childData.typeSpot.toLowerCase();
        this.spots = [];
        if (spotType === name) {

          console.log(spotType);
          console.log('===================');
          console.log(name);

           this.spots.push(new Spot(childData.index, childData.titleSpot,
            childData.description, childData.typeSpot, childData.latitude, childData.longitude, childData.author));
           }
            });
 
            resolve(snapshot.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  getSpots() {
   return new Promise(
     (resolve, reject) => {
       firebase.database().ref('/spots/').once('value').then(
         (snapshot) => {
           snapshot.forEach((childSnapshot) => {
             var key = childSnapshot.key;
             var childData = childSnapshot.val();

        /*
          console.log('Début de spot');
          console.log(childData.titleSpot);
          console.log(childData.description);
          console.log(childData.typeSpot);
          console.log(childData.latitude);
          console.log(childData.longitude);
          console.log('Fin de spot');
        */

          this.spots.push(new Spot(childData.index, childData.titleSpot,
           childData.description, childData.typeSpot, childData.latitude, childData.longitude, childData.author));
           });

           resolve(snapshot.val());
         }, (error) => {
           reject(error);
         }
       );
     }
   );
  }

  clickedSpot(id: number) {
    this.router.navigate(['/singlespot', id]);
  }

  ngOnInit() {
    this.getSpots();
    this.getCurrentPosition();

    //test
    this.spotSubscription = this.spotService.spotSubject.subscribe(
      (spots: Spot[]) => {
        this.spot = spots;
      }
    );
    this.spotService.emitSpots();
  }



  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
  }
}
