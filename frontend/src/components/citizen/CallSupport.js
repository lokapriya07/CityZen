import React, { useState } from "react";

export function CallSupport({ complaint, onClose, onCall }) {
  const [isCalling, setIsCalling] = useState(false);
  const [selectedContact, setSelectedContact] = useState("");

  const contactOptions = [
    {
      type: "worker",
      name: complaint.worker?.name || "Assigned Worker",
      number: complaint.worker?.contact,
      role: "👷 Direct Worker",
      description: "Contact the worker assigned to your complaint",
      available: !!complaint.worker?.contact
    },
    {
      type: "support",
      name: "Customer Support",
      number: "+1-800-123-4567",
      role: "📞 Support Center",
      description: "24/7 customer service helpline",
      available: true
    },
    {
      type: "emergency",
      name: "Emergency Hotline",
      number: "+1-800-911-HELP",
      role: "🚨 Emergency",
      description: "For urgent safety concerns only",
      available: true
    },
    {
      type: "supervisor",
      name: "Area Supervisor",
      number: "+1-800-555-0123",
      role: "👨‍💼 Supervisor",
      description: "Contact area supervisor for escalations",
      available: true
    }
  ];

  const handleCall = async (contact) => {
    if (!contact.number) {
      alert(`Phone number not available for ${contact.name}`);
      return;
    }

    setIsCalling(true);
    setSelectedContact(contact.type);

    // Call the onCall prop if provided
    if (onCall) {
      await onCall(contact);
    }

    // Simulate call initiation
    setTimeout(() => {
      // Actually initiate the phone call
      window.location.href = `tel:${contact.number}`;
      setIsCalling(false);
      onClose();
    }, 1000);
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "Not available";
    
    // Basic phone number formatting
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phoneNumber;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-green-50 to-emerald-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-lg">📞</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Call Support</h3>
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
          {/* Complaint Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Complaint Details</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Type:</span> {complaint.type}</p>
              <p><span className="font-medium">Status:</span> {complaint.status}</p>
              <p><span className="font-medium">Worker:</span> {complaint.worker?.name || "Not assigned"}</p>
              <p><span className="font-medium">Location:</span> {complaint.location?.address || "Unknown"}</p>
            </div>
          </div>

          {/* Contact Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Who would you like to call?</h4>
            
            {contactOptions.map((contact) => (
              <div
                key={contact.type}
                className={`border rounded-lg p-3 transition-all ${
                  contact.available
                    ? "border-gray-200 hover:border-green-300 hover:bg-green-50 cursor-pointer"
                    : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                }`}
                onClick={() => contact.available && handleCall(contact)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">{contact.role}</span>
                      {!contact.available && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Unavailable</span>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{contact.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{contact.description}</p>
                    <p className={`text-sm font-mono mt-2 ${
                      contact.available ? "text-green-600" : "text-gray-400"
                    }`}>
                      {formatPhoneNumber(contact.number)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-1">
                    {isCalling && selectedContact === contact.type ? (
                      <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <button
                        disabled={!contact.available}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                          contact.available
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        📞
                      </button>
                    )}
                    {contact.available && (
                      <span className="text-xs text-gray-500">Call</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600 text-sm">💡</span>
              <div>
                <p className="text-xs font-medium text-yellow-800">Call Tips</p>
                <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                  <li>• Have your complaint ID ready: <strong>{complaint.id}</strong></li>
                  <li>• Describe your issue clearly and concisely</li>
                  <li>• Note down any reference numbers provided</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <span className="text-gray-600 text-sm">🕒</span>
              <div>
                <p className="text-xs font-medium text-gray-800">Operating Hours</p>
                <div className="text-xs text-gray-700 mt-1 space-y-1">
                  <p><strong>Support Center:</strong> 24/7</p>
                  <p><strong>Worker Contact:</strong> 7 AM - 7 PM</p>
                  <p><strong>Emergency Line:</strong> 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              disabled={isCalling}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => handleCall(contactOptions[1])} // Default to support
              disabled={isCalling}
              className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isCalling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Calling...
                </>
              ) : (
                "Call Support"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}