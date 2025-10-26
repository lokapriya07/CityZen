import React, { useState, useEffect, useRef } from 'react';
import './UploadImage.css';
import { useNavigate } from 'react-router-dom';


// SVG Icons (code unchanged)
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.91 2.75 6 3.704 6 4.884v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008v-.008z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;

export function ReportForm({ onSubmit, isSubmitting }) {
    const navigate = useNavigate();
    const initialFormData = {
        fullName: '', email: '', phone: '', altPhone: '', address: '', city: '',
        pincode: '', state: '', gpsLocation: false, gpsCoordinates: '',
        wasteType: '', wasteAmount: '', description: '', urgency: '', photos: null,
        previousReports: '', preferredContact: '', updates: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [progress, setProgress] = useState(0);
    const [fileLabel, setFileLabel] = useState('Click to select a photo or drag and drop');
    const [fileLabelStyle, setFileLabelStyle] = useState({});
    const [classificationResult, setClassificationResult] = useState("");
    const [locationStatus, setLocationStatus] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const formRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // 'description' is removed from the list of required fields for progress calculation
        const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'pincode', 'state', 'wasteType'];
        const filledCount = requiredFields.filter(field => formData[field] && formData[field].toString().trim() !== '').length;
        const newProgress = (filledCount / requiredFields.length) * 100;
        setProgress(newProgress);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleGpsToggle = (e) => {
        const isChecked = e.target.checked;
        setFormData(prev => ({ ...prev, gpsLocation: isChecked }));

        if (isChecked) {
            if (!navigator.geolocation) {
                setLocationStatus("Geolocation is not supported by your browser.");
                setFormData(prev => ({ ...prev, gpsLocation: false }));
                return;
            }

            setLocationStatus("Fetching your location...");
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocationStatus("✅ Location captured. Fetching address...");
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        if (data && data.address) {
                            const addr = data.address;
                            setFormData(prev => ({
                                ...prev,
                                address: `${addr.road || ''}${addr.road && addr.suburb ? ', ' : ''}${addr.suburb || ''}`.trim(),
                                city: addr.city || addr.town || addr.village || '',
                                pincode: addr.postcode || '',
                                state: addr.state || '',
                                gpsCoordinates: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
                            }));
                            setLocationStatus('✅ Address automatically filled!');
                        } else {
                            throw new Error("Address not found.");
                        }
                    } catch (error) {
                        console.error("Reverse geocoding error:", error);
                        setLocationStatus("❌ Could not fetch address. Please enter it manually.");
                        setFormData(prev => ({ ...prev, gpsCoordinates: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
                    }
                },
                (error) => {
                    let errorMessage = "Could not get your location. ";
                    switch (error.code) {
                        case error.PERMISSION_DENIED: errorMessage += "You denied the request for Geolocation."; break;
                        case error.POSITION_UNAVAILABLE: errorMessage += "Location information is unavailable."; break;
                        case error.TIMEOUT: errorMessage += "The request to get user location timed out."; break;
                        default: errorMessage += "An unknown error occurred."; break;
                    }
                    setLocationStatus(`❌ Error: ${errorMessage}`);
                    setFormData(prev => ({ ...prev, gpsLocation: false }));
                }
            );
        } else {
            setFormData(prev => ({ ...prev, gpsCoordinates: '' }));
            setLocationStatus('');
        }
    };
    
    const resetFileInput = (message) => {
        if (fileInputRef.current) { fileInputRef.current.value = ""; }
        setFormData(prev => ({ ...prev, photos: null }));
        setFileLabel('Click to select a photo or drag and drop');
        setFileLabelStyle({});
        setClassificationResult(message || "");
        setImagePreview('');
    };
    
    const handleFileChangeAndValidation = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            resetFileInput('');
            return;
        }

        const fileToValidate = files[0];
        const previewUrl = URL.createObjectURL(fileToValidate);

        const uploadFormData = new FormData();
        uploadFormData.append("file", fileToValidate);

        setClassificationResult("Classifying, please wait...");
        setFileLabel(`Validating ${fileToValidate.name}...`);
        setImagePreview('');

        try {
            const token = localStorage.getItem("token"); // JWT token from login
            const response = await fetch("http://localhost:8000/upload-image", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // <--- Add token here
                },
                body: uploadFormData,
            });

            if (response.status === 401 || response.status === 403) {
                resetFileInput("❌ Submission Failed: Authentication required. Please log in.");
                return;
            }

            const res = await response.json();
            const resultMessage = res.message || "";

            if (resultMessage.toLowerCase().includes("please select a valid image")) {
                resetFileInput("❌ Invalid image. Please upload a photo of garbage.");
                return;
            }

            setClassificationResult(resultMessage);
            setFormData(prev => ({ ...prev, photos: fileToValidate }));
            setFileLabel(`📷 ${fileToValidate.name} selected`);
            setFileLabelStyle({ borderColor: 'var(--success-color)', background: '#e8f5e9', color: 'var(--success-color)' });
            setImagePreview(previewUrl);

        } catch (err) {
            console.error(err);
            resetFileInput("❌ Error: Could not classify image. Please try again.");
        }
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.photos) {
            alert("Please upload and validate a photo of the waste spot before submitting.");
            return;
        }
        if (!formData.urgency) {
            alert("Please select an urgency level for the report.");
            return;
        }

        try {
            const token = localStorage.getItem("token"); // JWT token
            const response = await fetch("http://localhost:8001/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // <--- Add token here
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 401 || response.status === 403) {
                alert("❌ Submission Failed: Authentication required. Please log in.");
                return;
            }

            const result = await response.json();
            alert(result.message || "✅ Report submitted successfully!");
            setFormData(initialFormData);
            setProgress(0);
            resetFileInput();
            navigate("/citizen");

              
        } catch (err) {
            console.error(err);
            alert("❌ Error submitting report. Please try again.");
        }
    };


    const indianStates = [ "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi" ];

    return (
        <div className="container">
            <div className="header">
                <h1>Report Waste Spot</h1>
                <p>Help us keep our community clean by reporting improper waste disposal</p>
            </div>
            <div className="form-container">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <form id="complaintForm" onSubmit={handleSubmit} ref={formRef}>
                    <div className="section" style={{ animationDelay: '0s' }}>
                        <h2><span className="section-icon"><UserIcon /></span>Personal Information</h2>
                        <div className="form-grid">
                            <div className="form-group"><label htmlFor="fullName" className="required">Full Name</label><input type="text" id="fullName" name="fullName" onChange={handleChange} value={formData.fullName} required /></div>
                            <div className="form-group"><label htmlFor="email" className="required">Email Address</label><input type="email" id="email" name="email" onChange={handleChange} value={formData.email} required /></div>
                            <div className="form-group"><label htmlFor="phone" className="required">Phone Number</label><input type="tel" id="phone" name="phone" onChange={handleChange} value={formData.phone} required /></div>
                            <div className="form-group"><label htmlFor="altPhone">Alternative Phone (Optional)</label><input type="tel" id="altPhone" name="altPhone" onChange={handleChange} value={formData.altPhone} /></div>
                        </div>
                    </div>
                    <div className="section" style={{ animationDelay: '0.1s' }}>
                        <h2><span className="section-icon"><LocationIcon /></span>Waste Spot Location</h2>
                        <div className="form-grid">
                            <div className="form-group full-width"><label htmlFor="address" className="required">Street Address/Landmark</label><input type="text" id="address" name="address" onChange={handleChange} value={formData.address} required /><div className="help-text">Provide the most specific address or nearest landmark</div></div>
                            <div className="form-group"><label htmlFor="city" className="required">City</label><input type="text" id="city" name="city" onChange={handleChange} value={formData.city} required /></div>
                            <div className="form-group"><label htmlFor="pincode" className="required">PIN Code</label><input type="text" id="pincode" name="pincode" pattern="[0-9]{6}" onChange={handleChange} value={formData.pincode} required /></div>
                            <div className="form-group"><label htmlFor="state" className="required">State</label><select id="state" name="state" onChange={handleChange} value={formData.state} required><option value="">Select State</option>{indianStates.map(state => <option key={state} value={state}>{state}</option>)}</select></div>
                            <div className="form-group full-width">
                                <div className="checkbox-group gps-group">
                                    <input type="checkbox" id="gpsLocation" name="gpsLocation" checked={formData.gpsLocation} onChange={handleGpsToggle} />
                                    <label htmlFor="gpsLocation">Automatically fill address using GPS!</label>
                                </div>
                                {locationStatus && <div className="help-text gps-status">{locationStatus}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="section" style={{ animationDelay: '0.2s' }}>
                        <h2><span className="section-icon"><TrashIcon /></span>Waste Spot Details</h2>
                        <div className="form-grid">
                            <div className="form-group"><label htmlFor="wasteType" className="required">Type of Waste</label><select id="wasteType" name="wasteType" value={formData.wasteType} onChange={handleChange} required><option value="">Select Waste Type</option><option value="household">Household Waste</option><option value="construction">Construction Debris</option><option value="electronic">Electronic Waste</option><option value="medical">Medical Waste</option><option value="plastic">Plastic Waste</option><option value="organic">Organic/Food Waste</option><option value="chemical">Chemical/Hazardous Waste</option><option value="mixed">Mixed Waste</option><option value="other">Other</option></select></div>
                            <div className="form-group"><label htmlFor="wasteAmount" className="required">Estimated Amount</label><select id="wasteAmount" name="wasteAmount" value={formData.wasteAmount} onChange={handleChange} required><option value="">Select Amount</option><option value="small">Small (Few bags/items)</option><option value="medium">Medium (Cart load)</option><option value="large">Large (Truck load)</option><option value="massive">Massive (Multiple trucks)</option></select></div>
                            
                            {/* The 'required' attribute and class have been removed from the description */}
                            <div className="form-group full-width">
                                <label htmlFor="description">Detailed Description (Optional)</label>
                                <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe the waste spot..."></textarea>
                            </div>

                        </div>
                    </div>
                    <div className="section" style={{ animationDelay: '0.3s' }}>
                        <h2><span className="section-icon"><AlertIcon /></span>Urgency Level</h2>
                        <div className="urgency-levels">
                            <div className="urgency-option"><input type="radio" id="low" name="urgency" value="low" className="urgency-radio" onChange={handleChange} checked={formData.urgency === 'low'} /><label htmlFor="low" className="urgency-label low"><strong>Low</strong><small>Can wait a week</small></label></div>
                            <div className="urgency-option"><input type="radio" id="medium" name="urgency" value="medium" className="urgency-radio" onChange={handleChange} checked={formData.urgency === 'medium'} /><label htmlFor="medium" className="urgency-label medium"><strong>Medium</strong><small>Within few days</small></label></div>
                            <div className="urgency-option"><input type="radio" id="high" name="urgency" value="high" className="urgency-radio" onChange={handleChange} checked={formData.urgency === 'high'} /><label htmlFor="high" className="urgency-label high"><strong>High</strong><small>Immediate attention</small></label></div>
                        </div>
                    </div>
                    <div className="section" style={{ animationDelay: '0.4s' }}>
                        <h2><span className="section-icon"><CameraIcon /></span>Photo Evidence & Classification</h2>
                        <div className="form-group">
                            <label htmlFor="photos" className="required">Upload Photo (Must be a valid garbage image)</label>
                            {imagePreview && (
                                <div className="image-preview-container">
                                    <img src={imagePreview} alt="Waste spot preview" className="image-preview" />
                                </div>
                            )}
                            <div className="file-upload">
                                <input type="file" id="photos" name="photos" className="file-input" accept="image/*" onChange={handleFileChangeAndValidation} ref={fileInputRef} />
                                <label htmlFor="photos" className="file-label" style={fileLabelStyle}><UploadIcon /><span>{fileLabel}</span></label>
                            </div>
                            <div className="help-text">The image will be validated before it is accepted.</div>
                            {classificationResult && (<div style={{ marginTop: '15px', padding: '10px', borderRadius: '12px', background: 'var(--background-color)', border: '1px solid var(--border-color)' }}><p style={{ fontWeight: '500', color: 'var(--text-color)', margin: 0, textAlign: 'center' }}>Result: <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{classificationResult}</span></p></div>)}
                        </div>
                    </div>
                    <div className="section" style={{ animationDelay: '0.5s' }}>
                        <h2><span className="section-icon"><InfoIcon /></span>Additional Information</h2>
                        <div className="form-grid">
                            <div className="form-group"><label htmlFor="preferredContact">Preferred Contact Method</label><select id="preferredContact" name="preferredContact" value={formData.preferredContact} onChange={handleChange}><option value="">Select Method</option><option value="phone">Phone Call</option><option value="email">Email</option><option value="sms">SMS</option><option value="any">Any method</option></select></div>
                            <div className="form-group"><label htmlFor="previousReports">Have you reported this before?</label><select id="previousReports" name="previousReports" value={formData.previousReports} onChange={handleChange}><option value="">Select</option><option value="no">No, first time</option><option value="yes">Yes, reported before</option></select></div>
                        </div>
                        <div className="checkbox-group"><input type="checkbox" id="updates" name="updates" checked={formData.updates} onChange={handleChange} /><label htmlFor="updates">I would like to receive updates on the action taken</label></div>
                    </div>
                    <div className="submit-section">
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                        <div className="help-text" style={{ marginTop: '15px' }}>
                            By submitting this form, you agree to our terms and conditions.
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default ReportForm;