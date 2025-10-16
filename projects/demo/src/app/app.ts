import { Component, signal } from '@angular/core';
import { CodeScannerComponent, Html5QrcodeSupportedFormats } from '../../../ng-code-scanner/src/public-api';
import type { ScanResult, ScannerConfig } from '../../../ng-code-scanner/src/public-api';

@Component({
  selector: 'app-root',
  imports: [CodeScannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'ng-code-scanner Demo';
  protected readonly scanResults = signal<ScanResult[]>([]);
  protected readonly lastError = signal<string | null>(null);

  protected readonly scannerConfig = signal<ScannerConfig>({
    fps: 10,
    qrbox: { width: 250, height: 250 },
    showTorchButtonIfSupported: true,
    formatsToSupport: [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
    ]
  });

  protected onScanSuccess(result: ScanResult): void {
    console.log('Scan success:', result);
    this.scanResults.update(results => [result, ...results.slice(0, 9)]);
    this.lastError.set(null);
  }

  protected onScanError(error: string): void {
    console.error('Scan error:', error);
    this.lastError.set(error);
  }

  protected onScanStarted(): void {
    console.log('Scanner started');
  }

  protected onScanStopped(): void {
    console.log('Scanner stopped');
  }

  protected clearResults(): void {
    this.scanResults.set([]);
    this.lastError.set(null);
  }
}
