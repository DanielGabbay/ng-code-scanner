# Container Sizing Guide

## Overview

The `ng-code-scanner` component is designed to automatically fit **exactly** to the width and height of its parent container, without any overflow. This ensures a predictable and responsive layout in your application.

## How It Works

The component uses CSS flexbox and percentage-based sizing to adapt to its parent container:

- **Width**: Always 100% of the parent container
- **Height**: Always 100% of the parent container
- **Overflow**: Hidden to prevent content spilling
- **Video/Canvas**: Use `object-fit: contain` to maintain aspect ratio without distortion

## Requirements

### ✅ Parent Container Must Have Explicit Height

The **most important** requirement is that the parent container **must** have an explicit height defined. Without it, the component cannot determine how tall to be.

```html
<!-- ✅ CORRECT: Explicit height -->
<div style="width: 100%; height: 500px;">
  <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
</div>

<!-- ❌ INCORRECT: No height defined -->
<div style="width: 100%;">
  <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
</div>
```

## Usage Examples

### Example 1: Fixed Pixel Height

```html
<div style="width: 600px; height: 400px;">
  <ncs-code-scanner
    [autoStart]="true"
    [showCameraSelection]="true"
    (scanSuccess)="onScan($event)">
  </ncs-code-scanner>
</div>
```

### Example 2: Viewport Height (vh)

```html
<div style="width: 100%; height: 80vh;">
  <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
</div>
```

### Example 3: Using CSS Classes

```css
/* styles.css */
.scanner-container {
  width: 100%;
  height: 500px;
  padding: 1rem;
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .scanner-container {
    height: 400px;
  }
}
```

```html
<!-- component.html -->
<div class="scanner-container">
  <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
</div>
```

### Example 4: Flexbox Layout

```css
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  flex-shrink: 0;
  height: 60px;
}

.scanner-wrapper {
  flex: 1; /* Takes remaining space */
  min-height: 0; /* Important for flexbox */
}

.footer {
  flex-shrink: 0;
  height: 40px;
}
```

```html
<div class="page-container">
  <header class="header">
    <h1>Scanner App</h1>
  </header>
  
  <div class="scanner-wrapper">
    <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
  </div>
  
  <footer class="footer">
    <p>© 2025</p>
  </footer>
</div>
```

### Example 5: Grid Layout

```css
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 500px auto;
  gap: 1rem;
  height: 100vh;
}

.scanner-area {
  grid-column: 1 / -1;
  grid-row: 2;
}
```

```html
<div class="grid-layout">
  <div class="header">Header</div>
  
  <div class="scanner-area">
    <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
  </div>
  
  <div class="sidebar">Sidebar</div>
  <div class="content">Content</div>
</div>
```

## Common Pitfalls

### ❌ No Height on Parent

```html
<!-- This won't work properly -->
<div>
  <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
</div>
```

**Solution**: Add explicit height
```html
<div style="height: 500px;">
  <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
</div>
```

### ❌ Using `min-height` Only

```css
/* This is insufficient */
.scanner-container {
  min-height: 400px;
}
```

**Solution**: Use `height` or combine with flexbox
```css
.scanner-container {
  height: 400px;
}
```

### ❌ Conflicting CSS

```css
/* Avoid overriding component internals */
ncs-code-scanner {
  height: 300px !important; /* Don't do this */
}
```

**Solution**: Control size via parent container
```html
<div style="height: 300px;">
  <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
</div>
```

## Best Practices

### ✅ Use Viewport Units for Full-Screen

```html
<div style="width: 100vw; height: 100vh;">
  <ncs-code-scanner [autoStart]="true"></ncs-code-scanner>
</div>
```

### ✅ Combine with CSS Custom Properties

```css
:root {
  --scanner-height: 500px;
}

.scanner-container {
  height: var(--scanner-height);
}

@media (max-width: 768px) {
  :root {
    --scanner-height: 400px;
  }
}
```

### ✅ Responsive Design

```css
.scanner-wrapper {
  width: 100%;
  height: 60vh;
  max-height: 600px;
  min-height: 300px;
}
```

### ✅ Aspect Ratio (Modern CSS)

```css
.scanner-container {
  width: 100%;
  aspect-ratio: 4 / 3;
  max-width: 800px;
}
```

## Component Internals

The component's CSS structure ensures proper sizing:

```css
/* Host element takes full parent size */
:host {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* Container flexbox layout */
.ncs-scanner-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Scanner view takes remaining space */
.ncs-scanner-view {
  width: 100%;
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* Video/canvas fit within bounds */
.ncs-scanner-view video,
.ncs-scanner-view canvas {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
  display: block;
}
```

## Testing

To verify proper sizing:

1. Open browser DevTools
2. Inspect the scanner component
3. Verify:
   - Parent container has explicit height
   - `ncs-code-scanner` fills 100% of parent
   - `.ncs-scanner-view` uses flexbox `flex: 1`
   - Video/canvas use `object-fit: contain`

## Summary

✅ **Do**:
- Define explicit height on parent container
- Use flexbox or grid for dynamic layouts
- Use viewport units (vh/vw) for full-screen
- Use aspect-ratio for proportional sizing
- Test on different screen sizes

❌ **Don't**:
- Leave parent container without height
- Override component's internal CSS
- Use only `min-height` without `height`
- Assume component has intrinsic height

By following these guidelines, your scanner will always fit perfectly within its container without overflow! 🎯
