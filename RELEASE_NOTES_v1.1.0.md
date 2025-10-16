# Release Notes - Version 1.1.0

## 🎉 New Features

### 🔦 Torch/Flashlight Control
Added full support for controlling the device flashlight on supported mobile devices:

- **Floating Torch Button**: Beautiful, animated button that appears over the camera view
- **Automatic Detection**: Automatically detects if the device supports torch/flashlight
- **Smart Positioning**: Button positioned at bottom-right, out of the way but easily accessible
- **Visual Feedback**: 
  - Black semi-transparent when OFF
  - Amber with glow effect when ON
  - Smooth hover and click animations
- **Configuration**: Enable/disable via `showTorchButtonIfSupported` in config

**Usage Example:**
```typescript
const config = signal<ScannerConfig>({
  showTorchButtonIfSupported: true, // Enable torch button
  fps: 10,
  qrbox: 250
});
```

**Service Methods:**
- `scannerService.isTorchAvailable()`: Check if torch is available
- `scannerService.isTorchOn()`: Check if torch is currently on
- `scannerService.toggleTorch()`: Toggle torch on/off

### 📱 Camera Facing Mode Selection
Added ability to choose between front and back camera on mobile devices:

- **New Input**: `preferredFacingMode` with options `'user'` (front) or `'environment'` (back)
- **Default**: `'environment'` (back camera) for better scanning experience
- **Mobile-Friendly**: Especially useful for mobile applications

**Usage Example:**
```typescript
<ncs-code-scanner
  [preferredFacingMode]="'environment'"  // Back camera
  [config]="scannerConfig()">
</ncs-code-scanner>
```

## 🔧 Technical Improvements

### DOM Structure
- Added `.ncs-scanner-wrapper` to properly position overlay elements
- Torch button is now a sibling of the scanner div (not a child)
- Prevents conflicts with html5-qrcode library's DOM manipulation

### CSS Architecture
- Enhanced positioning system for overlay elements
- Improved responsive design for mobile devices
- Better z-index management for layered components

### Torch Detection Logic
- Asynchronous torch availability checking with retry mechanism
- 15 retry attempts at 300ms intervals
- Proper cleanup on scanner stop

## 📊 Signal-Based State

New reactive signals for torch control:
- `_isTorchAvailable`: Boolean signal for torch availability
- `_isTorchOn`: Boolean signal for torch state

## 🎨 Styling

### Torch Button Styles
```css
.ncs-torch-button {
  - 56px circular button
  - Semi-transparent black background with backdrop blur
  - Smooth transitions and animations
  - Hover effect with scale transform
  - Active state with glow effect when torch is on
  - Amber color (#FFC107) when active
}
```

## 📦 Distribution

- Version: **1.1.0**
- Built with Angular 20+
- Full TypeScript support
- Production-ready build in `dist/ng-code-scanner`

## 🚀 Getting Started

### Install
```bash
npm install ng-code-scanner@1.1.0 html5-qrcode
```

### Import
```typescript
import { CodeScannerComponent } from 'ng-code-scanner';
```

### Use
```typescript
<ncs-code-scanner
  [config]="{ showTorchButtonIfSupported: true }"
  [preferredFacingMode]="'environment'"
  (scanSuccess)="onScanSuccess($event)">
</ncs-code-scanner>
```

## 🔄 Migration from 1.0.x

No breaking changes! The new features are opt-in:

1. **To enable torch button**: Add `showTorchButtonIfSupported: true` to your config
2. **To set camera facing mode**: Add `[preferredFacingMode]="'environment'"` to your component

## 🐛 Bug Fixes

- Fixed DOM structure to prevent torch button from being removed by html5-qrcode
- Improved element positioning for overlay components
- Enhanced mobile compatibility

## 📝 Documentation

- Updated README with new features and examples
- Added comprehensive API reference for new inputs/methods
- Updated CHANGELOG with detailed feature descriptions

## 🎯 Browser Support

Torch feature requires:
- Mobile device with camera
- Back-facing camera (environment)
- Browser support for MediaStream Track Constraints API
- Typically works on modern Android and iOS devices

## ⚡ Performance

- No impact on scanning performance
- Torch detection runs asynchronously
- Minimal overhead for button rendering
- Efficient event handling with Angular signals

---

**Full Changelog**: [CHANGELOG.md](./projects/ng-code-scanner/CHANGELOG.md)

**Published**: October 16, 2025
**Author**: Daniel Gabbay
