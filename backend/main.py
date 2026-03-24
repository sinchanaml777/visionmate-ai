import speech_recognition as sr
from tts import speak
from detector import capture_image, detect_product, detect_currency

recognizer = sr.Recognizer()


def listen_command():
    with sr.Microphone() as source:
        print("\nListening...")
        speak("How can I help you?")
        
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        audio = recognizer.listen(source)

    try:
        command = recognizer.recognize_google(audio)
        print("You said:", command)
        return command.lower()

    except sr.UnknownValueError:
        speak("Sorry, I did not understand.")
        return ""

    except sr.RequestError:
        speak("Network error.")
        return ""


while True:
    command = listen_command()

    # ---- CURRENCY DETECTION ----
    if "currency" in command:
        speak("Scanning currency")
        image = capture_image()

        if image is not None:
            result = detect_currency(image)
            print("Detected currency:", result)
            speak(f"This is {result}")
        else:
            speak("Camera closed")

    # ---- PRODUCT DETECTION ----
    elif "product" in command:
        speak("Scanning product")
        image = capture_image()

        if image is not None:
            result = detect_product(image)
            print("Detected product:", result)

            if result:
                speak(f"This looks like a {result}")
            else:
                speak("Product detected but not recognized")
        else:
            speak("Camera closed")

    # ---- IMAGE COMMAND (fallback) ----
    elif "image" in command:
        speak("Please say scan currency or scan product")

    # ---- EXIT ----
    elif "exit" in command or "stop" in command or "quit" in command:
        speak("Goodbye")
        print("Exiting Vision Mate...")
        break

    # ---- UNKNOWN COMMAND ----
    else:
        speak("Sorry, please say scan currency or scan product")