// src/player/template.js
var DEFAULT_OPTIONS = {
  showFileOpen: true,
  // Open-button + file input
  showTransport: true,
  // Play/Pause/Stop/Skip
  showTime: true,
  // Time display
  showVolume: true,
  // Volume slider + mute
  showViewToggles: true,
  // Follow / Loop / Fit / Reset
  showZoom: true,
  // Zoom slider
  showFFTControls: true,
  // FFT size, Freq, AF, Color
  showDisplayGain: true,
  // Floor / Ceil / AC sliders
  showStatusbar: true
  // Bottom status bar
};
function createPlayerHTML(opts = {}) {
  const o = { ...DEFAULT_OPTIONS, ...opts };
  const hide = (flag) => flag ? "" : ' style="display:none"';
  return `<div class="daw-shell">

    <!-- \u2550\u2550\u2550 Top Toolbar \u2550\u2550\u2550 -->
    <div class="toolbar">
        <button class="toolbar-btn file-btn" id="openFileBtn" title="Audio-Datei laden"${hide(o.showFileOpen)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Open
        </button>
        <input type="file" id="audioFile" accept="audio/*" hidden>

        <div class="toolbar-sep"${hide(o.showFileOpen)}></div>

        <!-- Transport -->
        <div class="transport"${hide(o.showTransport)}>
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
        <div class="time-display" id="timeDisplay"${hide(o.showTime)}>
            <span id="currentTime">00:00.0</span><span class="time-sep">/</span><span id="totalTime">00:00.0</span>
        </div>

        <div class="toolbar-sep"${hide(o.showVolume)}></div>

        <!-- Volume -->
        <button class="toolbar-btn icon-btn" id="volumeToggleBtn" title="Mute / Unmute"${hide(o.showVolume)}>
            <svg id="volumeIcon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path id="volumeWaves" d="M15 8.5a4 4 0 010 7M18 5a9 9 0 010 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
        <input type="range" id="volumeSlider" class="toolbar-range toolbar-range-sm" min="0" max="100" value="80" title="Lautst\xE4rke"${hide(o.showVolume)}>

        <div class="toolbar-sep"${hide(o.showViewToggles)}></div>

        <!-- Toggle tools -->
        <span${hide(o.showViewToggles)}>
            <button class="toolbar-btn toggle-btn active" id="followToggleBtn" disabled title="Playhead folgen">Follow</button>
            <button class="toolbar-btn toggle-btn" id="loopToggleBtn" disabled title="Loop">Loop</button>
            <button class="toolbar-btn" id="fitViewBtn" disabled title="Fit to view">Fit</button>
            <button class="toolbar-btn" id="resetViewBtn" disabled title="Reset zoom">Reset</button>
        </span>

        <div class="toolbar-sep"${hide(o.showZoom)}></div>

        <!-- Zoom -->
        <span${hide(o.showZoom)}>
            <label class="toolbar-label" for="zoomSlider">Zoom</label>
            <input type="range" id="zoomSlider" class="toolbar-range" min="20" max="600" value="100" step="5">
            <span class="toolbar-value" id="zoomValue">100 px/s</span>
        </span>

        <div class="toolbar-sep"${hide(o.showFFTControls)}></div>

        <!-- Settings -->
        <span${hide(o.showFFTControls)}>
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

        <div class="toolbar-sep"${hide(o.showDisplayGain)}></div>

        <!-- Display gain: SDR#-style floor / ceiling -->
        <span${hide(o.showDisplayGain)}>
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
    <div class="statusbar"${hide(o.showStatusbar)}>
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
</div>`;
}

// src/player/constants.js
var DEFAULT_ZOOM_PPS = 100;
var DEFAULT_WAVEFORM_HEIGHT = 100;
var DEFAULT_SPECTROGRAM_DISPLAY_HEIGHT = DEFAULT_WAVEFORM_HEIGHT * 2;
var MIN_WAVEFORM_HEIGHT = 64;
var MIN_SPECTROGRAM_DISPLAY_HEIGHT = 140;
var SEEK_FINE_SEC = 0.5;
var SEEK_COARSE_SEC = 5;
var SPECTROGRAM_HEIGHT = 512;
var MAX_BASE_SPECTROGRAM_WIDTH = 24e3;
var MIN_WINDOW_NORM = 0.02;
var PERCH_FRAME_RATE = 100;
var PERCH_N_MELS = 160;
var PERCH_PCEN_GAIN = 0.8;
var PERCH_PCEN_BIAS = 0.01;
var PERCH_PCEN_ROOT = 4;
var PERCH_PCEN_SMOOTHING = 0.025;

// src/player/utils.js
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(4, "0")}`;
}
function formatSecondsShort(seconds) {
  return `${seconds.toFixed(2)}s`;
}
function isTypingContext(target) {
  if (!target || !target.tagName) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable;
}
function getTimeGridSteps(pixelsPerSecond) {
  const majorStep = pixelsPerSecond >= 320 ? 0.5 : pixelsPerSecond >= 180 ? 1 : pixelsPerSecond >= 90 ? 2 : pixelsPerSecond >= 45 ? 5 : 10;
  return { majorStep, minorStep: majorStep / 2 };
}

// src/player/spectrogram.js
function computeAmplitudePeak(channelData) {
  let peak = 0;
  for (let i = 0; i < channelData.length; i++) {
    const abs = Math.abs(channelData[i]);
    if (abs > peak) peak = abs;
  }
  return Math.max(1e-6, peak);
}
function buildMelFrequencies(sampleRate, nMels) {
  const melToHz = (mel) => 700 * (Math.pow(10, mel / 2595) - 1);
  const hzToMel = (hz) => 2595 * Math.log10(1 + hz / 700);
  const melMin = hzToMel(0);
  const melMax = hzToMel(sampleRate / 2);
  const freqs = new Float32Array(nMels);
  for (let i = 0; i < nMels; i++) {
    const mel = melMin + i / Math.max(1, nMels - 1) * (melMax - melMin);
    freqs[i] = melToHz(mel);
  }
  return freqs;
}
var COLOR_MAPS = {
  inferno: [
    [0, 0, 4],
    [31, 12, 72],
    [85, 15, 109],
    [136, 34, 106],
    [186, 54, 85],
    [227, 89, 51],
    [249, 140, 10],
    [252, 201, 40],
    [252, 255, 164]
  ],
  // Keep this table in sync with `web-demo/src/spectrogram.ts` (VIRIDIS_COLORS).
  viridis: [
    [68, 1, 84],
    [68, 2, 86],
    [69, 4, 87],
    [69, 5, 89],
    [70, 7, 90],
    [70, 8, 92],
    [70, 10, 93],
    [70, 11, 94],
    [71, 13, 96],
    [71, 14, 97],
    [71, 16, 99],
    [71, 17, 100],
    [71, 19, 101],
    [72, 20, 103],
    [72, 22, 104],
    [72, 23, 105],
    [72, 24, 106],
    [72, 26, 108],
    [72, 27, 109],
    [72, 28, 110],
    [72, 29, 111],
    [72, 31, 112],
    [72, 32, 113],
    [72, 33, 115],
    [72, 35, 116],
    [72, 36, 117],
    [72, 37, 118],
    [72, 38, 119],
    [72, 40, 120],
    [72, 41, 121],
    [71, 42, 122],
    [71, 44, 122],
    [71, 45, 123],
    [71, 46, 124],
    [71, 47, 125],
    [70, 48, 126],
    [70, 50, 126],
    [70, 51, 127],
    [69, 52, 128],
    [69, 53, 129],
    [69, 55, 129],
    [68, 56, 130],
    [68, 57, 131],
    [68, 58, 131],
    [67, 60, 132],
    [67, 61, 132],
    [66, 62, 133],
    [66, 63, 133],
    [66, 64, 134],
    [65, 66, 134],
    [65, 67, 135],
    [64, 68, 135],
    [64, 69, 136],
    [63, 71, 136],
    [63, 72, 137],
    [62, 73, 137],
    [62, 74, 137],
    [62, 76, 138],
    [61, 77, 138],
    [61, 78, 138],
    [60, 79, 139],
    [60, 80, 139],
    [59, 82, 139],
    [59, 83, 140],
    [58, 84, 140],
    [58, 85, 140],
    [57, 86, 141],
    [57, 88, 141],
    [56, 89, 141],
    [56, 90, 141],
    [55, 91, 142],
    [55, 92, 142],
    [54, 94, 142],
    [54, 95, 142],
    [53, 96, 142],
    [53, 97, 143],
    [52, 98, 143],
    [52, 99, 143],
    [51, 101, 143],
    [51, 102, 143],
    [50, 103, 144],
    [50, 104, 144],
    [49, 105, 144],
    [49, 106, 144],
    [49, 108, 144],
    [48, 109, 144],
    [48, 110, 144],
    [47, 111, 145],
    [47, 112, 145],
    [46, 113, 145],
    [46, 114, 145],
    [45, 116, 145],
    [45, 117, 145],
    [44, 118, 145],
    [44, 119, 145],
    [44, 120, 146],
    [43, 121, 146],
    [43, 122, 146],
    [42, 123, 146],
    [42, 125, 146],
    [42, 126, 146],
    [41, 127, 146],
    [41, 128, 146],
    [40, 129, 146],
    [40, 130, 146],
    [40, 131, 146],
    [39, 132, 146],
    [39, 133, 146],
    [38, 134, 146],
    [38, 136, 146],
    [38, 137, 146],
    [37, 138, 146],
    [37, 139, 146],
    [36, 140, 146],
    [36, 141, 146],
    [36, 142, 146],
    [35, 143, 146],
    [35, 144, 146],
    [35, 145, 146],
    [34, 146, 146],
    [34, 147, 146],
    [33, 148, 146],
    [33, 149, 146],
    [33, 150, 146],
    [32, 151, 145],
    [32, 152, 145],
    [32, 153, 145],
    [31, 154, 145],
    [31, 155, 145],
    [31, 156, 145],
    [30, 157, 144],
    [30, 158, 144],
    [30, 159, 144],
    [30, 160, 144],
    [29, 161, 143],
    [29, 162, 143],
    [29, 163, 143],
    [29, 164, 142],
    [28, 165, 142],
    [28, 166, 142],
    [28, 167, 141],
    [28, 168, 141],
    [28, 169, 141],
    [27, 170, 140],
    [27, 171, 140],
    [27, 172, 139],
    [27, 173, 139],
    [27, 174, 138],
    [27, 175, 138],
    [27, 176, 137],
    [27, 177, 137],
    [27, 178, 136],
    [27, 179, 136],
    [27, 180, 135],
    [27, 181, 135],
    [27, 182, 134],
    [27, 183, 133],
    [28, 184, 133],
    [28, 185, 132],
    [28, 186, 131],
    [29, 187, 131],
    [29, 188, 130],
    [29, 189, 129],
    [30, 190, 129],
    [30, 190, 128],
    [31, 191, 127],
    [31, 192, 126],
    [32, 193, 126],
    [33, 194, 125],
    [33, 195, 124],
    [34, 196, 123],
    [35, 197, 123],
    [36, 198, 122],
    [37, 198, 121],
    [37, 199, 120],
    [38, 200, 119],
    [39, 201, 118],
    [40, 202, 118],
    [41, 203, 117],
    [42, 203, 116],
    [44, 204, 115],
    [45, 205, 114],
    [46, 206, 113],
    [47, 207, 112],
    [49, 207, 111],
    [50, 208, 110],
    [51, 209, 109],
    [53, 210, 108],
    [54, 210, 107],
    [56, 211, 106],
    [57, 212, 105],
    [59, 213, 104],
    [60, 213, 103],
    [62, 214, 102],
    [64, 215, 101],
    [65, 215, 100],
    [67, 216, 98],
    [69, 217, 97],
    [70, 217, 96],
    [72, 218, 95],
    [74, 219, 94],
    [76, 219, 93],
    [78, 220, 91],
    [80, 221, 90],
    [82, 221, 89],
    [83, 222, 88],
    [85, 222, 86],
    [87, 223, 85],
    [89, 224, 84],
    [91, 224, 83],
    [94, 225, 81],
    [96, 225, 80],
    [98, 226, 79],
    [100, 226, 77],
    [102, 227, 76],
    [104, 227, 75],
    [106, 228, 73],
    [109, 228, 72],
    [111, 229, 71],
    [113, 229, 69],
    [115, 230, 68],
    [118, 230, 66],
    [120, 231, 65],
    [122, 231, 64],
    [125, 232, 62],
    [127, 232, 61],
    [129, 232, 59],
    [132, 233, 58],
    [134, 233, 56],
    [137, 234, 55],
    [139, 234, 53],
    [141, 235, 52],
    [144, 235, 50],
    [146, 235, 49],
    [149, 236, 47],
    [151, 236, 46],
    [154, 236, 45],
    [156, 237, 43],
    [159, 237, 42],
    [161, 237, 40],
    [163, 238, 39],
    [166, 238, 38],
    [168, 238, 36],
    [171, 239, 35],
    [173, 239, 34],
    [176, 239, 32],
    [178, 239, 31],
    [181, 240, 30],
    [183, 240, 29],
    [186, 240, 28],
    [188, 240, 27],
    [191, 241, 26],
    [193, 241, 25],
    [195, 241, 24],
    [198, 241, 23],
    [200, 241, 23],
    [203, 241, 22],
    [205, 242, 22],
    [207, 242, 21],
    [210, 242, 21],
    [212, 242, 21],
    [214, 242, 21],
    [217, 242, 20],
    [219, 242, 20],
    [221, 243, 20],
    [224, 243, 21],
    [226, 243, 21],
    [228, 243, 21],
    [230, 243, 22],
    [232, 243, 22],
    [235, 243, 23],
    [237, 244, 24],
    [239, 244, 25],
    [241, 244, 26],
    [243, 244, 27],
    [245, 244, 28],
    [247, 244, 30],
    [249, 244, 31],
    [251, 245, 33],
    [253, 245, 35]
  ],
  magma: [
    [0, 0, 4],
    [28, 16, 68],
    [79, 18, 123],
    [129, 37, 129],
    [181, 54, 122],
    [229, 80, 100],
    [251, 135, 97],
    [254, 194, 135],
    [252, 253, 191]
  ],
  plasma: [
    [13, 8, 135],
    [75, 3, 161],
    [125, 3, 168],
    [168, 34, 150],
    [203, 70, 121],
    [229, 107, 93],
    [248, 148, 65],
    [253, 195, 40],
    [240, 249, 33]
  ]
};
function sampleColorMap(stops, t) {
  if (!stops || stops.length === 0) return { r: 0, g: 0, b: 0 };
  if (stops.length === 1) return { r: stops[0][0], g: stops[0][1], b: stops[0][2] };
  const pos = Math.max(0, Math.min(1, t)) * (stops.length - 1);
  const idx = Math.floor(pos);
  const frac = pos - idx;
  const a = stops[idx];
  const b = stops[Math.min(stops.length - 1, idx + 1)];
  return {
    r: Math.round(a[0] + (b[0] - a[0]) * frac),
    g: Math.round(a[1] + (b[1] - a[1]) * frac),
    b: Math.round(a[2] + (b[2] - a[2]) * frac)
  };
}
function getSpectrogramColor(value, colorScheme) {
  const x = Math.max(0, Math.min(1, value));
  if (colorScheme === "grayscale") {
    const v = Math.round(x * 255);
    return { r: v, g: v, b: v };
  }
  if (colorScheme === "viridis") {
    const palette = COLOR_MAPS.viridis;
    const idx = Math.min(palette.length - 1, Math.floor(x * (palette.length - 1)));
    const color = palette[idx];
    return { r: color[0], g: color[1], b: color[2] };
  }
  if (colorScheme === "fire") {
    const r = Math.round(255 * Math.pow(x, 0.7));
    const g = Math.round(255 * Math.max(0, Math.min(1, (x - 0.15) / 0.85)));
    const b = Math.round(255 * Math.max(0, Math.min(1, (x - 0.45) / 0.55)));
    return { r, g, b };
  }
  return sampleColorMap(COLOR_MAPS[colorScheme] || COLOR_MAPS.inferno, x);
}
var _VS = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
    v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`;
var _FS = `#version 300 es
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
}`;
var GpuColorizer = class {
  constructor() {
    this._canvas = document.createElement("canvas");
    const gl = this._canvas.getContext("webgl2", {
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      antialias: false
    });
    if (!gl) {
      this._gl = null;
      return;
    }
    this._gl = gl;
    this._maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const vs = this._sh(gl.VERTEX_SHADER, _VS);
    const fs = this._sh(gl.FRAGMENT_SHADER, _FS);
    if (!vs || !fs) {
      this._gl = null;
      return;
    }
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      this._gl = null;
      return;
    }
    this._prog = p;
    this._uFloor = gl.getUniformLocation(p, "u_floor");
    this._uRcpRange = gl.getUniformLocation(p, "u_rcpRange");
    this._uGray = gl.getUniformLocation(p, "u_gray");
    this._uLut = gl.getUniformLocation(p, "u_lut");
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(p, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this._vao = vao;
    this._grayTex = gl.createTexture();
    this._lutTex = gl.createTexture();
    this._w = 0;
    this._h = 0;
    this._lutScheme = null;
  }
  /** @private */
  _sh(type, src) {
    const gl = this._gl, s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }
  get ok() {
    return !!this._gl;
  }
  get canvas() {
    return this._canvas;
  }
  /** Upload 8-bit grayscale map as a RED channel texture. Returns success. */
  uploadGrayscale(gray, width, height) {
    const gl = this._gl;
    if (!gl || width > this._maxTex || height > this._maxTex) return false;
    this._w = width;
    this._h = height;
    this._canvas.width = width;
    this._canvas.height = height;
    gl.bindTexture(gl.TEXTURE_2D, this._grayTex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.RED, gl.UNSIGNED_BYTE, gray);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return true;
  }
  /** Build 256-entry RGBA color look-up texture from a color scheme. */
  uploadColorLut(scheme) {
    if (scheme === this._lutScheme) return;
    const gl = this._gl;
    if (!gl) return;
    this._lutScheme = scheme;
    const d = new Uint8Array(256 * 4);
    for (let i = 0; i < 256; i++) {
      const c = getSpectrogramColor(i / 255, scheme);
      const o = i * 4;
      d[o] = c.r;
      d[o + 1] = c.g;
      d[o + 2] = c.b;
      d[o + 3] = 255;
    }
    gl.bindTexture(gl.TEXTURE_2D, this._lutTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, d);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  /** Render colorized spectrogram. floor01/ceil01 ∈ [0,1]. ~0.1 ms. */
  render(floor01, ceil01) {
    const gl = this._gl;
    if (!gl || !this._w) return;
    gl.viewport(0, 0, this._w, this._h);
    gl.useProgram(this._prog);
    gl.bindVertexArray(this._vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._grayTex);
    gl.uniform1i(this._uGray, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._lutTex);
    gl.uniform1i(this._uLut, 1);
    gl.uniform1f(this._uFloor, floor01);
    gl.uniform1f(this._uRcpRange, 1 / Math.max(1e-4, ceil01 - floor01));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  dispose() {
    const gl = this._gl;
    if (!gl) return;
    gl.deleteTexture(this._grayTex);
    gl.deleteTexture(this._lutTex);
    gl.deleteProgram(this._prog);
    gl.deleteVertexArray(this._vao);
    this._gl = null;
  }
};
function updateSpectrogramStats(spectrogramData) {
  if (!spectrogramData || spectrogramData.length === 0) {
    return { logMin: 0, logMax: 1 };
  }
  let minLog = Number.POSITIVE_INFINITY;
  let maxLog = Number.NEGATIVE_INFINITY;
  const stride = Math.max(1, Math.floor(spectrogramData.length / 12e4));
  for (let i = 0; i < spectrogramData.length; i += stride) {
    const mapped = Math.log1p((spectrogramData[i] || 0) * 12);
    if (mapped < minLog) minLog = mapped;
    if (mapped > maxLog) maxLog = mapped;
  }
  if (!Number.isFinite(minLog) || !Number.isFinite(maxLog) || maxLog - minLog < 1e-6) {
    return { logMin: 0, logMax: 1 };
  }
  return { logMin: minLog, logMax: maxLog };
}
function autoContrastStats(spectrogramData, loPercentile = 2, hiPercentile = 98) {
  if (!spectrogramData || spectrogramData.length === 0) return { logMin: 0, logMax: 1 };
  const stride = Math.max(1, Math.floor(spectrogramData.length / 2e5));
  const mapped = [];
  for (let i = 0; i < spectrogramData.length; i += stride) {
    mapped.push(Math.log1p((spectrogramData[i] || 0) * 12));
  }
  mapped.sort((a, b) => a - b);
  const loIdx = Math.floor(mapped.length * loPercentile / 100);
  const hiIdx = Math.min(mapped.length - 1, Math.floor(mapped.length * hiPercentile / 100));
  const logMin = mapped[loIdx];
  const logMax = mapped[hiIdx];
  if (!Number.isFinite(logMin) || !Number.isFinite(logMax) || logMax - logMin < 1e-6) {
    return { logMin: 0, logMax: 1 };
  }
  return { logMin, logMax };
}
function detectMaxFrequency(spectrogramData, nFrames, nMels, sampleRate, energyThreshold = 0.08) {
  if (!spectrogramData || nFrames <= 0 || nMels <= 0) return sampleRate / 2;
  const binEnergy = new Float64Array(nMels);
  const stride = Math.max(1, Math.floor(nFrames / 2e3));
  let sampledFrames = 0;
  for (let f = 0; f < nFrames; f += stride) {
    const base = f * nMels;
    for (let m = 0; m < nMels; m++) {
      binEnergy[m] += spectrogramData[base + m] || 0;
    }
    sampledFrames++;
  }
  for (let m = 0; m < nMels; m++) binEnergy[m] /= sampledFrames;
  let peakEnergy = 0;
  for (let m = 0; m < nMels; m++) {
    if (binEnergy[m] > peakEnergy) peakEnergy = binEnergy[m];
  }
  if (peakEnergy < 1e-12) return sampleRate / 2;
  const threshold = peakEnergy * energyThreshold;
  let highestActiveBin = 0;
  for (let m = nMels - 1; m >= 0; m--) {
    if (binEnergy[m] > threshold) {
      highestActiveBin = m;
      break;
    }
  }
  const melFreqs = buildMelFrequencies(sampleRate, nMels);
  const detectedHz = melFreqs[Math.min(nMels - 1, highestActiveBin + 2)] || sampleRate / 2;
  const withMargin = detectedHz * 1.1;
  const steps = [2e3, 3e3, 4e3, 5e3, 6e3, 8e3, 1e4, 12e3, 16e3, 2e4, 22050];
  const nyquist = sampleRate / 2;
  let best = nyquist;
  for (const s of steps) {
    if (s >= withMargin && s <= nyquist) {
      best = s;
      break;
    }
  }
  return best;
}
function drawTimeGrid({ ctx, width, height, duration, pixelsPerSecond }) {
  if (width <= 0) return;
  const css = getComputedStyle(document.documentElement);
  const majorColor = css.getPropertyValue("--color-text-secondary").trim() || "#cbd5e1";
  const { majorStep, minorStep } = getTimeGridSteps(pixelsPerSecond);
  ctx.save();
  ctx.font = "11px monospace";
  ctx.textBaseline = "top";
  for (let t = 0; t <= duration; t += minorStep) {
    const x = Math.round(t * pixelsPerSecond) + 0.5;
    if (x < 0 || x > width) continue;
    const isMajor = Math.abs(t / majorStep - Math.round(t / majorStep)) < 1e-4;
    ctx.strokeStyle = isMajor ? "rgba(148,163,184,0.35)" : "rgba(148,163,184,0.18)";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
    if (isMajor) {
      ctx.fillStyle = majorColor;
      ctx.fillText(`${t.toFixed(1)}s`, x + 3, 4);
    }
  }
  ctx.restore();
}
function buildSpectrogramGrayscale({
  spectrogramData,
  spectrogramFrames,
  spectrogramMels,
  sampleRateHz,
  maxFreq,
  spectrogramAbsLogMin,
  spectrogramAbsLogMax
}) {
  if (!spectrogramData || spectrogramFrames <= 0 || spectrogramMels <= 0) return null;
  const width = Math.max(1, Math.min(spectrogramFrames, MAX_BASE_SPECTROGRAM_WIDTH));
  const height = SPECTROGRAM_HEIGHT;
  const framesPerPixel = spectrogramFrames / width;
  const boundedMaxFreq = Math.min(maxFreq, sampleRateHz / 2);
  const melFreqs = buildMelFrequencies(sampleRateHz, spectrogramMels);
  let maxMelBin = spectrogramMels - 1;
  for (let i = 0; i < melFreqs.length; i++) {
    if (melFreqs[i] > boundedMaxFreq) {
      maxMelBin = Math.max(1, i - 1);
      break;
    }
  }
  const yToMel = new Int16Array(height);
  for (let y = 0; y < height; y++) {
    const freqIndex = Math.floor((height - y) / height * (maxMelBin + 1));
    yToMel[y] = Math.max(0, Math.min(maxMelBin, freqIndex));
  }
  const logRange = Math.max(1e-6, spectrogramAbsLogMax - spectrogramAbsLogMin);
  const gray = new Uint8Array(width * height);
  for (let x = 0; x < width; x++) {
    const frameStart = Math.max(0, Math.floor(x * framesPerPixel));
    const frameEnd = Math.max(frameStart + 1, Math.min(spectrogramFrames, Math.ceil((x + 1) * framesPerPixel)));
    const sampleStep = Math.max(1, Math.floor((frameEnd - frameStart) / 4));
    for (let y = 0; y < height; y++) {
      const melBin = yToMel[y];
      let sum = 0, count = 0;
      for (let frame = frameStart; frame < frameEnd; frame += sampleStep) {
        sum += spectrogramData[frame * spectrogramMels + melBin] || 0;
        count++;
      }
      if (frameEnd - 1 > frameStart) {
        sum += spectrogramData[(frameEnd - 1) * spectrogramMels + melBin] || 0;
        count++;
      }
      const magnitude = sum / Math.max(1, count);
      const normalized = (Math.log1p(magnitude * 12) - spectrogramAbsLogMin) / logRange;
      gray[y * width + x] = Math.max(0, Math.min(255, Math.round(normalized * 255)));
    }
  }
  return { gray, width, height };
}
function colorizeSpectrogram(grayInfo, floor01, ceil01, colorScheme) {
  if (!grayInfo) return null;
  const { gray, width, height } = grayInfo;
  const lut = new Uint32Array(256);
  const range = Math.max(1e-6, ceil01 - floor01);
  const view = new DataView(lut.buffer);
  for (let i = 0; i < 256; i++) {
    const raw = i / 255;
    const remapped = Math.max(0, Math.min(1, (raw - floor01) / range));
    const c = getSpectrogramColor(remapped, colorScheme);
    view.setUint32(i * 4, 255 << 24 | c.b << 16 | c.g << 8 | c.r, true);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const imageData = ctx.createImageData(width, height);
  const pixels = new Uint32Array(imageData.data.buffer);
  const len = width * height;
  for (let i = 0; i < len; i++) {
    pixels[i] = lut[gray[i]];
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
function renderSpectrogram({
  duration,
  spectrogramCanvas,
  pixelsPerSecond,
  canvasHeight,
  baseCanvas,
  sampleRate,
  frameRate,
  spectrogramFrames
}) {
  if (!baseCanvas) return;
  const ctx = spectrogramCanvas.getContext("2d");
  if (!ctx) return;
  const width = Math.max(1, Math.floor(duration * pixelsPerSecond));
  const height = Math.max(140, Math.floor(canvasHeight));
  spectrogramCanvas.width = width;
  spectrogramCanvas.height = height;
  ctx.clearRect(0, 0, width, height);
  const hopSize = Math.floor(sampleRate / frameRate);
  const frameCenterSec = 2 * hopSize / sampleRate;
  const x0 = Math.round(frameCenterSec * pixelsPerSecond);
  const drawWidth = Math.round(spectrogramFrames * hopSize / sampleRate * pixelsPerSecond);
  ctx.imageSmoothingEnabled = drawWidth < baseCanvas.width;
  ctx.drawImage(
    baseCanvas,
    0,
    0,
    baseCanvas.width,
    baseCanvas.height,
    x0,
    0,
    drawWidth,
    height
  );
  drawTimeGrid({ ctx, width, height, duration, pixelsPerSecond });
}
var WORKER_CODE = `
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
`;
function createSpectrogramProcessor() {
  let worker = null;
  let workerFailed = false;
  let requestCounter = 0;
  const pendingRequests = /* @__PURE__ */ new Map();
  let _mainThreadFn = null;
  const getMainThreadFn = () => {
    if (_mainThreadFn) return _mainThreadFn;
    _mainThreadFn = new Function("params", `
            const {
                channelData, fftSize, sampleRate, frameRate,
                nMels, pcenGain, pcenBias, pcenRoot, pcenSmoothing,
            } = params;

            const audio = new Float32Array(channelData);
            const hopSize = Math.max(1, Math.floor(sampleRate / frameRate));
            const winLength = 4 * hopSize;
            const numFrames = Math.max(1, Math.floor((audio.length - winLength) / hopSize) + 1);

            ${/* inline helpers from WORKER_CODE */
    ""}
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
        `);
    return _mainThreadFn;
  };
  const computeMainThread = (channelData, options) => {
    const fn = getMainThreadFn();
    return fn({
      channelData: channelData.buffer.slice(
        channelData.byteOffset,
        channelData.byteOffset + channelData.byteLength
      ),
      ...options
    });
  };
  const ensureWorker = () => {
    if (worker || workerFailed) return;
    try {
      const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      worker = new Worker(url);
      worker.onmessage = (event) => {
        const { requestId, data, nFrames, nMels } = event.data;
        const pending = pendingRequests.get(requestId);
        if (!pending) return;
        pendingRequests.delete(requestId);
        pending.resolve({ data: new Float32Array(data), nFrames, nMels });
      };
      worker.onerror = (error) => {
        console.warn("Spectrogram Worker failed, using main-thread fallback:", error);
        workerFailed = true;
        worker?.terminate();
        worker = null;
        pendingRequests.forEach(({ reject }) => reject(error));
        pendingRequests.clear();
      };
    } catch (e) {
      console.warn("Cannot create Worker, using main-thread fallback:", e);
      workerFailed = true;
      worker = null;
    }
  };
  const compute = async (channelData, options) => {
    if (workerFailed) {
      return computeMainThread(channelData, options);
    }
    ensureWorker();
    if (workerFailed) {
      return computeMainThread(channelData, options);
    }
    const requestId = ++requestCounter;
    const audioCopy = new Float32Array(channelData);
    const workerPromise = new Promise((resolve, reject) => {
      pendingRequests.set(requestId, { resolve, reject });
    });
    worker.postMessage(
      { requestId, channelData: audioCopy.buffer, ...options },
      [audioCopy.buffer]
    );
    try {
      const result = await Promise.race([
        workerPromise,
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Worker timeout")), 8e3)
        )
      ]);
      return result;
    } catch (e) {
      console.warn("Worker failed/timed out, computing on main thread:", e.message);
      pendingRequests.delete(requestId);
      workerFailed = true;
      worker?.terminate();
      worker = null;
      return computeMainThread(channelData, options);
    }
  };
  const dispose = () => {
    if (worker) {
      worker.terminate();
      worker = null;
    }
    pendingRequests.clear();
  };
  return { compute, dispose };
}

// src/player/waveform.js
function drawWaveformTimeline({ ctx, width, height, duration, pixelsPerSecond }) {
  if (width <= 0) return;
  const css = getComputedStyle(document.documentElement);
  const textColor = css.getPropertyValue("--color-text-secondary").trim() || "#cbd5e1";
  const { majorStep, minorStep } = getTimeGridSteps(pixelsPerSecond);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = css.getPropertyValue("--color-bg-secondary").trim() || "#1e293b";
  ctx.fillRect(0, 0, width, height);
  ctx.font = "11px monospace";
  ctx.textBaseline = "middle";
  ctx.fillStyle = textColor;
  ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
  for (let t = 0; t <= duration; t += minorStep) {
    const x = Math.round(t * pixelsPerSecond) + 0.5;
    if (x < 0 || x > width) continue;
    const isMajor = Math.abs(t / majorStep - Math.round(t / majorStep)) < 1e-4;
    const lineHeight = isMajor ? 14 : 8;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, lineHeight);
    ctx.stroke();
    if (isMajor) {
      ctx.fillText(`${t.toFixed(1)}s`, x + 3, height / 2);
    }
  }
}
function renderMainWaveform({
  audioBuffer,
  amplitudeCanvas,
  waveformTimelineCanvas,
  waveformContent,
  pixelsPerSecond,
  waveformHeight = 100,
  amplitudePeakAbs
}) {
  if (!audioBuffer) return;
  const ampCtx = amplitudeCanvas.getContext("2d");
  const timelineCtx = waveformTimelineCanvas.getContext("2d");
  if (!ampCtx || !timelineCtx) return;
  const width = Math.max(1, Math.floor(audioBuffer.duration * pixelsPerSecond));
  const clampedWaveformHeight = Math.max(64, Math.floor(waveformHeight));
  const timelineHeight = Math.max(18, Math.min(32, Math.round(clampedWaveformHeight * 0.22)));
  const ampHeight = Math.max(32, clampedWaveformHeight - timelineHeight);
  amplitudeCanvas.width = width;
  amplitudeCanvas.height = ampHeight;
  waveformTimelineCanvas.width = width;
  waveformTimelineCanvas.height = timelineHeight;
  waveformContent.style.width = `${width}px`;
  const channelData = audioBuffer.getChannelData(0);
  const totalSamples = channelData.length;
  const midY = ampHeight / 2;
  const ampScale = 1 / Math.max(1e-6, amplitudePeakAbs);
  const { majorStep, minorStep } = getTimeGridSteps(pixelsPerSecond);
  ampCtx.clearRect(0, 0, width, ampHeight);
  ampCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-bg-tertiary");
  ampCtx.fillRect(0, 0, width, ampHeight);
  for (let t = 0; t <= audioBuffer.duration; t += minorStep) {
    const x = Math.round(t * pixelsPerSecond) + 0.5;
    const isMajor = Math.abs(t / majorStep - Math.round(t / majorStep)) < 1e-4;
    ampCtx.strokeStyle = isMajor ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.12)";
    ampCtx.beginPath();
    ampCtx.moveTo(x, 0);
    ampCtx.lineTo(x, ampHeight);
    ampCtx.stroke();
  }
  ampCtx.strokeStyle = "rgba(148, 163, 184, 0.35)";
  ampCtx.beginPath();
  ampCtx.moveTo(0, midY + 0.5);
  ampCtx.lineTo(width, midY + 0.5);
  ampCtx.stroke();
  ampCtx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-accent");
  ampCtx.lineWidth = 1;
  for (let x = 0; x < width; x++) {
    const start = Math.floor(x * totalSamples / width);
    const end = Math.min(totalSamples, Math.floor((x + 1) * totalSamples / width));
    let min = 1;
    let max = -1;
    for (let i = start; i < end; i++) {
      const v = Math.max(-1, Math.min(1, channelData[i] * ampScale));
      if (v < min) min = v;
      if (v > max) max = v;
    }
    ampCtx.beginPath();
    ampCtx.moveTo(x + 0.5, (1 + min) * midY);
    ampCtx.lineTo(x + 0.5, (1 + max) * midY);
    ampCtx.stroke();
  }
  drawWaveformTimeline({
    ctx: timelineCtx,
    width,
    height: timelineHeight,
    duration: audioBuffer.duration,
    pixelsPerSecond
  });
}
function renderOverviewWaveform({
  audioBuffer,
  overviewCanvas,
  overviewContainer,
  amplitudePeakAbs
}) {
  if (!audioBuffer) return;
  const ctx = overviewCanvas.getContext("2d");
  if (!ctx) return;
  const rect = overviewContainer.getBoundingClientRect();
  overviewCanvas.width = Math.max(1, Math.floor(rect.width));
  overviewCanvas.height = Math.max(1, Math.floor(rect.height));
  ctx.clearRect(0, 0, overviewCanvas.width, overviewCanvas.height);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-bg-tertiary");
  ctx.fillRect(0, 0, overviewCanvas.width, overviewCanvas.height);
  const channelData = audioBuffer.getChannelData(0);
  const totalSamples = channelData.length;
  const amp = overviewCanvas.height / 2;
  const ampScale = 1 / Math.max(1e-6, amplitudePeakAbs);
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-accent");
  ctx.lineWidth = 1;
  for (let x = 0; x < overviewCanvas.width; x++) {
    const start = Math.floor(x * totalSamples / overviewCanvas.width);
    const end = Math.min(totalSamples, Math.floor((x + 1) * totalSamples / overviewCanvas.width));
    let min = 1;
    let max = -1;
    for (let i = start; i < end; i++) {
      const v = Math.max(-1, Math.min(1, channelData[i] * ampScale));
      if (v < min) min = v;
      if (v > max) max = v;
    }
    ctx.beginPath();
    ctx.moveTo(x, (1 + min) * amp);
    ctx.lineTo(x, (1 + max) * amp);
    ctx.stroke();
  }
}
function renderFrequencyLabels({ labelsElement, maxFreq, sampleRateHz }) {
  labelsElement.innerHTML = "";
  const boundedMaxFreq = Math.min(maxFreq, sampleRateHz / 2);
  const frequencies = [
    boundedMaxFreq,
    boundedMaxFreq * 0.8,
    boundedMaxFreq * 0.6,
    boundedMaxFreq * 0.4,
    boundedMaxFreq * 0.2,
    1e3,
    0
  ];
  frequencies.forEach((freq) => {
    const span = document.createElement("span");
    span.textContent = freq >= 1e3 ? `${(freq / 1e3).toFixed(freq % 1e3 === 0 ? 0 : 1)}k` : `${Math.round(freq)}Hz`;
    labelsElement.appendChild(span);
  });
}

// src/player/PlayerState.js
async function decodeArrayBuffer(arrayBuffer) {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) throw new Error("AudioContext wird von diesem Browser nicht unterst\xFCtzt.");
  const ctx = new Ctor();
  try {
    return await ctx.decodeAudioData(arrayBuffer);
  } finally {
    ctx.close?.().catch(() => {
    });
  }
}
var PlayerState = class {
  constructor(container, WaveSurfer) {
    if (!container) throw new Error("PlayerState: container element required");
    if (!WaveSurfer) throw new Error("PlayerState: WaveSurfer reference required");
    this.container = container;
    this.d = this._queryDom(container);
    this.WaveSurfer = WaveSurfer;
    this.processor = createSpectrogramProcessor();
    this.colorizer = new GpuColorizer();
    this.audioBuffer = null;
    this.wavesurfer = null;
    this.spectrogramData = null;
    this.spectrogramFrames = 0;
    this.spectrogramMels = 0;
    this.spectrogramBaseCanvas = null;
    this.spectrogramGrayInfo = null;
    this._gpuReady = false;
    this.spectrogramAbsLogMin = 0;
    this.spectrogramAbsLogMax = 1;
    this.sampleRateHz = 32e3;
    this.amplitudePeakAbs = 1;
    this.currentColorScheme = this.d.colorSchemeSelect.value || "fire";
    this.volume = 0.8;
    this.muted = false;
    this.preMuteVolume = 0.8;
    this.pixelsPerSecond = DEFAULT_ZOOM_PPS;
    this.zoomRedrawTimeout = null;
    this.scrollSyncLock = false;
    this.windowStartNorm = 0;
    this.windowEndNorm = 1;
    this.followPlayback = true;
    this.loopPlayback = false;
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
    this.waveformDisplayHeight = DEFAULT_WAVEFORM_HEIGHT;
    this.spectrogramDisplayHeight = DEFAULT_SPECTROGRAM_DISPLAY_HEIGHT;
    this.viewResizeMode = null;
    this.viewResizeStartY = 0;
    this.viewResizeStartWaveformHeight = DEFAULT_WAVEFORM_HEIGHT;
    this.viewResizeStartSpectrogramHeight = DEFAULT_SPECTROGRAM_DISPLAY_HEIGHT;
    this._applyLocalViewHeights();
    this._updateAmplitudeLabels();
    this._setInitialPlayheadPositions();
    this._updateToggleButtons();
    this._cleanups = [];
    this._bindEvents();
  }
  // ═════════════════════════════════════════════════════════════════
  //  DOM Query (scoped to container)
  // ═════════════════════════════════════════════════════════════════
  _queryDom(root) {
    const q = (id) => root.querySelector(`#${id}`);
    return {
      openFileBtn: q("openFileBtn"),
      audioFile: q("audioFile"),
      playPauseBtn: q("playPauseBtn"),
      stopBtn: q("stopBtn"),
      jumpStartBtn: q("jumpStartBtn"),
      jumpEndBtn: q("jumpEndBtn"),
      backwardBtn: q("backwardBtn"),
      forwardBtn: q("forwardBtn"),
      followToggleBtn: q("followToggleBtn"),
      loopToggleBtn: q("loopToggleBtn"),
      fitViewBtn: q("fitViewBtn"),
      resetViewBtn: q("resetViewBtn"),
      currentTimeDisplay: q("currentTime"),
      totalTimeDisplay: q("totalTime"),
      playStateDisplay: q("playState"),
      viewRangeDisplay: q("viewRange"),
      spectrogramCanvas: q("spectrogramCanvas"),
      spectrogramContainer: q("spectrogramContainer"),
      waveformContainer: q("waveformContainer"),
      waveformWrapper: q("waveformWrapper"),
      waveformContent: q("waveformContent"),
      amplitudeLabels: q("amplitudeLabels"),
      amplitudeCanvas: q("amplitudeCanvas"),
      waveformTimelineCanvas: q("waveformTimelineCanvas"),
      waveformPlayhead: q("waveformPlayhead"),
      audioEngineHost: q("audioEngineHost"),
      playhead: q("playhead"),
      canvasWrapper: q("canvasWrapper"),
      viewSplitHandle: q("viewSplitHandle"),
      spectrogramResizeHandle: q("spectrogramResizeHandle"),
      overviewCanvas: q("overviewCanvas"),
      overviewContainer: q("overviewContainer"),
      overviewWindow: q("overviewWindow"),
      overviewHandleLeft: q("overviewHandleLeft"),
      overviewHandleRight: q("overviewHandleRight"),
      fileInfo: q("fileInfo"),
      sampleRateInfo: q("sampleRateInfo"),
      fftSizeSelect: q("fftSize"),
      zoomSlider: q("zoomSlider"),
      zoomValue: q("zoomValue"),
      maxFreqSelect: q("maxFreqSelect"),
      colorSchemeSelect: q("colorSchemeSelect"),
      freqLabels: q("freqLabels"),
      volumeToggleBtn: q("volumeToggleBtn"),
      volumeIcon: q("volumeIcon"),
      volumeWaves: q("volumeWaves"),
      volumeSlider: q("volumeSlider"),
      floorSlider: q("floorSlider"),
      ceilSlider: q("ceilSlider"),
      autoContrastBtn: q("autoContrastBtn"),
      autoFreqBtn: q("autoFreqBtn")
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
    this.d.fileInfo.classList.add("loading");
    this._setPlayState("Loading");
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
      this._setPlayState("Ready");
      this.d.fileInfo.classList.remove("loading");
      this._setupWaveSurfer(file);
      await this._generateSpectrogram();
      this._drawMainWaveform();
      this._drawOverviewWaveform();
      this._createFrequencyLabels();
      this._seekToTime(0, true);
    } catch (error) {
      console.error("Fehler beim Laden der Datei:", error);
      this._setPlayState("Error");
      this.d.fileInfo.classList.remove("loading");
      alert("Fehler beim Laden der Audio-Datei");
    }
  }
  // ═════════════════════════════════════════════════════════════════
  //  Load from URL (programmatic)
  // ═════════════════════════════════════════════════════════════════
  async loadUrl(url) {
    this.d.fileInfo.innerHTML = `<span class="statusbar-label">Loading\u2026</span>`;
    this.d.fileInfo.classList.add("loading");
    this._setPlayState("Loading");
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
        new URL(url, location.href).pathname.split("/").pop() || "audio"
      );
      this.d.fileInfo.innerHTML = `<span class="statusbar-label">${name}</span> <span>${formatTime(audioBuffer.duration)}</span>`;
      this.d.sampleRateInfo.textContent = `${audioBuffer.sampleRate} Hz`;
      this.d.totalTimeDisplay.textContent = formatTime(audioBuffer.duration);
      this.d.currentTimeDisplay.textContent = formatTime(0);
      this._setPixelsPerSecond(DEFAULT_ZOOM_PPS, false);
      this._setTransportEnabled(true);
      this._updateToggleButtons();
      this._setPlayState("Ready");
      this.d.fileInfo.classList.remove("loading");
      this._setupWaveSurfer(url);
      await this._generateSpectrogram();
      this._drawMainWaveform();
      this._drawOverviewWaveform();
      this._createFrequencyLabels();
      this._seekToTime(0, true);
    } catch (error) {
      console.error("Error loading audio URL:", error);
      this._setPlayState("Error");
      this.d.fileInfo.classList.remove("loading");
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
      waveColor: "#38bdf8",
      progressColor: "#0ea5e9",
      cursorColor: "#ef4444",
      normalize: true,
      minPxPerSec: this.pixelsPerSecond,
      autoScroll: false,
      autoCenter: false
    });
    if (typeof source === "string") {
      ws.load(source);
    } else {
      ws.loadBlob(source);
    }
    ws.on("ready", () => {
      ws.zoom(this.pixelsPerSecond);
      ws.setVolume(this.volume);
      this._seekToTime(0, true);
    });
    ws.on("timeupdate", (t) => {
      this._updateTimeReadout(t);
      this._updatePlayhead(t, true);
    });
    ws.on("play", () => {
      this.d.playPauseBtn.classList.add("playing");
      this._setPlayState(this.loopPlayback ? "Playing (Loop)" : "Playing");
    });
    ws.on("pause", () => {
      this.d.playPauseBtn.classList.remove("playing");
      if (this.audioBuffer) {
        const atEnd = ws.getCurrentTime() >= this.audioBuffer.duration - 0.01;
        this._setPlayState(atEnd ? "Stopped" : "Paused");
      } else {
        this._setPlayState("Paused");
      }
    });
    ws.on("finish", () => {
      if (this.loopPlayback) {
        this._seekToTime(0, this.followPlayback);
        ws.play();
        return;
      }
      this.d.playPauseBtn.classList.remove("playing");
      this._setPlayState("Stopped");
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
    this._setPlayState("Stopped");
    this.d.playPauseBtn.classList.remove("playing");
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
    const duration = Math.max(1e-3, this.audioBuffer.duration);
    const canvasWidth = this.d.spectrogramCanvas.width;
    const position = currentTime / duration * canvasWidth;
    this.d.playhead.style.transform = `translateX(${position}px)`;
    this.d.waveformPlayhead.style.transform = `translateX(${position}px)`;
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
    this._setPlayState("Rendering...");
    const result = await this.processor.compute(this.audioBuffer.getChannelData(0), {
      fftSize: parseInt(this.d.fftSizeSelect.value, 10),
      sampleRate: this.audioBuffer.sampleRate,
      frameRate: PERCH_FRAME_RATE,
      nMels: PERCH_N_MELS,
      pcenGain: PERCH_PCEN_GAIN,
      pcenBias: PERCH_PCEN_BIAS,
      pcenRoot: PERCH_PCEN_ROOT,
      pcenSmoothing: PERCH_PCEN_SMOOTHING
    });
    this.spectrogramData = result.data;
    this.spectrogramFrames = result.nFrames;
    this.spectrogramMels = result.nMels;
    this._updateSpectrogramStats();
    this._autoContrast();
    this._autoFrequency();
    this._buildSpectrogramGrayscale();
    this._buildSpectrogramBaseImage();
    this._drawSpectrogram();
    this._syncOverviewWindowToViewport();
    this._setPlayState("Ready");
  }
  _updateSpectrogramStats() {
    const stats = updateSpectrogramStats(this.spectrogramData);
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
    const floorPct = Math.max(0, Math.min(
      100,
      (stats.logMin - this.spectrogramAbsLogMin) / range * 100
    ));
    const ceilPct = Math.max(0, Math.min(
      100,
      (stats.logMax - this.spectrogramAbsLogMin) / range * 100
    ));
    this.d.floorSlider.value = Math.round(floorPct);
    this.d.ceilSlider.value = Math.round(ceilPct);
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
      this.sampleRateHz
    );
    const options = Array.from(this.d.maxFreqSelect.options);
    let best = options[options.length - 1];
    for (const opt of options) {
      if (parseFloat(opt.value) >= hzValue) {
        best = opt;
        break;
      }
    }
    this.d.maxFreqSelect.value = best.value;
    this._createFrequencyLabels();
    if (redraw) {
      this._buildSpectrogramGrayscale();
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
    waves.style.display = vol < 0.01 ? "none" : "";
    waves.setAttribute(
      "d",
      vol < 0.4 ? "M15 8.5a4 4 0 010 7" : "M15 8.5a4 4 0 010 7M18 5a9 9 0 010 14"
    );
    btn.classList.toggle("muted", vol < 0.01);
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
      spectrogramAbsLogMax: this.spectrogramAbsLogMax
    });
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
    const ceil01 = parseFloat(this.d.ceilSlider.value) / 100;
    if (this._gpuReady && this.spectrogramGrayInfo) {
      this.colorizer.uploadColorLut(this.currentColorScheme);
      this.colorizer.render(floor01, ceil01);
      this.spectrogramBaseCanvas = this.colorizer.canvas;
    } else {
      this.spectrogramBaseCanvas = colorizeSpectrogram(
        this.spectrogramGrayInfo,
        floor01,
        ceil01,
        this.currentColorScheme
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
      spectrogramFrames: this.spectrogramFrames
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
      amplitudePeakAbs: this.amplitudePeakAbs
    });
    this._syncOverviewWindowToViewport();
    this._updatePlayhead(this._getCurrentTime(), false);
  }
  _drawOverviewWaveform() {
    renderOverviewWaveform({
      audioBuffer: this.audioBuffer,
      overviewCanvas: this.d.overviewCanvas,
      overviewContainer: this.d.overviewContainer,
      amplitudePeakAbs: this.amplitudePeakAbs
    });
    this._syncOverviewWindowToViewport();
  }
  _createFrequencyLabels() {
    renderFrequencyLabels({
      labelsElement: this.d.freqLabels,
      maxFreq: parseFloat(this.d.maxFreqSelect.value),
      sampleRateHz: this.sampleRateHz
    });
  }
  _updateAmplitudeLabels() {
    const el = this.d.amplitudeLabels;
    if (!el) return;
    el.innerHTML = "";
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
      const span = document.createElement("span");
      span.textContent = value === 0 ? "0.000" : `${value > 0 ? "+" : ""}${fmt(value)}`;
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
    const aPixel = anchorPixel ?? vw / 2;
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
  _clientXToTime(clientX, source = "spectrogram") {
    const wrapper = source === "waveform" ? this.d.waveformWrapper : this.d.canvasWrapper;
    const rect = wrapper.getBoundingClientRect();
    const x = clientX - rect.left + wrapper.scrollLeft;
    const refWidth = source === "waveform" ? this.d.amplitudeCanvas.width : this.d.spectrogramCanvas.width;
    const dur = this.audioBuffer?.duration || 0;
    const t = x / Math.max(1, refWidth) * dur;
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
    this.d.viewRangeDisplay.textContent = `${formatSecondsShort(startTime)} \u2013 ${formatSecondsShort(endTime)}`;
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
    if (this.overviewMode === "move") {
      let s = this.overviewDragStart + deltaNorm;
      let e = this.overviewDragEnd + deltaNorm;
      const span = e - s;
      if (s < 0) {
        s = 0;
        e = span;
      }
      if (e > 1) {
        e = 1;
        s = 1 - span;
      }
      this.windowStartNorm = s;
      this.windowEndNorm = e;
    } else if (this.overviewMode === "left") {
      this.windowStartNorm = Math.max(0, Math.min(
        this.overviewDragStart + deltaNorm,
        this.windowEndNorm - MIN_WINDOW_NORM
      ));
    } else if (this.overviewMode === "right") {
      this.windowEndNorm = Math.min(1, Math.max(
        this.overviewDragEnd + deltaNorm,
        this.windowStartNorm + MIN_WINDOW_NORM
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
    if (this.suppressSeekClick) {
      this.suppressSeekClick = false;
      return;
    }
    if (!this.audioBuffer) return;
    this._seekToTime(this._clientXToTime(e.clientX, "spectrogram"), false);
  }
  _handleWaveformClick(e) {
    if (this.suppressSeekClick) {
      this.suppressSeekClick = false;
      return;
    }
    if (!this.audioBuffer) return;
    this._seekToTime(this._clientXToTime(e.clientX, "waveform"), false);
  }
  _startPlayheadDrag(event, source) {
    if (!this.audioBuffer) return;
    event.preventDefault();
    this.draggingPlayhead = true;
    this.draggingPlayheadSource = source;
    this._seekFromClientX(event.clientX, source);
  }
  _seekFromClientX(clientX, source = "spectrogram") {
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
    this.viewportPanStartScroll = source === "waveform" ? this.d.waveformWrapper.scrollLeft : this.d.canvasWrapper.scrollLeft;
    this.suppressSeekClick = false;
    document.body.style.cursor = "grabbing";
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
    const wrapper = source === "waveform" ? this.d.waveformWrapper : this.d.canvasWrapper;
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
    document.body.style.cursor = "row-resize";
  }
  _updateViewResize(clientY) {
    if (!this.viewResizeMode) return;
    const dy = clientY - this.viewResizeStartY;
    const savedScroll = this.d.canvasWrapper.scrollLeft;
    let redrawWav = false;
    if (this.viewResizeMode === "split") {
      const total = this.viewResizeStartWaveformHeight + this.viewResizeStartSpectrogramHeight;
      let nextWav = this.viewResizeStartWaveformHeight + dy;
      nextWav = Math.max(MIN_WAVEFORM_HEIGHT, Math.min(total - MIN_SPECTROGRAM_DISPLAY_HEIGHT, nextWav));
      this.waveformDisplayHeight = nextWav;
      this.spectrogramDisplayHeight = total - nextWav;
      redrawWav = true;
    } else {
      this.spectrogramDisplayHeight = Math.max(
        MIN_SPECTROGRAM_DISPLAY_HEIGHT,
        this.viewResizeStartSpectrogramHeight + dy
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
    document.body.style.cursor = "";
  }
  // ═════════════════════════════════════════════════════════════════
  //  UI State Helpers
  // ═════════════════════════════════════════════════════════════════
  _setPlayState(text) {
    this.d.playStateDisplay.textContent = text;
  }
  _setTransportEnabled(enabled) {
    [
      this.d.playPauseBtn,
      this.d.stopBtn,
      this.d.jumpStartBtn,
      this.d.jumpEndBtn,
      this.d.backwardBtn,
      this.d.forwardBtn,
      this.d.followToggleBtn,
      this.d.loopToggleBtn,
      this.d.fitViewBtn,
      this.d.resetViewBtn,
      this.d.autoContrastBtn,
      this.d.autoFreqBtn
    ].forEach((btn) => {
      btn.disabled = !enabled;
    });
  }
  _updateToggleButtons() {
    this.d.followToggleBtn.classList.toggle("active", this.followPlayback);
    this.d.loopToggleBtn.classList.toggle("active", this.loopPlayback);
    this.d.followToggleBtn.textContent = this.followPlayback ? "Follow" : "Free";
    this.d.loopToggleBtn.textContent = this.loopPlayback ? "Loop On" : "Loop";
  }
  _setInitialPlayheadPositions() {
    this.d.playhead.style.left = "0px";
    this.d.waveformPlayhead.style.left = "0px";
    this.d.playhead.style.transform = "translateX(0px)";
    this.d.waveformPlayhead.style.transform = "translateX(0px)";
  }
  // ═════════════════════════════════════════════════════════════════
  //  Keyboard
  // ═════════════════════════════════════════════════════════════════
  _handleKeyboardShortcuts(event) {
    if (!this.audioBuffer || isTypingContext(event.target)) return;
    switch (event.code) {
      case "Space":
        event.preventDefault();
        this._togglePlayPause();
        break;
      case "Home":
        event.preventDefault();
        this._seekToTime(0, true);
        break;
      case "End":
        event.preventDefault();
        this._seekToTime(this.audioBuffer.duration, true);
        break;
      case "KeyJ":
        event.preventDefault();
        this._seekByDelta(-SEEK_COARSE_SEC);
        break;
      case "KeyL":
        event.preventDefault();
        this._seekByDelta(SEEK_COARSE_SEC);
        break;
      case "ArrowLeft":
        event.preventDefault();
        this._seekByDelta(-SEEK_FINE_SEC);
        break;
      case "ArrowRight":
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
    on(this.d.openFileBtn, "click", () => this.d.audioFile.click());
    on(this.d.audioFile, "change", (e) => this._handleFileSelect(e));
    on(this.d.playPauseBtn, "click", () => this._togglePlayPause());
    on(this.d.stopBtn, "click", () => this._stopPlayback());
    on(this.d.jumpStartBtn, "click", () => this._seekToTime(0, true));
    on(this.d.jumpEndBtn, "click", () => this._seekToTime(this.audioBuffer?.duration ?? 0, true));
    on(this.d.backwardBtn, "click", () => this._seekByDelta(-SEEK_COARSE_SEC));
    on(this.d.forwardBtn, "click", () => this._seekByDelta(SEEK_COARSE_SEC));
    on(this.d.followToggleBtn, "click", () => {
      this.followPlayback = !this.followPlayback;
      this._updateToggleButtons();
    });
    on(this.d.loopToggleBtn, "click", () => {
      this.loopPlayback = !this.loopPlayback;
      this._updateToggleButtons();
    });
    on(this.d.fitViewBtn, "click", () => this._fitEntireTrackInView());
    on(this.d.resetViewBtn, "click", () => {
      this._setPixelsPerSecond(DEFAULT_ZOOM_PPS, true);
      this._setLinkedScrollLeft(0);
      this._syncOverviewWindowToViewport();
    });
    on(this.d.fftSizeSelect, "change", () => {
      if (this.audioBuffer) this._generateSpectrogram();
    });
    on(this.d.maxFreqSelect, "change", () => {
      if (this.audioBuffer && this.spectrogramData && this.spectrogramFrames > 0) {
        this._createFrequencyLabels();
        this._buildSpectrogramGrayscale();
        this._buildSpectrogramBaseImage();
        this._drawSpectrogram();
      }
    });
    on(this.d.colorSchemeSelect, "change", () => {
      this.currentColorScheme = this.d.colorSchemeSelect.value;
      if (this.audioBuffer && this.spectrogramData && this.spectrogramFrames > 0) {
        this._buildSpectrogramBaseImage();
        this._drawSpectrogram();
      }
    });
    on(this.d.zoomSlider, "input", (e) => {
      this._setPixelsPerSecond(parseFloat(e.target.value), false);
      this._requestSpectrogramRedraw();
    });
    on(this.d.zoomSlider, "change", () => {
      if (this.spectrogramData && this.spectrogramFrames > 0) this._drawSpectrogram();
    });
    on(this.d.volumeSlider, "input", (e) => {
      this.muted = false;
      this._setVolume(parseFloat(e.target.value) / 100);
    });
    on(this.d.volumeToggleBtn, "click", () => this._toggleMute());
    const rebuildDisplay = () => {
      if (!this.spectrogramData || this.spectrogramFrames <= 0) return;
      this._buildSpectrogramBaseImage();
      this._drawSpectrogram();
    };
    on(this.d.floorSlider, "input", rebuildDisplay);
    on(this.d.ceilSlider, "input", rebuildDisplay);
    on(this.d.autoContrastBtn, "click", () => this._autoContrast(true));
    on(this.d.autoFreqBtn, "click", () => this._autoFrequency(true));
    on(this.d.canvasWrapper, "click", (e) => this._handleCanvasClick(e));
    on(this.d.waveformWrapper, "click", (e) => this._handleWaveformClick(e));
    on(this.d.canvasWrapper, "scroll", () => {
      if (!this.scrollSyncLock) this._setLinkedScrollLeft(this.d.canvasWrapper.scrollLeft);
    });
    on(this.d.canvasWrapper, "wheel", (e) => this._handleWheel(e, "spectrogram"), { passive: false });
    on(this.d.waveformWrapper, "wheel", (e) => this._handleWheel(e, "waveform"), { passive: false });
    on(this.d.canvasWrapper, "pointerdown", (e) => this._startViewportPan(e, "spectrogram"));
    on(this.d.waveformWrapper, "pointerdown", (e) => this._startViewportPan(e, "waveform"));
    on(this.d.playhead, "pointerdown", (e) => this._startPlayheadDrag(e, "spectrogram"));
    on(this.d.waveformPlayhead, "pointerdown", (e) => this._startPlayheadDrag(e, "waveform"));
    on(this.d.viewSplitHandle, "pointerdown", (e) => {
      e.preventDefault();
      this._startViewResize("split", e.clientY);
    });
    on(this.d.spectrogramResizeHandle, "pointerdown", (e) => {
      e.preventDefault();
      this._startViewResize("spectrogram", e.clientY);
    });
    on(document, "pointermove", (e) => {
      if (this.viewResizeMode) {
        this._updateViewResize(e.clientY);
        return;
      }
      if (this.draggingViewport) this._updateViewportPan(e.clientX);
      if (this.draggingPlayhead) this._seekFromClientX(e.clientX, this.draggingPlayheadSource);
      if (this.overviewMode) this._updateOverviewDrag(e.clientX);
    });
    const releaseAll = () => {
      this._stopViewResize();
      if (this.draggingViewport) {
        this.draggingViewport = false;
        document.body.style.cursor = "";
      }
      this.draggingPlayhead = false;
      this.draggingPlayheadSource = null;
      this.overviewMode = null;
    };
    on(document, "pointerup", releaseAll);
    on(document, "pointercancel", releaseAll);
    on(document, "keydown", (e) => this._handleKeyboardShortcuts(e));
    on(this.d.overviewHandleLeft, "pointerdown", (e) => {
      e.preventDefault();
      this._startOverviewDrag("left", e.clientX);
    });
    on(this.d.overviewHandleRight, "pointerdown", (e) => {
      e.preventDefault();
      this._startOverviewDrag("right", e.clientX);
    });
    on(this.d.overviewWindow, "pointerdown", (e) => {
      if (e.target === this.d.overviewHandleLeft || e.target === this.d.overviewHandleRight) return;
      e.preventDefault();
      this._startOverviewDrag("move", e.clientX);
    });
    on(this.d.overviewCanvas, "click", (e) => {
      if (!this.audioBuffer) return;
      const rect = this.d.overviewCanvas.getBoundingClientRect();
      const xNorm = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this._seekToTime(xNorm * this.audioBuffer.duration, true);
    });
    on(window, "resize", () => {
      if (!this.audioBuffer) return;
      this._drawMainWaveform();
      this._drawOverviewWaveform();
      this._syncOverviewWindowToViewport();
    });
    on(window, "beforeunload", () => this.dispose());
  }
};

// src/player/BirdNETPlayer.js
var WAVESURFER_CDN = "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";
var BirdNETPlayer = class {
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
    if (!container) throw new Error("BirdNETPlayer: container element required");
    this.container = container;
    this.options = options;
    this._state = null;
    this.ready = this._init();
  }
  // ── Initialization ──────────────────────────────────────────────
  async _init() {
    this.container.innerHTML = createPlayerHTML(this.options);
    this.root = this.container.querySelector(".daw-shell");
    const WaveSurfer = this.options.WaveSurfer || window.WaveSurfer || (await import(
      /* @vite-ignore */
      WAVESURFER_CDN
    )).default;
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
  play() {
    this._state?.wavesurfer?.play();
  }
  pause() {
    this._state?.wavesurfer?.pause();
  }
  stop() {
    this._state?._stopPlayback();
  }
  togglePlayPause() {
    this._state?._togglePlayPause();
  }
  /** Tear down the player and free resources */
  destroy() {
    this._state?.dispose();
    this._state = null;
    this.container.innerHTML = "";
  }
};
export {
  BirdNETPlayer,
  DEFAULT_OPTIONS
};
