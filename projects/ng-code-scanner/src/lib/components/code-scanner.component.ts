import { Component, input, output, signal, effect, OnDestroy, ChangeDetectionStrategy, ViewEncapsulation, inject, PLATFORM_ID, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CodeScannerService } from '../services/code-scanner.service';
import { ScannerConfig, ScanResult, CameraDevice } from '../models/scanner-config.model';

/**
 * Standalone component for barcode/QR code scanning
 *
 * @example
 * ```html
 * <ncs-code-scanner
 *   [config]="scannerConfig"
 *   [cameraId]="selectedCamera"
 *   [autoStart]="true"
 *   (scanSuccess)="onScanSuccess($event)"
 *   (scanError)="onScanError($event)">
 * </ncs-code-scanner>
 * ```
 */
@Component({
  selector: 'ncs-code-scanner',
  standalone: true,
  templateUrl: './code-scanner.component.html',
  styleUrls: ['./code-scanner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ncs-code-scanner]': 'true',
    '[class.ncs-scanning]': 'scannerService.isScanning()',
  }
})
export class CodeScannerComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private isDestroyed = false;

  protected readonly scannerService = inject(CodeScannerService);

  /**
   * Scanner configuration
   */
  readonly config = input<ScannerConfig>({});

  /**
   * Camera device ID to use (optional)
   */
  readonly cameraId = input<string | undefined>(undefined);

  /**
   * Whether to start scanning automatically
   */
  readonly autoStart = input<boolean>(false);

  /**
   * Show camera selection dropdown
   */
  readonly showCameraSelection = input<boolean>(true);

  /**
   * Show start/stop button
   */
  readonly showControls = input<boolean>(true);

  /**
   * Custom CSS class for the scanner container
   */
  readonly customClass = input<string>('');

  /**
   * Emitted when a code is successfully scanned
   */
  readonly scanSuccess = output<ScanResult>();

  /**
   * Emitted when an error occurs
   */
  readonly scanError = output<string>();

  /**
   * Emitted when scanning starts
   */
  readonly scanStarted = output<void>();

  /**
   * Emitted when scanning stops
   */
  readonly scanStopped = output<void>();

  protected readonly scannerId = `scanner-${Math.random().toString(36).substr(2, 9)}`;
  protected readonly selectedCamera = signal<string | undefined>(undefined);
  protected readonly isInitializing = signal<boolean>(false);

  constructor() {
    // Register cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.isDestroyed = true;
    });

    // Load cameras on initialization (browser only)
    effect(() => {
      if (this.isBrowser && this.showCameraSelection()) {
        this.loadCameras();
      }
    });

    // Auto-start if enabled (browser only)
    effect(() => {
      if (this.isBrowser && this.autoStart() && !this.scannerService.isScanning()) {
        this.startScanning();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopScanning();
  }

  protected async loadCameras(): Promise<void> {
    try {
      await this.scannerService.getCameras();
    } catch (error) {
      console.error('Failed to load cameras:', error);
    }
  }

  protected async startScanning(): Promise<void> {
    if (this.isDestroyed || this.scannerService.isScanning()) {
      return;
    }

    this.isInitializing.set(true);

    try {
      const cameraId = this.cameraId() ?? this.selectedCamera();

      await this.scannerService.startScanning(
        this.scannerId,
        cameraId,
        this.config(),
        (result: ScanResult) => {
          if (!this.isDestroyed) {
            this.scanSuccess.emit(result);
          }
        },
        (error: string) => {
          if (!this.isDestroyed) {
            this.scanError.emit(error);
          }
        }
      );

      if (!this.isDestroyed) {
        this.scanStarted.emit();
      }
    } catch (error) {
      if (!this.isDestroyed) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to start scanner';
        this.scanError.emit(errorMessage);
      }
    } finally {
      if (!this.isDestroyed) {
        this.isInitializing.set(false);
      }
    }
  }

  protected async stopScanning(): Promise<void> {
    try {
      await this.scannerService.stopScanning();
      if (!this.isDestroyed) {
        this.scanStopped.emit();
      }
    } catch (error) {
      if (!this.isDestroyed) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to stop scanner';
        this.scanError.emit(errorMessage);
      }
    }
  }

  protected onCameraChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCamera.set(select.value);

    if (this.scannerService.isScanning()) {
      this.stopScanning().then(() => {
        this.startScanning();
      });
    }
  }

  protected async toggleTorch(): Promise<void> {
    await this.scannerService.toggleTorch();
  }
}
