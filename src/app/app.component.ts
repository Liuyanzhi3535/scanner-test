import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  videoControl = new FormControl();
  @ViewChild('video') video!: ElementRef;
  deviceOptions: MediaDeviceInfo[] = [];
  stream!: MediaStream;

  ngOnInit(): void {
    // this.ensurePermission().then(() => {
    //   navigator.mediaDevices
    //     .enumerateDevices()
    //     .then((deviceInfos) => this.gotVideos(deviceInfos));
    // });

    // this.videoControl.valueChanges.subscribe((value) => {
    //   if (this.stream) {
    //     this.stream.getTracks().forEach((track) => {
    //       track.stop();
    //     });
    //   }

    //   if (!value) return;
    //   navigator.mediaDevices
    //     .getUserMedia({
    //       audio: false,
    //       video: { deviceId: value ? { exact: value } : undefined },
    //     })
    //     .then((stream) => {
    //       this.stream = stream;
    //       this.video.nativeElement.srcObject = stream;
    //     })
    //     .catch();
    // });
  }

  ensurePermission() {
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
  }

  gotVideos(deviceInfos: MediaDeviceInfo[]) {
    console.log(JSON.stringify(deviceInfos));
    this.deviceOptions = deviceInfos.filter(
      (deviceInfo) => deviceInfo.kind === 'videoinput'
    );
  }
}
