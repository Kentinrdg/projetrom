import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Spot } from '../models/spot.models';
import { SpotService } from '../services/spot.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-createactivity',
  templateUrl: './createactivity.component.html',
  styleUrls: ['./createactivity.component.css']
})
export class CreateactivityComponent implements OnInit {
  
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

  shapes = [
    {id:'0', name:'Marche'},
    {id:'1', name:'Chill'},
    {id:'2', name:'Peche'},
    {id:'3', name:'Autre'},
   ];

  constructor(private formBuilder: FormBuilder, private booksService: SpotService,
    private router: Router) {
  }

  ngOnInit() {
    this.getCurrentPosition();
    this.initForm();
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

  onSaveSpot() {
    const titleSpot = this.spotForm.get('titleSpot').value;
    const descriptionSpot = this.spotForm.get('descriptionSpot').value;
    const typeSpot = this.currentSelectedValue;
    const latitudeSpot = this.lat;
    const longitudeSpot = this.lng;

    console.log(titleSpot);
    console.log(descriptionSpot);
    console.log(typeSpot);
    console.log(latitudeSpot);
    console.log(longitudeSpot);

    const newSpot = new Spot(titleSpot, descriptionSpot, typeSpot, latitudeSpot, longitudeSpot);
    // Test si une photo est dispo
    if (this.fileUrl && this.fileUrl !== '') {
      newSpot.photo = this.fileUrl;
      }
    this.booksService.createNewSpot(newSpot);
    this.router.navigate(['showactivity']);
  }

    // Upload photo
    onUploadFile(file: File) {
      this.fileIsUploading = true;
      this.booksService.uploadFile(file).then(
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
