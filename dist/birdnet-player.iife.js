/* BirdNET Audio Player — bundled IIFE build */

var BirdNETPlayerModule=(()=>{var A=Object.defineProperty;var lt=Object.getOwnPropertyDescriptor;var ct=Object.getOwnPropertyNames;var ht=Object.prototype.hasOwnProperty;var dt=(r,t)=>{for(var e in t)A(r,e,{get:t[e],enumerable:!0})},pt=(r,t,e,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of ct(t))!ht.call(r,o)&&o!==e&&A(r,o,{get:()=>t[o],enumerable:!(a=lt(t,o))||a.enumerable});return r};var ut=r=>pt(A({},"__esModule",{value:!0}),r);var Et={};dt(Et,{BirdNETPlayer:()=>F});var W=document.createElement("style");W.textContent=`:root {
    --axis-width: 52px;
    --waveform-height: 100px;
    --spectrogram-height: 200px;
    --toolbar-height: 40px;
    --statusbar-height: 24px;
    --color-bg-primary: #1a1a2e;
    --color-bg-secondary: #16213e;
    --color-bg-tertiary: #0f3460;
    --color-bg-surface: #1a1a2e;
    --color-text-primary: #e0e0e0;
    --color-text-secondary: #8892a4;
    --color-accent: #38bdf8;
    --color-accent-hover: #0ea5e9;
    --color-border: rgba(255,255,255,0.08);
    --color-playhead: #ef4444;
    --color-toolbar: #12121f;
    --color-statusbar: #0e0e1a;
}

@media (prefers-color-scheme: light) {
    :root {
        --color-bg-primary: #f0f0f4;
        --color-bg-secondary: #e8e8ee;
        --color-bg-tertiary: #d4d4dc;
        --color-bg-surface: #ffffff;
        --color-text-primary: #1a1a2e;
        --color-text-secondary: #555568;
        --color-accent: #0284c7;
        --color-accent-hover: #0369a1;
        --color-playhead: #dc2626;
        --color-border: rgba(0,0,0,0.1);
        --color-toolbar: #e0e0e8;
        --color-statusbar: #d8d8e2;
    }
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    height: 100vh;
    overflow: hidden;
}

/* \u2550\u2550\u2550 DAW Shell \u2550\u2550\u2550 */

.daw-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
}

/* \u2550\u2550\u2550 Top Toolbar \u2550\u2550\u2550 */

.toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    height: var(--toolbar-height);
    min-height: var(--toolbar-height);
    padding: 0 8px;
    background: var(--color-toolbar);
    border-bottom: 1px solid var(--color-border);
    user-select: none;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
}

.toolbar::-webkit-scrollbar { display: none; }

.toolbar-sep {
    width: 1px;
    height: 22px;
    background: var(--color-border);
    flex-shrink: 0;
}

.toolbar-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 28px;
    padding: 0 10px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: transparent;
    color: var(--color-text-primary);
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 0.1s, border-color 0.1s;
}

.toolbar-btn:hover {
    background: rgba(255,255,255,0.06);
    border-color: var(--color-accent);
}

.toolbar-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.toolbar-btn.file-btn {
    background: var(--color-accent);
    color: #fff;
    border-color: transparent;
    font-weight: 600;
}

.toolbar-btn.file-btn:hover {
    background: var(--color-accent-hover);
}

.toolbar-btn.toggle-btn.active {
    background: var(--color-accent);
    color: #fff;
    border-color: transparent;
}

.toolbar-label {
    font-size: 0.72rem;
    color: var(--color-text-secondary);
    flex-shrink: 0;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.toolbar-select {
    height: 26px;
    padding: 0 6px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    font-size: 0.78rem;
    cursor: pointer;
    flex-shrink: 0;
}

.toolbar-range {
    width: 100px;
    min-width: 60px;
    max-width: 140px;
    height: 4px;
    accent-color: var(--color-accent);
    cursor: pointer;
    flex-shrink: 1;
}
.toolbar-range-sm {
    width: 64px;
    min-width: 40px;
    max-width: 80px;
}
.icon-btn {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 2px 4px;
    display: inline-flex;
    align-items: center;
}
.icon-btn:hover { color: var(--color-text-primary); }
.icon-btn.muted { color: var(--color-accent-dim, #664444); }

.mini-btn {
    background: var(--color-surface-light, #2a2a3e);
    border: 1px solid var(--color-border);
    border-radius: 3px;
    color: var(--color-text-secondary);
    font-size: 0.68rem;
    font-weight: 600;
    padding: 1px 5px;
    cursor: pointer;
    line-height: 1.3;
    flex-shrink: 0;
}
.mini-btn:hover:not(:disabled) {
    color: var(--color-text-primary);
    border-color: var(--color-accent);
}
.mini-btn:disabled { opacity: 0.35; cursor: default; }

.toolbar-value {
    font-size: 0.72rem;
    font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
    color: var(--color-text-secondary);
    min-width: 56px;
    flex-shrink: 0;
}

/* \u2550\u2550\u2550 Transport \u2550\u2550\u2550 */

.transport {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
}

.transport-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 28px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
}

.transport-btn:hover:not(:disabled) {
    background: rgba(255,255,255,0.08);
    color: var(--color-text-primary);
}

.transport-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.transport-btn.play-btn {
    width: 34px;
    height: 30px;
    background: var(--color-accent);
    color: #fff;
    border-radius: 6px;
}

.transport-btn.play-btn:hover:not(:disabled) {
    background: var(--color-accent-hover);
}

.transport-btn.play-btn:disabled {
    opacity: 0.4;
}

.transport-btn.play-btn.playing .icon-play {
    /* Swap to pause icon via CSS */
    display: none;
}

.transport-btn.play-btn.playing::after {
    content: '';
    display: block;
    width: 12px;
    height: 14px;
    border-left: 4px solid #fff;
    border-right: 4px solid #fff;
}

/* \u2550\u2550\u2550 Time Display \u2550\u2550\u2550 */

.time-display {
    font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--color-text-primary);
    padding: 0 10px;
    height: 28px;
    line-height: 28px;
    background: rgba(0,0,0,0.25);
    border-radius: 4px;
    border: 1px solid var(--color-border);
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: 0.02em;
}

.time-sep {
    color: var(--color-text-secondary);
    margin: 0 2px;
}

/* \u2550\u2550\u2550 Views Panel \u2550\u2550\u2550 */

.views-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: var(--color-bg-primary);
}

.spectrogram-container {
    position: relative;
    background: var(--color-bg-secondary);
    overflow: hidden;
    height: var(--spectrogram-height);
    border-top: 1px solid var(--color-border);
}

.canvas-wrapper {
    position: relative;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    cursor: crosshair;
    touch-action: pan-y;
}

.canvas-wrapper::-webkit-scrollbar {
    height: 6px;
}

.canvas-wrapper::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
}

.canvas-wrapper::-webkit-scrollbar-thumb {
    background: var(--color-text-secondary);
    border-radius: 3px;
}

#spectrogramCanvas {
    display: block;
    image-rendering: pixelated;
}

.playhead {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--color-playhead);
    pointer-events: auto;
    cursor: ew-resize;
    z-index: 10;
    box-shadow: 0 0 6px var(--color-playhead);
    touch-action: none;
    will-change: transform;
}

.playhead::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -4px;
    width: 10px;
    height: 10px;
    background: var(--color-playhead);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 0 6px var(--color-playhead);
}

.waveform-container {
    position: relative;
    height: var(--waveform-height);
    background: var(--color-bg-secondary);
    overflow: hidden;
}

.time-aligned-row {
    display: flex;
    width: 100%;
    height: 100%;
}

.axis-spacer {
    position: relative;
    width: var(--axis-width);
    flex: 0 0 var(--axis-width);
    border-right: 1px solid var(--color-border);
    background: var(--color-bg-secondary);
}

.time-pane {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.waveform-wrapper {
    position: relative;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    cursor: crosshair;
    background: var(--color-bg-secondary);
    touch-action: pan-y;
}

.waveform-wrapper::-webkit-scrollbar { height: 0; }
.waveform-wrapper::-webkit-scrollbar-track { background: transparent; }
.waveform-wrapper::-webkit-scrollbar-thumb { background: transparent; }

.waveform-content {
    position: relative;
}

#amplitudeCanvas {
    display: block;
    image-rendering: pixelated;
}

#waveformTimelineCanvas {
    display: block;
}

.view-split-handle {
    height: 5px;
    background: var(--color-bg-primary);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    cursor: row-resize;
    touch-action: none;
    transition: background 0.15s;
}

.view-split-handle:hover {
    background: var(--color-accent);
    opacity: 0.5;
}

.spectrogram-resize-handle {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    background: transparent;
    cursor: row-resize;
    touch-action: none;
    z-index: 11;
    transition: background 0.15s;
}

.spectrogram-resize-handle:hover {
    background: rgba(56, 189, 248, 0.3);
}

.playhead-secondary {
    top: 0;
    bottom: 0;
    box-shadow: 0 0 6px var(--color-playhead);
}

.playhead-secondary::before {
    display: none;
}

/* \u2550\u2550\u2550 Overview \u2550\u2550\u2550 */

.overview-container {
    position: relative;
    height: 48px;
    min-height: 48px;
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border);
    overflow: hidden;
}

#overviewCanvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.overview-window {
    position: absolute;
    top: 0;
    bottom: 0;
    border-left: 2px solid var(--color-accent);
    border-right: 2px solid var(--color-accent);
    background: rgba(56, 189, 248, 0.08);
    pointer-events: auto;
    cursor: grab;
    box-sizing: border-box;
}

.overview-window:active {
    cursor: grabbing;
}

.overview-window .handle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 8px;
    background: rgba(56, 189, 248, 0.6);
    pointer-events: auto;
    cursor: ew-resize;
    touch-action: none;
}

.overview-window .handle.left { left: -4px; }
.overview-window .handle.right { right: -4px; }

/* \u2550\u2550\u2550 Amplitude Labels \u2550\u2550\u2550 */

.amplitude-labels {
    position: absolute;
    inset: 0;
    font-size: 0.68rem;
    color: var(--color-text-secondary);
    pointer-events: none;
}

.amplitude-labels span {
    position: absolute;
    right: 4px;
    transform: translateY(-50%);
    font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.65rem;
    line-height: 1;
    white-space: nowrap;
}

/* \u2550\u2550\u2550 Frequency Labels \u2550\u2550\u2550 */

.freq-axis-spacer {
    display: flex;
    align-items: stretch;
}

.frequency-labels {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    padding: 4px 4px 3px 2px;
    font-size: 0.68rem;
    color: var(--color-text-secondary);
    pointer-events: none;
}

.frequency-labels span {
    width: 100%;
    text-align: right;
    padding-right: 2px;
    font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.65rem;
    white-space: nowrap;
}

/* \u2550\u2550\u2550 Status Bar \u2550\u2550\u2550 */

.statusbar {
    display: flex;
    align-items: center;
    height: var(--statusbar-height);
    min-height: var(--statusbar-height);
    padding: 0 10px;
    background: var(--color-statusbar);
    border-top: 1px solid var(--color-border);
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    user-select: none;
    gap: 4px;
}

.statusbar-section {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 8px;
    white-space: nowrap;
}

.statusbar-section:not(:last-child) {
    border-right: 1px solid var(--color-border);
}

.statusbar-spacer {
    flex: 1;
}

.statusbar-label {
    font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
}

/* \u2550\u2550\u2550 Utility \u2550\u2550\u2550 */

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.loading {
    animation: pulse 1.5s ease-in-out infinite;
}

@media (max-width: 900px) {
    .toolbar {
        gap: 4px;
        padding: 0 4px;
    }

    .toolbar-btn {
        padding: 0 6px;
        font-size: 0.72rem;
    }

    .transport-btn {
        width: 26px;
        height: 26px;
    }
}
`;document.head.appendChild(W);var H={showFileOpen:!0,showTransport:!0,showTime:!0,showVolume:!0,showViewToggles:!0,showZoom:!0,showFFTControls:!0,showDisplayGain:!0,showStatusbar:!0};function V(r={}){let t={...H,...r},e=a=>a?"":' style="display:none"';return`<div class="daw-shell">

    <!-- \u2550\u2550\u2550 Top Toolbar \u2550\u2550\u2550 -->
    <div class="toolbar">
        <button class="toolbar-btn file-btn" id="openFileBtn" title="Audio-Datei laden"${e(t.showFileOpen)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Open
        </button>
        <input type="file" id="audioFile" accept="audio/*" hidden>

        <div class="toolbar-sep"${e(t.showFileOpen)}></div>

        <!-- Transport -->
        <div class="transport"${e(t.showTransport)}>
            <button class="transport-btn" id="jumpStartBtn" disabled title="Zum Anfang (Home)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="3" height="14"/><polygon points="20 5 10 12 20 19"/></svg>
            </button>
            <button class="transport-btn" id="backwardBtn" disabled title="-5s (J)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 5 9 12 19 19"/><polygon points="12 5 2 12 12 19"/></svg>
            </button>
            <button class="transport-btn play-btn" id="playPauseBtn" disabled title="Play / Pause (Space)">
                <svg class="icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21"/></svg>
            </button>
            <button class="transport-btn" id="stopBtn" disabled title="Stop">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
            </button>
            <button class="transport-btn" id="forwardBtn" disabled title="+5s (L)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 5 15 12 5 19"/><polygon points="12 5 22 12 12 19"/></svg>
            </button>
            <button class="transport-btn" id="jumpEndBtn" disabled title="Zum Ende (End)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="4 5 14 12 4 19"/><rect x="18" y="5" width="3" height="14"/></svg>
            </button>
        </div>

        <!-- Time -->
        <div class="time-display" id="timeDisplay"${e(t.showTime)}>
            <span id="currentTime">00:00.0</span><span class="time-sep">/</span><span id="totalTime">00:00.0</span>
        </div>

        <div class="toolbar-sep"${e(t.showVolume)}></div>

        <!-- Volume -->
        <button class="toolbar-btn icon-btn" id="volumeToggleBtn" title="Mute / Unmute"${e(t.showVolume)}>
            <svg id="volumeIcon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path id="volumeWaves" d="M15 8.5a4 4 0 010 7M18 5a9 9 0 010 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
        <input type="range" id="volumeSlider" class="toolbar-range toolbar-range-sm" min="0" max="100" value="80" title="Lautst\xE4rke"${e(t.showVolume)}>

        <div class="toolbar-sep"${e(t.showViewToggles)}></div>

        <!-- Toggle tools -->
        <span${e(t.showViewToggles)}>
            <button class="toolbar-btn toggle-btn active" id="followToggleBtn" disabled title="Playhead folgen">Follow</button>
            <button class="toolbar-btn toggle-btn" id="loopToggleBtn" disabled title="Loop">Loop</button>
            <button class="toolbar-btn" id="fitViewBtn" disabled title="Fit to view">Fit</button>
            <button class="toolbar-btn" id="resetViewBtn" disabled title="Reset zoom">Reset</button>
        </span>

        <div class="toolbar-sep"${e(t.showZoom)}></div>

        <!-- Zoom -->
        <span${e(t.showZoom)}>
            <label class="toolbar-label" for="zoomSlider">Zoom</label>
            <input type="range" id="zoomSlider" class="toolbar-range" min="20" max="600" value="100" step="5">
            <span class="toolbar-value" id="zoomValue">100 px/s</span>
        </span>

        <div class="toolbar-sep"${e(t.showFFTControls)}></div>

        <!-- Settings -->
        <span${e(t.showFFTControls)}>
            <label class="toolbar-label" for="fftSize">FFT</label>
            <select id="fftSize" class="toolbar-select">
                <option value="1024">1024</option>
                <option value="2048" selected>2048</option>
                <option value="4096">4096</option>
            </select>

            <label class="toolbar-label" for="maxFreqSelect">Freq</label>
            <select id="maxFreqSelect" class="toolbar-select">
                <option value="4000">4k</option>
                <option value="6000">6k</option>
                <option value="8000">8k</option>
                <option value="10000" selected>10k</option>
                <option value="12000">12k</option>
                <option value="16000">16k</option>
            </select>
            <button class="toolbar-btn mini-btn" id="autoFreqBtn" disabled title="Frequenzbereich automatisch erkennen">AF</button>

            <label class="toolbar-label" for="colorSchemeSelect">Color</label>
            <select id="colorSchemeSelect" class="toolbar-select">
                <option value="fire" selected>Fire</option>
                <option value="grayscale">B/W</option>
                <option value="inferno">Inferno</option>
                <option value="viridis">Viridis</option>
                <option value="magma">Magma</option>
                <option value="plasma">Plasma</option>
            </select>
        </span>

        <div class="toolbar-sep"${e(t.showDisplayGain)}></div>

        <!-- Display gain: SDR#-style floor / ceiling -->
        <span${e(t.showDisplayGain)}>
            <label class="toolbar-label">Floor</label>
            <input type="range" id="floorSlider" class="toolbar-range toolbar-range-sm" min="0" max="100" value="0" title="Spectrogram Floor (Schwarzpunkt)">
            <label class="toolbar-label">Ceil</label>
            <input type="range" id="ceilSlider" class="toolbar-range toolbar-range-sm" min="0" max="100" value="100" title="Spectrogram Ceiling (Wei\xDFpunkt)">
            <button class="toolbar-btn mini-btn" id="autoContrastBtn" disabled title="Kontrast automatisch optimieren">AC</button>
        </span>
    </div>

    <!-- \u2550\u2550\u2550 Main Content \u2550\u2550\u2550 -->
    <div class="views-panel">
        <!-- Waveform -->
        <div class="waveform-container" id="waveformContainer">
            <div class="time-aligned-row">
                <div class="axis-spacer">
                    <div class="amplitude-labels" id="amplitudeLabels"></div>
                </div>
                <div class="time-pane">
                    <div class="waveform-wrapper" id="waveformWrapper">
                        <div class="waveform-content" id="waveformContent">
                            <canvas id="amplitudeCanvas"></canvas>
                            <canvas id="waveformTimelineCanvas"></canvas>
                        </div>
                        <div class="playhead playhead-secondary" id="waveformPlayhead"></div>
                    </div>
                </div>
            </div>
            <div id="audioEngineHost" style="position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;"></div>
        </div>

        <!-- Split handle -->
        <div class="view-split-handle" id="viewSplitHandle" title="Amplitude/Spektrogramm Verh\xE4ltnis anpassen"></div>

        <!-- Spectrogram -->
        <div class="spectrogram-container" id="spectrogramContainer">
            <div class="time-aligned-row">
                <div class="axis-spacer freq-axis-spacer">
                    <div class="frequency-labels" id="freqLabels"></div>
                </div>
                <div class="time-pane">
                    <div class="canvas-wrapper" id="canvasWrapper">
                        <canvas id="spectrogramCanvas"></canvas>
                        <div class="playhead" id="playhead"></div>
                    </div>
                </div>
            </div>
            <div class="spectrogram-resize-handle" id="spectrogramResizeHandle" title="Spektrogramm-H\xF6he anpassen"></div>
        </div>

        <!-- Overview -->
        <div class="overview-container" id="overviewContainer">
            <canvas id="overviewCanvas"></canvas>
            <div class="overview-window" id="overviewWindow">
                <div class="handle left" id="overviewHandleLeft"></div>
                <div class="handle right" id="overviewHandleRight"></div>
            </div>
        </div>
    </div>

    <!-- \u2550\u2550\u2550 Status Bar \u2550\u2550\u2550 -->
    <div class="statusbar"${e(t.showStatusbar)}>
        <div class="statusbar-section" id="fileInfo">
            <span class="statusbar-label">No file</span>
        </div>
        <div class="statusbar-section">
            <span class="statusbar-label" id="sampleRateInfo"></span>
        </div>
        <div class="statusbar-spacer"></div>
        <div class="statusbar-section">
            <span id="viewRange"></span>
        </div>
        <div class="statusbar-section">
            <span id="playState">Idle</span>
        </div>
    </div>
</div>`}function y(r){let t=Math.floor(r/60),e=(r%60).toFixed(1);return`${t.toString().padStart(2,"0")}:${e.toString().padStart(4,"0")}`}function z(r){return`${r.toFixed(2)}s`}function N(r){return!r||!r.tagName?!1:r.tagName==="INPUT"||r.tagName==="TEXTAREA"||r.tagName==="SELECT"||r.isContentEditable}function P(r){let t=r>=320?.5:r>=180?1:r>=90?2:r>=45?5:10;return{majorStep:t,minorStep:t/2}}function I(r){let t=0;for(let e=0;e<r.length;e++){let a=Math.abs(r[e]);a>t&&(t=a)}return Math.max(1e-6,t)}function O(r,t){let e=i=>700*(Math.pow(10,i/2595)-1),a=i=>2595*Math.log10(1+i/700),o=a(0),n=a(r/2),s=new Float32Array(t);for(let i=0;i<t;i++){let c=o+i/Math.max(1,t-1)*(n-o);s[i]=e(c)}return s}var D={inferno:[[0,0,4],[31,12,72],[85,15,109],[136,34,106],[186,54,85],[227,89,51],[249,140,10],[252,201,40],[252,255,164]],viridis:[[68,1,84],[68,2,86],[69,4,87],[69,5,89],[70,7,90],[70,8,92],[70,10,93],[70,11,94],[71,13,96],[71,14,97],[71,16,99],[71,17,100],[71,19,101],[72,20,103],[72,22,104],[72,23,105],[72,24,106],[72,26,108],[72,27,109],[72,28,110],[72,29,111],[72,31,112],[72,32,113],[72,33,115],[72,35,116],[72,36,117],[72,37,118],[72,38,119],[72,40,120],[72,41,121],[71,42,122],[71,44,122],[71,45,123],[71,46,124],[71,47,125],[70,48,126],[70,50,126],[70,51,127],[69,52,128],[69,53,129],[69,55,129],[68,56,130],[68,57,131],[68,58,131],[67,60,132],[67,61,132],[66,62,133],[66,63,133],[66,64,134],[65,66,134],[65,67,135],[64,68,135],[64,69,136],[63,71,136],[63,72,137],[62,73,137],[62,74,137],[62,76,138],[61,77,138],[61,78,138],[60,79,139],[60,80,139],[59,82,139],[59,83,140],[58,84,140],[58,85,140],[57,86,141],[57,88,141],[56,89,141],[56,90,141],[55,91,142],[55,92,142],[54,94,142],[54,95,142],[53,96,142],[53,97,143],[52,98,143],[52,99,143],[51,101,143],[51,102,143],[50,103,144],[50,104,144],[49,105,144],[49,106,144],[49,108,144],[48,109,144],[48,110,144],[47,111,145],[47,112,145],[46,113,145],[46,114,145],[45,116,145],[45,117,145],[44,118,145],[44,119,145],[44,120,146],[43,121,146],[43,122,146],[42,123,146],[42,125,146],[42,126,146],[41,127,146],[41,128,146],[40,129,146],[40,130,146],[40,131,146],[39,132,146],[39,133,146],[38,134,146],[38,136,146],[38,137,146],[37,138,146],[37,139,146],[36,140,146],[36,141,146],[36,142,146],[35,143,146],[35,144,146],[35,145,146],[34,146,146],[34,147,146],[33,148,146],[33,149,146],[33,150,146],[32,151,145],[32,152,145],[32,153,145],[31,154,145],[31,155,145],[31,156,145],[30,157,144],[30,158,144],[30,159,144],[30,160,144],[29,161,143],[29,162,143],[29,163,143],[29,164,142],[28,165,142],[28,166,142],[28,167,141],[28,168,141],[28,169,141],[27,170,140],[27,171,140],[27,172,139],[27,173,139],[27,174,138],[27,175,138],[27,176,137],[27,177,137],[27,178,136],[27,179,136],[27,180,135],[27,181,135],[27,182,134],[27,183,133],[28,184,133],[28,185,132],[28,186,131],[29,187,131],[29,188,130],[29,189,129],[30,190,129],[30,190,128],[31,191,127],[31,192,126],[32,193,126],[33,194,125],[33,195,124],[34,196,123],[35,197,123],[36,198,122],[37,198,121],[37,199,120],[38,200,119],[39,201,118],[40,202,118],[41,203,117],[42,203,116],[44,204,115],[45,205,114],[46,206,113],[47,207,112],[49,207,111],[50,208,110],[51,209,109],[53,210,108],[54,210,107],[56,211,106],[57,212,105],[59,213,104],[60,213,103],[62,214,102],[64,215,101],[65,215,100],[67,216,98],[69,217,97],[70,217,96],[72,218,95],[74,219,94],[76,219,93],[78,220,91],[80,221,90],[82,221,89],[83,222,88],[85,222,86],[87,223,85],[89,224,84],[91,224,83],[94,225,81],[96,225,80],[98,226,79],[100,226,77],[102,227,76],[104,227,75],[106,228,73],[109,228,72],[111,229,71],[113,229,69],[115,230,68],[118,230,66],[120,231,65],[122,231,64],[125,232,62],[127,232,61],[129,232,59],[132,233,58],[134,233,56],[137,234,55],[139,234,53],[141,235,52],[144,235,50],[146,235,49],[149,236,47],[151,236,46],[154,236,45],[156,237,43],[159,237,42],[161,237,40],[163,238,39],[166,238,38],[168,238,36],[171,239,35],[173,239,34],[176,239,32],[178,239,31],[181,240,30],[183,240,29],[186,240,28],[188,240,27],[191,241,26],[193,241,25],[195,241,24],[198,241,23],[200,241,23],[203,241,22],[205,242,22],[207,242,21],[210,242,21],[212,242,21],[214,242,21],[217,242,20],[219,242,20],[221,243,20],[224,243,21],[226,243,21],[228,243,21],[230,243,22],[232,243,22],[235,243,23],[237,244,24],[239,244,25],[241,244,26],[243,244,27],[245,244,28],[247,244,30],[249,244,31],[251,245,33],[253,245,35]],magma:[[0,0,4],[28,16,68],[79,18,123],[129,37,129],[181,54,122],[229,80,100],[251,135,97],[254,194,135],[252,253,191]],plasma:[[13,8,135],[75,3,161],[125,3,168],[168,34,150],[203,70,121],[229,107,93],[248,148,65],[253,195,40],[240,249,33]]};function gt(r,t){if(!r||r.length===0)return{r:0,g:0,b:0};if(r.length===1)return{r:r[0][0],g:r[0][1],b:r[0][2]};let e=Math.max(0,Math.min(1,t))*(r.length-1),a=Math.floor(e),o=e-a,n=r[a],s=r[Math.min(r.length-1,a+1)];return{r:Math.round(n[0]+(s[0]-n[0])*o),g:Math.round(n[1]+(s[1]-n[1])*o),b:Math.round(n[2]+(s[2]-n[2])*o)}}function G(r,t){let e=Math.max(0,Math.min(1,r));if(t==="grayscale"){let a=Math.round(e*255);return{r:a,g:a,b:a}}if(t==="viridis"){let a=D.viridis,o=Math.min(a.length-1,Math.floor(e*(a.length-1))),n=a[o];return{r:n[0],g:n[1],b:n[2]}}if(t==="fire"){let a=Math.round(255*Math.pow(e,.7)),o=Math.round(255*Math.max(0,Math.min(1,(e-.15)/.85))),n=Math.round(255*Math.max(0,Math.min(1,(e-.45)/.55)));return{r:a,g:o,b:n}}return gt(D[t]||D.inferno,e)}var vt=`#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
    v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`,wt=`#version 300 es
precision mediump float;
uniform sampler2D u_gray;
uniform sampler2D u_lut;
uniform float u_floor;
uniform float u_rcpRange;
in vec2 v_uv;
out vec4 fragColor;
void main() {
    float g = texture(u_gray, v_uv).r;
    float t = clamp((g - u_floor) * u_rcpRange, 0.0, 1.0);
    fragColor = texture(u_lut, vec2(t, 0.5));
}`,E=class{constructor(){this._canvas=document.createElement("canvas");let t=this._canvas.getContext("webgl2",{premultipliedAlpha:!1,preserveDrawingBuffer:!0,antialias:!1});if(!t){this._gl=null;return}this._gl=t,this._maxTex=t.getParameter(t.MAX_TEXTURE_SIZE);let e=this._sh(t.VERTEX_SHADER,vt),a=this._sh(t.FRAGMENT_SHADER,wt);if(!e||!a){this._gl=null;return}let o=t.createProgram();if(t.attachShader(o,e),t.attachShader(o,a),t.linkProgram(o),t.deleteShader(e),t.deleteShader(a),!t.getProgramParameter(o,t.LINK_STATUS)){this._gl=null;return}this._prog=o,this._uFloor=t.getUniformLocation(o,"u_floor"),this._uRcpRange=t.getUniformLocation(o,"u_rcpRange"),this._uGray=t.getUniformLocation(o,"u_gray"),this._uLut=t.getUniformLocation(o,"u_lut");let n=t.createVertexArray();t.bindVertexArray(n);let s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW);let i=t.getAttribLocation(o,"a_pos");t.enableVertexAttribArray(i),t.vertexAttribPointer(i,2,t.FLOAT,!1,0,0),this._vao=n,this._grayTex=t.createTexture(),this._lutTex=t.createTexture(),this._w=0,this._h=0,this._lutScheme=null}_sh(t,e){let a=this._gl,o=a.createShader(t);return a.shaderSource(o,e),a.compileShader(o),a.getShaderParameter(o,a.COMPILE_STATUS)?o:(a.deleteShader(o),null)}get ok(){return!!this._gl}get canvas(){return this._canvas}uploadGrayscale(t,e,a){let o=this._gl;return!o||e>this._maxTex||a>this._maxTex?!1:(this._w=e,this._h=a,this._canvas.width=e,this._canvas.height=a,o.bindTexture(o.TEXTURE_2D,this._grayTex),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texImage2D(o.TEXTURE_2D,0,o.R8,e,a,0,o.RED,o.UNSIGNED_BYTE,t),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),!0)}uploadColorLut(t){if(t===this._lutScheme)return;let e=this._gl;if(!e)return;this._lutScheme=t;let a=new Uint8Array(256*4);for(let o=0;o<256;o++){let n=G(o/255,t),s=o*4;a[s]=n.r,a[s+1]=n.g,a[s+2]=n.b,a[s+3]=255}e.bindTexture(e.TEXTURE_2D,this._lutTex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,256,1,0,e.RGBA,e.UNSIGNED_BYTE,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}render(t,e){let a=this._gl;!a||!this._w||(a.viewport(0,0,this._w,this._h),a.useProgram(this._prog),a.bindVertexArray(this._vao),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,this._grayTex),a.uniform1i(this._uGray,0),a.activeTexture(a.TEXTURE1),a.bindTexture(a.TEXTURE_2D,this._lutTex),a.uniform1i(this._uLut,1),a.uniform1f(this._uFloor,t),a.uniform1f(this._uRcpRange,1/Math.max(1e-4,e-t)),a.drawArrays(a.TRIANGLE_STRIP,0,4))}dispose(){let t=this._gl;t&&(t.deleteTexture(this._grayTex),t.deleteTexture(this._lutTex),t.deleteProgram(this._prog),t.deleteVertexArray(this._vao),this._gl=null)}};function q(r){if(!r||r.length===0)return{logMin:0,logMax:1};let t=Number.POSITIVE_INFINITY,e=Number.NEGATIVE_INFINITY,a=Math.max(1,Math.floor(r.length/12e4));for(let o=0;o<r.length;o+=a){let n=Math.log1p((r[o]||0)*12);n<t&&(t=n),n>e&&(e=n)}return!Number.isFinite(t)||!Number.isFinite(e)||e-t<1e-6?{logMin:0,logMax:1}:{logMin:t,logMax:e}}function U(r,t=2,e=98){if(!r||r.length===0)return{logMin:0,logMax:1};let a=Math.max(1,Math.floor(r.length/2e5)),o=[];for(let h=0;h<r.length;h+=a)o.push(Math.log1p((r[h]||0)*12));o.sort((h,l)=>h-l);let n=Math.floor(o.length*t/100),s=Math.min(o.length-1,Math.floor(o.length*e/100)),i=o[n],c=o[s];return!Number.isFinite(i)||!Number.isFinite(c)||c-i<1e-6?{logMin:0,logMax:1}:{logMin:i,logMax:c}}function X(r,t,e,a,o=.08){if(!r||t<=0||e<=0)return a/2;let n=new Float64Array(e),s=Math.max(1,Math.floor(t/2e3)),i=0;for(let d=0;d<t;d+=s){let b=d*e;for(let w=0;w<e;w++)n[w]+=r[b+w]||0;i++}for(let d=0;d<e;d++)n[d]/=i;let c=0;for(let d=0;d<e;d++)n[d]>c&&(c=n[d]);if(c<1e-12)return a/2;let h=c*o,l=0;for(let d=e-1;d>=0;d--)if(n[d]>h){l=d;break}let g=(O(a,e)[Math.min(e-1,l+2)]||a/2)*1.1,v=[2e3,3e3,4e3,5e3,6e3,8e3,1e4,12e3,16e3,2e4,22050],p=a/2,m=p;for(let d of v)if(d>=g&&d<=p){m=d;break}return m}function bt({ctx:r,width:t,height:e,duration:a,pixelsPerSecond:o}){if(t<=0)return;let s=getComputedStyle(document.documentElement).getPropertyValue("--color-text-secondary").trim()||"#cbd5e1",{majorStep:i,minorStep:c}=P(o);r.save(),r.font="11px monospace",r.textBaseline="top";for(let h=0;h<=a;h+=c){let l=Math.round(h*o)+.5;if(l<0||l>t)continue;let u=Math.abs(h/i-Math.round(h/i))<1e-4;r.strokeStyle=u?"rgba(148,163,184,0.35)":"rgba(148,163,184,0.18)",r.beginPath(),r.moveTo(l,0),r.lineTo(l,e),r.stroke(),u&&(r.fillStyle=s,r.fillText(`${h.toFixed(1)}s`,l+3,4))}r.restore()}function $({spectrogramData:r,spectrogramFrames:t,spectrogramMels:e,sampleRateHz:a,maxFreq:o,spectrogramAbsLogMin:n,spectrogramAbsLogMax:s}){if(!r||t<=0||e<=0)return null;let i=Math.max(1,Math.min(t,24e3)),c=512,h=t/i,l=Math.min(o,a/2),u=O(a,e),f=e-1;for(let m=0;m<u.length;m++)if(u[m]>l){f=Math.max(1,m-1);break}let g=new Int16Array(c);for(let m=0;m<c;m++){let d=Math.floor((c-m)/c*(f+1));g[m]=Math.max(0,Math.min(f,d))}let v=Math.max(1e-6,s-n),p=new Uint8Array(i*c);for(let m=0;m<i;m++){let d=Math.max(0,Math.floor(m*h)),b=Math.max(d+1,Math.min(t,Math.ceil((m+1)*h))),w=Math.max(1,Math.floor((b-d)/4));for(let x=0;x<c;x++){let M=g[x],_=0,S=0;for(let L=d;L<b;L+=w)_+=r[L*e+M]||0,S++;b-1>d&&(_+=r[(b-1)*e+M]||0,S++);let k=_/Math.max(1,S),T=(Math.log1p(k*12)-n)/v;p[x*i+m]=Math.max(0,Math.min(255,Math.round(T*255)))}}return{gray:p,width:i,height:c}}function j(r,t,e,a){if(!r)return null;let{gray:o,width:n,height:s}=r,i=new Uint32Array(256),c=Math.max(1e-6,e-t),h=new DataView(i.buffer);for(let p=0;p<256;p++){let m=p/255,d=Math.max(0,Math.min(1,(m-t)/c)),b=G(d,a);h.setUint32(p*4,255<<24|b.b<<16|b.g<<8|b.r,!0)}let l=document.createElement("canvas");l.width=n,l.height=s;let u=l.getContext("2d");if(!u)return null;let f=u.createImageData(n,s),g=new Uint32Array(f.data.buffer),v=n*s;for(let p=0;p<v;p++)g[p]=i[o[p]];return u.putImageData(f,0,0),l}function Y({duration:r,spectrogramCanvas:t,pixelsPerSecond:e,canvasHeight:a,baseCanvas:o,sampleRate:n,frameRate:s,spectrogramFrames:i}){if(!o)return;let c=t.getContext("2d");if(!c)return;let h=Math.max(1,Math.floor(r*e)),l=Math.max(140,Math.floor(a));t.width=h,t.height=l,c.clearRect(0,0,h,l);let u=Math.floor(n/s),f=2*u/n,g=Math.round(f*e),v=Math.round(i*u/n*e);c.imageSmoothingEnabled=v<o.width,c.drawImage(o,0,0,o.width,o.height,g,0,v,l),bt({ctx:c,width:h,height:l,duration:r,pixelsPerSecond:e})}var xt=`
self.onmessage = (event) => {
    const {
        requestId,
        channelData,
        fftSize,
        sampleRate,
        frameRate,
        nMels,
        pcenGain,
        pcenBias,
        pcenRoot,
        pcenSmoothing,
    } = event.data;

    const audio = new Float32Array(channelData);
    const hopSize = Math.max(1, Math.floor(sampleRate / frameRate));
    const winLength = 4 * hopSize;
    const numFrames = Math.max(1, Math.floor((audio.length - winLength) / hopSize) + 1);

    const melFilterbank = createMelFilterbank(sampleRate, fftSize, nMels, 0, sampleRate / 2);
    const pcenOutput = new Float32Array(numFrames * nMels);
    const smooth = new Float32Array(nMels);
    const pcenPower = 1.0 / pcenRoot;

    for (let frameIdx = 0; frameIdx < numFrames; frameIdx++) {
        const offset = frameIdx * hopSize;
        const powerSpectrum = fftPowerSpectrum(audio, offset, winLength, fftSize);
        const melSpectrum = applyMelFilterbank(powerSpectrum, melFilterbank);

        const base = frameIdx * nMels;
        for (let m = 0; m < nMels; m++) {
            const e = melSpectrum[m];
            smooth[m] = (1 - pcenSmoothing) * smooth[m] + pcenSmoothing * e;
            const denominator = Math.pow(1e-12 + smooth[m], pcenGain);
            const normalized = e / denominator;
            pcenOutput[base + m] = Math.pow(normalized + pcenBias, pcenPower) - Math.pow(pcenBias, pcenPower);
        }
    }

    self.postMessage(
        { requestId, data: pcenOutput.buffer, nFrames: numFrames, nMels },
        [pcenOutput.buffer]
    );
};

function fftPowerSpectrum(audio, offset, winLength, fftSize) {
    const real = new Float32Array(fftSize);
    const imag = new Float32Array(fftSize);

    const maxCopy = Math.min(winLength, fftSize);
    for (let i = 0; i < maxCopy; i++) {
        const sample = audio[offset + i] || 0;
        const window = 0.5 * (1 - Math.cos(2 * Math.PI * i / Math.max(1, winLength - 1)));
        real[i] = sample * window;
    }

    iterativeFFT(real, imag);

    const out = new Float32Array(fftSize / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = real[i] * real[i] + imag[i] * imag[i];
    }
    return out;
}

function iterativeFFT(real, imag) {
    const n = real.length;

    let j = 0;
    for (let i = 1; i < n; i++) {
        let bit = n >> 1;
        while (j & bit) {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;

        if (i < j) {
            let tmp = real[i];
            real[i] = real[j];
            real[j] = tmp;
            tmp = imag[i];
            imag[i] = imag[j];
            imag[j] = tmp;
        }
    }

    for (let len = 2; len <= n; len <<= 1) {
        const halfLen = len >> 1;
        const angleStep = -2 * Math.PI / len;

        for (let i = 0; i < n; i += len) {
            for (let k = 0; k < halfLen; k++) {
                const angle = angleStep * k;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);

                const evenIndex = i + k;
                const oddIndex = evenIndex + halfLen;

                const tr = cos * real[oddIndex] - sin * imag[oddIndex];
                const ti = sin * real[oddIndex] + cos * imag[oddIndex];

                real[oddIndex] = real[evenIndex] - tr;
                imag[oddIndex] = imag[evenIndex] - ti;
                real[evenIndex] += tr;
                imag[evenIndex] += ti;
            }
        }
    }
}

function hzToMel(hz) {
    return 2595 * Math.log10(1 + hz / 700);
}

function melToHz(mel) {
    return 700 * (Math.pow(10, mel / 2595) - 1);
}

function createMelFilterbank(sampleRate, fftSize, nMels, fMin, fMax) {
    const nFftBins = Math.floor(fftSize / 2);
    const melMin = hzToMel(fMin);
    const melMax = hzToMel(fMax);
    const melPoints = [];

    for (let i = 0; i < nMels + 2; i++) {
        melPoints.push(melMin + (i / (nMels + 1)) * (melMax - melMin));
    }

    const hzPoints = melPoints.map(melToHz);
    const binPoints = hzPoints.map((hz) => Math.floor((fftSize + 1) * hz / sampleRate));

    const filterbank = [];
    for (let m = 1; m <= nMels; m++) {
        const filter = new Float32Array(nFftBins);
        const left = Math.max(0, Math.min(nFftBins - 1, binPoints[m - 1]));
        const center = Math.max(0, Math.min(nFftBins - 1, binPoints[m]));
        const right = Math.max(0, Math.min(nFftBins - 1, binPoints[m + 1]));

        for (let k = left; k < center; k++) {
            const denom = center - left || 1;
            filter[k] = (k - left) / denom;
        }
        for (let k = center; k < right; k++) {
            const denom = right - center || 1;
            filter[k] = (right - k) / denom;
        }

        filterbank.push(filter);
    }

    return filterbank;
}

function applyMelFilterbank(powerSpectrum, melFilterbank) {
    const melSpectrum = new Float32Array(melFilterbank.length);
    for (let m = 0; m < melFilterbank.length; m++) {
        const filter = melFilterbank[m];
        let sum = 0;
        for (let k = 0; k < filter.length; k++) {
            if (filter[k] !== 0) {
                sum += powerSpectrum[k] * filter[k];
            }
        }
        melSpectrum[m] = sum;
    }
    return melSpectrum;
}
`;function K(){let r=null,t=!1,e=0,a=new Map,o=null,n=()=>o||(o=new Function("params",`
            const {
                channelData, fftSize, sampleRate, frameRate,
                nMels, pcenGain, pcenBias, pcenRoot, pcenSmoothing,
            } = params;

            const audio = new Float32Array(channelData);
            const hopSize = Math.max(1, Math.floor(sampleRate / frameRate));
            const winLength = 4 * hopSize;
            const numFrames = Math.max(1, Math.floor((audio.length - winLength) / hopSize) + 1);

            
            function hzToMel(hz) { return 2595 * Math.log10(1 + hz / 700); }
            function melToHz(mel) { return 700 * (Math.pow(10, mel / 2595) - 1); }

            function createMelFB(sr, fft, nm, fMin, fMax) {
                const nBins = Math.floor(fft / 2);
                const mMin = hzToMel(fMin), mMax = hzToMel(fMax);
                const mPts = [];
                for (let i = 0; i < nm + 2; i++) mPts.push(mMin + (i / (nm + 1)) * (mMax - mMin));
                const hPts = mPts.map(melToHz);
                const bPts = hPts.map(hz => Math.floor((fft + 1) * hz / sr));
                const fb = [];
                for (let m = 1; m <= nm; m++) {
                    const f = new Float32Array(nBins);
                    const l = Math.max(0, Math.min(nBins-1, bPts[m-1]));
                    const c = Math.max(0, Math.min(nBins-1, bPts[m]));
                    const r = Math.max(0, Math.min(nBins-1, bPts[m+1]));
                    for (let k = l; k < c; k++) f[k] = (k - l) / (c - l || 1);
                    for (let k = c; k < r; k++) f[k] = (r - k) / (r - c || 1);
                    fb.push(f);
                }
                return fb;
            }

            function iterativeFFT(re, im) {
                const n = re.length;
                let j = 0;
                for (let i = 1; i < n; i++) {
                    let bit = n >> 1;
                    while (j & bit) { j ^= bit; bit >>= 1; }
                    j ^= bit;
                    if (i < j) {
                        let t = re[i]; re[i] = re[j]; re[j] = t;
                        t = im[i]; im[i] = im[j]; im[j] = t;
                    }
                }
                for (let len = 2; len <= n; len <<= 1) {
                    const half = len >> 1, step = -2 * Math.PI / len;
                    for (let i = 0; i < n; i += len) {
                        for (let k = 0; k < half; k++) {
                            const a = step * k, cos = Math.cos(a), sin = Math.sin(a);
                            const ei = i + k, oi = ei + half;
                            const tr = cos * re[oi] - sin * im[oi];
                            const ti = sin * re[oi] + cos * im[oi];
                            re[oi] = re[ei] - tr; im[oi] = im[ei] - ti;
                            re[ei] += tr; im[ei] += ti;
                        }
                    }
                }
            }

            function fftPow(audio, off, wl, fft) {
                const re = new Float32Array(fft), im = new Float32Array(fft);
                const mc = Math.min(wl, fft);
                for (let i = 0; i < mc; i++) {
                    const s = audio[off + i] || 0;
                    re[i] = s * 0.5 * (1 - Math.cos(2 * Math.PI * i / Math.max(1, wl - 1)));
                }
                iterativeFFT(re, im);
                const o = new Float32Array(fft / 2);
                for (let i = 0; i < o.length; i++) o[i] = re[i]*re[i] + im[i]*im[i];
                return o;
            }

            function applyMel(ps, fb) {
                const ms = new Float32Array(fb.length);
                for (let m = 0; m < fb.length; m++) {
                    let s = 0;
                    for (let k = 0; k < fb[m].length; k++) if (fb[m][k]) s += ps[k]*fb[m][k];
                    ms[m] = s;
                }
                return ms;
            }

            const melFB = createMelFB(sampleRate, fftSize, nMels, 0, sampleRate / 2);
            const out = new Float32Array(numFrames * nMels);
            const smooth = new Float32Array(nMels);
            const pcenPower = 1.0 / pcenRoot;

            for (let fi = 0; fi < numFrames; fi++) {
                const ps = fftPow(audio, fi * hopSize, winLength, fftSize);
                const ms = applyMel(ps, melFB);
                const base = fi * nMels;
                for (let m = 0; m < nMels; m++) {
                    const e = ms[m];
                    smooth[m] = (1 - pcenSmoothing) * smooth[m] + pcenSmoothing * e;
                    const den = Math.pow(1e-12 + smooth[m], pcenGain);
                    out[base + m] = Math.pow(e / den + pcenBias, pcenPower) - Math.pow(pcenBias, pcenPower);
                }
            }
            return { data: out, nFrames: numFrames, nMels };
        `),o),s=(l,u)=>n()({channelData:l.buffer.slice(l.byteOffset,l.byteOffset+l.byteLength),...u}),i=()=>{if(!(r||t))try{let l=new Blob([xt],{type:"application/javascript"}),u=URL.createObjectURL(l);r=new Worker(u),r.onmessage=f=>{let{requestId:g,data:v,nFrames:p,nMels:m}=f.data,d=a.get(g);d&&(a.delete(g),d.resolve({data:new Float32Array(v),nFrames:p,nMels:m}))},r.onerror=f=>{console.warn("Spectrogram Worker failed, using main-thread fallback:",f),t=!0,r?.terminate(),r=null,a.forEach(({reject:g})=>g(f)),a.clear()}}catch(l){console.warn("Cannot create Worker, using main-thread fallback:",l),t=!0,r=null}};return{compute:async(l,u)=>{if(t||(i(),t))return s(l,u);let f=++e,g=new Float32Array(l),v=new Promise((p,m)=>{a.set(f,{resolve:p,reject:m})});r.postMessage({requestId:f,channelData:g.buffer,...u},[g.buffer]);try{return await Promise.race([v,new Promise((m,d)=>setTimeout(()=>d(new Error("Worker timeout")),8e3))])}catch(p){return console.warn("Worker failed/timed out, computing on main thread:",p.message),a.delete(f),t=!0,r?.terminate(),r=null,s(l,u)}},dispose:()=>{r&&(r.terminate(),r=null),a.clear()}}}function yt({ctx:r,width:t,height:e,duration:a,pixelsPerSecond:o}){if(t<=0)return;let n=getComputedStyle(document.documentElement),s=n.getPropertyValue("--color-text-secondary").trim()||"#cbd5e1",{majorStep:i,minorStep:c}=P(o);r.clearRect(0,0,t,e),r.fillStyle=n.getPropertyValue("--color-bg-secondary").trim()||"#1e293b",r.fillRect(0,0,t,e),r.font="11px monospace",r.textBaseline="middle",r.fillStyle=s,r.strokeStyle="rgba(148, 163, 184, 0.25)";for(let h=0;h<=a;h+=c){let l=Math.round(h*o)+.5;if(l<0||l>t)continue;let u=Math.abs(h/i-Math.round(h/i))<1e-4,f=u?14:8;r.beginPath(),r.moveTo(l,0),r.lineTo(l,f),r.stroke(),u&&r.fillText(`${h.toFixed(1)}s`,l+3,e/2)}}function Z({audioBuffer:r,amplitudeCanvas:t,waveformTimelineCanvas:e,waveformContent:a,pixelsPerSecond:o,waveformHeight:n=100,amplitudePeakAbs:s}){if(!r)return;let i=t.getContext("2d"),c=e.getContext("2d");if(!i||!c)return;let h=Math.max(1,Math.floor(r.duration*o)),l=Math.max(64,Math.floor(n)),u=Math.max(18,Math.min(32,Math.round(l*.22))),f=Math.max(32,l-u);t.width=h,t.height=f,e.width=h,e.height=u,a.style.width=`${h}px`;let g=r.getChannelData(0),v=g.length,p=f/2,m=1/Math.max(1e-6,s),{majorStep:d,minorStep:b}=P(o);i.clearRect(0,0,h,f),i.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--color-bg-tertiary"),i.fillRect(0,0,h,f);for(let w=0;w<=r.duration;w+=b){let x=Math.round(w*o)+.5,M=Math.abs(w/d-Math.round(w/d))<1e-4;i.strokeStyle=M?"rgba(148,163,184,0.22)":"rgba(148,163,184,0.12)",i.beginPath(),i.moveTo(x,0),i.lineTo(x,f),i.stroke()}i.strokeStyle="rgba(148, 163, 184, 0.35)",i.beginPath(),i.moveTo(0,p+.5),i.lineTo(h,p+.5),i.stroke(),i.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue("--color-accent"),i.lineWidth=1;for(let w=0;w<h;w++){let x=Math.floor(w*v/h),M=Math.min(v,Math.floor((w+1)*v/h)),_=1,S=-1;for(let k=x;k<M;k++){let T=Math.max(-1,Math.min(1,g[k]*m));T<_&&(_=T),T>S&&(S=T)}i.beginPath(),i.moveTo(w+.5,(1+_)*p),i.lineTo(w+.5,(1+S)*p),i.stroke()}yt({ctx:c,width:h,height:u,duration:r.duration,pixelsPerSecond:o})}function J({audioBuffer:r,overviewCanvas:t,overviewContainer:e,amplitudePeakAbs:a}){if(!r)return;let o=t.getContext("2d");if(!o)return;let n=e.getBoundingClientRect();t.width=Math.max(1,Math.floor(n.width)),t.height=Math.max(1,Math.floor(n.height)),o.clearRect(0,0,t.width,t.height),o.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--color-bg-tertiary"),o.fillRect(0,0,t.width,t.height);let s=r.getChannelData(0),i=s.length,c=t.height/2,h=1/Math.max(1e-6,a);o.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue("--color-accent"),o.lineWidth=1;for(let l=0;l<t.width;l++){let u=Math.floor(l*i/t.width),f=Math.min(i,Math.floor((l+1)*i/t.width)),g=1,v=-1;for(let p=u;p<f;p++){let m=Math.max(-1,Math.min(1,s[p]*h));m<g&&(g=m),m>v&&(v=m)}o.beginPath(),o.moveTo(l,(1+g)*c),o.lineTo(l,(1+v)*c),o.stroke()}}function Q({labelsElement:r,maxFreq:t,sampleRateHz:e}){r.innerHTML="";let a=Math.min(t,e/2);[a,a*.8,a*.6,a*.4,a*.2,1e3,0].forEach(n=>{let s=document.createElement("span");s.textContent=n>=1e3?`${(n/1e3).toFixed(n%1e3===0?0:1)}k`:`${Math.round(n)}Hz`,r.appendChild(s)})}async function st(r){let t=window.AudioContext||window.webkitAudioContext;if(!t)throw new Error("AudioContext wird von diesem Browser nicht unterst\xFCtzt.");let e=new t;try{return await e.decodeAudioData(r)}finally{e.close?.().catch(()=>{})}}var C=class{constructor(t,e){if(!t)throw new Error("PlayerState: container element required");if(!e)throw new Error("PlayerState: WaveSurfer reference required");this.container=t,this.d=this._queryDom(t),this.WaveSurfer=e,this.processor=K(),this.colorizer=new E,this.audioBuffer=null,this.wavesurfer=null,this.spectrogramData=null,this.spectrogramFrames=0,this.spectrogramMels=0,this.spectrogramBaseCanvas=null,this.spectrogramGrayInfo=null,this._gpuReady=!1,this.spectrogramAbsLogMin=0,this.spectrogramAbsLogMax=1,this.sampleRateHz=32e3,this.amplitudePeakAbs=1,this.currentColorScheme=this.d.colorSchemeSelect.value||"fire",this.volume=.8,this.muted=!1,this.preMuteVolume=.8,this.pixelsPerSecond=100,this.zoomRedrawTimeout=null,this.scrollSyncLock=!1,this.windowStartNorm=0,this.windowEndNorm=1,this.followPlayback=!0,this.loopPlayback=!1,this.draggingPlayhead=!1,this.draggingPlayheadSource=null,this.draggingViewport=!1,this.viewportPanStartX=0,this.viewportPanStartScroll=0,this.suppressSeekClick=!1,this.overviewMode=null,this.overviewDragStartX=0,this.overviewDragStart=0,this.overviewDragEnd=1,this.waveformDisplayHeight=100,this.spectrogramDisplayHeight=200,this.viewResizeMode=null,this.viewResizeStartY=0,this.viewResizeStartWaveformHeight=100,this.viewResizeStartSpectrogramHeight=200,this._applyLocalViewHeights(),this._updateAmplitudeLabels(),this._setInitialPlayheadPositions(),this._updateToggleButtons(),this._cleanups=[],this._bindEvents()}_queryDom(t){let e=a=>t.querySelector(`#${a}`);return{openFileBtn:e("openFileBtn"),audioFile:e("audioFile"),playPauseBtn:e("playPauseBtn"),stopBtn:e("stopBtn"),jumpStartBtn:e("jumpStartBtn"),jumpEndBtn:e("jumpEndBtn"),backwardBtn:e("backwardBtn"),forwardBtn:e("forwardBtn"),followToggleBtn:e("followToggleBtn"),loopToggleBtn:e("loopToggleBtn"),fitViewBtn:e("fitViewBtn"),resetViewBtn:e("resetViewBtn"),currentTimeDisplay:e("currentTime"),totalTimeDisplay:e("totalTime"),playStateDisplay:e("playState"),viewRangeDisplay:e("viewRange"),spectrogramCanvas:e("spectrogramCanvas"),spectrogramContainer:e("spectrogramContainer"),waveformContainer:e("waveformContainer"),waveformWrapper:e("waveformWrapper"),waveformContent:e("waveformContent"),amplitudeLabels:e("amplitudeLabels"),amplitudeCanvas:e("amplitudeCanvas"),waveformTimelineCanvas:e("waveformTimelineCanvas"),waveformPlayhead:e("waveformPlayhead"),audioEngineHost:e("audioEngineHost"),playhead:e("playhead"),canvasWrapper:e("canvasWrapper"),viewSplitHandle:e("viewSplitHandle"),spectrogramResizeHandle:e("spectrogramResizeHandle"),overviewCanvas:e("overviewCanvas"),overviewContainer:e("overviewContainer"),overviewWindow:e("overviewWindow"),overviewHandleLeft:e("overviewHandleLeft"),overviewHandleRight:e("overviewHandleRight"),fileInfo:e("fileInfo"),sampleRateInfo:e("sampleRateInfo"),fftSizeSelect:e("fftSize"),zoomSlider:e("zoomSlider"),zoomValue:e("zoomValue"),maxFreqSelect:e("maxFreqSelect"),colorSchemeSelect:e("colorSchemeSelect"),freqLabels:e("freqLabels"),volumeToggleBtn:e("volumeToggleBtn"),volumeIcon:e("volumeIcon"),volumeWaves:e("volumeWaves"),volumeSlider:e("volumeSlider"),floorSlider:e("floorSlider"),ceilSlider:e("ceilSlider"),autoContrastBtn:e("autoContrastBtn"),autoFreqBtn:e("autoFreqBtn")}}dispose(){for(let t=this._cleanups.length-1;t>=0;t--)this._cleanups[t]();this._cleanups.length=0,this.processor.dispose(),this.colorizer.dispose()}async _handleFileSelect(t){let e=t?.target?.files?.[0];if(e){this.d.fileInfo.innerHTML=`<span class="statusbar-label">${e.name}</span>`,this.d.fileInfo.classList.add("loading"),this._setPlayState("Loading");try{let a=await st(await e.arrayBuffer());this.audioBuffer=a,this.sampleRateHz=a.sampleRate,this.amplitudePeakAbs=I(a.getChannelData(0)),this._updateAmplitudeLabels(),this.d.fileInfo.innerHTML=`<span class="statusbar-label">${e.name}</span> <span>${y(a.duration)}</span>`,this.d.sampleRateInfo.textContent=`${a.sampleRate} Hz`,this.d.totalTimeDisplay.textContent=y(a.duration),this.d.currentTimeDisplay.textContent=y(0),this._setPixelsPerSecond(100,!1),this._setTransportEnabled(!0),this._updateToggleButtons(),this._setPlayState("Ready"),this.d.fileInfo.classList.remove("loading"),this._setupWaveSurfer(e),await this._generateSpectrogram(),this._drawMainWaveform(),this._drawOverviewWaveform(),this._createFrequencyLabels(),this._seekToTime(0,!0)}catch(a){console.error("Fehler beim Laden der Datei:",a),this._setPlayState("Error"),this.d.fileInfo.classList.remove("loading"),alert("Fehler beim Laden der Audio-Datei")}}}async loadUrl(t){this.d.fileInfo.innerHTML='<span class="statusbar-label">Loading\u2026</span>',this.d.fileInfo.classList.add("loading"),this._setPlayState("Loading");try{let e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);let a=await e.arrayBuffer(),o=await st(a);this.audioBuffer=o,this.sampleRateHz=o.sampleRate,this.amplitudePeakAbs=I(o.getChannelData(0)),this._updateAmplitudeLabels();let n=decodeURIComponent(new URL(t,location.href).pathname.split("/").pop()||"audio");this.d.fileInfo.innerHTML=`<span class="statusbar-label">${n}</span> <span>${y(o.duration)}</span>`,this.d.sampleRateInfo.textContent=`${o.sampleRate} Hz`,this.d.totalTimeDisplay.textContent=y(o.duration),this.d.currentTimeDisplay.textContent=y(0),this._setPixelsPerSecond(100,!1),this._setTransportEnabled(!0),this._updateToggleButtons(),this._setPlayState("Ready"),this.d.fileInfo.classList.remove("loading"),this._setupWaveSurfer(t),await this._generateSpectrogram(),this._drawMainWaveform(),this._drawOverviewWaveform(),this._createFrequencyLabels(),this._seekToTime(0,!0)}catch(e){console.error("Error loading audio URL:",e),this._setPlayState("Error"),this.d.fileInfo.classList.remove("loading")}}_setupWaveSurfer(t){this.wavesurfer&&this.wavesurfer.destroy();let e=this.WaveSurfer.create({container:this.d.audioEngineHost,height:1,waveColor:"#38bdf8",progressColor:"#0ea5e9",cursorColor:"#ef4444",normalize:!0,minPxPerSec:this.pixelsPerSecond,autoScroll:!1,autoCenter:!1});typeof t=="string"?e.load(t):e.loadBlob(t),e.on("ready",()=>{e.zoom(this.pixelsPerSecond),e.setVolume(this.volume),this._seekToTime(0,!0)}),e.on("timeupdate",a=>{this._updateTimeReadout(a),this._updatePlayhead(a,!0)}),e.on("play",()=>{this.d.playPauseBtn.classList.add("playing"),this._setPlayState(this.loopPlayback?"Playing (Loop)":"Playing")}),e.on("pause",()=>{if(this.d.playPauseBtn.classList.remove("playing"),this.audioBuffer){let a=e.getCurrentTime()>=this.audioBuffer.duration-.01;this._setPlayState(a?"Stopped":"Paused")}else this._setPlayState("Paused")}),e.on("finish",()=>{if(this.loopPlayback){this._seekToTime(0,this.followPlayback),e.play();return}this.d.playPauseBtn.classList.remove("playing"),this._setPlayState("Stopped"),this.audioBuffer&&this._updatePlayhead(this.audioBuffer.duration,!1)}),this.wavesurfer=e}_togglePlayPause(){this.wavesurfer&&this.audioBuffer&&this.wavesurfer.playPause()}_stopPlayback(){this.wavesurfer&&(this.wavesurfer.pause(),this._seekToTime(0,!0),this._setPlayState("Stopped"),this.d.playPauseBtn.classList.remove("playing"))}_seekToTime(t,e=!1){if(!this.audioBuffer)return;let a=Math.max(0,Math.min(t,this.audioBuffer.duration));this.wavesurfer&&this.wavesurfer.setTime(a),this._updateTimeReadout(a),this._updatePlayhead(a,!1),e&&this._centerViewportAtTime(a)}_seekByDelta(t){this.audioBuffer&&this._seekToTime(this._getCurrentTime()+t,!1)}_getCurrentTime(){return this.wavesurfer?this.wavesurfer.getCurrentTime():0}_updateTimeReadout(t){this.d.currentTimeDisplay.textContent=y(t)}_updatePlayhead(t,e){if(!this.audioBuffer)return;let a=Math.max(.001,this.audioBuffer.duration),o=this.d.spectrogramCanvas.width,n=t/a*o;if(this.d.playhead.style.transform=`translateX(${n}px)`,this.d.waveformPlayhead.style.transform=`translateX(${n}px)`,e&&this.followPlayback&&this.wavesurfer?.isPlaying()){let s=this._getViewportWidth(),i=this.d.canvasWrapper.scrollLeft,c=i+s*.35,h=i+s*.65;(n<c||n>h)&&this._setLinkedScrollLeft(Math.max(0,n-s*.5))}this._syncOverviewWindowToViewport()}async _generateSpectrogram(){if(!this.audioBuffer)return;this._setPlayState("Rendering...");let t=await this.processor.compute(this.audioBuffer.getChannelData(0),{fftSize:parseInt(this.d.fftSizeSelect.value,10),sampleRate:this.audioBuffer.sampleRate,frameRate:100,nMels:160,pcenGain:.8,pcenBias:.01,pcenRoot:4,pcenSmoothing:.025});this.spectrogramData=t.data,this.spectrogramFrames=t.nFrames,this.spectrogramMels=t.nMels,this._updateSpectrogramStats(),this._autoContrast(),this._autoFrequency(),this._buildSpectrogramGrayscale(),this._buildSpectrogramBaseImage(),this._drawSpectrogram(),this._syncOverviewWindowToViewport(),this._setPlayState("Ready")}_updateSpectrogramStats(){let t=q(this.spectrogramData);this.spectrogramAbsLogMin=t.logMin,this.spectrogramAbsLogMax=t.logMax}_autoContrast(t=!1){if(!this.spectrogramData)return;let e=U(this.spectrogramData,2,98),a=this.spectrogramAbsLogMax-this.spectrogramAbsLogMin;if(a<1e-8)return;let o=Math.max(0,Math.min(100,(e.logMin-this.spectrogramAbsLogMin)/a*100)),n=Math.max(0,Math.min(100,(e.logMax-this.spectrogramAbsLogMin)/a*100));this.d.floorSlider.value=Math.round(o),this.d.ceilSlider.value=Math.round(n),t&&(this._buildSpectrogramBaseImage(),this._drawSpectrogram())}_autoFrequency(t=!1){if(!this.spectrogramData)return;let e=X(this.spectrogramData,this.spectrogramFrames,this.spectrogramMels,this.sampleRateHz),a=Array.from(this.d.maxFreqSelect.options),o=a[a.length-1];for(let n of a)if(parseFloat(n.value)>=e){o=n;break}this.d.maxFreqSelect.value=o.value,this._createFrequencyLabels(),t&&(this._buildSpectrogramGrayscale(),this._buildSpectrogramBaseImage(),this._drawSpectrogram())}_setVolume(t){this.volume=Math.max(0,Math.min(1,t)),this.wavesurfer&&this.wavesurfer.setVolume(this.volume),this._updateVolumeIcon()}_toggleMute(){this.muted?(this.muted=!1,this._setVolume(this.preMuteVolume),this.d.volumeSlider.value=Math.round(this.preMuteVolume*100)):(this.preMuteVolume=this.volume,this.muted=!0,this.wavesurfer&&this.wavesurfer.setVolume(0),this._updateVolumeIcon())}_updateVolumeIcon(){let t=this.d.volumeWaves,e=this.d.volumeToggleBtn;if(!t||!e)return;let a=this.muted?0:this.volume;t.style.display=a<.01?"none":"",t.setAttribute("d",a<.4?"M15 8.5a4 4 0 010 7":"M15 8.5a4 4 0 010 7M18 5a9 9 0 010 14"),e.classList.toggle("muted",a<.01)}_buildSpectrogramGrayscale(){if(this.spectrogramGrayInfo=$({spectrogramData:this.spectrogramData,spectrogramFrames:this.spectrogramFrames,spectrogramMels:this.spectrogramMels,sampleRateHz:this.sampleRateHz,maxFreq:parseFloat(this.d.maxFreqSelect.value),spectrogramAbsLogMin:this.spectrogramAbsLogMin,spectrogramAbsLogMax:this.spectrogramAbsLogMax}),this.spectrogramGrayInfo&&this.colorizer.ok){let{gray:t,width:e,height:a}=this.spectrogramGrayInfo;this._gpuReady=this.colorizer.uploadGrayscale(t,e,a)}else this._gpuReady=!1}_buildSpectrogramBaseImage(){this.spectrogramGrayInfo||this._buildSpectrogramGrayscale();let t=parseFloat(this.d.floorSlider.value)/100,e=parseFloat(this.d.ceilSlider.value)/100;return this._gpuReady&&this.spectrogramGrayInfo?(this.colorizer.uploadColorLut(this.currentColorScheme),this.colorizer.render(t,e),this.spectrogramBaseCanvas=this.colorizer.canvas):this.spectrogramBaseCanvas=j(this.spectrogramGrayInfo,t,e,this.currentColorScheme),this.spectrogramBaseCanvas}_drawSpectrogram(){!this.audioBuffer||!this.spectrogramData||this.spectrogramFrames<=0||(this.spectrogramBaseCanvas||this._buildSpectrogramBaseImage(),this.spectrogramBaseCanvas&&(Y({duration:this.audioBuffer.duration,spectrogramCanvas:this.d.spectrogramCanvas,pixelsPerSecond:this.pixelsPerSecond,canvasHeight:this.spectrogramDisplayHeight,baseCanvas:this.spectrogramBaseCanvas,sampleRate:this.audioBuffer.sampleRate,frameRate:100,spectrogramFrames:this.spectrogramFrames}),this._syncOverviewWindowToViewport(),this._updatePlayhead(this._getCurrentTime(),!1)))}_requestSpectrogramRedraw(){this.zoomRedrawTimeout&&clearTimeout(this.zoomRedrawTimeout),this.zoomRedrawTimeout=setTimeout(()=>{this.audioBuffer&&(this.spectrogramData&&this.spectrogramFrames>0&&this._drawSpectrogram(),this._drawMainWaveform())},90)}_drawMainWaveform(){Z({audioBuffer:this.audioBuffer,amplitudeCanvas:this.d.amplitudeCanvas,waveformTimelineCanvas:this.d.waveformTimelineCanvas,waveformContent:this.d.waveformContent,pixelsPerSecond:this.pixelsPerSecond,waveformHeight:this.waveformDisplayHeight,amplitudePeakAbs:this.amplitudePeakAbs}),this._syncOverviewWindowToViewport(),this._updatePlayhead(this._getCurrentTime(),!1)}_drawOverviewWaveform(){J({audioBuffer:this.audioBuffer,overviewCanvas:this.d.overviewCanvas,overviewContainer:this.d.overviewContainer,amplitudePeakAbs:this.amplitudePeakAbs}),this._syncOverviewWindowToViewport()}_createFrequencyLabels(){Q({labelsElement:this.d.freqLabels,maxFreq:parseFloat(this.d.maxFreqSelect.value),sampleRateHz:this.sampleRateHz})}_updateAmplitudeLabels(){let t=this.d.amplitudeLabels;if(!t)return;t.innerHTML="";let e=Math.max(1e-6,this.amplitudePeakAbs||1),a=Math.max(64,Math.floor(this.waveformDisplayHeight)),o=Math.max(18,Math.min(32,Math.round(a*.22))),n=Math.max(32,a-o),s=c=>{let h=Math.abs(c);return h>=1?c.toFixed(2):h>=.1?c.toFixed(3):c.toFixed(4)},i=[4,n/2,Math.max(4,n-4)];[e,0,-e].forEach((c,h)=>{let l=document.createElement("span");l.textContent=c===0?"0.000":`${c>0?"+":""}${s(c)}`,l.style.top=`${i[h]}px`,t.appendChild(l)})}_getViewportWidth(){return Math.max(1,this.d.canvasWrapper.clientWidth||this.d.waveformWrapper.clientWidth)}_setLinkedScrollLeft(t){if(this.scrollSyncLock)return;this.scrollSyncLock=!0;let e=this._getViewportWidth(),a=this.audioBuffer?Math.max(1,Math.floor(this.audioBuffer.duration*this.pixelsPerSecond)):0,o=Math.max(0,a-e),n=Math.max(0,Math.min(t,o));this.d.canvasWrapper.scrollLeft=n,this.d.waveformWrapper.scrollLeft=this.d.canvasWrapper.scrollLeft,this.scrollSyncLock=!1,this._syncOverviewWindowToViewport()}_setPixelsPerSecond(t,e,a,o){let n=Number(this.d.zoomSlider.min),s=Number(this.d.zoomSlider.max),i=Number(this.d.zoomSlider.step||1),c=this._getViewportWidth(),h=this.audioBuffer?.duration||0,l=Math.max(n,Math.min(s,t)),u=Math.abs(l-this.pixelsPerSecond)>=.01,f=(this.d.canvasWrapper.scrollLeft+c/2)/Math.max(this.pixelsPerSecond,.01),g=a??f,v=o??c/2,p=u?l:this.pixelsPerSecond,m=h?Math.max(1,Math.floor(h*p)):0,d=Math.max(0,m-c),b=g*p-v,w=Math.max(0,Math.min(d,b));u&&(this.pixelsPerSecond=p,this.d.zoomSlider.value=String(Math.round(p/i)*i),this.d.zoomValue.textContent=`${Math.round(p)} px/s`,this.wavesurfer&&this.wavesurfer.zoom(p),this.audioBuffer&&e&&(this.spectrogramData&&this.spectrogramFrames>0&&this._drawSpectrogram(),this._drawMainWaveform())),this._setLinkedScrollLeft(w)}_fitEntireTrackInView(){if(!this.audioBuffer)return;let t=this._getViewportWidth()/Math.max(.05,this.audioBuffer.duration);this._setPixelsPerSecond(t,!0,0,0)}_centerViewportAtTime(t){if(!this.audioBuffer)return;let a=this._getViewportWidth()/this.pixelsPerSecond,o=t-a/2;o=Math.max(0,Math.min(o,Math.max(0,this.audioBuffer.duration-a))),this._setLinkedScrollLeft(o*this.pixelsPerSecond)}_clientXToTime(t,e="spectrogram"){let a=e==="waveform"?this.d.waveformWrapper:this.d.canvasWrapper,o=a.getBoundingClientRect(),n=t-o.left+a.scrollLeft,s=e==="waveform"?this.d.amplitudeCanvas.width:this.d.spectrogramCanvas.width,i=this.audioBuffer?.duration||0,c=n/Math.max(1,s)*i;return Math.max(0,Math.min(c,i))}_syncOverviewWindowToViewport(){if(!this.audioBuffer||this.d.spectrogramCanvas.width<=0)return;let e=this._getViewportWidth()/this.pixelsPerSecond,a=this.d.canvasWrapper.scrollLeft/this.pixelsPerSecond,o=Math.min(this.audioBuffer.duration,a+e);this.windowStartNorm=a/this.audioBuffer.duration,this.windowEndNorm=o/this.audioBuffer.duration,this._updateOverviewWindowElement(),this.d.viewRangeDisplay.textContent=`${z(a)} \u2013 ${z(o)}`}_updateOverviewWindowElement(){let t=this.d.overviewContainer.clientWidth,e=this.windowStartNorm*t,a=Math.max(8,this.windowEndNorm*t-e);this.d.overviewWindow.style.left=`${e}px`,this.d.overviewWindow.style.width=`${a}px`}_startOverviewDrag(t,e){this.overviewMode=t,this.overviewDragStartX=e,this.overviewDragStart=this.windowStartNorm,this.overviewDragEnd=this.windowEndNorm}_updateOverviewDrag(t){if(!this.audioBuffer||!this.overviewMode)return;let e=this.d.overviewContainer.clientWidth,a=(t-this.overviewDragStartX)/e;if(this.overviewMode==="move"){let o=this.overviewDragStart+a,n=this.overviewDragEnd+a,s=n-o;o<0&&(o=0,n=s),n>1&&(n=1,o=1-s),this.windowStartNorm=o,this.windowEndNorm=n}else this.overviewMode==="left"?this.windowStartNorm=Math.max(0,Math.min(this.overviewDragStart+a,this.windowEndNorm-.02)):this.overviewMode==="right"&&(this.windowEndNorm=Math.min(1,Math.max(this.overviewDragEnd+a,this.windowStartNorm+.02)));this._updateOverviewWindowElement(),this._applyOverviewWindowToViewport()}_applyOverviewWindowToViewport(){if(!this.audioBuffer)return;let t=this.audioBuffer.duration,e=Math.max(.01,(this.windowEndNorm-this.windowStartNorm)*t),a=this._getViewportWidth()/e;this._setPixelsPerSecond(a,!0,this.windowStartNorm*t,0)}_handleCanvasClick(t){if(this.suppressSeekClick){this.suppressSeekClick=!1;return}this.audioBuffer&&this._seekToTime(this._clientXToTime(t.clientX,"spectrogram"),!1)}_handleWaveformClick(t){if(this.suppressSeekClick){this.suppressSeekClick=!1;return}this.audioBuffer&&this._seekToTime(this._clientXToTime(t.clientX,"waveform"),!1)}_startPlayheadDrag(t,e){this.audioBuffer&&(t.preventDefault(),this.draggingPlayhead=!0,this.draggingPlayheadSource=e,this._seekFromClientX(t.clientX,e))}_seekFromClientX(t,e="spectrogram"){this.audioBuffer&&this._seekToTime(this._clientXToTime(t,e),!1)}_startViewportPan(t,e){this.audioBuffer&&(t.target===this.d.playhead||t.target===this.d.waveformPlayhead||t.button!==0&&t.button!==1||(t.button===1&&t.preventDefault(),this.draggingViewport=!0,this.viewportPanStartX=t.clientX,this.viewportPanStartScroll=e==="waveform"?this.d.waveformWrapper.scrollLeft:this.d.canvasWrapper.scrollLeft,this.suppressSeekClick=!1,document.body.style.cursor="grabbing"))}_updateViewportPan(t){let e=t-this.viewportPanStartX;this.suppressSeekClick=Math.abs(e)>3,this._setLinkedScrollLeft(this.viewportPanStartScroll-e)}_handleWheel(t,e){if(!this.audioBuffer)return;let a=e==="waveform"?this.d.waveformWrapper:this.d.canvasWrapper,o=a.getBoundingClientRect(),n=t.clientX-o.left,s=(a.scrollLeft+n)/this.pixelsPerSecond;if(t.ctrlKey||t.metaKey){t.preventDefault();let i=t.deltaY<0?1.12:1/1.12;this._setPixelsPerSecond(this.pixelsPerSecond*i,!0,s,n);return}Math.abs(t.deltaY)>Math.abs(t.deltaX)&&(t.preventDefault(),this._setLinkedScrollLeft(Math.max(0,a.scrollLeft+t.deltaY)))}_applyLocalViewHeights(){this.d.waveformContainer.style.height=`${Math.round(this.waveformDisplayHeight)}px`,this.d.spectrogramContainer.style.height=`${Math.round(this.spectrogramDisplayHeight)}px`}_startViewResize(t,e){this.viewResizeMode=t,this.viewResizeStartY=e,this.viewResizeStartWaveformHeight=this.waveformDisplayHeight,this.viewResizeStartSpectrogramHeight=this.spectrogramDisplayHeight,document.body.style.cursor="row-resize"}_updateViewResize(t){if(!this.viewResizeMode)return;let e=t-this.viewResizeStartY,a=this.d.canvasWrapper.scrollLeft,o=!1;if(this.viewResizeMode==="split"){let n=this.viewResizeStartWaveformHeight+this.viewResizeStartSpectrogramHeight,s=this.viewResizeStartWaveformHeight+e;s=Math.max(64,Math.min(n-140,s)),this.waveformDisplayHeight=s,this.spectrogramDisplayHeight=n-s,o=!0}else this.spectrogramDisplayHeight=Math.max(140,this.viewResizeStartSpectrogramHeight+e);this._applyLocalViewHeights(),o&&this._updateAmplitudeLabels(),this.audioBuffer&&(o&&this._drawMainWaveform(),this.spectrogramData&&this.spectrogramFrames>0&&this._drawSpectrogram(),this._setLinkedScrollLeft(a))}_stopViewResize(){this.viewResizeMode&&(this.viewResizeMode=null,document.body.style.cursor="")}_setPlayState(t){this.d.playStateDisplay.textContent=t}_setTransportEnabled(t){[this.d.playPauseBtn,this.d.stopBtn,this.d.jumpStartBtn,this.d.jumpEndBtn,this.d.backwardBtn,this.d.forwardBtn,this.d.followToggleBtn,this.d.loopToggleBtn,this.d.fitViewBtn,this.d.resetViewBtn,this.d.autoContrastBtn,this.d.autoFreqBtn].forEach(e=>{e.disabled=!t})}_updateToggleButtons(){this.d.followToggleBtn.classList.toggle("active",this.followPlayback),this.d.loopToggleBtn.classList.toggle("active",this.loopPlayback),this.d.followToggleBtn.textContent=this.followPlayback?"Follow":"Free",this.d.loopToggleBtn.textContent=this.loopPlayback?"Loop On":"Loop"}_setInitialPlayheadPositions(){this.d.playhead.style.left="0px",this.d.waveformPlayhead.style.left="0px",this.d.playhead.style.transform="translateX(0px)",this.d.waveformPlayhead.style.transform="translateX(0px)"}_handleKeyboardShortcuts(t){if(!(!this.audioBuffer||N(t.target)))switch(t.code){case"Space":t.preventDefault(),this._togglePlayPause();break;case"Home":t.preventDefault(),this._seekToTime(0,!0);break;case"End":t.preventDefault(),this._seekToTime(this.audioBuffer.duration,!0);break;case"KeyJ":t.preventDefault(),this._seekByDelta(-5);break;case"KeyL":t.preventDefault(),this._seekByDelta(5);break;case"ArrowLeft":t.preventDefault(),this._seekByDelta(-.5);break;case"ArrowRight":t.preventDefault(),this._seekByDelta(.5);break}}_bindEvents(){let t=(o,n,s,i)=>{o.addEventListener(n,s,i),this._cleanups.push(()=>o.removeEventListener(n,s,i))};t(this.d.openFileBtn,"click",()=>this.d.audioFile.click()),t(this.d.audioFile,"change",o=>this._handleFileSelect(o)),t(this.d.playPauseBtn,"click",()=>this._togglePlayPause()),t(this.d.stopBtn,"click",()=>this._stopPlayback()),t(this.d.jumpStartBtn,"click",()=>this._seekToTime(0,!0)),t(this.d.jumpEndBtn,"click",()=>this._seekToTime(this.audioBuffer?.duration??0,!0)),t(this.d.backwardBtn,"click",()=>this._seekByDelta(-5)),t(this.d.forwardBtn,"click",()=>this._seekByDelta(5)),t(this.d.followToggleBtn,"click",()=>{this.followPlayback=!this.followPlayback,this._updateToggleButtons()}),t(this.d.loopToggleBtn,"click",()=>{this.loopPlayback=!this.loopPlayback,this._updateToggleButtons()}),t(this.d.fitViewBtn,"click",()=>this._fitEntireTrackInView()),t(this.d.resetViewBtn,"click",()=>{this._setPixelsPerSecond(100,!0),this._setLinkedScrollLeft(0),this._syncOverviewWindowToViewport()}),t(this.d.fftSizeSelect,"change",()=>{this.audioBuffer&&this._generateSpectrogram()}),t(this.d.maxFreqSelect,"change",()=>{this.audioBuffer&&this.spectrogramData&&this.spectrogramFrames>0&&(this._createFrequencyLabels(),this._buildSpectrogramGrayscale(),this._buildSpectrogramBaseImage(),this._drawSpectrogram())}),t(this.d.colorSchemeSelect,"change",()=>{this.currentColorScheme=this.d.colorSchemeSelect.value,this.audioBuffer&&this.spectrogramData&&this.spectrogramFrames>0&&(this._buildSpectrogramBaseImage(),this._drawSpectrogram())}),t(this.d.zoomSlider,"input",o=>{this._setPixelsPerSecond(parseFloat(o.target.value),!1),this._requestSpectrogramRedraw()}),t(this.d.zoomSlider,"change",()=>{this.spectrogramData&&this.spectrogramFrames>0&&this._drawSpectrogram()}),t(this.d.volumeSlider,"input",o=>{this.muted=!1,this._setVolume(parseFloat(o.target.value)/100)}),t(this.d.volumeToggleBtn,"click",()=>this._toggleMute());let e=()=>{!this.spectrogramData||this.spectrogramFrames<=0||(this._buildSpectrogramBaseImage(),this._drawSpectrogram())};t(this.d.floorSlider,"input",e),t(this.d.ceilSlider,"input",e),t(this.d.autoContrastBtn,"click",()=>this._autoContrast(!0)),t(this.d.autoFreqBtn,"click",()=>this._autoFrequency(!0)),t(this.d.canvasWrapper,"click",o=>this._handleCanvasClick(o)),t(this.d.waveformWrapper,"click",o=>this._handleWaveformClick(o)),t(this.d.canvasWrapper,"scroll",()=>{this.scrollSyncLock||this._setLinkedScrollLeft(this.d.canvasWrapper.scrollLeft)}),t(this.d.canvasWrapper,"wheel",o=>this._handleWheel(o,"spectrogram"),{passive:!1}),t(this.d.waveformWrapper,"wheel",o=>this._handleWheel(o,"waveform"),{passive:!1}),t(this.d.canvasWrapper,"pointerdown",o=>this._startViewportPan(o,"spectrogram")),t(this.d.waveformWrapper,"pointerdown",o=>this._startViewportPan(o,"waveform")),t(this.d.playhead,"pointerdown",o=>this._startPlayheadDrag(o,"spectrogram")),t(this.d.waveformPlayhead,"pointerdown",o=>this._startPlayheadDrag(o,"waveform")),t(this.d.viewSplitHandle,"pointerdown",o=>{o.preventDefault(),this._startViewResize("split",o.clientY)}),t(this.d.spectrogramResizeHandle,"pointerdown",o=>{o.preventDefault(),this._startViewResize("spectrogram",o.clientY)}),t(document,"pointermove",o=>{if(this.viewResizeMode){this._updateViewResize(o.clientY);return}this.draggingViewport&&this._updateViewportPan(o.clientX),this.draggingPlayhead&&this._seekFromClientX(o.clientX,this.draggingPlayheadSource),this.overviewMode&&this._updateOverviewDrag(o.clientX)});let a=()=>{this._stopViewResize(),this.draggingViewport&&(this.draggingViewport=!1,document.body.style.cursor=""),this.draggingPlayhead=!1,this.draggingPlayheadSource=null,this.overviewMode=null};t(document,"pointerup",a),t(document,"pointercancel",a),t(document,"keydown",o=>this._handleKeyboardShortcuts(o)),t(this.d.overviewHandleLeft,"pointerdown",o=>{o.preventDefault(),this._startOverviewDrag("left",o.clientX)}),t(this.d.overviewHandleRight,"pointerdown",o=>{o.preventDefault(),this._startOverviewDrag("right",o.clientX)}),t(this.d.overviewWindow,"pointerdown",o=>{o.target===this.d.overviewHandleLeft||o.target===this.d.overviewHandleRight||(o.preventDefault(),this._startOverviewDrag("move",o.clientX))}),t(this.d.overviewCanvas,"click",o=>{if(!this.audioBuffer)return;let n=this.d.overviewCanvas.getBoundingClientRect(),s=Math.max(0,Math.min(1,(o.clientX-n.left)/n.width));this._seekToTime(s*this.audioBuffer.duration,!0)}),t(window,"resize",()=>{this.audioBuffer&&(this._drawMainWaveform(),this._drawOverviewWaveform(),this._syncOverviewWindowToViewport())}),t(window,"beforeunload",()=>this.dispose())}};var Pt="https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";var F=class{constructor(t,e={}){if(!t)throw new Error("BirdNETPlayer: container element required");this.container=t,this.options=e,this._state=null,this.ready=this._init()}async _init(){this.container.innerHTML=V(this.options),this.root=this.container.querySelector(".daw-shell");let t=this.options.WaveSurfer||window.WaveSurfer||(await import(Pt)).default;return this._state=new C(this.root,t),this}async loadUrl(t){return await this.ready,this._state.loadUrl(t)}async loadFile(t){return await this.ready,this._state._handleFileSelect({target:{files:[t]}})}get currentTime(){return this._state?._getCurrentTime()||0}get duration(){return this._state?.audioBuffer?.duration||0}play(){this._state?.wavesurfer?.play()}pause(){this._state?.wavesurfer?.pause()}stop(){this._state?._stopPlayback()}togglePlayPause(){this._state?._togglePlayPause()}destroy(){this._state?.dispose(),this._state=null,this.container.innerHTML=""}};return ut(Et);})();
