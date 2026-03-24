from ultralytics import YOLO

# Load YOLO model
model = YOLO("yolov8n.pt")


def detect_product_yolo(image):
    results = model(image)

    for r in results:
        if r.boxes is None or len(r.boxes) == 0:
            return {
                "result": "No object detected",
                "predictions": [],
                "confidence": 0.0,
            }

        cls_id = int(r.boxes.cls[0])
        confidence = float(r.boxes.conf[0])

        label = model.names[cls_id]

        return {
            "result": label,
            "predictions": [
                {
                    "label": label,
                    "confidence": round(confidence * 100, 1),
                }
            ],
            "confidence": round(confidence * 100, 1),
        }