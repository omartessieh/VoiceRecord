import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  recording = false;
  storedFileNames: string[] = [];
  durationDisplay = '';

  audioRef: HTMLAudioElement | any;
  isPlaying = false;
  currentFile: any;
  currentTime: { [key: string]: number } = {};
  duration = 0;

  constructor(private platform: Platform, private router: Router) {
    this.platform.ready().then(() => {
      document.addEventListener('backbutton', this.onBackButton.bind(this));
    });
    VoiceRecorder.requestAudioRecordingPermission();
  }

  ngOnInit() {
    this.loadFiles();
    VoiceRecorder.requestAudioRecordingPermission();
  }

  async loadFiles() {
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result => {
      this.storedFileNames = result.files.map(file => file.name);
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  toggleRecording() {
    if (this.recording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    if (this.recording) {
      return;
    }
    this.recording = true;
    VoiceRecorder.startRecording().then(() => {
      console.log('Recording started.');
    });
    this.calculateDuration();
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }

    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      this.recording = false;
      if (result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        console.log(recordData);
        const fileName = new Date().getTime() + '.wav';
        await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Data,
          data: recordData
        });
        this.loadFiles();
      }
    })
  }

  calculateDuration() {
    if (!this.recording) {
      this.duration = 0;
      this.durationDisplay = ''
      return;
    }

    this.duration += 1;
    const minutes = Math.floor(this.duration / 60);
    const second = (this.duration % 60).toString().padStart(2, '0');
    this.durationDisplay = `${minutes}:${second}`
    setTimeout(() => {
      this.calculateDuration();
    }, 1000);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  async play(filename: string) {
    try {
      if (this.audioRef && this.currentFile === filename) {
        if (this.isPlaying) {
          this.audioRef.pause();
        } else {
          this.audioRef.play();
        }
        this.isPlaying = !this.isPlaying;
      } else {
        if (this.audioRef) {
          this.audioRef.pause();
        }

        const audioFile = await Filesystem.readFile({
          path: filename,
          directory: Directory.Data,
        });

        const base64Sound = audioFile.data;

        this.audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`);
        this.audioRef.oncanplaythrough = () => {
          this.duration = this.audioRef.duration;
          this.audioRef.play();
        };
        this.audioRef.load();
        this.currentFile = filename;
        this.isPlaying = true;
        this.updateProgress(filename);

        this.audioRef.addEventListener('ended', () => {
          this.isPlaying = false;
          this.currentTime[filename] = 0;
          this.updateProgress(filename);
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  seek(newValue: number, filename: string) {
    if (this.audioRef && this.currentFile === filename) {
      let duration = this.audioRef.duration;
      this.audioRef.currentTime = duration * (newValue / 100);
    }
  }

  updateProgress(filename: string) {
    if (this.audioRef && this.currentFile === filename) {
      let currentTime = this.audioRef.currentTime;
      let duration = this.audioRef.duration;
      this.currentTime[filename] = (currentTime / duration) * 100 || 0;
      if (currentTime >= duration) {
        this.currentTime[filename] = 0;
      }
      setTimeout(() => {
        this.updateProgress(filename);
      }, 100);
    }
  }

  async deleteFile(filename: string) {
    try {
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data,
      });
      console.log('Audio file deleted:', filename);
      this.loadFiles();
    } catch (error) {
      console.error('Error deleting audio file:', error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  ngOnDestroy() {
    if (this.audioRef) {
      this.audioRef.pause();
      this.audioRef = null;
    }

    this.platform.backButton.unsubscribe();
    if (this.audioRef) {
      this.audioRef.pause();
      this.audioRef = null;
      this.isPlaying = false;
      this.currentTime[this.currentFile] = 0;
    }
  }

  gopage() {
    if (this.audioRef) {
      this.audioRef.pause();
      this.audioRef = null;
      this.isPlaying = false;
      this.currentTime[this.currentFile] = 0;
    }
    this.router.navigate(['/home']);
  }

  onBackButton(event: Event) {
    if (window.location.pathname === '/contact') {
      if (this.audioRef) {
        this.audioRef.pause();
        this.audioRef = null;
        this.isPlaying = false;
        this.currentTime[this.currentFile] = 0;
      }
      event.preventDefault();
      App.exitApp();
    }
  }

}