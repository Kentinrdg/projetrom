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

  constructor(private route: ActivatedRoute, private spotService: SpotService, private router: Router) {

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
           childData.description, childData.typeSpot, childData.latitude, childData.longitude));
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
        //console.log(spots.length);
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
