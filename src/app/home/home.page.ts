import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //npm install capacitor-voice-recorder
  //npm install cordova-sqlite-storage
  //npm install @awesome-cordova-plugins/sqlite
  //npm install @capacitor/filesystem
  
  items: any[] = [];
  recording: boolean = false;
  durationDisplay = '';
  duration = 0;
  isPlaying: false | any;
  audioRef: any;
  voiceduration: any;

  constructor(private platform: Platform, private router: Router, private databaseService: DatabaseService) {
    // this.platform.ready().then(() => {
    //   document.addEventListener('backbutton', this.onBackButton.bind(this));
    // });
    // VoiceRecorder.requestAudioRecordingPermission();
  }

  // ngOnInit() {
    // this.databaseService.createDatabase().then(() => {
    //   this.loadItems();
    // });
    // VoiceRecorder.requestAudioRecordingPermission();
  // }

  // toggleRecording() {
  //   if (this.recording) {
  //     this.stopRecording();
  //   } else {
  //     this.startRecording();
  //   }
  // }

  // loadItems() {
  //   this.databaseService.getItems().then((items) => {
  //     this.items = items;
  //     console.log(items);
  //   });
  // }

  //////////////////////////////////////////////////////////////////////////////////////

  // startRecording() {
  //   if (this.recording) {
  //     return;
  //   }
  //   this.recording = true;
  //   VoiceRecorder.startRecording().then(() => {
  //     console.log('Recording started.');
  //   });
  //   this.calculateDuration();
  // }

  // stopRecording() {
  //   if (!this.recording) {
  //     return;
  //   }
  //   VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
  //     this.recording = false;
  //     if (result.value && result.value.recordDataBase64) {
  //       const recordData = result.value.recordDataBase64;
  //       console.log("~ file: home.page.ts ~ line 47 ~ HomePage ~ VoiceRecorder.stopRecording ~ recordData", recordData);
  //       const fileName = new Date().getTime() + '.wav';
  //       //const blob = this.base64ToBlob(recordData, 'audio/wav');
  //       if (fileName) {
  //         this.databaseService.addItem(fileName, recordData).then(() => {
  //           this.loadItems();
  //         });
  //       }
  //     }
  //   })
  // }

  // calculateDuration() {
  //   if (!this.recording) {
  //     this.duration = 0;
  //     this.durationDisplay = ''
  //     return;
  //   }

  //   this.duration += 1;
  //   const minutes = Math.floor(this.duration / 60);
  //   const second = (this.duration % 60).toString().padStart(2, '0');
  //   this.durationDisplay = `${minutes}:${second}`
  //   setTimeout(() => {
  //     this.calculateDuration();
  //   }, 1000);
  // }

  // base64ToBlob(base64Data: string, contentType: string): Blob {
  //   const byteCharacters = atob(base64Data);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   return new Blob([byteArray], { type: contentType });
  // }

  //////////////////////////////////////////////////////////////////////////////////////

  // playFile(item: any) {
  //   if (this.audioRef) {
  //     this.audioRef.pause();
  //     this.audioRef.currentTime = 0;
  //   }
  //   this.audioRef = '';
  //   this.audioRef = new Audio(`data:audio/aac;base64,${item.url}`);
  //   this.voiceduration = this.audioRef.duration;
  //   this.audioRef.oncanplaythrough = () => {
  //     this.audioRef.play();
  //   };
  //   this.audioRef.load();
  // }

  // togglePause(i: any) {
  //   this.voiceduration = this.audioRef.duration;
  //   if (this.audioRef.paused) {
  //     this.audioRef.play();
  //     this.isPlaying = 'pause';
  //   } else {
  //     this.audioRef.pause();
  //     this.isPlaying = 'play';
  //   }
  // }

  // deleteRecording(item: any) {
  //   if (this.audioRef) {
  //     this.audioRef.pause();
  //   }
  //   this.databaseService.deleteItem(item.id).then(() => {
  //     this.loadItems();
  //   });
  // }

  //////////////////////////////////////////////////////////////////////////////////////

  // ionViewWillLeave() {
  //   if (this.audioRef) {
  //     this.audioRef.pause();
  //     this.audioRef.currentTime = 0;
  //   }
  //   this.audioRef = '';
  // }

  gopage() {
    this.router.navigate(['/contact']);
  }

  // onBackButton(event: Event) {
  //   if (window.location.pathname === '/home') {
  //     if (this.audioRef) {
  //       this.audioRef.pause();
  //       this.audioRef.currentTime = 0;
  //     }
  //     this.audioRef = '';
  //     event.preventDefault();
  //     App.exitApp();
  //   }
  // }
}