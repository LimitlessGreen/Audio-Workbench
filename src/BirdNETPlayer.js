// ═══════════════════════════════════════════════════════════════════════
// BirdNETPlayer.js — Public API for the BirdNET Audio Player module
//
// Usage:
//   import { BirdNETPlayer } from './BirdNETPlayer.js';
//   const player = new BirdNETPlayer(document.getElementById('root'));
//   await player.ready;
//   await player.loadUrl('https://example.com/audio.wav');
//   player.play();
// ═══════════════════════════════════════════════════════════════════════

import { createPlayerHTML, DEFAULT_OPTIONS } from './template.js';
import { PlayerState } from './PlayerState.js';
import { AnnotationLayer, SpectrogramLabelLayer } from './annotations.js';

const WAVESURFER_CDN = 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';

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
    constructor(container, options = {}) {
        if (!container) throw new Error('BirdNETPlayer: container element required');
        this.container = container;
        this.options = options;
        this._state = null;
        this._events = new EventTarget();
        this.annotations = new AnnotationLayer();
        this.spectrogramLabels = new SpectrogramLabelLayer();
        this._linkedLabels = new Map();
        this._isSyncingLabels = false;

        this.on = (event, callback, options) => {
            this._events.addEventListener(event, callback, options);
            return () => this.off(event, callback, options);
        };

        this.off = (event, callback, options) => {
            this._events.removeEventListener(event, callback, options);
        };

        this.ready = this._init();
    }

    // ── Initialization ──────────────────────────────────────────────

    async _init() {
        // 1. Inject player DOM (pass options for section visibility)
        this.container.innerHTML = createPlayerHTML(this.options);
        this.root = this.container.querySelector('.daw-shell');

        // 2. Resolve WaveSurfer (option → global → CDN import)
        const WaveSurfer = this.options.WaveSurfer
            || window.WaveSurfer
            || (await import(/* @vite-ignore */ WAVESURFER_CDN)).default;

        // 3. Create internal state machine
        this._state = new PlayerState(
            this.root,
            WaveSurfer,
            (event, detail) => this._emit(event, detail),
            this.options,
        );
        this.annotations.attach(this);
        this.spectrogramLabels.attach(this);
        this._bindLinkedLabelSync();
        this._emit('ready', { phase: 'init' });
        return this;
    }

    _emit(event, detail = {}) {
        this._events.dispatchEvent(new CustomEvent(event, { detail }));
    }

    // ── Public API ──────────────────────────────────────────────────

    /** Load audio from a URL (http, blob:, data: URLs all supported) */
    async loadUrl(url) {
        await this.ready;
        return this._state.loadUrl(url);
    }

    /** Load audio from a File object (e.g. from an <input type="file">) */
    async loadFile(file) {
        await this.ready;
        return this._state._handleFileSelect({ target: { files: [file] } });
    }

    /** Current playback time in seconds */
    get currentTime() {
        return this._state?._getCurrentTime() || 0;
    }

    /** Duration of loaded audio in seconds */
    get duration() {
        return this._state?.audioBuffer?.duration || 0;
    }

    play()            { this._state?.wavesurfer?.play(); }
    pause()           { this._state?.wavesurfer?.pause(); }
    stop()            { this._state?._stopPlayback(); }
    togglePlayPause() { this._state?._togglePlayPause(); }
    playSegment(startSec, endSec, options) { this._state?.playSegment(startSec, endSec, options); }
    playBandpassedSegment(startSec, endSec, freqMinHz, freqMaxHz, options) {
        this._state?.playBandpassedSegment(startSec, endSec, freqMinHz, freqMaxHz, options);
    }
    addAnnotation(annotation) {
        const id = annotation?.id || `lbl_${Math.random().toString(36).slice(2, 10)}`;
        const existing = this._linkedLabels.get(id);
        const merged = this._normalizeLinkedLabel({
            ...existing,
            ...annotation,
            id,
            label: annotation?.label ?? annotation?.species ?? existing?.label ?? 'Label',
        });
        this._linkedLabels.set(id, merged);
        this._syncLinkedLabelsToLayers();
        return id;
    }
    setAnnotations(annotations) {
        const next = new Map();
        for (const ann of annotations || []) {
            const id = ann?.id || `lbl_${Math.random().toString(36).slice(2, 10)}`;
            const existing = this._linkedLabels.get(id);
            next.set(id, this._normalizeLinkedLabel({
                ...existing,
                ...ann,
                id,
                label: ann?.label ?? ann?.species ?? existing?.label ?? 'Label',
            }));
        }
        this._linkedLabels = next;
        this._syncLinkedLabelsToLayers();
    }
    clearAnnotations() {
        this._linkedLabels.clear();
        this._syncLinkedLabelsToLayers();
    }
    exportAnnotationsRaven() {
        return this.annotations.exportRavenFormat(this._toAnnotationList());
    }
    addSpectrogramLabel(label) {
        const id = label?.id || `lbl_${Math.random().toString(36).slice(2, 10)}`;
        const existing = this._linkedLabels.get(id);
        const merged = this._normalizeLinkedLabel({
            ...existing,
            ...label,
            id,
            species: label?.species ?? label?.label ?? existing?.species ?? '',
            label: label?.label ?? existing?.label ?? label?.species ?? 'Label',
        });
        this._linkedLabels.set(id, merged);
        this._syncLinkedLabelsToLayers();
        return id;
    }
    setSpectrogramLabels(labels) {
        const next = new Map();
        for (const lbl of labels || []) {
            const id = lbl?.id || `lbl_${Math.random().toString(36).slice(2, 10)}`;
            const existing = this._linkedLabels.get(id);
            next.set(id, this._normalizeLinkedLabel({
                ...existing,
                ...lbl,
                id,
                species: lbl?.species ?? lbl?.label ?? existing?.species ?? '',
                label: lbl?.label ?? existing?.label ?? lbl?.species ?? 'Label',
            }));
        }
        this._linkedLabels = next;
        this._syncLinkedLabelsToLayers();
    }
    clearSpectrogramLabels() {
        this._linkedLabels.clear();
        this._syncLinkedLabelsToLayers();
    }

    /** Tear down the player and free resources */
    destroy() {
        this.annotations.detach();
        this.spectrogramLabels.detach();
        this._state?.dispose();
        this._state = null;
        this.container.innerHTML = '';
    }

    _bindLinkedLabelSync() {
        this.on('annotationpreview', (e) => this._previewFromAnnotationEvent(e.detail.annotation));
        this.on('spectrogramlabelpreview', (e) => this._previewFromSpectrogramEvent(e.detail.label));
        this.on('annotationcreate', (e) => this._upsertFromAnnotationEvent(e.detail.annotation));
        this.on('annotationupdate', (e) => this._upsertFromAnnotationEvent(e.detail.annotation));
        this.on('spectrogramlabelcreate', (e) => this._upsertFromSpectrogramEvent(e.detail.label));
        this.on('spectrogramlabelupdate', (e) => this._upsertFromSpectrogramEvent(e.detail.label));
    }

    _previewFromAnnotationEvent(annotation) {
        if (this._isSyncingLabels || !annotation) return;
        const id = annotation.id || `lbl_${Math.random().toString(36).slice(2, 10)}`;
        const existing = this._linkedLabels.get(id);
        const next = this._normalizeLinkedLabel({
            ...existing,
            ...annotation,
            id,
            label: annotation?.species ?? existing?.label ?? 'Label',
        });
        this._linkedLabels.set(id, next);
        this._state?.updateActiveSegmentFromLabel?.(next);
        this.spectrogramLabels.setLiveLinkedId(id);
        this.spectrogramLabels.set(this._toSpectrogramLabelList());
    }

    _previewFromSpectrogramEvent(label) {
        if (this._isSyncingLabels || !label) return;
        const id = label.id || `lbl_${Math.random().toString(36).slice(2, 10)}`;
        const existing = this._linkedLabels.get(id);
        const next = this._normalizeLinkedLabel({
            ...existing,
            ...label,
            id,
            species: existing?.species ?? label?.label ?? '',
            label: label?.label ?? existing?.label ?? 'Label',
        });
        this._linkedLabels.set(id, next);
        this._state?.updateActiveSegmentFromLabel?.(next);
        this.annotations.setLiveLinkedId(id);
        this.annotations.set(this._toAnnotationList());
    }

    _upsertFromAnnotationEvent(annotation) {
        if (this._isSyncingLabels || !annotation) return;
        const id = annotation.id || `lbl_${Math.random().toString(36).slice(2, 10)}`;
        const existing = this._linkedLabels.get(id);
        const next = this._normalizeLinkedLabel({
            ...existing,
            ...annotation,
            id,
            label: annotation?.species ?? existing?.label ?? 'Label',
        });
        this._linkedLabels.set(id, next);
        this._state?.updateActiveSegmentFromLabel?.(next);
        this.annotations.setLiveLinkedId(null);
        this.spectrogramLabels.setLiveLinkedId(null);
        this._syncLinkedLabelsToLayers();
    }

    _upsertFromSpectrogramEvent(label) {
        if (this._isSyncingLabels || !label) return;
        const id = label.id || `lbl_${Math.random().toString(36).slice(2, 10)}`;
        const existing = this._linkedLabels.get(id);
        const next = this._normalizeLinkedLabel({
            ...existing,
            ...label,
            id,
            species: existing?.species ?? label?.label ?? '',
            label: label?.label ?? existing?.label ?? 'Label',
        });
        this._linkedLabels.set(id, next);
        this._state?.updateActiveSegmentFromLabel?.(next);
        this.annotations.setLiveLinkedId(null);
        this.spectrogramLabels.setLiveLinkedId(null);
        this._syncLinkedLabelsToLayers();
    }

    _syncLinkedLabelsToLayers() {
        this._isSyncingLabels = true;
        try {
            this.annotations.set(this._toAnnotationList());
            this.spectrogramLabels.set(this._toSpectrogramLabelList());
        } finally {
            this._isSyncingLabels = false;
        }
    }

    _toAnnotationList() {
        return Array.from(this._linkedLabels.values()).map((l) => ({
            id: l.id,
            start: l.start,
            end: l.end,
            species: l.species || l.label || '',
            confidence: l.confidence,
            color: l.color,
        }));
    }

    _toSpectrogramLabelList() {
        return Array.from(this._linkedLabels.values()).map((l) => ({
            id: l.id,
            start: l.start,
            end: l.end,
            freqMin: l.freqMin,
            freqMax: l.freqMax,
            label: l.label || l.species || '',
            color: l.color,
        }));
    }

    _normalizeLinkedLabel(label) {
        const duration = Math.max(0.001, this.duration || this._state?.audioBuffer?.duration || 0.001);
        const nyquist = (this._state?.sampleRateHz || 32000) / 2;
        const selected = parseFloat(this._state?.d?.maxFreqSelect?.value || `${nyquist}`);
        const maxFreq = Math.max(1, Math.min(selected, nyquist));

        const start = Math.max(0, Math.min(Number(label?.start ?? 0), duration));
        const end = Math.max(start + 0.01, Math.min(duration, Number(label?.end ?? start + 0.01)));
        const freqMinRaw = Number(label?.freqMin ?? 0);
        const freqMaxRaw = Number(label?.freqMax ?? maxFreq);
        const freqMin = Math.max(0, Math.min(freqMinRaw, maxFreq));
        const freqMax = Math.max(freqMin + 1, Math.min(maxFreq, freqMaxRaw));

        return {
            id: label?.id || `lbl_${Math.random().toString(36).slice(2, 10)}`,
            start,
            end,
            freqMin,
            freqMax,
            species: label?.species || '',
            label: label?.label || label?.species || '',
            confidence: label?.confidence,
            color: label?.color || '',
        };
    }
}
