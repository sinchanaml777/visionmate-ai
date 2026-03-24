import cv2
import numpy as np
from tensorflow.keras.models import load_model

# Load trained model + labels
model = load_model("currency_model.h5")
labels = np.load("labels.npy")

print("✅ Labels:", labels)

# Load test image
img = cv2.imread("test.jpg")

if img is None:
    print("❌ test.jpg not found")
    exit()

img = cv2.resize(img, (224, 224))
img = np.expand_dims(img, axis=0)
img = img / 255.0

prediction = model.predict(img)[0]

class_index = np.argmax(prediction)
confidence = prediction[class_index]

print("💰 Raw prediction:", prediction)
print("💰 Predicted:", labels[class_index])
print("💰 Confidence:", confidence)

if confidence < 0.75:
    print("⚠ Unable to detect clearly")
else:
    print(f"✅ Detected currency: {labels[class_index]} rupees")