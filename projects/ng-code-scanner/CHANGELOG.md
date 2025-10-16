# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-10-16

### Changed
- **Container Sizing Improvements**: Scanner component now automatically adapts to 100% width and height of parent container
- Updated CSS to use flexbox for proper container sizing without overflow
- Removed fixed `min-height` in favor of responsive height based on parent container
- Added `:host` styling to ensure component fills parent container properly
- Video/canvas elements now use `object-fit: contain` to maintain aspect ratio

### Documentation
- Added container sizing documentation to README
- Added Hebrew documentation for container sizing in SUMMARY_HE.md
- Updated demo app to showcase proper container sizing with explicit height

## [1.0.0] - 2025-10-16 (Initial Release)

### Added
- Initial release of ng-code-scanner
- `CodeScannerComponent` - Standalone Angular component for scanning barcodes and QR codes
- `CodeScannerService` - Service for programmatic control of scanning functionality
- Signal-based state management (isScanning, lastScanResult, error, availableCameras)
- Support for multiple barcode formats (QR Code, EAN, UPC, Code 128, etc.)
- Camera selection functionality
- File scanning capability
- Customizable configuration options
- Full TypeScript support with comprehensive type definitions
- Responsive design with default styling
- Modern Angular 20+ features (signals, standalone components, control flow)
- Comprehensive documentation and examples
- Demo application

### Features
- ✅ Modern Angular 20+ with Signals
- ✅ Standalone Components
- ✅ Multiple Barcode Formats
- ✅ Camera Selection
- ✅ File Scanning
- ✅ TypeScript Support
- ✅ Customizable Configuration
- ✅ Responsive Design

### Documentation
- Complete README with usage examples
- API reference documentation
- Demo application with live examples
- TypeScript interface definitions

```
