export interface BirdNETPlayerOptions {
  WaveSurfer?: unknown;
  showFileOpen?: boolean;
  showTransport?: boolean;
  showTime?: boolean;
  showVolume?: boolean;
  showViewToggles?: boolean;
  showZoom?: boolean;
  showFFTControls?: boolean;
  showDisplayGain?: boolean;
  showStatusbar?: boolean;
}

export declare class BirdNETPlayer {
  constructor(container: HTMLElement, options?: BirdNETPlayerOptions);
  readonly ready: Promise<BirdNETPlayer>;
  loadUrl(url: string): Promise<void>;
  loadFile(file: File): Promise<void>;
  readonly currentTime: number;
  readonly duration: number;
  play(): void;
  pause(): void;
  stop(): void;
  togglePlayPause(): void;
  destroy(): void;
}

export declare const DEFAULT_OPTIONS: Required<
  Omit<BirdNETPlayerOptions, "WaveSurfer">
>;
