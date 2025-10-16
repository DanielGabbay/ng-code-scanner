import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { ScannerConfig, ScanResult, CameraDevice } from '../models/scanner-config.model';

/**
 * Service for managing barcode/QR code scanning functionality
 */
@Injectable({
  providedIn: 'root'
})
export class CodeScannerService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private scanner: Html5Qrcode | null = null;
  private readonly _isScanning = signal<boolean>(false);
  private readonly _lastScanResult = signal<ScanResult | null>(null);
  private readonly _error = signal<string | null>(null);
  private readonly _availableCameras = signal<CameraDevice[]>([]);

  /**
   * Whether the scanner is currently active
   */
  readonly isScanning = this._isScanning.asReadonly();

  /**
   * Last successful scan result
   */
  readonly lastScanResult = this._lastScanResult.asReadonly();

  /**
   * Last error message
   */
  readonly error = this._error.asReadonly();

  /**
   * Available camera devices
   */
  readonly availableCameras = this._availableCameras.asReadonly();

  /**
   * Whether cameras are available
   */
  readonly hasCameras = computed(() => this._availableCameras().length > 0);

  /**
   * Get list of available cameras
   */
  async getCameras(): Promise<CameraDevice[]> {
    if (!this.isBrowser) {
      return [];
    }

    try {
      const devices = await Html5Qrcode.getCameras();
      const cameras: CameraDevice[] = devices.map(device => ({
        id: device.id,
        label: device.label || `Camera ${device.id}`
      }));
      this._availableCameras.set(cameras);
      return cameras;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get cameras';
      this._error.set(errorMessage);
      throw error;
    }
  }

  /**
   * Start scanning with the specified camera
   * @param elementId HTML element ID where scanner should be rendered
   * @param cameraId Camera device ID (optional, uses default if not provided)
   * @param config Scanner configuration
   * @param onSuccess Callback for successful scans
   * @param onError Callback for scan errors (optional)
   */
  async startScanning(
    elementId: string,
    cameraId: string | undefined,
    config: ScannerConfig = {},
    onSuccess: (result: ScanResult) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!this.isBrowser) {
      throw new Error('Scanner is only available in browser environment');
    }

    if (this._isScanning()) {
      throw new Error('Scanner is already running');
    }

    try {
      this.scanner = new Html5Qrcode(elementId);

      const qrCodeConfig = {
        fps: config.fps ?? 10,
        qrbox: config.qrbox ?? 250,
        aspectRatio: config.aspectRatio,
        disableFlip: config.disableFlip ?? false,
        videoConstraints: config.videoConstraints,
        showTorchButtonIfSupported: config.showTorchButtonIfSupported ?? false,
        formatsToSupport: config.formatsToSupport,
      };

      await this.scanner.start(
        cameraId ?? { facingMode: 'environment' },
        qrCodeConfig,
        (decodedText, result) => {
          const scanResult: ScanResult = { decodedText, result };
          this._lastScanResult.set(scanResult);
          this._error.set(null);
          onSuccess(scanResult);
        },
        (errorMessage) => {
          if (onError) {
            onError(errorMessage);
          }
        }
      );

      this._isScanning.set(true);
      this._error.set(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start scanner';
      this._error.set(errorMessage);
      throw error;
    }
  }

  /**
   * Stop the currently running scanner
   */
  async stopScanning(): Promise<void> {
    if (!this.scanner || !this._isScanning()) {
      return;
    }

    try {
      await this.scanner.stop();
      this.scanner.clear();
      this.scanner = null;
      this._isScanning.set(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop scanner';
      this._error.set(errorMessage);
      throw error;
    }
  }

  /**
   * Scan an image file
   * @param file Image file to scan
   * @param config Scanner configuration
   */
  async scanFile(file: File, config: ScannerConfig = {}): Promise<ScanResult> {
    if (!this.isBrowser) {
      throw new Error('File scanning is only available in browser environment');
    }

    try {
      const html5QrCode = new Html5Qrcode('temp-file-scanner', {
        formatsToSupport: config.formatsToSupport,
        verbose: config.verbose ?? false
      });

      const result = await html5QrCode.scanFile(file, true);
      const scanResult: ScanResult = {
        decodedText: result,
        result: result
      };

      this._lastScanResult.set(scanResult);
      this._error.set(null);

      return scanResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan file';
      this._error.set(errorMessage);
      throw error;
    }
  }

  /**
   * Clear the last scan result and error
   */
  clearResults(): void {
    this._lastScanResult.set(null);
    this._error.set(null);
  }
}
