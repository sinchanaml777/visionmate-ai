import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import (
    MobileNetV2,
    preprocess_input,
    decode_predictions,
)

# ORB detector
from orb_currency import detect_currency_orb

# ---------------- LOAD MODELS ---------------- #

print("🔄 Loading models...")

currency_model = load_model("currency_model.h5")
product_model = MobileNetV2(weights="imagenet")

currency_labels = np.load("labels.npy")
print("✅ Loaded currency labels:", currency_labels)

CONFIDENCE_THRESHOLD = 0.60   # safer threshold


# ---------------- CAMERA FUNCTION ---------------- #

def capture_image():
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ Camera not accessible")
        return None

    print("📷 Camera started")

    while True:
        ret, frame = cap.read()

        if not ret:
            print("❌ Failed to grab frame")
            break

        cv2.putText(
            frame,
            "Press C to Capture | Q to Quit",
            (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2,
        )

        cv2.imshow("Vision Mate Camera", frame)

        key = cv2.waitKey(1) & 0xFF

        if key == ord("c"):
            image = frame.copy()
            print("✅ Image captured")
            break

        elif key == ord("q"):
            image = None
            print("❌ Capture cancelled")
            break

    cap.release()
    cv2.destroyAllWindows()
    print("📷 Camera closed")

    return image


# ---------------- PRODUCT DETECTION ---------------- #

def detect_product(image):
    try:
        if image is None:
            return "No image received"

        print("\n🧠 Running product detection...")

        # Resize
        img = cv2.resize(image, (224, 224))

        # Convert to array
        img = np.expand_dims(img, axis=0)

        # Preprocess for MobileNet
        img = preprocess_input(img)

        # Predict
        preds = product_model.predict(img)

        # Get TOP 3 predictions ⭐
        decoded = decode_predictions(preds, top=3)[0]

        best_label = decoded[0][1]
        confidence = decoded[0][2]

        print("🔍 Top predictions:")
        for label in decoded:
            print(f"   {label[1]} → {round(label[2]*100, 2)}%")

        print(f"✅ Best Match: {best_label}")
        print(f"📊 Confidence: {round(confidence*100, 2)}%")

        # ⭐ Confidence filter
        if confidence < 0.50:
            return "Unable to detect product clearly"

        return f"{best_label} ({round(confidence*100, 1)}% confidence)"

    except Exception as e:
        print("❌ Product detection error:", e)
        return "Product detection failed"

# ---------------- CNN CURRENCY (Fallback) ---------------- #

def detect_currency_cnn(image):

    img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    h, w, _ = img.shape

    # ⭐ Better center crop
    crop = img[int(h * 0.15): int(h * 0.85),
               int(w * 0.15): int(w * 0.85)]

    img = cv2.resize(crop, (224, 224))
    img = np.expand_dims(img, axis=0)
    img = img / 255.0

    prediction = currency_model.predict(img)[0]

    class_index = np.argmax(prediction)
    confidence = prediction[class_index]
    predicted_label = currency_labels[class_index]

    print("💰 CNN Raw:", prediction)
    print("💰 CNN Predicted:", predicted_label)
    print("💰 CNN Confidence:", confidence)

    if confidence < CONFIDENCE_THRESHOLD:
        return None

    return f"{predicted_label} rupees"


# ---------------- FINAL CURRENCY DETECTION ---------------- #

def detect_currency(image):
    try:
        if image is None:
            return "No image received"

        print("\n🔍 Running ORB detection...")
        orb_result = detect_currency_orb(image)

        # ⭐ If ORB confident → use it
        if "rupees" in orb_result:
            print("✅ ORB Result:", orb_result)
            return orb_result

        print("⚠ ORB uncertain. Falling back to CNN...")

        cnn_result = detect_currency_cnn(image)

        if cnn_result:
            print("✅ CNN Result:", cnn_result)
            return cnn_result

        return "Unable to detect currency clearly"

    except Exception as e:
        print("❌ Currency detection error:", e)
        return "Currency detection failed"