/**
 * @param {Partial<typeof DEFAULT_OPTIONS>} opts
 */
export function createPlayerHTML(opts?: Partial<typeof DEFAULT_OPTIONS>): string;
export namespace DEFAULT_OPTIONS {
    let showFileOpen: boolean;
    let showTransport: boolean;
    let showTime: boolean;
    let showVolume: boolean;
    let showViewToggles: boolean;
    let showZoom: boolean;
    let showFFTControls: boolean;
    let showDisplayGain: boolean;
    let showStatusbar: boolean;
    let showOverview: boolean;
    let viewMode: string;
    let transportStyle: string;
    let transportOverlay: boolean;
    let showWaveformTimeline: boolean;
    let followGuardLeftRatio: number;
    let followGuardRightRatio: number;
    let followTargetRatio: number;
    let followCatchupDurationMs: number;
    let followCatchupSeekDurationMs: number;
    let smoothLerp: number;
    let smoothSeekLerp: number;
    let smoothMinStepRatio: number;
    let smoothSeekMinStepRatio: number;
    let smoothSeekFocusMs: number;
}
