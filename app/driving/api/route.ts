import { NextResponse } from 'next/server';
import { initializeAdminApp } from '@/app/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: Request) {
    const admin = await initializeAdminApp();
    const fs = await import('firebase-admin/firestore');
    const db = fs.getFirestore(admin);

    const data = await request.json();

    const leg = {
        timestamp: Timestamp.fromDate(new Date()),
        lat: data.location.lat,
        lng: data.location.lng,
    };

    const trip = {
        uid: data.uid,
        email: data.email,
        startLocation: data.startLocation,
        destination: data.destination,
        destPlaceId: data.placeId,
        insertTimeStamp: Timestamp.fromDate(new Date()),
    };
    
    const res = await db.collection('trips').doc(data.tripid).set(trip, {merge: true});

    const routeRes = await db.collection('trips').doc(data.tripid).collection('route')
    .doc(uuidv4()).set(leg);

    return NextResponse.json({ status: 200});
}