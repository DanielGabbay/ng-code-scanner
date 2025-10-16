# ng-code-scanner# NgCodeScanner



Angular library for barcode and QR code scanning. A modern Angular wrapper for [html5-qrcode](https://scanapp.org/html5-qrcode-docs/) with Signal-based state management and full TypeScript support.This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.0.



## Features## Code scaffolding



- ✅ **Modern Angular 20+**: Built with signals, standalone components, and latest Angular featuresAngular CLI includes powerful code scaffolding tools. To generate a new component, run:

- ✅ **Multiple Barcode Formats**: QR Code, EAN, UPC, Code 128, and more

- ✅ **Camera Selection**: Choose between multiple cameras on the device```bash

- ✅ **File Scanning**: Scan codes from image filesng generate component component-name

- ✅ **Reactive State Management**: Signal-based state with computed properties```

- ✅ **TypeScript**: Full type safety and IntelliSense support

- ✅ **Customizable**: Extensive configuration optionsFor a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

- ✅ **Responsive**: Works on desktop and mobile devices

```bash

## Installationng generate --help

```

```bash

npm install ng-code-scanner html5-qrcode## Building

```

To build the library, run:

## Quick Start

```bash

### Import the Componentng build ng-code-scanner

```

```typescript

import { Component } from '@angular/core';This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

import { CodeScannerComponent, ScanResult } from 'ng-code-scanner';

### Publishing the Library

@Component({

  selector: 'app-root',Once the project is built, you can publish your library by following these steps:

  imports: [CodeScannerComponent],

  template: `1. Navigate to the `dist` directory:

    <ncs-code-scanner   ```bash

      [autoStart]="true"   cd dist/ng-code-scanner

      (scanSuccess)="onScanSuccess($event)">   ```

    </ncs-code-scanner>

  `2. Run the `npm publish` command to publish your library to the npm registry:

})   ```bash

export class AppComponent {   npm publish

  onScanSuccess(result: ScanResult) {   ```

    console.log('Scanned:', result.decodedText);

  }## Running unit tests

}

```To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:



### Advanced Configuration```bash

ng test

```typescript```

import { Component, signal } from '@angular/core';

import { CodeScannerComponent, ScannerConfig, Html5QrcodeSupportedFormats } from 'ng-code-scanner';## Running end-to-end tests



@Component({For end-to-end (e2e) testing, run:

  selector: 'app-scanner',

  imports: [CodeScannerComponent],```bash

  template: `ng e2e

    <ncs-code-scanner```

      [config]="scannerConfig()"

      [cameraId]="selectedCamera()"Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

      [showCameraSelection]="true"

      [showControls]="true"## Additional Resources

      (scanSuccess)="onScanSuccess($event)"

      (scanError)="onScanError($event)"For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

      (scanStarted)="onScanStarted()"
      (scanStopped)="onScanStopped()">
    </ncs-code-scanner>
  `
})
export class ScannerComponent {
  protected readonly selectedCamera = signal<string | undefined>(undefined);
  protected readonly scannerConfig = signal<ScannerConfig>({
    fps: 10,
    qrbox: 250,
    formatsToSupport: [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.CODE_128
    ],
    showTorchButtonIfSupported: true, // Show torch button on supported devices
    aspectRatio: 1.0
  });

  onScanSuccess(result: ScanResult) {
    console.log('Scanned successfully:', result.decodedText);
  }

  onScanError(error: string) {
    console.error('Scan error:', error);
  }

  onScanStarted() {
    console.log('Scanner started');
  }

  onScanStopped() {
    console.log('Scanner stopped');
  }
}
```

### Using the Service Directly

```typescript
import { Component, inject, signal } from '@angular/core';
import { CodeScannerService, ScannerConfig } from 'ng-code-scanner';

@Component({
  selector: 'app-custom-scanner',
  template: `
    <div id="scanner"></div>
    <button (click)="startScan()">Start</button>
    <button (click)="stopScan()">Stop</button>
    
    @if (scannerService.isScanning()) {
      <p>Scanning...</p>
    }
    
    @if (scannerService.lastScanResult()) {
      <p>Result: {{ scannerService.lastScanResult()?.decodedText }}</p>
    }
  `
})
export class CustomScannerComponent {
  protected readonly scannerService = inject(CodeScannerService);

  async startScan() {
    await this.scannerService.startScanning(
      'scanner',
      undefined,
      { fps: 10, qrbox: 250 },
      (result) => console.log('Scanned:', result.decodedText)
    );
  }

  async stopScan() {
    await this.scannerService.stopScanning();
  }
}
```

### File Scanning

```typescript
import { Component, inject, signal } from '@angular/core';
import { CodeScannerService } from 'ng-code-scanner';

@Component({
  selector: 'app-file-scanner',
  template: `
    <input 
      type="file" 
      accept="image/*" 
      (change)="onFileSelected($event)">
    
    @if (result()) {
      <p>Scanned: {{ result() }}</p>
    }
  `
})
export class FileScannerComponent {
  private readonly scannerService = inject(CodeScannerService);
  protected readonly result = signal<string | null>(null);

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      try {
        const scanResult = await this.scannerService.scanFile(file);
        this.result.set(scanResult.decodedText);
      } catch (error) {
        console.error('Failed to scan file:', error);
      }
    }
  }
}
```

## API Reference

### CodeScannerComponent

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `config` | `ScannerConfig` | `{}` | Scanner configuration options |
| `cameraId` | `string \| undefined` | `undefined` | Specific camera device ID |
| `preferredFacingMode` | `'user' \| 'environment'` | `'environment'` | Preferred camera facing mode (front/back) |
| `autoStart` | `boolean` | `false` | Start scanning automatically |
| `showCameraSelection` | `boolean` | `true` | Show camera selection dropdown |
| `showControls` | `boolean` | `true` | Show start/stop buttons |
| `customClass` | `string` | `''` | Custom CSS class |

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `scanSuccess` | `ScanResult` | Emitted on successful scan |
| `scanError` | `string` | Emitted on error |
| `scanStarted` | `void` | Emitted when scanning starts |
| `scanStopped` | `void` | Emitted when scanning stops |

### ScannerConfig

```typescript
interface ScannerConfig {
  fps?: number;                              // Frames per second (default: 10)
  qrbox?: number | { width: number; height: number }; // Scan box size (default: 250)
  formatsToSupport?: Html5QrcodeSupportedFormats[];  // Barcode formats to scan
  verbose?: boolean;                         // Enable verbose logging
  aspectRatio?: number;                      // Video aspect ratio
  disableFlip?: boolean;                     // Disable mirror effect
  videoConstraints?: MediaTrackConstraints;  // Camera constraints
  showTorchButtonIfSupported?: boolean;      // Show torch button if available
}
```

### Supported Formats

- QR_CODE
- AZTEC
- CODABAR
- CODE_39, CODE_93, CODE_128
- DATA_MATRIX
- EAN_13, EAN_8
- UPC_A, UPC_E
- PDF_417
- ITF
- And more...

## Styling

The component comes with default styles that can be customized:

```css
/* Override default styles */
.ncs-scanner-container {
  max-width: 600px;
}

.ncs-btn-start {
  background-color: #your-color;
}

.ncs-scanner-view {
  border-radius: 12px;
}
```

### Container Sizing

The scanner component is designed to fit exactly to the width and height of its parent container without overflow. To ensure proper sizing:

```html
<!-- Define a container with specific dimensions -->
<div style="width: 500px; height: 400px;">
  <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
</div>
```

Or with CSS:

```css
.scanner-wrapper {
  width: 100%;
  height: 500px; /* Or use vh units: height: 80vh; */
}
```

```html
<div class="scanner-wrapper">
  <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
</div>
```

**Important Notes:**
- The parent container must have an explicit height defined
- The component will automatically adapt to fill 100% of the parent's width and height
- Video will use `object-fit: contain` to maintain aspect ratio without distortion
- All content (camera selector, controls, error messages) will fit within the container without overflow

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with camera access

## Requirements

- Angular 20+
- html5-qrcode 2.3.8+

## Development

### Build the library

```bash
ng build ng-code-scanner
```

### Run tests

```bash
ng test ng-code-scanner
```

### Publish to npm

```bash
cd dist/ng-code-scanner
npm publish
```

## License

MIT

## Credits

Built on top of [html5-qrcode](https://github.com/mebjas/html5-qrcode) by Minhaz.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
