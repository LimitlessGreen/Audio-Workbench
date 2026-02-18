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
        this._state = new PlayerState(this.root, WaveSurfer);
        return this;
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

    /** Tear down the player and free resources */
    destroy() {
        this._state?.dispose();
        this._state = null;
        this.container.innerHTML = '';
    }
}
