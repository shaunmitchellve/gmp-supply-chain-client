'use client';

import { auth } from "@/auth";

export const fetcher = (url: any, args?: any) => fetch(url, args).then(r => r.json());

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

export function saveLocation(
        location: google.maps.LatLngLiteral,
        destination: google.maps.LatLngLiteral,
        startLocation: google.maps.LatLngLiteral,
        tripId: string,
        placeId: string
    ) {
    auth().then(session => {
        const tripData = {
            uid: session?.user?.id,
            email: session?.user?.email,
            location: {
                lat: location.lat,
                lng: location.lng,
            },
            startLocation: startLocation,
            destination: destination,
            tripid: tripId,
            placeId: placeId,
        }

        const post = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tripData),
        };

        fetcher('/driving/api', post);
    });
}

export function currentDate(): string {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');
    const currentDay = `${currentDate.getDate()}`.padStart(2, '0');

    return `${currentDate.getFullYear()}-${currentMonth}-${currentDay}`;
}