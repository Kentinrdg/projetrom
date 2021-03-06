import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Spot } from '../models/spot.models';
import { SpotService } from '../services/spot.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { unescapeIdentifier } from '@angular/compiler';


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

  filesURLArray: string[] = [];

  username: string;

  shapes = [
    {id: '0', name: 'Marche'},
    {id: '1', name: 'Chill'},
    {id: '2', name: 'Peche'},
    {id: '3', name: 'Running'},
    {id: '4', name: 'Canoe'},
    {id: '5', name: 'Skate'},
    {id: '6', name: 'BMX'},
    {id: '7', name: 'VTT'},
    {id: '8', name: 'Autre'}
   ];

   @ViewChild('search')
   public searchElementRef: ElementRef;

  constructor(private formBuilder: FormBuilder, private spotService: SpotService,
    private router: Router,     private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
      this.getKey();
      this.initShape();
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
              this.lat = place.geometry.location.lat();
              this.lng = place.geometry.location.lng();
            });
          });
        });

        var userId = firebase.auth().currentUser.uid;
        return new Promise(
          (resolve, reject) => {
            firebase.database().ref('/users/' + userId).once('value').then(
              (snapshot) => {
                var username = (snapshot.val() && snapshot.val().pseudo);
                this.username = username;
                resolve(snapshot.val());
              }, (error) => {
                reject(error);
              }
            );
          }
        );
  }

  initShape() {
    this.currentSelectedValue = this.shapes[0].name;
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


    if (this.keyNum === undefined) {
      this.keyNum = 0;
    }

    const index = this.keyNum;

    console.log(index);
    console.log(titleSpot);
    console.log(descriptionSpot);
    console.log(typeSpot);
    console.log(latitudeSpot);
    console.log(longitudeSpot);

    const newSpot = new Spot(index, titleSpot, descriptionSpot, typeSpot, latitudeSpot, longitudeSpot, this.username);
    // Test si une photo est dispo

    if (this.filesURLArray.length > -1) {
      newSpot.photos = this.filesURLArray;
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

  onUploadFileArray(file: File) {
    if (file) {

        this.spotService.uploadFile(file).then(
          (url: string) => {
            this.filesURLArray.push(url);
            this.fileIsUploading = false;
            this.fileUploaded = true;
          }
        );
    }
  }



  detectFiles(event) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        this.onUploadFileArray(file);
       // this.filesArray.push(file);
      }
    }
    console.log(this.filesURLArray);
  }

}
