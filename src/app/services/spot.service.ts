import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Spot } from '../models/spot.models';
import * as firebase from 'firebase';

@Injectable()
export class SpotService {

  spot: Spot[] = [];
  spotSubject = new Subject<Spot[]>();

  constructor() {
    this.getSpots();
}

  emitSpots() {
    this.spotSubject.next(this.spot);
  }

  saveSpots() {
    firebase.database().ref('/spots').set(this.spot);
}

getSpots() {
  firebase.database().ref('/spots')
    .on('value', (data) => {
        this.spot = data.val() ? data.val() : [];
        this.emitSpots();
      }
    );
}

  getGetSpots() {
    return firebase.database().ref('/spots').on('value', (data) => {
      this.spot = data.val() ? data.val() : [];
    });
  }

getSingleSpot(id: number) {
  return new Promise(
    (resolve, reject) => {
      firebase.database().ref('/spots/' + id).once('value').then(
        (data) => {
          resolve(data.val());
        }, (error) => {
          reject(error);
        }
      );
    }
  );
}

createNewSpot(newSpot: Spot) {
  this.spot.push(newSpot);
  this.saveSpots();
  this.emitSpots();
}

removeSpot(spot: Spot) {
  if (spot.photo) {
    const storageRef = firebase.storage().refFromURL(spot.photo);
    storageRef.delete().then(
      () => {
        console.log('Photo removed!');
      },
      (error) => {
        console.log('Could not remove photo! : ' + error);
      }
    );
  }
  const spotIndexToRemove = this.spot.findIndex(
    (spotEl) => {
      if (spotEl === spot) {
        return true;
      }
    }
  );
  this.spot.splice(spotIndexToRemove, 1);
  this.saveSpots();
  this.emitSpots();
}

// Permet l'upload de photo
uploadFile(file: File) {
  return new Promise(
    (resolve, reject) => {
      const almostUniqueFileName = Date.now().toString();
      const upload = firebase.storage().ref()
        .child('images/' + almostUniqueFileName + file.name).put(file);
      upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
        () => {
          console.log('Chargement…');
        },
        (error) => {
          console.log('Erreur de chargement ! : ' + error);
          reject();
        },
        () => {
        //  resolve(upload.snapshot.downloadURL);
        resolve(upload.snapshot.ref.getDownloadURL());
        }
      );
    }
  );
}
}