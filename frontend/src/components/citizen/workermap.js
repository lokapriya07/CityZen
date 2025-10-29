import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon issues with bundlers
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

// --- Custom Icons (using emoji) ---
const workerIcon = L.divIcon({
    html: '👷', // Worker emoji
    className: 'text-3xl bg-transparent border-0',
    iconSize: [30, 42],
    iconAnchor: [15, 42],  // Point of the pin
    popupAnchor: [0, -42] // Popup above the pin
});

const userIcon = L.divIcon({
    html: '📍', // Location pin emoji
    className: 'text-3xl bg-transparent border-0',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
});

export function WorkerLocationMap({ workerLocation, complaintLocation }) {
    // Ensure we have valid data before rendering
    if (
        !workerLocation?.latitude ||
        !workerLocation?.longitude ||
        !complaintLocation?.coordinates?.lat ||
        !complaintLocation?.coordinates?.lng
    ) {
        return <div className="text-center text-gray-500 p-4">Map data unavailable.</div>;
    }

    // Leaflet expects [latitude, longitude]
    const workerPos = [workerLocation.latitude, workerLocation.longitude];
    const userPos = [complaintLocation.coordinates.lat, complaintLocation.coordinates.lng];

    // This 'bounds' prop will make the map automatically zoom
    // and center to fit both the user and the worker.
    const bounds = [workerPos, userPos];

    return (
        <MapContainer
            bounds={bounds}
            style={{ height: '250px', width: '100%', borderRadius: '8px' }}
            className="z-0" // Ensures it stays behind modals
            scrollWheelZoom={false} // Better UX for a scrollable page
            boundsOptions={{ padding: [50, 50] }} // Add padding around markers
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Worker Marker */}
            <Marker position={workerPos} icon={workerIcon}>
                <Popup>Worker's current location</Popup>
            </Marker>

            {/* User/Complaint Marker */}
            <Marker position={userPos} icon={userIcon}>
                <Popup>Your report location</Popup>
            </Marker>
        </MapContainer>
    );
}