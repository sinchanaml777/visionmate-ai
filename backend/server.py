import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from orb_currency import detect_currency_orb
from yolo_detector import detect_product_yolo
from tensorflow.keras.models import load_model

# ---- Load Models ----
print("🔄 Loading models...")
currency_model = load_model("currency_model.h5")
currency_labels = np.load("labels.npy")
print("✅ Models loaded")

CONFIDENCE_THRESHOLD = 0.60

app = FastAPI(title="VisionMate API", version="1.0.0")

# ✅ FIXED CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Read Image ----
def read_image(file_bytes: bytes) -> np.ndarray:
    nparr = np.frombuffer(file_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return image


# ===============================
# Currency Detection
# ===============================

def detect_currency_cnn(image):
    img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    h, w, _ = img.shape
    crop = img[int(h * 0.15):int(h * 0.85), int(w * 0.15):int(w * 0.85)]

    img = cv2.resize(crop, (224, 224))
    img = np.expand_dims(img, axis=0) / 255.0

    prediction = currency_model.predict(img)[0]
    class_index = int(np.argmax(prediction))
    confidence = float(prediction[class_index])

    if confidence < CONFIDENCE_THRESHOLD:
        return None, 0.0

    predicted_label = str(currency_labels[class_index])
    return f"{predicted_label} rupees", confidence


def detect_currency(image):
    orb_result = detect_currency_orb(image)

    if isinstance(orb_result, str) and "rupees" in orb_result:
        return {
            "result": orb_result,
            "method": "ORB",
            "confidence": None,
        }

    cnn_result, confidence = detect_currency_cnn(image)

    if cnn_result:
        return {
            "result": cnn_result,
            "method": "CNN",
            "confidence": round(confidence * 100, 1),
        }

    return {
        "result": "Unable to detect currency clearly",
        "method": None,
        "confidence": None,
    }


# ===============================
# Product Detection (YOLO)
# ===============================

def detect_product(image):
    return detect_product_yolo(image)


# ===============================
# API ROUTES
# ===============================

@app.get("/health")
async def health():
    return {"status": "ok", "message": "VisionMate API is running"}


@app.post("/detect/currency")
async def api_detect_currency(file: UploadFile = File(...)):
    contents = await file.read()
    image = read_image(contents)

    if image is None:
        return {"error": "Invalid image"}

    return detect_currency(image)


@app.post("/detect/product")
async def api_detect_product(file: UploadFile = File(...)):
    contents = await file.read()
    image = read_image(contents)

    if image is None:
        return {"error": "Invalid image"}

    return detect_product(image)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)