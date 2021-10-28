import { Injectable } from '@angular/core';
import { AnalyzerService } from './analyzer.service';

@Injectable({
  providedIn: 'root',
})
export class ScannerService {
  constructor(private analyzer:AnalyzerService) {}

  start() {}

  stop() {}

  private scan() {
    // 截圖頻率

    // 截圖

    // 回傳結果
  }
}
