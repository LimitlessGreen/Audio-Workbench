// ═══════════════════════════════════════════════════════════════════════
// PlayerState.js — Central state machine, interaction & event binding
// ═══════════════════════════════════════════════════════════════════════

import {
    DEFAULT_ZOOM_PPS,
    DEFAULT_WAVEFORM_HEIGHT, DEFAULT_SPECTROGRAM_DISPLAY_HEIGHT,
    MIN_WAVEFORM_HEIGHT, MIN_SPECTROGRAM_DISPLAY_HEIGHT,
    SEEK_FINE_SEC, SEEK_COARSE_SEC, MIN_WINDOW_NORM,
    PERCH_FRAME_RATE, PERCH_N_MELS,
    PERCH_PCEN_GAIN, PERCH_PCEN_BIAS, PERCH_PCEN_ROOT, PERCH_PCEN_SMOOTHING,
} from './constants.js';

import { formatTime, formatSecondsShort, isTypingContext } from './utils.js';

import {
    computeAmplitudePeak,
    updateSpectrogramStats as computeSpectrogramStats,
    autoContrastStats,
    detectMaxFrequency,
    buildSpectrogramGrayscale,
    colorizeSpectrogram,
    GpuColorizer,
    renderSpectrogram,
    createSpectrogramProcessor,
} from './spectrogram.js';

import {
    renderMainWaveform,
    renderOverviewWaveform,
    renderFrequencyLabels,
} from './waveform.js';

// ─── Helper ─────────────────────────────────────────────────────────

async function decodeArrayBuffer(arrayBuffer) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) throw new Error('AudioContext wird von diesem Browser nicht unterstützt.');
    const ctx = new Ctor();
    try {
        return await ctx.decodeAudioData(arrayBuffer);
    } finally {
        ctx.close?.().catch(() => {});
    }
}

// ═════════════════════════════════════════════════════════════════════

export class PlayerState {
    constructor(container, WaveSurfer) {
        if (!container) throw new Error('PlayerState: container element required');
        if (!WaveSurfer) throw new Error('PlayerState: WaveSurfer reference required');

        this.container = container;
        this.d = this._queryDom(container);
        this.WaveSurfer = WaveSurfer;

        this.processor = createSpectrogramProcessor();
        this.colorizer = new GpuColorizer();

        // ── Audio / analysis state ──
        this.audioBuffer = null;
        this.wavesurfer = null;
        this.spectrogramData = null;
        this.spectrogramFrames = 0;
        this.spectrogramMels = 0;
        this.spectrogramBaseCanvas = null;
        this.spectrogramGrayInfo = null;  // { gray: Uint8Array, width, height }
        this._gpuReady = false;
        this.spectrogramAbsLogMin = 0;   // absolute range (full data)
        this.spectrogramAbsLogMax = 1;
        this.sampleRateHz = 32000;
        this.amplitudePeakAbs = 1;
        this.currentColorScheme = this.d.colorSchemeSelect.value || 'fire';
        this.volume = 0.8;
        this.muted = false;
        this.preMuteVolume = 0.8;

        // ── Zoom / viewport ──
        this.pixelsPerSecond = DEFAULT_ZOOM_PPS;
        this.zoomRedrawTimeout = null;
        this.scrollSyncLock = false;
        this.windowStartNorm = 0;
        this.windowEndNorm = 1;

        // ── Playback toggles ──
        this.followPlayback = true;
        this.loopPlayback = false;

        // ── Drag / interaction state ──
        this.draggingPlayhead = false;
        this.draggingPlayheadSource = null;
        this.draggingViewport = false;
        this.viewportPanStartX = 0;
        this.viewportPanStartScroll = 0;
        this.suppressSeekClick = false;
        this.overviewMode = null;
        this.overviewDragStartX = 0;
        this.overviewDragStart = 0;
        this.overviewDragEnd = 1;

        // ── View resize ──
        this.waveformDisplayHeight = DEFAULT_WAVEFORM_HEIGHT;
        this.spectrogramDisplayHeight = DEFAULT_SPECTROGRAM_DISPLAY_HEIGHT;
        this.viewResizeMode = null;
        this.viewResizeStartY = 0;
        this.viewResizeStartWaveformHeight = DEFAULT_WAVEFORM_HEIGHT;
        this.viewResizeStartSpectrogramHeight = DEFAULT_SPECTROGRAM_DISPLAY_HEIGHT;

        // ── Initial DOM setup ──
        this._applyLocalViewHeights();
        this._updateAmplitudeLabels();
        this._setInitialPlayheadPositions();
        this._updateToggleButtons();

        // ── Event listeners ──
        this._cleanups = [];
        this._bindEvents();
    }

    // ═════════════════════════════════════════════════════════════════
    //  DOM Query (scoped to container)
    // ═════════════════════════════════════════════════════════════════

    _queryDom(root) {
        const q = (id) => root.querySelector(`#${id}`);
        return {
            openFileBtn:            q('openFileBtn'),
            audioFile:              q('audioFile'),
            playPauseBtn:           q('playPauseBtn'),
            stopBtn:                q('stopBtn'),
            jumpStartBtn:           q('jumpStartBtn'),
            jumpEndBtn:             q('jumpEndBtn'),
            backwardBtn:            q('backwardBtn'),
            forwardBtn:             q('forwardBtn'),
            followToggleBtn:        q('followToggleBtn'),
            loopToggleBtn:          q('loopToggleBtn'),
            fitViewBtn:             q('fitViewBtn'),
            resetViewBtn:           q('resetViewBtn'),
            currentTimeDisplay:     q('currentTime'),
            totalTimeDisplay:       q('totalTime'),
            playStateDisplay:       q('playState'),
            viewRangeDisplay:       q('viewRange'),
            spectrogramCanvas:      q('spectrogramCanvas'),
            spectrogramContainer:   q('spectrogramContainer'),
            waveformContainer:      q('waveformContainer'),
            waveformWrapper:        q('waveformWrapper'),
            waveformContent:        q('waveformContent'),
            amplitudeLabels:        q('amplitudeLabels'),
            amplitudeCanvas:        q('amplitudeCanvas'),
            waveformTimelineCanvas: q('waveformTimelineCanvas'),
            waveformPlayhead:       q('waveformPlayhead'),
            audioEngineHost:        q('audioEngineHost'),
            playhead:               q('playhead'),
            canvasWrapper:          q('canvasWrapper'),
            viewSplitHandle:        q('viewSplitHandle'),
            spectrogramResizeHandle:q('spectrogramResizeHandle'),
            overviewCanvas:         q('overviewCanvas'),
            overviewContainer:      q('overviewContainer'),
            overviewWindow:         q('overviewWindow'),
            overviewHandleLeft:     q('overviewHandleLeft'),
            overviewHandleRight:    q('overviewHandleRight'),
            fileInfo:               q('fileInfo'),
            sampleRateInfo:         q('sampleRateInfo'),
            fftSizeSelect:          q('fftSize'),
            zoomSlider:             q('zoomSlider'),
            zoomValue:              q('zoomValue'),
            maxFreqSelect:          q('maxFreqSelect'),
            colorSchemeSelect:      q('colorSchemeSelect'),
            freqLabels:             q('freqLabels'),
            volumeToggleBtn:        q('volumeToggleBtn'),
            volumeIcon:             q('volumeIcon'),
            volumeWaves:            q('volumeWaves'),
            volumeSlider:           q('volumeSlider'),
            floorSlider:            q('floorSlider'),
            ceilSlider:             q('ceilSlider'),
            autoContrastBtn:        q('autoContrastBtn'),
            autoFreqBtn:            q('autoFreqBtn'),
        };
    }

    // ═════════════════════════════════════════════════════════════════
    //  Disposal
    // ═════════════════════════════════════════════════════════════════

    dispose() {
        for (let i = this._cleanups.length - 1; i >= 0; i--) this._cleanups[i]();
        this._cleanups.length = 0;
        this.processor.dispose();
        this.colorizer.dispose();
    }

    // ═════════════════════════════════════════════════════════════════
    //  File Loading
    // ═════════════════════════════════════════════════════════════════

    async _handleFileSelect(e) {
        const file = e?.target?.files?.[0];
        if (!file) return;

        this.d.fileInfo.innerHTML = `<span class="statusbar-label">${file.name}</span>`;
        this.d.fileInfo.classList.add('loading');
        this._setPlayState('Loading');

        try {
            const audioBuffer = await decodeArrayBuffer(await file.arrayBuffer());
            this.audioBuffer = audioBuffer;
            this.sampleRateHz = audioBuffer.sampleRate;
            this.amplitudePeakAbs = computeAmplitudePeak(audioBuffer.getChannelData(0));
            this._updateAmplitudeLabels();

            this.d.fileInfo.innerHTML = `<span class="statusbar-label">${file.name}</span> <span>${formatTime(audioBuffer.duration)}</span>`;
            this.d.sampleRateInfo.textContent = `${audioBuffer.sampleRate} Hz`;
            this.d.totalTimeDisplay.textContent = formatTime(audioBuffer.duration);
            this.d.currentTimeDisplay.textContent = formatTime(0);

            this._setPixelsPerSecond(DEFAULT_ZOOM_PPS, false);
            this._setTransportEnabled(true);
            this._updateToggleButtons();
            this._setPlayState('Ready');
            this.d.fileInfo.classList.remove('loading');

            this._setupWaveSurfer(file);
            await this._generateSpectrogram();
            this._drawMainWaveform();
            this._drawOverviewWaveform();
            this._createFrequencyLabels();
            this._seekToTime(0, true);
        } catch (error) {
            console.error('Fehler beim Laden der Datei:', error);
            this._setPlayState('Error');
            this.d.fileInfo.classList.remove('loading');
            alert('Fehler beim Laden der Audio-Datei');
        }
    }

    // ═════════════════════════════════════════════════════════════════
    //  Load from URL (programmatic)
    // ═════════════════════════════════════════════════════════════════

    async loadUrl(url) {
        this.d.fileInfo.innerHTML = `<span class="statusbar-label">Loading…</span>`;
        this.d.fileInfo.classList.add('loading');
        this._setPlayState('Loading');

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();

            const audioBuffer = await decodeArrayBuffer(arrayBuffer);
            this.audioBuffer = audioBuffer;
            this.sampleRateHz = audioBuffer.sampleRate;
            this.amplitudePeakAbs = computeAmplitudePeak(audioBuffer.getChannelData(0));
            this._updateAmplitudeLabels();

            const name = decodeURIComponent(
                new URL(url, location.href).pathname.split('/').pop() || 'audio',
            );
            this.d.fileInfo.innerHTML = `<span class="statusbar-label">${name}</span> <span>${formatTime(audioBuffer.duration)}</span>`;
            this.d.sampleRateInfo.textContent = `${audioBuffer.sampleRate} Hz`;
            this.d.totalTimeDisplay.textContent = formatTime(audioBuffer.duration);
            this.d.currentTimeDisplay.textContent = formatTime(0);

            this._setPixelsPerSecond(DEFAULT_ZOOM_PPS, false);
            this._setTransportEnabled(true);
            this._updateToggleButtons();
            this._setPlayState('Ready');
            this.d.fileInfo.classList.remove('loading');

            // Pass the original URL to WaveSurfer (data: URLs work in
            // sandboxed iframes where blob: URLs fail).
            this._setupWaveSurfer(url);
            await this._generateSpectrogram();
            this._drawMainWaveform();
            this._drawOverviewWaveform();
            this._createFrequencyLabels();
            this._seekToTime(0, true);
        } catch (error) {
            console.error('Error loading audio URL:', error);
            this._setPlayState('Error');
            this.d.fileInfo.classList.remove('loading');
        }
    }

    // ═════════════════════════════════════════════════════════════════
    //  WaveSurfer Engine
    // ═════════════════════════════════════════════════════════════════

    _setupWaveSurfer(source) {
        if (this.wavesurfer) this.wavesurfer.destroy();

        const ws = this.WaveSurfer.create({
            container: this.d.audioEngineHost,
            height: 1,
            waveColor: '#38bdf8',
            progressColor: '#0ea5e9',
            cursorColor: '#ef4444',
            normalize: true,
            minPxPerSec: this.pixelsPerSecond,
            autoScroll: false,
            autoCenter: false,
        });

        // Accept both URL strings (data:, http:, blob:) and File/Blob objects
        if (typeof source === 'string') {
            ws.load(source);
        } else {
            ws.loadBlob(source);
        }

        ws.on('ready', () => {
            ws.zoom(this.pixelsPerSecond);
            ws.setVolume(this.volume);
            this._seekToTime(0, true);
        });

        ws.on('timeupdate', (t) => {
            this._updateTimeReadout(t);
            this._updatePlayhead(t, true);
        });

        ws.on('play', () => {
            this.d.playPauseBtn.classList.add('playing');
            this._setPlayState(this.loopPlayback ? 'Playing (Loop)' : 'Playing');
        });

        ws.on('pause', () => {
            this.d.playPauseBtn.classList.remove('playing');
            if (this.audioBuffer) {
                const atEnd = ws.getCurrentTime() >= this.audioBuffer.duration - 0.01;
                this._setPlayState(atEnd ? 'Stopped' : 'Paused');
            } else {
                this._setPlayState('Paused');
            }
        });

        ws.on('finish', () => {
            if (this.loopPlayback) {
                this._seekToTime(0, this.followPlayback);
                ws.play();
                return;
            }
            this.d.playPauseBtn.classList.remove('playing');
            this._setPlayState('Stopped');
            if (this.audioBuffer) this._updatePlayhead(this.audioBuffer.duration, false);
        });

        this.wavesurfer = ws;
    }

    // ═════════════════════════════════════════════════════════════════
    //  Transport Controls
    // ═════════════════════════════════════════════════════════════════

    _togglePlayPause() {
        if (this.wavesurfer && this.audioBuffer) this.wavesurfer.playPause();
    }

    _stopPlayback() {
        if (!this.wavesurfer) return;
        this.wavesurfer.pause();
        this._seekToTime(0, true);
        this._setPlayState('Stopped');
        this.d.playPauseBtn.classList.remove('playing');
    }

    _seekToTime(timeSec, centerView = false) {
        if (!this.audioBuffer) return;
        const t = Math.max(0, Math.min(timeSec, this.audioBuffer.duration));
        if (this.wavesurfer) this.wavesurfer.setTime(t);
        this._updateTimeReadout(t);
        this._updatePlayhead(t, false);
        if (centerView) this._centerViewportAtTime(t);
    }

    _seekByDelta(deltaSec) {
        if (!this.audioBuffer) return;
        this._seekToTime(this._getCurrentTime() + deltaSec, false);
    }

    _getCurrentTime() {
        return this.wavesurfer ? this.wavesurfer.getCurrentTime() : 0;
    }

    _updateTimeReadout(t) {
        this.d.currentTimeDisplay.textContent = formatTime(t);
    }

    // ═════════════════════════════════════════════════════════════════
    //  Playhead & Follow
    // ═════════════════════════════════════════════════════════════════

    _updatePlayhead(currentTime, fromPlayback) {
        if (!this.audioBuffer) return;

        const duration = Math.max(0.001, this.audioBuffer.duration);
        const canvasWidth = this.d.spectrogramCanvas.width;
        const position = (currentTime / duration) * canvasWidth;

        this.d.playhead.style.transform = `translateX(${position}px)`;
        this.d.waveformPlayhead.style.transform = `translateX(${position}px)`;

        // Follow-mode scroll
        if (fromPlayback && this.followPlayback && this.wavesurfer?.isPlaying()) {
            const vw = this._getViewportWidth();
            const scrollLeft = this.d.canvasWrapper.scrollLeft;
            const guardLeft = scrollLeft + vw * 0.35;
            const guardRight = scrollLeft + vw * 0.65;
            if (position < guardLeft || position > guardRight) {
                this._setLinkedScrollLeft(Math.max(0, position - vw * 0.5));
            }
        }

        this._syncOverviewWindowToViewport();
    }

    // ═════════════════════════════════════════════════════════════════
    //  Spectrogram Pipeline
    // ═════════════════════════════════════════════════════════════════

    async _generateSpectrogram() {
        if (!this.audioBuffer) return;
        this._setPlayState('Rendering...');

        const result = await this.processor.compute(this.audioBuffer.getChannelData(0), {
            fftSize: parseInt(this.d.fftSizeSelect.value, 10),
            sampleRate: this.audioBuffer.sampleRate,
            frameRate: PERCH_FRAME_RATE,
            nMels: PERCH_N_MELS,
            pcenGain: PERCH_PCEN_GAIN,
            pcenBias: PERCH_PCEN_BIAS,
            pcenRoot: PERCH_PCEN_ROOT,
            pcenSmoothing: PERCH_PCEN_SMOOTHING,
        });

        this.spectrogramData = result.data;
        this.spectrogramFrames = result.nFrames;
        this.spectrogramMels = result.nMels;

        this._updateSpectrogramStats();

        // Auto-optimize on first load (sets slider values only)
        this._autoContrast();
        this._autoFrequency();

        // Stage 1: build grayscale (expensive, once)
        this._buildSpectrogramGrayscale();
        // Stage 2: colorize (fast, GPU or JS)
        this._buildSpectrogramBaseImage();
        this._drawSpectrogram();
        this._syncOverviewWindowToViewport();
        this._setPlayState('Ready');
    }

    _updateSpectrogramStats() {
        const stats = computeSpectrogramStats(this.spectrogramData);
        this.spectrogramAbsLogMin = stats.logMin;
        this.spectrogramAbsLogMax = stats.logMax;
    }

    // ── Auto-Contrast ───────────────────────────────────────────────

    /** Compute optimal floor/ceil from percentiles.
     *  Pass redraw=true when called from a button click. */
    _autoContrast(redraw = false) {
        if (!this.spectrogramData) return;
        const stats = autoContrastStats(this.spectrogramData, 2, 98);
        const range = this.spectrogramAbsLogMax - this.spectrogramAbsLogMin;
        if (range < 1e-8) return;

        const floorPct = Math.max(0, Math.min(100,
            ((stats.logMin - this.spectrogramAbsLogMin) / range) * 100));
        const ceilPct  = Math.max(0, Math.min(100,
            ((stats.logMax - this.spectrogramAbsLogMin) / range) * 100));

        this.d.floorSlider.value = Math.round(floorPct);
        this.d.ceilSlider.value  = Math.round(ceilPct);
        if (redraw) {
            this._buildSpectrogramBaseImage();
            this._drawSpectrogram();
        }
    }

    // ── Auto-Frequency ──────────────────────────────────────────────

    /** Detect best maxFreq. Pass redraw=true when called from button click. */
    _autoFrequency(redraw = false) {
        if (!this.spectrogramData) return;
        const hzValue = detectMaxFrequency(
            this.spectrogramData,
            this.spectrogramFrames,
            this.spectrogramMels,
            this.sampleRateHz,
        );
        const options = Array.from(this.d.maxFreqSelect.options);
        let best = options[options.length - 1];
        for (const opt of options) {
            if (parseFloat(opt.value) >= hzValue) { best = opt; break; }
        }
        this.d.maxFreqSelect.value = best.value;
        this._createFrequencyLabels();
        if (redraw) {
            this._buildSpectrogramGrayscale();  // maxFreq changed → Stage 1
            this._buildSpectrogramBaseImage();
            this._drawSpectrogram();
        }
    }

    // ── Volume ──────────────────────────────────────────────────────

    _setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.wavesurfer) this.wavesurfer.setVolume(this.volume);
        this._updateVolumeIcon();
    }

    _toggleMute() {
        if (this.muted) {
            this.muted = false;
            this._setVolume(this.preMuteVolume);
            this.d.volumeSlider.value = Math.round(this.preMuteVolume * 100);
        } else {
            this.preMuteVolume = this.volume;
            this.muted = true;
            if (this.wavesurfer) this.wavesurfer.setVolume(0);
            this._updateVolumeIcon();
        }
    }

    _updateVolumeIcon() {
        const waves = this.d.volumeWaves;
        const btn = this.d.volumeToggleBtn;
        if (!waves || !btn) return;
        const vol = this.muted ? 0 : this.volume;
        waves.style.display = vol < 0.01 ? 'none' : '';
        waves.setAttribute('d',
            vol < 0.4
                ? 'M15 8.5a4 4 0 010 7'
                : 'M15 8.5a4 4 0 010 7M18 5a9 9 0 010 14'
        );
        btn.classList.toggle('muted', vol < 0.01);
    }

    /** Stage 1 — expensive: PCEN → 8-bit grayscale. Run once per audio/fft/freq change. */
    _buildSpectrogramGrayscale() {
        this.spectrogramGrayInfo = buildSpectrogramGrayscale({
            spectrogramData: this.spectrogramData,
            spectrogramFrames: this.spectrogramFrames,
            spectrogramMels: this.spectrogramMels,
            sampleRateHz: this.sampleRateHz,
            maxFreq: parseFloat(this.d.maxFreqSelect.value),
            spectrogramAbsLogMin: this.spectrogramAbsLogMin,
            spectrogramAbsLogMax: this.spectrogramAbsLogMax,
        });
        // Upload to GPU if available
        if (this.spectrogramGrayInfo && this.colorizer.ok) {
            const { gray, width, height } = this.spectrogramGrayInfo;
            this._gpuReady = this.colorizer.uploadGrayscale(gray, width, height);
        } else {
            this._gpuReady = false;
        }
    }

    /** Stage 2 — fast: grayscale → colored canvas.
     *  GPU path: ~0.1 ms.  JS fallback: ~20-80 ms. */
    _buildSpectrogramBaseImage() {
        if (!this.spectrogramGrayInfo) this._buildSpectrogramGrayscale();
        const floor01 = parseFloat(this.d.floorSlider.value) / 100;
        const ceil01  = parseFloat(this.d.ceilSlider.value)  / 100;

        if (this._gpuReady && this.spectrogramGrayInfo) {
            this.colorizer.uploadColorLut(this.currentColorScheme);
            this.colorizer.render(floor01, ceil01);
            this.spectrogramBaseCanvas = this.colorizer.canvas;
        } else {
            this.spectrogramBaseCanvas = colorizeSpectrogram(
                this.spectrogramGrayInfo, floor01, ceil01, this.currentColorScheme,
            );
        }
        return this.spectrogramBaseCanvas;
    }

    _drawSpectrogram() {
        if (!this.audioBuffer || !this.spectrogramData || this.spectrogramFrames <= 0) return;
        if (!this.spectrogramBaseCanvas) this._buildSpectrogramBaseImage();
        if (!this.spectrogramBaseCanvas) return;

        renderSpectrogram({
            duration: this.audioBuffer.duration,
            spectrogramCanvas: this.d.spectrogramCanvas,
            pixelsPerSecond: this.pixelsPerSecond,
            canvasHeight: this.spectrogramDisplayHeight,
            baseCanvas: this.spectrogramBaseCanvas,
            sampleRate: this.audioBuffer.sampleRate,
            frameRate: PERCH_FRAME_RATE,
            spectrogramFrames: this.spectrogramFrames,
        });

        this._syncOverviewWindowToViewport();
        this._updatePlayhead(this._getCurrentTime(), false);
    }

    _requestSpectrogramRedraw() {
        if (this.zoomRedrawTimeout) clearTimeout(this.zoomRedrawTimeout);
        this.zoomRedrawTimeout = setTimeout(() => {
            if (!this.audioBuffer) return;
            if (this.spectrogramData && this.spectrogramFrames > 0) this._drawSpectrogram();
            this._drawMainWaveform();
        }, 90);
    }

    // ═════════════════════════════════════════════════════════════════
    //  Waveform Rendering
    // ═════════════════════════════════════════════════════════════════

    _drawMainWaveform() {
        renderMainWaveform({
            audioBuffer: this.audioBuffer,
            amplitudeCanvas: this.d.amplitudeCanvas,
            waveformTimelineCanvas: this.d.waveformTimelineCanvas,
            waveformContent: this.d.waveformContent,
            pixelsPerSecond: this.pixelsPerSecond,
            waveformHeight: this.waveformDisplayHeight,
            amplitudePeakAbs: this.amplitudePeakAbs,
        });
        this._syncOverviewWindowToViewport();
        this._updatePlayhead(this._getCurrentTime(), false);
    }

    _drawOverviewWaveform() {
        renderOverviewWaveform({
            audioBuffer: this.audioBuffer,
            overviewCanvas: this.d.overviewCanvas,
            overviewContainer: this.d.overviewContainer,
            amplitudePeakAbs: this.amplitudePeakAbs,
        });
        this._syncOverviewWindowToViewport();
    }

    _createFrequencyLabels() {
        renderFrequencyLabels({
            labelsElement: this.d.freqLabels,
            maxFreq: parseFloat(this.d.maxFreqSelect.value),
            sampleRateHz: this.sampleRateHz,
        });
    }

    _updateAmplitudeLabels() {
        const el = this.d.amplitudeLabels;
        if (!el) return;
        el.innerHTML = '';

        const peak = Math.max(1e-6, this.amplitudePeakAbs || 1);
        const clampedH = Math.max(MIN_WAVEFORM_HEIGHT, Math.floor(this.waveformDisplayHeight));
        const timelineH = Math.max(18, Math.min(32, Math.round(clampedH * 0.22)));
        const ampH = Math.max(32, clampedH - timelineH);

        const fmt = (v) => {
            const a = Math.abs(v);
            return a >= 1 ? v.toFixed(2) : a >= 0.1 ? v.toFixed(3) : v.toFixed(4);
        };

        const positions = [4, ampH / 2, Math.max(4, ampH - 4)];
        [peak, 0, -peak].forEach((value, i) => {
            const span = document.createElement('span');
            span.textContent = value === 0 ? '0.000' : `${value > 0 ? '+' : ''}${fmt(value)}`;
            span.style.top = `${positions[i]}px`;
            el.appendChild(span);
        });
    }

    // ═════════════════════════════════════════════════════════════════
    //  Viewport & Scroll
    // ═════════════════════════════════════════════════════════════════

    _getViewportWidth() {
        return Math.max(1, this.d.canvasWrapper.clientWidth || this.d.waveformWrapper.clientWidth);
    }

    _setLinkedScrollLeft(nextLeft) {
        if (this.scrollSyncLock) return;
        this.scrollSyncLock = true;

        const vw = this._getViewportWidth();
        const tw = this.audioBuffer ? Math.max(1, Math.floor(this.audioBuffer.duration * this.pixelsPerSecond)) : 0;
        const maxScroll = Math.max(0, tw - vw);
        const bounded = Math.max(0, Math.min(nextLeft, maxScroll));

        this.d.canvasWrapper.scrollLeft = bounded;
        // Use spectrogram wrapper as single source of truth to avoid drift.
        this.d.waveformWrapper.scrollLeft = this.d.canvasWrapper.scrollLeft;

        this.scrollSyncLock = false;
        this._syncOverviewWindowToViewport();
    }

    _setPixelsPerSecond(nextPps, redraw, anchorTime, anchorPixel) {
        const minPps = Number(this.d.zoomSlider.min);
        const maxPps = Number(this.d.zoomSlider.max);
        const sliderStep = Number(this.d.zoomSlider.step || 1);
        const vw = this._getViewportWidth();
        const duration = this.audioBuffer?.duration || 0;

        const clamped = Math.max(minPps, Math.min(maxPps, nextPps));
        const changed = Math.abs(clamped - this.pixelsPerSecond) >= 0.01;

        const fallbackTime = (this.d.canvasWrapper.scrollLeft + vw / 2) / Math.max(this.pixelsPerSecond, 0.01);
        const aTime = anchorTime ?? fallbackTime;
        const aPixel = anchorPixel ?? (vw / 2);

        const effectivePps = changed ? clamped : this.pixelsPerSecond;
        const estWidth = duration ? Math.max(1, Math.floor(duration * effectivePps)) : 0;
        const maxScroll = Math.max(0, estWidth - vw);
        const nextScroll = aTime * effectivePps - aPixel;
        const bounded = Math.max(0, Math.min(maxScroll, nextScroll));

        if (changed) {
            this.pixelsPerSecond = effectivePps;
            this.d.zoomSlider.value = String(Math.round(effectivePps / sliderStep) * sliderStep);
            this.d.zoomValue.textContent = `${Math.round(effectivePps)} px/s`;

            if (this.wavesurfer) this.wavesurfer.zoom(effectivePps);
            if (this.audioBuffer && redraw) {
                if (this.spectrogramData && this.spectrogramFrames > 0) this._drawSpectrogram();
                this._drawMainWaveform();
            }
        }

        this._setLinkedScrollLeft(bounded);
    }

    _fitEntireTrackInView() {
        if (!this.audioBuffer) return;
        const fitPps = this._getViewportWidth() / Math.max(0.05, this.audioBuffer.duration);
        this._setPixelsPerSecond(fitPps, true, 0, 0);
    }

    _centerViewportAtTime(timeSec) {
        if (!this.audioBuffer) return;
        const vw = this._getViewportWidth();
        const viewDur = vw / this.pixelsPerSecond;
        let start = timeSec - viewDur / 2;
        start = Math.max(0, Math.min(start, Math.max(0, this.audioBuffer.duration - viewDur)));
        this._setLinkedScrollLeft(start * this.pixelsPerSecond);
    }

    _clientXToTime(clientX, source = 'spectrogram') {
        const wrapper = source === 'waveform' ? this.d.waveformWrapper : this.d.canvasWrapper;
        const rect = wrapper.getBoundingClientRect();
        const x = clientX - rect.left + wrapper.scrollLeft;
        const refWidth = source === 'waveform' ? this.d.amplitudeCanvas.width : this.d.spectrogramCanvas.width;
        const dur = this.audioBuffer?.duration || 0;
        const t = (x / Math.max(1, refWidth)) * dur;
        return Math.max(0, Math.min(t, dur));
    }

    // ═════════════════════════════════════════════════════════════════
    //  Overview Navigator
    // ═════════════════════════════════════════════════════════════════

    _syncOverviewWindowToViewport() {
        if (!this.audioBuffer || this.d.spectrogramCanvas.width <= 0) return;

        const vw = this._getViewportWidth();
        const viewTime = vw / this.pixelsPerSecond;
        const startTime = this.d.canvasWrapper.scrollLeft / this.pixelsPerSecond;
        const endTime = Math.min(this.audioBuffer.duration, startTime + viewTime);

        this.windowStartNorm = startTime / this.audioBuffer.duration;
        this.windowEndNorm = endTime / this.audioBuffer.duration;
        this._updateOverviewWindowElement();
        this.d.viewRangeDisplay.textContent = `${formatSecondsShort(startTime)} – ${formatSecondsShort(endTime)}`;
    }

    _updateOverviewWindowElement() {
        const cw = this.d.overviewContainer.clientWidth;
        const left = this.windowStartNorm * cw;
        const width = Math.max(8, this.windowEndNorm * cw - left);
        this.d.overviewWindow.style.left = `${left}px`;
        this.d.overviewWindow.style.width = `${width}px`;
    }

    _startOverviewDrag(mode, clientX) {
        this.overviewMode = mode;
        this.overviewDragStartX = clientX;
        this.overviewDragStart = this.windowStartNorm;
        this.overviewDragEnd = this.windowEndNorm;
    }

    _updateOverviewDrag(clientX) {
        if (!this.audioBuffer || !this.overviewMode) return;

        const cw = this.d.overviewContainer.clientWidth;
        const deltaNorm = (clientX - this.overviewDragStartX) / cw;

        if (this.overviewMode === 'move') {
            let s = this.overviewDragStart + deltaNorm;
            let e = this.overviewDragEnd + deltaNorm;
            const span = e - s;
            if (s < 0) { s = 0; e = span; }
            if (e > 1) { e = 1; s = 1 - span; }
            this.windowStartNorm = s;
            this.windowEndNorm = e;
        } else if (this.overviewMode === 'left') {
            this.windowStartNorm = Math.max(0, Math.min(
                this.overviewDragStart + deltaNorm,
                this.windowEndNorm - MIN_WINDOW_NORM,
            ));
        } else if (this.overviewMode === 'right') {
            this.windowEndNorm = Math.min(1, Math.max(
                this.overviewDragEnd + deltaNorm,
                this.windowStartNorm + MIN_WINDOW_NORM,
            ));
        }

        this._updateOverviewWindowElement();
        this._applyOverviewWindowToViewport();
    }

    _applyOverviewWindowToViewport() {
        if (!this.audioBuffer) return;
        const dur = this.audioBuffer.duration;
        const viewDur = Math.max(0.01, (this.windowEndNorm - this.windowStartNorm) * dur);
        const targetPps = this._getViewportWidth() / viewDur;
        this._setPixelsPerSecond(targetPps, true, this.windowStartNorm * dur, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    //  Click / Pointer / Drag
    // ═════════════════════════════════════════════════════════════════

    _handleCanvasClick(e) {
        if (this.suppressSeekClick) { this.suppressSeekClick = false; return; }
        if (!this.audioBuffer) return;
        this._seekToTime(this._clientXToTime(e.clientX, 'spectrogram'), false);
    }

    _handleWaveformClick(e) {
        if (this.suppressSeekClick) { this.suppressSeekClick = false; return; }
        if (!this.audioBuffer) return;
        this._seekToTime(this._clientXToTime(e.clientX, 'waveform'), false);
    }

    _startPlayheadDrag(event, source) {
        if (!this.audioBuffer) return;
        event.preventDefault();
        this.draggingPlayhead = true;
        this.draggingPlayheadSource = source;
        this._seekFromClientX(event.clientX, source);
    }

    _seekFromClientX(clientX, source = 'spectrogram') {
        if (!this.audioBuffer) return;
        this._seekToTime(this._clientXToTime(clientX, source), false);
    }

    _startViewportPan(event, source) {
        if (!this.audioBuffer) return;
        if (event.target === this.d.playhead || event.target === this.d.waveformPlayhead) return;
        if (event.button !== 0 && event.button !== 1) return;
        if (event.button === 1) event.preventDefault();

        this.draggingViewport = true;
        this.viewportPanStartX = event.clientX;
        this.viewportPanStartScroll = source === 'waveform'
            ? this.d.waveformWrapper.scrollLeft
            : this.d.canvasWrapper.scrollLeft;
        this.suppressSeekClick = false;
        document.body.style.cursor = 'grabbing';
    }

    _updateViewportPan(clientX) {
        const dx = clientX - this.viewportPanStartX;
        this.suppressSeekClick = Math.abs(dx) > 3;
        this._setLinkedScrollLeft(this.viewportPanStartScroll - dx);
    }

    // ═════════════════════════════════════════════════════════════════
    //  Wheel Zoom / Scroll
    // ═════════════════════════════════════════════════════════════════

    _handleWheel(event, source) {
        if (!this.audioBuffer) return;

        const wrapper = source === 'waveform' ? this.d.waveformWrapper : this.d.canvasWrapper;
        const rect = wrapper.getBoundingClientRect();
        const localX = event.clientX - rect.left;
        const timeAtCursor = (wrapper.scrollLeft + localX) / this.pixelsPerSecond;

        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
            this._setPixelsPerSecond(this.pixelsPerSecond * factor, true, timeAtCursor, localX);
            return;
        }

        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            this._setLinkedScrollLeft(Math.max(0, wrapper.scrollLeft + event.deltaY));
        }
    }

    // ═════════════════════════════════════════════════════════════════
    //  View Resize
    // ═════════════════════════════════════════════════════════════════

    _applyLocalViewHeights() {
        this.d.waveformContainer.style.height = `${Math.round(this.waveformDisplayHeight)}px`;
        this.d.spectrogramContainer.style.height = `${Math.round(this.spectrogramDisplayHeight)}px`;
    }

    _startViewResize(mode, clientY) {
        this.viewResizeMode = mode;
        this.viewResizeStartY = clientY;
        this.viewResizeStartWaveformHeight = this.waveformDisplayHeight;
        this.viewResizeStartSpectrogramHeight = this.spectrogramDisplayHeight;
        document.body.style.cursor = 'row-resize';
    }

    _updateViewResize(clientY) {
        if (!this.viewResizeMode) return;
        const dy = clientY - this.viewResizeStartY;
        const savedScroll = this.d.canvasWrapper.scrollLeft;
        let redrawWav = false;

        if (this.viewResizeMode === 'split') {
            const total = this.viewResizeStartWaveformHeight + this.viewResizeStartSpectrogramHeight;
            let nextWav = this.viewResizeStartWaveformHeight + dy;
            nextWav = Math.max(MIN_WAVEFORM_HEIGHT, Math.min(total - MIN_SPECTROGRAM_DISPLAY_HEIGHT, nextWav));
            this.waveformDisplayHeight = nextWav;
            this.spectrogramDisplayHeight = total - nextWav;
            redrawWav = true;
        } else {
            this.spectrogramDisplayHeight = Math.max(
                MIN_SPECTROGRAM_DISPLAY_HEIGHT,
                this.viewResizeStartSpectrogramHeight + dy,
            );
        }

        this._applyLocalViewHeights();
        if (redrawWav) this._updateAmplitudeLabels();
        if (!this.audioBuffer) return;
        if (redrawWav) this._drawMainWaveform();
        if (this.spectrogramData && this.spectrogramFrames > 0) this._drawSpectrogram();
        this._setLinkedScrollLeft(savedScroll);
    }

    _stopViewResize() {
        if (!this.viewResizeMode) return;
        this.viewResizeMode = null;
        document.body.style.cursor = '';
    }

    // ═════════════════════════════════════════════════════════════════
    //  UI State Helpers
    // ═════════════════════════════════════════════════════════════════

    _setPlayState(text) {
        this.d.playStateDisplay.textContent = text;
    }

    _setTransportEnabled(enabled) {
        [
            this.d.playPauseBtn, this.d.stopBtn,
            this.d.jumpStartBtn, this.d.jumpEndBtn,
            this.d.backwardBtn, this.d.forwardBtn,
            this.d.followToggleBtn, this.d.loopToggleBtn,
            this.d.fitViewBtn, this.d.resetViewBtn,
            this.d.autoContrastBtn, this.d.autoFreqBtn,
        ].forEach((btn) => { btn.disabled = !enabled; });
    }

    _updateToggleButtons() {
        this.d.followToggleBtn.classList.toggle('active', this.followPlayback);
        this.d.loopToggleBtn.classList.toggle('active', this.loopPlayback);
        this.d.followToggleBtn.textContent = this.followPlayback ? 'Follow' : 'Free';
        this.d.loopToggleBtn.textContent = this.loopPlayback ? 'Loop On' : 'Loop';
    }

    _setInitialPlayheadPositions() {
        this.d.playhead.style.left = '0px';
        this.d.waveformPlayhead.style.left = '0px';
        this.d.playhead.style.transform = 'translateX(0px)';
        this.d.waveformPlayhead.style.transform = 'translateX(0px)';
    }

    // ═════════════════════════════════════════════════════════════════
    //  Keyboard
    // ═════════════════════════════════════════════════════════════════

    _handleKeyboardShortcuts(event) {
        if (!this.audioBuffer || isTypingContext(event.target)) return;

        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this._togglePlayPause();
                break;
            case 'Home':
                event.preventDefault();
                this._seekToTime(0, true);
                break;
            case 'End':
                event.preventDefault();
                this._seekToTime(this.audioBuffer.duration, true);
                break;
            case 'KeyJ':
                event.preventDefault();
                this._seekByDelta(-SEEK_COARSE_SEC);
                break;
            case 'KeyL':
                event.preventDefault();
                this._seekByDelta(SEEK_COARSE_SEC);
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this._seekByDelta(-SEEK_FINE_SEC);
                break;
            case 'ArrowRight':
                event.preventDefault();
                this._seekByDelta(SEEK_FINE_SEC);
                break;
        }
    }

    // ═════════════════════════════════════════════════════════════════
    //  Event Binding
    // ═════════════════════════════════════════════════════════════════

    _bindEvents() {
        const on = (target, type, fn, opts) => {
            target.addEventListener(type, fn, opts);
            this._cleanups.push(() => target.removeEventListener(type, fn, opts));
        };

        // ── File / transport ──
        on(this.d.openFileBtn, 'click', () => this.d.audioFile.click());
        on(this.d.audioFile, 'change', (e) => this._handleFileSelect(e));
        on(this.d.playPauseBtn, 'click', () => this._togglePlayPause());
        on(this.d.stopBtn, 'click', () => this._stopPlayback());
        on(this.d.jumpStartBtn, 'click', () => this._seekToTime(0, true));
        on(this.d.jumpEndBtn, 'click', () => this._seekToTime(this.audioBuffer?.duration ?? 0, true));
        on(this.d.backwardBtn, 'click', () => this._seekByDelta(-SEEK_COARSE_SEC));
        on(this.d.forwardBtn, 'click', () => this._seekByDelta(SEEK_COARSE_SEC));
        on(this.d.followToggleBtn, 'click', () => { this.followPlayback = !this.followPlayback; this._updateToggleButtons(); });
        on(this.d.loopToggleBtn, 'click', () => { this.loopPlayback = !this.loopPlayback; this._updateToggleButtons(); });
        on(this.d.fitViewBtn, 'click', () => this._fitEntireTrackInView());
        on(this.d.resetViewBtn, 'click', () => {
            this._setPixelsPerSecond(DEFAULT_ZOOM_PPS, true);
            this._setLinkedScrollLeft(0);
            this._syncOverviewWindowToViewport();
        });

        // ── Settings ──
        on(this.d.fftSizeSelect, 'change', () => { if (this.audioBuffer) this._generateSpectrogram(); });
        on(this.d.maxFreqSelect, 'change', () => {
            if (this.audioBuffer && this.spectrogramData && this.spectrogramFrames > 0) {
                this._createFrequencyLabels();
                this._buildSpectrogramGrayscale();  // maxFreq affects spatial layout
                this._buildSpectrogramBaseImage();
                this._drawSpectrogram();
            }
        });
        on(this.d.colorSchemeSelect, 'change', () => {
            this.currentColorScheme = this.d.colorSchemeSelect.value;
            if (this.audioBuffer && this.spectrogramData && this.spectrogramFrames > 0) {
                this._buildSpectrogramBaseImage();
                this._drawSpectrogram();
            }
        });
        on(this.d.zoomSlider, 'input', (e) => {
            this._setPixelsPerSecond(parseFloat(e.target.value), false);
            this._requestSpectrogramRedraw();
        });
        on(this.d.zoomSlider, 'change', () => {
            if (this.spectrogramData && this.spectrogramFrames > 0) this._drawSpectrogram();
        });

        // ── Volume ──
        on(this.d.volumeSlider, 'input', (e) => {
            this.muted = false;
            this._setVolume(parseFloat(e.target.value) / 100);
        });
        on(this.d.volumeToggleBtn, 'click', () => this._toggleMute());

        // ── Display Floor / Ceiling (Stage 2 only — fast) ──
        const rebuildDisplay = () => {
            if (!this.spectrogramData || this.spectrogramFrames <= 0) return;
            this._buildSpectrogramBaseImage();
            this._drawSpectrogram();
        };
        on(this.d.floorSlider, 'input', rebuildDisplay);
        on(this.d.ceilSlider, 'input', rebuildDisplay);
        on(this.d.autoContrastBtn, 'click', () => this._autoContrast(true));
        on(this.d.autoFreqBtn, 'click', () => this._autoFrequency(true));

        // ── Canvas interaction ──
        on(this.d.canvasWrapper, 'click', (e) => this._handleCanvasClick(e));
        on(this.d.waveformWrapper, 'click', (e) => this._handleWaveformClick(e));
        on(this.d.canvasWrapper, 'scroll', () => {
            if (!this.scrollSyncLock) this._setLinkedScrollLeft(this.d.canvasWrapper.scrollLeft);
        });
        on(this.d.canvasWrapper, 'wheel', (e) => this._handleWheel(e, 'spectrogram'), { passive: false });
        on(this.d.waveformWrapper, 'wheel', (e) => this._handleWheel(e, 'waveform'), { passive: false });
        on(this.d.canvasWrapper, 'pointerdown', (e) => this._startViewportPan(e, 'spectrogram'));
        on(this.d.waveformWrapper, 'pointerdown', (e) => this._startViewportPan(e, 'waveform'));

        // ── Playhead drag ──
        on(this.d.playhead, 'pointerdown', (e) => this._startPlayheadDrag(e, 'spectrogram'));
        on(this.d.waveformPlayhead, 'pointerdown', (e) => this._startPlayheadDrag(e, 'waveform'));

        // ── View resize ──
        on(this.d.viewSplitHandle, 'pointerdown', (e) => { e.preventDefault(); this._startViewResize('split', e.clientY); });
        on(this.d.spectrogramResizeHandle, 'pointerdown', (e) => { e.preventDefault(); this._startViewResize('spectrogram', e.clientY); });

        // ── Document-level pointer ──
        on(document, 'pointermove', (e) => {
            if (this.viewResizeMode) { this._updateViewResize(e.clientY); return; }
            if (this.draggingViewport) this._updateViewportPan(e.clientX);
            if (this.draggingPlayhead) this._seekFromClientX(e.clientX, this.draggingPlayheadSource);
            if (this.overviewMode) this._updateOverviewDrag(e.clientX);
        });

        const releaseAll = () => {
            this._stopViewResize();
            if (this.draggingViewport) { this.draggingViewport = false; document.body.style.cursor = ''; }
            this.draggingPlayhead = false;
            this.draggingPlayheadSource = null;
            this.overviewMode = null;
        };
        on(document, 'pointerup', releaseAll);
        on(document, 'pointercancel', releaseAll);

        // ── Keyboard ──
        on(document, 'keydown', (e) => this._handleKeyboardShortcuts(e));

        // ── Overview ──
        on(this.d.overviewHandleLeft, 'pointerdown', (e) => { e.preventDefault(); this._startOverviewDrag('left', e.clientX); });
        on(this.d.overviewHandleRight, 'pointerdown', (e) => { e.preventDefault(); this._startOverviewDrag('right', e.clientX); });
        on(this.d.overviewWindow, 'pointerdown', (e) => {
            if (e.target === this.d.overviewHandleLeft || e.target === this.d.overviewHandleRight) return;
            e.preventDefault();
            this._startOverviewDrag('move', e.clientX);
        });
        on(this.d.overviewCanvas, 'click', (e) => {
            if (!this.audioBuffer) return;
            const rect = this.d.overviewCanvas.getBoundingClientRect();
            const xNorm = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            this._seekToTime(xNorm * this.audioBuffer.duration, true);
        });

        // ── Window ──
        on(window, 'resize', () => {
            if (!this.audioBuffer) return;
            this._drawMainWaveform();
            this._drawOverviewWaveform();
            this._syncOverviewWindowToViewport();
        });
        on(window, 'beforeunload', () => this.dispose());
    }
}
