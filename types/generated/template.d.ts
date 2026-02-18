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
}
