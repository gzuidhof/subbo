const VTT_TIMING_REGEX = /\.\d\d\d --> \d\d:/;

export type VTTTimings = [string, string][];
export interface ShortenedVTTWithTimings {
    text: string,
    timings: VTTTimings
}

export function shortenVTTForTranslation(text: string): ShortenedVTTWithTimings {
    const lines = text.replace(/\r?\n/g, "\r\n").split("\r\n");

    let timings: [string, string][] = [];
    for(let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.match(VTT_TIMING_REGEX)) {
            const t = l.split(" --> ");
            timings.push([t[0], t[1]]);
            lines[i] = "-_>"
        }
    }

    return {
        text: lines.join("\n"),
        timings: timings,
    }
}


export function restoreShortenedVTTAfterTranslation(text: string, timings: VTTTimings): string {
    const lines = text.replace(/\r?\n/g, "\r\n").split("\r\n");
    let timingIdx = 0;

    for(let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l === "-_>") {
            const timing =  timings[timingIdx];
            lines[i] = `${timing[0]} --> ${timing[1]}`;
            timingIdx++;
        }
    }
    return lines.join("\n");
}
