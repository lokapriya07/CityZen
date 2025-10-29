// utils/distance.js

const { Client } = require("@googlemaps/google-maps-services-js");

// Load API Key from environment variables
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: GOOGLE_MAPS_API_KEY is not set. Road distance calculation will return null.");
}

// Initialize Google Maps Client
const client = new Client({});

/**
 * Calculates the actual road travel distance in kilometers between two addresses 
 * using the Google Distance Matrix API.
 * * @param {string} origin - The starting point (address string or lat/lng coordinates).
 * @param {string} destination - The ending point (address string or lat/lng coordinates).
 * @returns {Promise<number|null>} Distance in kilometers, or null on API failure/bad address.
 */
async function calculateRoadDistanceKm(origin, destination) {
    if (!apiKey || !origin || !destination) {
        return null;
    }

    try {
        const response = await client.distancematrix({
            params: {
                origins: [origin],
                destinations: [destination],
                mode: "driving",
                units: "metric", // Returns distance in kilometers and meters
                key: apiKey,
            },
            timeout: 2000,
        });

        const element = response.data.rows[0].elements[0];

        if (element.status === 'OK') {
            // Distance is returned in meters. Convert to km.
            const distanceInMeters = element.distance.value;
            const distanceInKm = distanceInMeters / 1000;
            return distanceInKm;
        }

        console.warn(`Distance Matrix Status: ${element.status} for ${origin} to ${destination}`);
        return null;

    } catch (e) {
        console.error("Google Maps Distance Matrix API Error:", e.message);
        return null;
    }
}

module.exports = {
    calculateRoadDistanceKm,
};