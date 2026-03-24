import pyttsx3

def speak(text):
    engine = pyttsx3.init()   # Reinitialize every time
    engine.say(text)
    engine.runAndWait()