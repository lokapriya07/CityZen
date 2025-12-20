# from fastapi import FastAPI, File, UploadFile
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# import google.generativeai as genai
# import os
# from dotenv import load_dotenv
# from PIL import Image
# from PIL.ExifTags import TAGS
# from datetime import datetime, timedelta
# from io import BytesIO
# import json
# from json.decoder import JSONDecodeError

# # -------------------- ENV + CONFIG --------------------
# load_dotenv()

# api_key = os.getenv("GEMINI_API_KEY")
# if not api_key:
#     raise ValueError("❌ GEMINI_API_KEY not found in .env file or environment.")

# genai.configure(api_key=api_key)

# app = FastAPI()

# # Enable CORS for frontend communication
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # -------------------- EXIF CHECK UTILITY --------------------
# def check_exif_data(image_bytes: bytes):
#     """Checks for camera/date EXIF data in the uploaded image."""
#     try:
#         image = Image.open(BytesIO(image_bytes))
#         exif_data = image.getexif()

#         if not exif_data:
#             return {"valid": False, "reason": "No camera metadata (EXIF data) found. The image may not be an original photo."}

#         # Convert EXIF tag IDs to names
#         exif_tags = {TAGS.get(k, k): v for k, v in exif_data.items()}

#         # Check for important tags
#         critical_keys = ["Make", "Model", "DateTimeOriginal"]
#         if not any(key in exif_tags for key in critical_keys):
#             return {"valid": False, "reason": "Missing essential camera metadata (Make/Model/Date)."}

#         # Check if photo was taken recently (within 1 day)
#         if "DateTimeOriginal" in exif_tags:
#             try:
#                 photo_datetime_str = exif_tags.get("DateTimeOriginal", exif_tags.get("DateTime"))
#                 date_part, time_part = photo_datetime_str.split(" ")
#                 photo_datetime = datetime.strptime(f"{date_part.replace(':', '-')} {time_part}", "%Y-%m-%d %H:%M:%S")

#                 if datetime.now() - photo_datetime > timedelta(days=1):
#                     return {"valid": False, "reason": f"Photo too old ({photo_datetime.date()}). Please upload a photo taken now."}

#             except Exception as e:
#                 print(f"Warning parsing EXIF date: {e}")
#                 pass

#         return {"valid": True, "reason": "✅ EXIF metadata confirmed."}

#     except Exception as e:
#         print(f"EXIF error: {e}")
#         return {"valid": False, "reason": "Failed to read image metadata. The image may be corrupt or modified."}


# # -------------------- ROUTE: IMAGE UPLOAD --------------------
# @app.post("/upload-image")
# async def upload_image(file: UploadFile = File(...)):
#     if not file.content_type.startswith("image/"):
#         return JSONResponse(
#             content={"status": "rejected", "message": "Invalid file type. Please upload an image."},
#             status_code=400,
#         )

#     # Read uploaded image
#     image_bytes = await file.read()

#     # STEP 1 — Validate EXIF metadata
#     exif_result = check_exif_data(image_bytes)
#     if not exif_result["valid"]:
#         return JSONResponse(content={"status": "rejected", "message": exif_result["reason"]})

#     # STEP 2 — Classify with Gemini
#     model = genai.GenerativeModel(
#         model_name="gemini-1.5-flash",  # Compatible stable version
#         system_instruction=(
#             "You are an AI waste classification expert. Analyze the image to determine if it clearly displays "
#             "mismanaged garbage, random litter, or general household trash/waste that should be reported. "
#             "Do NOT classify clearly individual, intact items (e.g., a single, undamaged electronics or bottle) "
#             "as 'valid waste' unless they are part of a larger pile, clearly dumped in an inappropriate location, or are messy litter. "
#             "Your response must be a single JSON object."
#         ),
#         generation_config={
#             "response_mime_type": "application/json",
#             "response_schema": {
#                 "type": "object",
#                 "properties": {
#                     "is_valid_waste": {
#                         "type": "boolean",
#                         "description": "True if the image clearly shows mismanaged garbage, litter, or non-specific general waste, and False otherwise."
#                     },
#                     "waste_type": {
#                         "type": "string",
#                         "description": "Brief classification, e.g., 'household litter', 'illegal dumping', 'recyclable item (not waste)'."
#                     }
#                 },
#                 "required": ["is_valid_waste", "waste_type"]
#             }
#         }
#     )

#     prompt = "Analyze this image and determine if it represents reportable mismanaged waste or litter. Return output as JSON."

#     try:
#         response = model.generate_content(
#             [
#                 {"mime_type": file.content_type, "data": image_bytes},
#                 prompt
#             ]
#         )

#         if not response.text or response.text.strip() == "":
#             raise ValueError("Gemini API returned an empty response.")

#         classification_data = json.loads(response.text)
#         is_valid_waste = classification_data.get("is_valid_waste", False)
#         waste_type = classification_data.get("waste_type", "Unclassified")

#     except JSONDecodeError as e:
#         print(f"❌ JSON parsing error: {e}")
#         print(f"Raw Gemini output:\n{response.text}\n---")
#         return JSONResponse(
#             content={"status": "rejected", "message": "AI returned unparseable data. Check logs for details."},
#             status_code=500,
#         )

#     except Exception as e:
#         print(f"❌ Gemini classification error: {e}")
#         return JSONResponse(
#             content={"status": "rejected", "message": "Internal error during AI classification."},
#             status_code=500,
#         )

#     # STEP 3 — Final Decision
#     if is_valid_waste:
#         return JSONResponse(
#             content={
#                 "status": "accepted",
#                 "message": f"✅ Image accepted. Classified as mismanaged waste: {waste_type}."
#             }
#         )
#     else:
#         return JSONResponse(
#             content={
#                 "status": "rejected",
#                 "message": f"❌ Image rejected. Classified as '{waste_type}', not reportable waste. Please upload a photo showing actual litter or garbage."
#             }
#         )


# # -------------------- MAIN ENTRY --------------------
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)



from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from json.decoder import JSONDecodeError

# Load environment variables
load_dotenv()

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file or environment.")

genai.configure(api_key=api_key)

# Create FastAPI app
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Accepts any image and checks if it shows garbage/waste using Gemini."""
    if not file.content_type.startswith("image/"):
        return JSONResponse(
            content={"status": "rejected", "message": "Invalid file type. Please upload an image."},
            status_code=400,
        )

    image_bytes = await file.read()
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Define system behavior — only classify garbage/waste
    system_instruction = (
        "You are an AI waste classification expert. "
        "Analyze the image and decide if it clearly shows garbage, trash, litter, or mismanaged waste. "
        "Respond ONLY in JSON. Do not include explanations or text outside JSON."
    )

    response_schema = {
        "type": "OBJECT",
        "properties": {
            "is_garbage": {
                "type": "BOOLEAN",
                "description": "True if the image clearly shows garbage or waste."
            },
            "garbage_type": {
                "type": "STRING",
                "description": "Briefly describe the type of waste (e.g., household litter, dumping, roadside waste)."
            }
        },
        "required": ["is_garbage", "garbage_type"]
    }

    prompt = "Determine if this image clearly contains garbage or waste. Respond strictly in JSON."

    try:
        response = model.generate_content(
            contents=[
                {"mime_type": file.content_type, "data": image_bytes},
                prompt
            ],
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=response_schema
        )

        if not response.text or response.text.strip() == "":
            raise ValueError("Empty response from Gemini API.")

        data = json.loads(response.text)
        is_garbage = data.get("is_garbage", False)
        garbage_type = data.get("garbage_type", "Unclassified")

    except JSONDecodeError as e:
        print("JSON parsing error:", e)
        print("Raw Gemini output:", getattr(response, "text", "No text"))
        return JSONResponse(
            content={"status": "error", "message": "Invalid AI response format."},
            status_code=500,
        )
    except Exception as e:
        print("Error:", e)
        return JSONResponse(
            content={"status": "error", "message": "AI processing error."},
            status_code=500,
        )

    if is_garbage:
        return JSONResponse(
            content={"status": "accepted", "message": f"Image accepted — contains garbage: {garbage_type}."},
            status_code=200,
        )
    else:
        return JSONResponse(
            content={"status": "rejected", "message": f"Image rejected — does not show garbage (classified as: {garbage_type})."},
            status_code=200,
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)




























# from fastapi import FastAPI, File, UploadFile
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# import google.generativeai as genai
# import os
# from dotenv import load_dotenv
# import json
# from json.decoder import JSONDecodeError

# # Load environment variables
# load_dotenv()

# # Configure Gemini API
# api_key = os.getenv("GEMINI_API_KEY")
# if not api_key:
#     raise ValueError("GEMINI_API_KEY not found in .env file or environment.")

# genai.configure(api_key=api_key)

# # Create FastAPI app
# app = FastAPI()

# # Enable CORS for frontend communication
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/upload-image")
# async def upload_image(file: UploadFile = File(...)):
#     """Accepts any image and checks if it shows garbage/waste using Gemini."""
#     if not file.content_type.startswith("image/"):
#         return JSONResponse(
#             content={"status": "rejected", "message": "Invalid file type. Please upload an image."},
#             status_code=400,
#         )

#     image_bytes = await file.read()
#     model = genai.GenerativeModel("gemini-2.5-flash")

#     # Define system behavior — only classify garbage/waste
#     system_instruction = (
#         "You are an AI waste classification expert. "
#         "Analyze the image and decide if it clearly shows garbage, trash, litter, or mismanaged waste. "
#         "Respond ONLY in JSON. Do not include explanations or text outside JSON."
#     )

#     response_schema = {
#         "type": "OBJECT",
#         "properties": {
#             "is_garbage": {
#                 "type": "BOOLEAN",
#                 "description": "True if the image clearly shows garbage or waste."
#             },
#             "garbage_type": {
#                 "type": "STRING",
#                 "description": "Briefly describe the type of waste (e.g., household litter, dumping, roadside waste)."
#             }
#         },
#         "required": ["is_garbage", "garbage_type"]
#     }

#     prompt = "Determine if this image clearly contains garbage or waste. Respond strictly in JSON."

#     try:
#         response = model.generate_content(
#             contents=[
#                 {"mime_type": file.content_type, "data": image_bytes},
#                 prompt
#             ],
#             system_instruction=system_instruction,
#             response_mime_type="application/json",
#             response_schema=response_schema
#         )

#         if not response.text or response.text.strip() == "":
#             raise ValueError("Empty response from Gemini API.")

#         data = json.loads(response.text)
#         is_garbage = data.get("is_garbage", False)
#         garbage_type = data.get("garbage_type", "Unclassified")

#     except JSONDecodeError as e:
#         print("JSON parsing error:", e)
#         print("Raw Gemini output:", getattr(response, "text", "No text"))
#         return JSONResponse(
#             content={"status": "error", "message": "Invalid AI response format."},
#             status_code=500,
#         )
#     except Exception as e:
#         print("Error:", e)
#         return JSONResponse(
#             content={"status": "error", "message": "AI processing error."},
#             status_code=500,
#         )

#     if is_garbage:
#         return JSONResponse(
#             content={"status": "accepted", "message": f"Image accepted — contains garbage: {garbage_type}."},
#             status_code=200,
#         )
#     else:
#         return JSONResponse(
#             content={"status": "rejected", "message": f"Image rejected — does not show garbage (classified as: {garbage_type})."},
#             status_code=200,
#         )


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)