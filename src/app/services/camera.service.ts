import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  stream?: MediaStream | null;
  constructor() {}

  async start(deviceId: string) {
    let constraints: MediaStreamConstraints | undefined = {
      audio: false,
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        width: { min: 1024, ideal: 1280, max: 1920 },
      },
    };

    this.stream = await this.wrapErrors(async () => {
      return await navigator.mediaDevices.getUserMedia(constraints);
    });

    return this.stream;
  }

  private async ensureAccess() {
    return await this.wrapErrors(async () => {
      let access = await navigator.mediaDevices.getUserMedia({ video: true });
      for (let stream of access.getVideoTracks()) {
        stream.stop();
      }
    });
  }

  private async wrapErrors(fn: () => any) {
    try {
      return await fn();
    } catch (e: any) {
      throw e;
    }
  }

  stop() {
    if (!this.stream) {
      return;
    }

    for (let stream of this.stream.getVideoTracks()) {
      stream.stop();
    }

    this.stream = null;
  }

  async getCameras() {
    await this.ensureAccess();

    let devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === 'videoinput')
      .map(({ deviceId, label }, i) => ({
        id: deviceId,
        name: label || 'camera' + i,
      }));
  }
}
