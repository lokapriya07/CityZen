from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from dotenv import load_dotenv

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
    allow_origins=["*"],   # For production, replace "*" with ["http://localhost:3000"] or your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    # Read uploaded image
    image_bytes = await file.read()

    # Use Gemini model for classification
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content([
        {"mime_type": file.content_type, "data": image_bytes},
        "Classify this image: Does it contain visible waste, garbage, or trash? Answer only 'yes' or 'no'."
    ])

    answer = response.text.strip().lower()

    if "yes" in answer:
        return JSONResponse(content={"status": "accepted", "message": "Waste image accepted."})
    else:
        return JSONResponse(content={"status": "rejected", "message": "Please select a valid image."})
