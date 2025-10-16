/**
 * Configuration for the code scanner
 */
export interface ScannerConfig {
  /**
   * Frames per second for scanning (default: 10)
   */
  fps?: number;

  /**
   * Quality of picture (default: 250)
   */
  qrbox?: number | { width: number; height: number };

  /**
   * If true, all types of 2D barcodes will be scanned
   */
  formatsToSupport?: Html5QrcodeSupportedFormats[];

  /**
   * If true, scanner will use verbose logging
   */
  verbose?: boolean;

  /**
   * Aspect ratio for the video
   */
  aspectRatio?: number;

  /**
   * If true, will disable flip (mirror effect)
   */
  disableFlip?: boolean;

  /**
   * Video constraints for camera selection
   */
  videoConstraints?: MediaTrackConstraints;

  /**
   * If true, will show torch button if supported
   */
  showTorchButtonIfSupported?: boolean;
}

/**
 * Supported barcode formats
 */
export enum Html5QrcodeSupportedFormats {
  QR_CODE = 0,
  AZTEC = 1,
  CODABAR = 2,
  CODE_39 = 3,
  CODE_93 = 4,
  CODE_128 = 5,
  DATA_MATRIX = 6,
  MAXICODE = 7,
  ITF = 8,
  EAN_13 = 9,
  EAN_8 = 10,
  PDF_417 = 11,
  RSS_14 = 12,
  RSS_EXPANDED = 13,
  UPC_A = 14,
  UPC_E = 15,
  UPC_EAN_EXTENSION = 16,
}

/**
 * Result from a successful scan
 */
export interface ScanResult {
  /**
   * Decoded text from the scanned code
   */
  decodedText: string;

  /**
   * Result object from html5-qrcode
   */
  result: any;
}

/**
 * Camera device information
 */
export interface CameraDevice {
  id: string;
  label: string;
}
