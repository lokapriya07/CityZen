from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from dotenv import load_dotenv
from PIL import Image
from PIL.ExifTags import TAGS
from datetime import datetime, timedelta
from io import BytesIO

# Load environment variables
load_dotenv()

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=api_key)

# Create FastAPI app
app = FastAPI()

# Enable CORS (important for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- EXIF CHECK UTILITY ---
def check_exif_data(image_bytes: bytes):
    """Checks for the presence of camera/date EXIF data in an image."""
    try:
        image = Image.open(BytesIO(image_bytes))
        exif_data = image.getexif()
        
        if not exif_data:
            return {"valid": False, "reason": "No camera metadata (EXIF data) found. Photo might be downloaded or modified."}

        # Map tag IDs to names
        exif_tags = {TAGS.get(k, k): v for k, v in exif_data.items()}

        # Check for critical tags
        camera_info_keys = ['Make', 'Model', 'DateTimeOriginal']
        if not any(key in exif_tags for key in camera_info_keys):
            return {"valid": False, "reason": "Missing critical camera tags (Make/Model/Date). Photo may not be a recent, direct capture."}

        # Check if the photo is 'recent' (optional but highly recommended for waste reports)
        if 'DateTimeOriginal' in exif_tags:
            try:
                # Standard format 'YYYY:MM:DD HH:MM:SS'
                photo_datetime_str = exif_tags.get('DateTimeOriginal', exif_tags.get('DateTime'))
                # Replace colons in the date part for strict ISO format parsing 
                date_part, time_part = photo_datetime_str.split(' ')
                photo_datetime = datetime.strptime(f"{date_part.replace(':', '-')} {time_part}", '%Y-%m-%d %H:%M:%S')
                
                # Check if photo is too old (e.g., older than 7 days)
                if datetime.now() - photo_datetime > timedelta(days=7):
                     return {"valid": False, "reason": f"Photo is too old ({photo_datetime.date()}). Please upload a photo taken within the last 7 days."}

            except (ValueError, AttributeError):
                print(f"Warning: Could not fully parse EXIF DateTime tag: {photo_datetime_str}")
                pass 

        return {"valid": True, "reason": "EXIF metadata confirmed."}

    except Exception as e:
        print(f"Error reading EXIF data: {e}")
        return {"valid": False, "reason": "Failed to read image metadata. Photo might be corrupt or an invalid source."}
# ----------------------------------


@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        return JSONResponse(content={"status": "rejected", "message": "Invalid file type. Please upload an image."}, status_code=400)

    # Read uploaded image bytes
    image_bytes = await file.read()
    
    # --- STEP 1: EXIF Metadata Check (Camera Source Check) ---
    exif_result = check_exif_data(image_bytes)
    
    if not exif_result["valid"]:
        # Respond with the reason for rejection
        return JSONResponse(content={"status": "rejected", "message": exif_result['reason']})


    # --- STEP 2: Gemini Classification (Waste Content Check) ---
    model = genai.GenerativeModel("gemini-2.5-flash")
    # Must seek back to the beginning or reload bytes if the stream was consumed by check_exif_data
    # Since we read the whole bytes at the start, we can pass it directly.
    response = model.generate_content([
        {"mime_type": file.content_type, "data": image_bytes},
        "Classify this image: Does it contain visible waste, garbage, or trash? Answer only 'yes' or 'no'."
    ])

    answer = response.text.strip().lower()

    if "yes" in answer:
        # Both checks passed
        return JSONResponse(content={"status": "accepted", "message": "Image accepted: Valid photo and classified as waste."})
    else:
        # EXIF passed, but Gemini failed
        return JSONResponse(content={"status": "rejected", "message": "Image Content Failed: Please upload a photo of actual waste/garbage."})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)