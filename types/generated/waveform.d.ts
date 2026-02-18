export function renderMainWaveform({ audioBuffer, amplitudeCanvas, waveformTimelineCanvas, waveformContent, pixelsPerSecond, waveformHeight, amplitudePeakAbs, }: {
    audioBuffer: any;
    amplitudeCanvas: any;
    waveformTimelineCanvas: any;
    waveformContent: any;
    pixelsPerSecond: any;
    waveformHeight?: number;
    amplitudePeakAbs: any;
}): void;
export function renderOverviewWaveform({ audioBuffer, overviewCanvas, overviewContainer, amplitudePeakAbs, }: {
    audioBuffer: any;
    overviewCanvas: any;
    overviewContainer: any;
    amplitudePeakAbs: any;
}): void;
export function renderFrequencyLabels({ labelsElement, maxFreq, sampleRateHz }: {
    labelsElement: any;
    maxFreq: any;
    sampleRateHz: any;
}): void;
