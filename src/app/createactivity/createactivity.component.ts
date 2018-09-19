import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Spot } from '../models/spot.models';
import { SpotService } from '../services/spot.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';



@Component({
  selector: 'app-createactivity',
  templateUrl: './createactivity.component.html',
  styleUrls: ['./createactivity.component.css']
})
export class CreateactivityComponent implements OnInit {

  public searchControl: FormControl;

  spotForm: FormGroup;
  public pos: any;
  lat: any;
  lng: any;

  latitudeInput: any;
  longitudeInput: any;

  currentSelectedValue: string;

  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;

  keyNum: number;

  shapes = [
    {id: '0', name: 'Marche'},
    {id: '1', name: 'Chill'},
    {id: '2', name: 'Peche'},
    {id: '3', name: 'Autre'},
   ];

   @ViewChild('search')
   public searchElementRef: ElementRef;

  constructor(private formBuilder: FormBuilder, private spotService: SpotService,
    private router: Router,     private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
      this.getKey();
  }

  ngOnInit() {
    this.getCurrentPosition();
    this.initForm();

    this.searchControl = new FormControl();
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
          const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ['address']
          });
          autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    
              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
    
              //set latitude, longitude and zoom
             /** this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.zoom = 12;**/
            });
          });
        });
  }

  changeShape(shape) {
    this.currentSelectedValue = this.shapes[shape.value].name;
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
  }

  initForm() {
    this.spotForm = this.formBuilder.group({
      titleSpot: ['', Validators.required],
      descriptionSpot: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log(this.latitudeInput);
    console.log(this.longitudeInput);
    this.lat = this.latitudeInput;
    this.lng = this.longitudeInput;
  }

  onChoseLocation(event) {
    console.log(event);
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }

  getKey() {
    firebase.database().ref('/spots').limitToLast(1).on('child_added', (data) => {
      this.keyNum = +data.key + 1;
    });
  }

  onSaveSpot() {
    const titleSpot = this.spotForm.get('titleSpot').value;
    const descriptionSpot = this.spotForm.get('descriptionSpot').value;
    const typeSpot = this.currentSelectedValue;
    const latitudeSpot = this.lat;
    const longitudeSpot = this.lng;
    const index = this.keyNum;

    console.log(index);
    console.log(titleSpot);
    console.log(descriptionSpot);
    console.log(typeSpot);
    console.log(latitudeSpot);
    console.log(longitudeSpot);

    const newSpot = new Spot(index, titleSpot, descriptionSpot, typeSpot, latitudeSpot, longitudeSpot);
    // Test si une photo est dispo
    console.log(this.fileUrl);
    if (this.fileUrl && this.fileUrl !== '') {
      newSpot.photo = this.fileUrl;
      }

    this.spotService.createNewSpot(newSpot);
    this.router.navigate(['showactivity']);
  }

    // Upload photo
    onUploadFile(file: File) {
      this.fileIsUploading = true;
      this.spotService.uploadFile(file).then(
        (url: string) => {
          this.fileUrl = url;
          this.fileIsUploading = false;
          this.fileUploaded = true;
        }
      );
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }

}
