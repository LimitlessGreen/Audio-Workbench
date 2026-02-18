const SAMPLE_BIRD = './samples/birdsong.wav';
const SAMPLE_TONE = './samples/tones-1k.wav';
const SAMPLE_SWEEP = './samples/sweep-200-8000.wav';

function makeBaseContainer(root, height = 520) {
    root.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.height = `${height}px`;
    wrap.style.border = '1px solid #d5ddea';
    wrap.style.borderRadius = '12px';
    wrap.style.background = '#ffffff';
    wrap.style.overflow = 'hidden';
    root.appendChild(wrap);
    return wrap;
}

async function createStoryPlayer(root, options = {}, audioUrl = null, afterReady = null) {
    if (!globalThis.BirdNETPlayerModule?.BirdNETPlayer) {
        throw new Error('BirdNETPlayerModule unavailable. Load dist/birdnet-player.iife.js first.');
    }

    const container = makeBaseContainer(root, options.height || 520);
    const player = new globalThis.BirdNETPlayerModule.BirdNETPlayer(container, options);
    await player.ready;
    if (audioUrl) await player.loadUrl(audioUrl);
    if (afterReady) await afterReady(player);
    return player;
}

export const stories = [
    {
        id: 'minimal',
        title: 'Minimal Player',
        description: 'Nur File-Open + Transport + Timeline.',
        async run(root) {
            return createStoryPlayer(root, {
                showZoom: false,
                showFFTControls: false,
                showDisplayGain: false,
                showViewToggles: false,
            });
        },
    },
    {
        id: 'full',
        title: 'Full DAW',
        description: 'Vollständiger Player mit allen Controls.',
        async run(root) {
            return createStoryPlayer(root, {}, SAMPLE_BIRD);
        },
    },
    {
        id: 'spectrogram-focus',
        title: 'Spectrogram Focus',
        description: 'Analysefokus mit Sweep-Sample.',
        async run(root) {
            return createStoryPlayer(root, {}, SAMPLE_SWEEP, async (player) => {
                player._state.d.maxFreqSelect.value = '16000';
                player._state._createFrequencyLabels();
                player._state._buildSpectrogramGrayscale();
                player._state._buildSpectrogramBaseImage();
                player._state._drawSpectrogram();
            });
        },
    },
    {
        id: 'waveform-focus',
        title: 'Waveform Focus',
        description: 'Waveform-only Look (spektrale Controls versteckt).',
        async run(root) {
            return createStoryPlayer(root, {
                showFFTControls: false,
                showDisplayGain: false,
            }, SAMPLE_BIRD);
        },
    },
    {
        id: 'compact',
        title: 'Compact Embed',
        description: 'Kompakte Einbettung für kleine Panels.',
        async run(root) {
            return createStoryPlayer(root, {
                showStatusbar: false,
                showViewToggles: false,
                height: 320,
            }, SAMPLE_TONE);
        },
    },
    {
        id: 'annotation-demo',
        title: 'Annotation Layer',
        description: 'Demo mit klickbaren BirdNET-artigen Regions.',
        async run(root) {
            return createStoryPlayer(root, {}, SAMPLE_BIRD, async (player) => {
                player.setAnnotations([
                    { start: 0.7, end: 2.1, species: 'Erithacus rubecula', confidence: 0.93, color: 'rgba(255,99,132,0.22)' },
                    { start: 3.0, end: 4.3, species: 'Parus major', confidence: 0.87, color: 'rgba(54,162,235,0.22)' },
                    { start: 5.2, end: 6.7, species: 'Turdus merula', confidence: 0.91, color: 'rgba(255,206,86,0.22)' },
                ]);
            });
        },
    },
    {
        id: 'event-monitor',
        title: 'Event Monitor',
        description: 'Zeigt Event-API in Aktion (timeupdate/zoom/selection).',
        async run(root) {
            root.innerHTML = '';
            const shell = document.createElement('div');
            shell.style.display = 'grid';
            shell.style.gridTemplateColumns = '1fr 320px';
            shell.style.gap = '12px';
            root.appendChild(shell);

            const playerHost = document.createElement('div');
            const log = document.createElement('pre');
            log.style.margin = '0';
            log.style.padding = '10px';
            log.style.borderRadius = '12px';
            log.style.border = '1px solid #d5ddea';
            log.style.background = '#0b1020';
            log.style.color = '#cfe7ff';
            log.style.font = '12px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace';
            log.style.height = '520px';
            log.style.overflow = 'auto';
            shell.appendChild(playerHost);
            shell.appendChild(log);

            const player = await createStoryPlayer(playerHost, {}, SAMPLE_BIRD);
            const write = (line) => {
                log.textContent = `${new Date().toLocaleTimeString()}  ${line}\n` + log.textContent;
            };

            const unsubs = [
                player.on('ready', (e) => write(`ready ${JSON.stringify(e.detail)}`)),
                player.on('selection', (e) => write(`selection ${e.detail.start.toFixed(2)}-${e.detail.end.toFixed(2)}s`)),
                player.on('zoomchange', (e) => write(`zoom ${Math.round(e.detail.pixelsPerSecond)} px/s`)),
                player.on('cachehit', () => write('cachehit')),
                player.on('cachemiss', () => write('cachemiss')),
                player.on('cachewrite', () => write('cachewrite')),
            ];

            const origDestroy = player.destroy.bind(player);
            player.destroy = () => {
                for (const unsub of unsubs) unsub();
                origDestroy();
            };
            return player;
        },
    },
    {
        id: 'cache-demo',
        title: 'Cache Demo',
        description: 'Lädt Datei, damit IndexedDB-Cache sichtbar wird.',
        async run(root) {
            return createStoryPlayer(root, {}, SAMPLE_SWEEP);
        },
    },
    {
        id: 'touch-disabled',
        title: 'Touch Disabled',
        description: 'Gesten deaktiviert (Regression-Test).',
        async run(root) {
            return createStoryPlayer(root, {
                enableTouchGestures: false,
            }, SAMPLE_BIRD);
        },
    },
    {
        id: 'progressive-optin',
        title: 'Progressive Opt-In',
        description: 'Progressive Spektrogramm-Pipeline explizit aktiviert.',
        async run(root) {
            return createStoryPlayer(root, {
                enableProgressiveSpectrogram: true,
            }, SAMPLE_SWEEP);
        },
    },
];
