import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function OpenStreetMap({ lat, lng, locationName }) {
  // Use a default position if lat/lng is invalid (e.g., 0, 0)
  const position = lat && lng ? [lat, lng] : [17.3850, 78.4867]; // Default to Hyderabad

  return (
    <MapContainer 
      center={position} 
      zoom={15} 
      style={{ width: "100%", height: "100%", borderRadius: '8px' }} // Added border-radius
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Only show a marker if the position is valid */}
      {lat && lng && (
        <Marker position={position}>
          <Popup>{locationName || "Task Location"}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default OpenStreetMap;