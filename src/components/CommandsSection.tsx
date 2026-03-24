import { ScanLine, PackageSearch, MicOff } from "lucide-react";

const commands = [
  {
    icon: ScanLine,
    keyword: '"currency"',
    title: "Scan Currency",
    description:
      "Detects Indian currency using ORB feature matching first, then falls back to CNN if uncertain.",
  },
  {
    icon: PackageSearch,
    keyword: '"product"',
    title: "Scan Product",
    description:
      "Identifies everyday objects using MobileNetV2 with ImageNet — returns top prediction with confidence.",
  },
  {
    icon: MicOff,
    keyword: '"exit"',
    title: "Exit",
    description: 'Say "exit", "stop" or "quit" to close VisionMate.',
  },
];

const CommandsSection = () => {
  return (
    <section id="commands" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-foreground mb-3">
          Voice Commands
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-lg mx-auto">
          Say the keyword — VisionMate handles detection & response.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {commands.map((cmd) => (
            <div
              key={cmd.title}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors group"
            >
              <cmd.icon className="h-8 w-8 text-primary mb-4" />
              <p className="text-sm text-primary font-mono mb-1">{cmd.keyword}</p>
              <h3 className="text-lg font-semibold text-foreground mb-2">{cmd.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {cmd.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommandsSection;
