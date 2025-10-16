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
  private readonly _isTorchOn = signal<boolean>(false);
  private readonly _isTorchAvailable = signal<boolean>(false);

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
   * Whether torch/flashlight is currently on
   */
  readonly isTorchOn = this._isTorchOn.asReadonly();

  /**
   * Whether torch/flashlight is available on current camera
   */
  readonly isTorchAvailable = this._isTorchAvailable.asReadonly();

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

      // Check if torch is available with a small delay to ensure video track is ready
      setTimeout(() => {
        this.checkTorchAvailability();
      }, 500);
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
      this._isTorchOn.set(false);
      this._isTorchAvailable.set(false);
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

  /**
   * Check if torch is available on current camera
   */
  private checkTorchAvailability(): void {
    if (!this.scanner || !this.isBrowser) {
      console.log('Cannot check torch - scanner not ready or not in browser');
      return;
    }

    // Get the element ID from the scanner
    const elementId = (this.scanner as any).elementId;
    console.log('Checking torch availability for element:', elementId);

    // Try multiple times to get the video element (it may not be ready immediately)
    let attempts = 0;
    const maxAttempts = 15;

    const checkVideo = (): void => {
      attempts++;
      console.log(`Attempt ${attempts}/${maxAttempts} to find video element...`);

      const videoElement = document.querySelector(`#${elementId} video`) as HTMLVideoElement;

      if (!videoElement) {
        console.log('Video element not found yet');
        if (attempts < maxAttempts) {
          setTimeout(checkVideo, 300);
        } else {
          console.log('Max attempts reached - video element not found');
          this._isTorchAvailable.set(false);
        }
        return;
      }

      if (!videoElement.srcObject) {
        console.log('Video srcObject not ready yet');
        if (attempts < maxAttempts) {
          setTimeout(checkVideo, 300);
        } else {
          console.log('Max attempts reached - srcObject not ready');
          this._isTorchAvailable.set(false);
        }
        return;
      }

      const stream = videoElement.srcObject as MediaStream;
      const tracks = stream.getVideoTracks();

      if (tracks.length === 0) {
        console.log('No video tracks found');
        if (attempts < maxAttempts) {
          setTimeout(checkVideo, 300);
        } else {
          this._isTorchAvailable.set(false);
        }
        return;
      }

      const track = tracks[0];
      const capabilities = track.getCapabilities() as any;

      console.log('✅ Video track found!');
      console.log('Track capabilities:', capabilities);
      console.log('Torch capability:', capabilities?.torch);

      if (capabilities?.torch === true) {
        this._isTorchAvailable.set(true);
        console.log('🔦 Torch is available!');
      } else {
        this._isTorchAvailable.set(false);
        console.log('❌ Torch not supported on this device');
      }
    };

    // Start checking
    checkVideo();
  }

  /**
   * Toggle torch on/off
   */
  async toggleTorch(): Promise<void> {
    if (!this.scanner || !this.isBrowser || !this._isTorchAvailable()) {
      console.log('Cannot toggle torch - not available');
      return;
    }

    try {
      const elementId = (this.scanner as any).elementId;
      const videoElement = document.querySelector(`#${elementId} video`) as HTMLVideoElement;

      if (videoElement?.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        const tracks = stream.getVideoTracks();

        if (tracks.length > 0) {
          const track = tracks[0];
          const newTorchState = !this._isTorchOn();

          console.log(`Toggling torch to: ${newTorchState}`);

          await track.applyConstraints({
            advanced: [{ torch: newTorchState } as any]
          });

          this._isTorchOn.set(newTorchState);
          console.log('Torch toggled successfully');
        }
      }
    } catch (error) {
      console.error('Failed to toggle torch:', error);
      this._error.set('Failed to toggle flashlight');
    }
  }
}
