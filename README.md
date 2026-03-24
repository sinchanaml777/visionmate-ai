# 👁️ VisionMate AI

VisionMate AI is a voice-controlled assistive system that helps visually impaired individuals identify currency notes and everyday objects using computer vision and artificial intelligence.

---

## 🎯 Problem Statement

Visually impaired individuals face difficulty in identifying currency and daily-use products independently. This creates dependency on others and can lead to errors or financial risks.

VisionMate AI solves this problem using voice commands, camera input, and AI-based detection to provide real-time audio feedback.

---

## 💡 Features

- 🎤 Voice-controlled assistant  
- 📷 Real-time camera integration  
- 💵 Currency recognition  
- 🛍️ Product detection  
- 🔊 Audio feedback using Text-to-Speech  
- 🔁 Auto retry for failed detection  
- 🧠 Smart guidance (move closer, hold steady, etc.)

---

## 🧠 How It Works

1. User starts voice assistant  
2. Gives command: **"scan currency"** or **"scan product"**  
3. Camera captures image  
4. Image is sent to backend API  
5. AI model processes the image  
6. Result is returned and spoken to user  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS

### Backend
- Python
- FastAPI
- Uvicorn

### AI / ML
- OpenCV
- ORB Feature Matching
- Deep Learning Model (`.h5`)
- NumPy

### Other
- Web Speech API (Speech Recognition)
- Text-to-Speech (TTS)

---

## 📂 Project Structure

```
VisionMate/
│
├── backend/
│   ├── api.py
│   ├── server.py
│   ├── detector.py
│   ├── orb_currency.py
│   ├── currency_model.h5
│   ├── labels.npy
│   └── ...
│
├── src/
│   ├── components/
│   │   ├── DetectionSection.tsx
│   │   ├── TryItSection.tsx
│   │   └── ...
│   └── ...
│
├── public/
├── package.json
├── README.md
```

---

## ▶️ How to Run the Project

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/visionmate-ai.git
cd visionmate-ai
```

---

### 🔹 2. Run Backend

```bash
cd backend
python server.py
```

Backend runs on: http://127.0.0.1:8000

---

### 🔹 3. Run Frontend

```bash
npm install
npm run dev
```

Frontend runs on: http://localhost:8080

---

## 🔗 API Endpoints

- POST /detect/currency  
- POST /detect/product  

---

## 📌 Applications

- Assistive technology for visually impaired users  
- Currency identification  
- Product recognition in daily life  
- AI + Computer Vision learning project  

---

## ✅ Advantages

- Hands-free operation  
- Real-time detection  
- Improves independence  
- User-friendly interface  
- Scalable system  

---

## 🔮 Future Enhancements

- 📱 Mobile app integration  
- 🌐 Offline mode  
- 🎯 Higher accuracy models  
- 🧭 Navigation assistance  

---

## ⚠️ Notes

- Ensure camera & microphone permissions are enabled  
- Works best in Chrome browser  

---

## 🙌 Acknowledgement

This project is built to promote inclusive technology and improve accessibility using AI.

---

## 📜 License

This project is for educational purposes.