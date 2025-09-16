import React, { useState } from "react";
import { MapPin, Camera, Upload, CheckCircle } from "lucide-react";

export default function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      issueType,
      priority,
      location,
      description,
      name,
      phone,
      files,
    };
    console.log("Submitting data:", formData);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    alert("Report Submitted Successfully! Complaint ID: WC003");
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        setLocation(coords);
      },
      (err) => {
        alert("Location Error: " + err.message);
      }
    );
  };

  if (isSubmitted) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#d1fae5",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircle size={32} color="#10b981" />
          </div>
          <h2>Report Submitted!</h2>
          <p>Your complaint has been successfully submitted with ID: <b>WC003</b></p>
          <button onClick={() => setIsSubmitted(false)}>Submit Another Report</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Issue Type */}
        <div>
          <label>Issue Type</label>
          <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
            <option value="">Select the type of issue</option>
            <option value="overflowing">Overflowing Bin</option>
            <option value="illegal-dumping">Illegal Dumping</option>
            <option value="missed-collection">Missed Collection</option>
            <option value="damaged-bin">Damaged Bin</option>
            <option value="hazardous-waste">Hazardous Waste</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label>Location</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter address or landmark"
              required
              style={{ flex: 1 }}
            />
            <button type="button" onClick={handleGetLocation}>
              <MapPin size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Provide details about the issue..."
            required
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label>Photo Evidence</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          {files.length > 0 && <p>{files.length} file(s) selected</p>}
        </div>

        {/* Contact Info */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1 }}>
            <label>Your Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label>Priority Level</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
            <option value="">Select priority level</option>
            <option value="low">Low - Can wait a few days</option>
            <option value="medium">Medium - Should be addressed soon</option>
            <option value="high">High - Needs immediate attention</option>
            <option value="urgent">Urgent - Health/safety hazard</option>
          </select>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
