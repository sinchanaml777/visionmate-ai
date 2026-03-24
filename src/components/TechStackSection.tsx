const techs = [
  { name: "Python", sub: "Core Language" },
  { name: "OpenCV", sub: "Camera & ORB" },
  { name: "TensorFlow", sub: "Deep Learning" },
  { name: "MobileNetV2", sub: "Transfer Learning" },
  { name: "SpeechRecognition", sub: "Voice Input" },
  { name: "pyttsx3", sub: "Text-to-Speech" },
];

const TechStackSection = () => {
  return (
    <section id="tech" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-foreground mb-14">
          Built With
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {techs.map((tech) => (
            <div
              key={tech.name}
              className="rounded-xl border border-border bg-card p-5 text-center hover:border-primary/40 transition-colors"
            >
              <p className="font-semibold text-primary">{tech.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{tech.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
