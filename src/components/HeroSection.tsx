import heroImage from "@/assets/hero-image.png";

const HeroSection = () => {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              🎙 Voice Activated AI
            </span>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              VisionMate
            </h1>
            <p className="text-lg text-muted-foreground">
              AI assistant for the visually impaired.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Speak a command → camera captures → ORB or CNN detects → result spoken back. Fully voice-driven, no screen needed.
            </p>

            <div className="rounded-lg border border-border bg-secondary p-5 font-mono text-sm space-y-1">
              <p className="text-muted-foreground">$ python main.py</p>
              <p>🎤 <span className="text-primary">Listening...</span></p>
              <p className="text-foreground">"How can I help you?"</p>
              <p className="text-muted-foreground">
                You said: <span className="text-primary font-bold">currency</span>
              </p>
              <p className="text-muted-foreground">🔍 Running ORB detection...</p>
              <p className="text-muted-foreground">500 → Good Matches: 34</p>
              <p>⭐ Best: 500 (34)</p>
              <p>
                ✅ ORB Result: <span className="text-primary">500 rupees</span>
              </p>
              <p>
                🔊 <span className="text-primary">"This is 500 rupees"</span>
              </p>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="VisionMate scanning currency with smartphone"
                className="w-full max-w-md rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
