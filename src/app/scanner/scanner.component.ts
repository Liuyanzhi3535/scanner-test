import { mapTo, startWith } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromEvent, merge, Subscription } from 'rxjs';
import { CameraService } from '../services/camera.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnInit {
  videoControl = new FormControl();
  @ViewChild('video') video!: ElementRef;
  cameraOptions: {
    id: string;
    name: string;
  }[] = [];

  maskControl = new FormControl('1d');
  maskSize = { height: 0, width: 0 };

  @ViewChild('croped') cnv!: ElementRef<HTMLCanvasElement>;

  subscriptions = new Subscription();

  constructor(private camera: CameraService) {}

  ngOnInit(): void {
    this.camera.getCameras().then((cameras) => (this.cameraOptions = cameras));

    this.subscriptions.add(
      this.videoControl.valueChanges.subscribe((id) => {
        this.setCamera(id);
        if (id) {
          this.snapshot();
        }
      })
    );

  }

  ngAfterViewInit(): void {
    this.subscriptions.add(
      merge(
        this.maskControl.valueChanges,
        fromEvent(
          this.video.nativeElement as HTMLVideoElement,
          'canplay'
        ).pipe(mapTo(this.maskControl.value)),
        fromEvent(
          window,
          'resize'
        ).pipe(mapTo(this.maskControl.value))
      ).subscribe(() => {
        this.setMaskSize(this.maskControl.value);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setCamera(id: string) {
    if (id) {
      this.camera.start(id).then((stream) => {
        this.video.nativeElement.srcObject = stream;
      });
    } else {
      this.camera.stop();
    }
  }

  setScanner() {}

  snapshot() {
    if (this.videoControl.value !== '') {
      requestAnimationFrame(this.snapshot.bind(this));
    }
    console.log('shot');

    const { videoWidth, videoHeight } = this.video
      .nativeElement as HTMLVideoElement;

    // const cropedWidth = videoWidth * 1;
    // const cropedHeight = 100;

    this.cnv.nativeElement.width = this.maskSize.width;
    this.cnv.nativeElement.height = this.maskSize.height;
    let ctx = this.cnv.nativeElement.getContext('2d');
    ctx?.drawImage(
      this.video.nativeElement,
      videoWidth / 2 - this.maskSize.width / 2,
      videoHeight / 2 - this.maskSize.height / 2,
      this.maskSize.width,
      this.maskSize.height,
      0,
      0,
      this.maskSize.width,
      this.maskSize.height
    );
  }

  setMaskSize(value: '1d' | '2d') {
    const { videoWidth, videoHeight } = this.video
      .nativeElement as HTMLVideoElement;

    switch (value) {
      case '1d':
        this.maskSize = {
          height: 200,
          width: videoWidth * 1,
        };

        break;
      case '2d':
        this.maskSize = {
          height: 300,
          width: 300,
        };
        break;
    }
  }
}
