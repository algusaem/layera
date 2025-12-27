import SectionContainer from "./SectionContainer";

const steps = [
  {
    number: "01",
    title: "Build your collection",
    description:
      "Add your fragrances from our community database. If something's missing, contribute it yourself.",
  },
  {
    number: "02",
    title: "Set the scene",
    description:
      "Describe what you're dressing for — a mood, a season, an occasion. Be as specific as you like.",
  },
  {
    number: "03",
    title: "Discover your blend",
    description:
      "Receive layering suggestions tailored to what you own, with guidance on how to wear them.",
  },
];

const HowItWorksSection = () => {
  return (
    <SectionContainer className="max-w-5xl">
      {/* Section Header */}
      <div className="text-center mb-16">
        <p className="text-accent uppercase tracking-widest text-sm mb-3">
          Simple & Intuitive
        </p>
        <h2 className="text-4xl md:text-5xl font-serif italic">How it works</h2>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col gap-4">
            {/* Step number */}
            <span className="text-5xl font-serif italic text-accent">
              {step.number}
            </span>

            {/* Title */}
            <h3 className="text-xl font-semibold">{step.title}</h3>

            {/* Description */}
            <p className="text-secondary/60 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Closing line */}
      <p className="text-center text-secondary/40 italic mt-16">
        No guesswork. Just combinations that work.
      </p>
    </SectionContainer>
  );
};

export default HowItWorksSection;
