import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { detectCurrency, detectProduct, checkHealth } from "@/lib/api";
import type { CurrencyResult, ProductResult } from "@/lib/api";

type Mode = "currency" | "product";

const TryItSection = () => {
  const [mode, setMode] = useState<Mode>("currency");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | Blob | null>(null);
  const [result, setResult] = useState<CurrencyResult | ProductResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 🔊 Speak helper
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  };

  // ✅ Backend check (FIXED)
  useEffect(() => {
    const check = async () => {
      const status = await checkHealth();
      setBackendOnline(status);
    };

    check();
    const interval = setInterval(check, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Cleanup camera
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    stopCamera();
  };

  // 🎥 Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      speak("Camera started. Hold the object steady");

      // Auto capture after 5 sec
      setTimeout(() => {
        speak("Capturing image");
        captureFromCamera();
      }, 5000);

    } catch {
      setError("Camera access denied");
      speak("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // 📸 Capture
  const captureFromCamera = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (video.readyState !== 4) {
      setError("Camera not ready");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setImageFile(blob);
        setImagePreview(canvas.toDataURL("image/jpeg"));
        stopCamera();
        speak("Image captured");
      }
    }, "image/jpeg");
  };

  // 🔍 Detect
  const handleDetect = async () => {
    if (!imageFile) return;

    if (!backendOnline) {
      setError("Backend is not connected");
      speak("Backend is not connected");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res =
        mode === "currency"
          ? await detectCurrency(imageFile)
          : await detectProduct(imageFile);

      setResult(res);

      if (res.result) {
        const text =
          mode === "currency"
            ? `This is ${res.result}`
            : `This looks like ${res.result}`;
        speak(text);
      }
    } catch {
      setError("Detection failed");
      speak("Detection failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  // 🎤 Voice command
  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();

      if (command.includes("currency")) {
        setMode("currency");
        speak("Currency mode selected");
      }
      if (command.includes("product")) {
        setMode("product");
        speak("Product mode selected");
      }
    };

    recognition.start();
  }, []);

  const reset = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    stopCamera();
  };

  return (
    <section className="py-24">
      <div className="text-center">

        <h2 className="text-3xl font-bold mb-4">Try It Live</h2>

        {/* ✅ Backend Status */}
        <p className={backendOnline ? "text-green-500" : "text-red-500"}>
          {backendOnline ? "Backend Connected" : "Backend Offline"}
        </p>

        <div className="flex justify-center gap-3 mb-6">
          <Button onClick={() => setMode("currency")}>Currency</Button>
          <Button onClick={() => setMode("product")}>Product</Button>
          <Button onClick={startListening}>
            {listening ? "Listening..." : "Voice"}
          </Button>
        </div>

        <div className="border p-6 rounded-lg">

          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-80 bg-black rounded"
            />
          ) : imagePreview ? (
            <>
              <img src={imagePreview} className="w-full h-80 object-contain" />
              <div className="mt-4">
                <Button onClick={handleDetect}>
                  {loading ? "Detecting..." : "Detect"}
                </Button>
                <Button onClick={reset}>Reset</Button>
              </div>
            </>
          ) : (
            <>
              <Button onClick={() => fileInputRef.current?.click()}>
                Upload
              </Button>
              <Button onClick={startCamera}>Use Camera</Button>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </>
          )}

        </div>

        {result && <p className="mt-4 text-xl">{result.result}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}

      </div>
    </section>
  );
};

export default TryItSection;