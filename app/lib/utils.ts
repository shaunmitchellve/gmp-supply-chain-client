'use client';

export const fetcher = (url: any) => fetch(url).then(r => r.json());

// Calculate the ETA
export function getArrivalTime(departTime: Date, duration: number | undefined):string {
    if (duration === undefined) {
        duration = 0;
    }

    const time = new Date(departTime.getTime() + (duration * 1000));
    let min = time.getMinutes().toString();
    min = (min.length === 1) ? "0" + min : min;
    let ampm = time.getHours() >= 12 ? "pm" : "am";

    return (time.getHours() % 12 || 12).toString() + ":" + min + " " + ampm;
}
