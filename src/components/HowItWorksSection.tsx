import { Mic, Camera, Brain, Volume2 } from "lucide-react";

const steps = [
  { icon: Mic, label: "Voice Command" },
  { icon: Camera, label: "Camera Capture (C key)" },
  { icon: Brain, label: "AI Detection" },
  { icon: Volume2, label: "Result Spoken" },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-foreground mb-14">
          How It Works
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4 md:gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground text-center max-w-[100px]">
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span className="text-muted-foreground text-xl mb-6">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
