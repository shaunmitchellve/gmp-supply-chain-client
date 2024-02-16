'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { getFireStore} from '@/app/lib/firebase-admin';
import { Timestamp  } from 'firebase-admin/firestore';
import { ReturnTrips } from '@/app/lib/definitions';

export async function fetchDrivers() {
    noStore(); // Add noStore() to prevent caching of the data
    const db = await getFireStore();
    let drivers: Array<string> = [];

    try {
        const doc = await db.collection('trips').get();

        doc.docs.map(doc => {
            drivers.push(doc.data().email);
        });
        
       return [...new Set(drivers)];
    } catch (err) {
        console.log("Datastore error: ", err);
        throw new Error('Failed to fetch Drivers from Datastore');
    }
}

export async function fetchTrips(driver: string, date: string): Promise<string> {
    noStore();
    const db = await getFireStore();

    let returnValue: Array<object> = [];
    let returnTrips: ReturnTrips = {
        id: '',
        uid: '',
        email: '',
        startLocation: {
            lat: 0,
            lng: 0
        },
        destination: {
            lat: 0,
            lng: 0
        },
        insertTimeStamp: null,
        route: []
    };

    const start = Timestamp.fromDate(new Date(Date.parse(date + " 00:00:00 GMT")));
    const end = Timestamp.fromDate(new Date(Date.parse(date + " 23:59:59 GMT")));

    try {
        const trips = db.collection('trips');

        let query = trips
        .where('insertTimeStamp', '>', start)
        .where('insertTimeStamp', '<', end);

        if (driver !== ""){
            query =trips.where('email', '==', driver)
        }
        
        const qs = await query.get();

        if (!qs.empty) {
            for (let trip of qs.docs) {
                returnTrips.id = trip.id;
                returnTrips.uid = trip.data().uid;
                returnTrips.email = trip.data().email;
                returnTrips.startLocation = trip.data().startLocation;
                returnTrips.destination = trip.data().destination;
                returnTrips.insertTimeStamp = trip.data().insertTimeStamp.toDate();
                returnTrips.route = [];
                let legs = await trips.doc(trip.id).collection('route').orderBy('timestamp').get();
                for (let leg of legs.docs) {
                    returnTrips.route.push({
                        lat: leg.data().lat,
                        lng: leg.data().lng,
                        timestamp: leg.data().timestamp.toDate(),
                    });
                }
                returnValue.push(returnTrips);
            }
            return JSON.stringify(returnValue);
        } else {
            return '{}';
        }
    } catch (err) {
        console.log("Database error: ",err);
        throw new Error('Failed to fetch Trips from Datastore');
    }
}
