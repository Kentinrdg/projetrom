import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotService } from '../services/spot.service';
import { Spot } from '../models/spot.models';

@Component({
  selector: 'app-singlespot',
  templateUrl: './singlespot.component.html',
  styleUrls: ['./singlespot.component.css']
})
export class SinglespotComponent implements OnInit {

  spot: Spot;

  lat: number;
  lng: number;

  constructor(private route: ActivatedRoute, private spotService: SpotService,
    private router: Router) {
     }

  ngOnInit() {
    this.spot = new Spot(0, '', '', '', 0, 0);
    const id = this.route.snapshot.params['id'];
    this.spotService.getSingleSpot(+id).then(
      (spot: Spot) => {
        this.spot = spot;
      }
    );
    this.getCurrentPosition();
  }

  onBack() {
    this.router.navigate(['/showactivity']);
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
  }

}
