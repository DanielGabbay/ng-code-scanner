# ng-code-scanner Workspace# NgCodeScannerWorkspace



This workspace contains the **ng-code-scanner** Angular library and a demo application.This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.1.



## What's Included## Development server



- 📦 **ng-code-scanner**: A modern Angular 20+ library for barcode and QR code scanningTo start a local development server, run:

- 🎨 **demo**: A demo application showcasing the library features

```bash

## Quick Startng serve

```

### Installation

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

```bash

npm install## Code scaffolding

```

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

### Build the Library

```bash

```bashng generate component component-name

ng build ng-code-scanner```

```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

The built library will be available in `dist/ng-code-scanner/`.

```bash

### Run the Demong generate --help

```

```bash

ng serve demo## Building

```

To build the project run:

Then navigate to `http://localhost:4200/` to see the demo in action.

```bash

## Library Featuresng build

```

- ✅ Modern Angular 20+ with Signals

- ✅ Standalone ComponentsThis will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

- ✅ Multiple Barcode Formats (QR Code, EAN, UPC, Code 128, etc.)

- ✅ Camera Selection## Running unit tests

- ✅ File Scanning

- ✅ TypeScript SupportTo execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

- ✅ Customizable Configuration

- ✅ Responsive Design```bash

ng test

## Project Structure```



```## Running end-to-end tests

ng-code-scanner-workspace/

├── projects/For end-to-end (e2e) testing, run:

│   ├── ng-code-scanner/          # The library

│   │   ├── src/```bash

│   │   │   ├── lib/ng e2e

│   │   │   │   ├── components/   # CodeScannerComponent```

│   │   │   │   ├── services/     # CodeScannerService

│   │   │   │   └── models/       # TypeScript interfacesAngular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

│   │   │   └── public-api.ts

│   │   └── README.md## Additional Resources

│   └── demo/                      # Demo application

│       └── src/For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

└── dist/                          # Built library output
```

## Usage Example

```typescript
import { Component } from '@angular/core';
import { CodeScannerComponent, ScanResult } from 'ng-code-scanner';

@Component({
  selector: 'app-root',
  imports: [CodeScannerComponent],
  template: `
    <ncs-code-scanner
      [autoStart]="true"
      (scanSuccess)="onScanSuccess($event)">
    </ncs-code-scanner>
  `
})
export class AppComponent {
  onScanSuccess(result: ScanResult) {
    console.log('Scanned:', result.decodedText);
  }
}
```

## Development

### Watch Mode for Library

```bash
ng build ng-code-scanner --watch
```

### Run Tests

```bash
ng test ng-code-scanner
```

## Publishing

1. Build the library:
   ```bash
   ng build ng-code-scanner
   ```

2. Navigate to the dist folder:
   ```bash
   cd dist/ng-code-scanner
   ```

3. Update package.json with your npm package details

4. Publish to npm:
   ```bash
   npm publish
   ```

## Documentation

For detailed documentation, see the [library README](projects/ng-code-scanner/README.md).

## License

MIT

## Credits

Built on top of [html5-qrcode](https://github.com/mebjas/html5-qrcode) by Minhaz.
