import { useState, useRef } from "react";
import { Mic } from "lucide-react";

const DetectionSection = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  // 🔊 Speak
  const speak = (text: string) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    speechSynthesis.speak(utterance);
  };

  // 🧠 Guide user
  const guideUser = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
    speak(msg);
  };

  // 📷 Start camera
  const startCamera = async (type: "currency" | "product") => {
    retryCountRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      guideUser("Camera started");
      guideUser("Hold the object in front of the camera");

      setTimeout(() => guideUser("Keep it steady"), 2000);
      setTimeout(() => guideUser("Capturing image in 3 seconds"), 3000);

      setTimeout(() => captureImage(type), 5000);
    } catch {
      guideUser("Camera access failed");
    }
  };

  // 🛑 Stop camera
  const stopCamera = () => {
    if (!videoRef.current) return;

    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // 📸 Capture image
  const captureImage = async (type: "currency" | "product") => {
    if (!videoRef.current) return;

    guideUser("Capturing image");

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "capture.jpg");

      guideUser("Processing image");

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/detect/${type}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        setLogs((prev) => [...prev, `Result: ${data.result}`]);

        if (data.result.includes("Unable")) {
          retryCountRef.current += 1;

          guideUser("I could not detect clearly");
          setTimeout(() => guideUser("Please move the object closer"), 1500);
          setTimeout(() => guideUser("Hold it steady and try again"), 3000);

          if (retryCountRef.current < MAX_RETRIES) {
            setTimeout(() => {
              guideUser("Retrying detection");
              captureImage(type);
            }, 5000);
          } else {
            guideUser("I am still not able to detect");

            setTimeout(() => {
              guideUser(
                "Please say scan currency or scan product to try again"
              );
            }, 2000);

            stopCamera();
          }
        } else {
          guideUser(`This is ${data.result}`);

          stopCamera();

          setTimeout(() => {
            guideUser("Do you want to scan currency or scan product?");
          }, 2000);
        }
      } catch {
        guideUser("Backend connection failed");
      }
    });
  };

  // 🛑 Stop assistant
  const stopAssistant = () => {
    setIsActive(false);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    stopCamera();
    guideUser("Assistant stopped");
  };

  // 🎤 Start assistant
  const startAssistant = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert("Microphone permission required");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    setIsActive(true);
    setLogs(["Listening..."]);

    recognition.start();

    guideUser("How can I help you?");

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .trim();

      setLogs((prev) => [...prev, `You said: ${transcript}`]);

      if (transcript.includes("stop") || transcript.includes("exit")) {
        stopAssistant();
        return;
      }

      if (transcript.includes("currency")) {
        guideUser("Opening camera for currency detection");
        startCamera("currency");
        return;
      }

      if (transcript.includes("product")) {
        guideUser("Opening camera for product detection");
        startCamera("product");
        return;
      }

      guideUser("Say scan currency or scan product");
    };

    recognition.onend = () => {
      if (recognitionRef.current) {
        recognition.start();
      }
    };
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-6">
          VisionMate Voice Scanner
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={isActive ? stopAssistant : startAssistant}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md"
          >
            <Mic className="h-4 w-4" />
            {isActive ? "Stop Assistant" : "Start Voice Scan"}
          </button>
        </div>

        {/* ✅ SIDE-BY-SIDE LAYOUT */}
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* 📝 TEXT LOGS */}
          <div className="w-full md:w-1/2 bg-muted p-6 rounded-lg text-sm font-mono space-y-2 h-[400px] overflow-y-auto">
            {logs.length === 0 ? (
              <div>Start the assistant...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </div>

          {/* 📷 CAMERA */}
          <div className="w-full md:w-1/2 flex justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md rounded-lg border-2 border-yellow-500"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default DetectionSection;