export { DEFAULT_OPTIONS };
export class BirdNETPlayer {
    /**
     * @param {HTMLElement} container — the DOM element to mount the player into
     * @param {Object}      [options]
     * @param {Object}      [options.WaveSurfer]     — pre-loaded WaveSurfer constructor
     * @param {boolean}     [options.showFileOpen]    — show Open button (default: true)
     * @param {boolean}     [options.showTransport]   — show transport controls (default: true)
     * @param {boolean}     [options.showTime]        — show time display (default: true)
     * @param {boolean}     [options.showVolume]      — show volume controls (default: true)
     * @param {boolean}     [options.showViewToggles] — show Follow/Loop/Fit/Reset (default: true)
     * @param {boolean}     [options.showZoom]        — show zoom slider (default: true)
     * @param {boolean}     [options.showFFTControls] — show FFT/Freq/Color selects (default: true)
     * @param {boolean}     [options.showDisplayGain] — show Floor/Ceil sliders (default: true)
     * @param {boolean}     [options.showStatusbar]   — show bottom status bar (default: true)
     */
    constructor(container: HTMLElement, options?: {
        WaveSurfer?: any;
        showFileOpen?: boolean;
        showTransport?: boolean;
        showTime?: boolean;
        showVolume?: boolean;
        showViewToggles?: boolean;
        showZoom?: boolean;
        showFFTControls?: boolean;
        showDisplayGain?: boolean;
        showStatusbar?: boolean;
    });
    container: HTMLElement;
    options: {
        WaveSurfer?: any;
        showFileOpen?: boolean;
        showTransport?: boolean;
        showTime?: boolean;
        showVolume?: boolean;
        showViewToggles?: boolean;
        showZoom?: boolean;
        showFFTControls?: boolean;
        showDisplayGain?: boolean;
        showStatusbar?: boolean;
    };
    _state: PlayerState;
    _events: EventTarget;
    annotations: AnnotationLayer;
    spectrogramLabels: SpectrogramLabelLayer;
    _linkedLabels: Map<any, any>;
    _isSyncingLabels: boolean;
    on: (event: any, callback: any, options: any) => () => void;
    off: (event: any, callback: any, options: any) => void;
    ready: Promise<this>;
    _init(): Promise<this>;
    root: Element;
    _emit(event: any, detail?: {}): void;
    /** Load audio from a URL (http, blob:, data: URLs all supported) */
    loadUrl(url: any): Promise<void>;
    /** Load audio from a File object (e.g. from an <input type="file">) */
    loadFile(file: any): Promise<void>;
    /** Current playback time in seconds */
    get currentTime(): any;
    /** Duration of loaded audio in seconds */
    get duration(): any;
    play(): void;
    pause(): void;
    stop(): void;
    togglePlayPause(): void;
    playSegment(startSec: any, endSec: any, options: any): void;
    playBandpassedSegment(startSec: any, endSec: any, freqMinHz: any, freqMaxHz: any, options: any): void;
    addAnnotation(annotation: any): any;
    setAnnotations(annotations: any): void;
    clearAnnotations(): void;
    exportAnnotationsRaven(): string;
    addSpectrogramLabel(label: any): any;
    setSpectrogramLabels(labels: any): void;
    clearSpectrogramLabels(): void;
    /** Tear down the player and free resources */
    destroy(): void;
    _bindLinkedLabelSync(): void;
    _upsertFromAnnotationEvent(annotation: any): void;
    _upsertFromSpectrogramEvent(label: any): void;
    _syncLinkedLabelsToLayers(): void;
    _toAnnotationList(): {
        id: any;
        start: any;
        end: any;
        species: any;
        confidence: any;
        color: any;
    }[];
    _toSpectrogramLabelList(): {
        id: any;
        start: any;
        end: any;
        freqMin: any;
        freqMax: any;
        label: any;
        color: any;
    }[];
    _normalizeLinkedLabel(label: any): {
        id: any;
        start: number;
        end: number;
        freqMin: number;
        freqMax: number;
        species: any;
        label: any;
        confidence: any;
        color: any;
    };
}
import { DEFAULT_OPTIONS } from './template.js';
import { PlayerState } from './PlayerState.js';
import { AnnotationLayer } from './annotations.js';
import { SpectrogramLabelLayer } from './annotations.js';
