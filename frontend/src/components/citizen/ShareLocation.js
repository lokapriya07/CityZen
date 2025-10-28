import React, { useState, useEffect } from "react";

export function ShareLocation({ complaint, onClose, onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy: position.coords.accuracy
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to retrieve your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = "An unknown error occurred while getting location.";
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleShareLocation = async () => {
    if (!location) {
      alert("Please get your location first");
      return;
    }

    setIsSharing(true);
    
    try {
      // Call the onSubmit prop if provided
      if (onSubmit) {
        await onSubmit(location);
      }
      
      // Show success message
      alert("Location shared successfully with the worker!");
      onClose();
    } catch (error) {
      console.error("Error sharing location:", error);
      alert("Failed to share location. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || "Address not available";
    } catch (error) {
      console.error("Error getting address:", error);
      return "Address not available";
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-lg">📍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Share Location</h3>
                <p className="text-xs text-gray-600">Complaint ID: {complaint.id}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Location Status */}
          <div className="text-center">
            {isLoading ? (
              <div className="py-8">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Getting your current location...</p>
                <p className="text-sm text-gray-500 mt-2">Please allow location access</p>
              </div>
            ) : error ? (
              <div className="py-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-2xl">❌</span>
                </div>
                <p className="text-red-600 font-medium mb-2">Location Error</p>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <button
                  onClick={getCurrentLocation}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  Try Again
                </button>
              </div>
            ) : location ? (
              <div className="py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">✅</span>
                </div>
                <p className="text-green-600 font-medium mb-2">Location Found!</p>
                
                {/* Location Details */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Latitude:</span>
                    <span className="text-sm font-mono">{location.lat.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Longitude:</span>
                    <span className="text-sm font-mono">{location.lng.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Accuracy:</span>
                    <span className="text-sm font-mono">±{Math.round(location.accuracy)} meters</span>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="mt-4 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
                    <span>🗺️</span>
                    <span className="text-sm font-medium">Map Preview</span>
                  </div>
                  <div className="h-32 bg-blue-100 rounded flex items-center justify-center">
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=16/${location.lat}/${location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm underline"
                    >
                      View on OpenStreetMap
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Complaint Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sharing with Worker</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Worker:</span> {complaint.worker?.name || "Not assigned"}</p>
              <p><span className="font-medium">Complaint:</span> {complaint.type}</p>
              <p><span className="font-medium">Your Location:</span> {complaint.location?.address || "Unknown"}</p>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600 text-sm">🔒</span>
              <div>
                <p className="text-xs font-medium text-yellow-800">Privacy Notice</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Your location will only be shared with the assigned worker and will be used solely for service purposes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              disabled={isSharing}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleShareLocation}
              disabled={isSharing || !location || isLoading}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isSharing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sharing...
                </>
              ) : (
                "Share Location"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}