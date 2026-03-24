# VisionMate Backend

## Setup

1. Place this file in your project root (alongside `currency_model.h5`, `labels.npy`, `orb_reference/`, etc.)

2. Install dependencies:
```bash
pip install fastapi uvicorn python-multipart opencv-python numpy tensorflow
```

3. Run the server:
```bash
python server.py
```

4. The API will be available at `http://localhost:8000`

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check if API is running |
| POST | `/detect/currency` | Upload image → detect currency (ORB + CNN) |
| POST | `/detect/product` | Upload image → detect product (MobileNetV2) |

## File Structure

Make sure these files are in the same directory as `server.py`:
- `currency_model.h5` — trained currency model
- `labels.npy` — currency class labels
- `orb_reference/` — reference images for ORB matching
- `orb_currency.py` — ORB detection logic
