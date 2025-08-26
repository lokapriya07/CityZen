# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import google.generativeai as genai
import io

# Configure Gemini API
genai.configure(api_key="AIzaSyBKKrzis8p7lRPIeIRHPGeHPSBQM0sAV6U")

app = FastAPI()

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    # Check file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    # Read the uploaded image
    image_bytes = await file.read()

    # Send to Gemini
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
