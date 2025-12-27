import { Code, Heart, Users, LucideIcon } from "lucide-react";
import SectionContainer from "./SectionContainer";

const SectionItem = ({
  Icon,
  title,
  description,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
      <Icon size={24} className="text-accent" />
    </div>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-secondary/40">{description}</p>
  </div>
);

const OpenSourceSection = () => {
  return (
    <SectionContainer className="max-w-4xl">
      <div className="text-center">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-accent uppercase tracking-widest text-sm mb-3">
            Community Driven
          </p>
          <h2 className="text-4xl md:text-5xl font-serif italic mb-6">
            Open source, always
          </h2>
          <p className="text-secondary/60 max-w-2xl mx-auto leading-relaxed">
            Layera is built in the open. Our code, our fragrance database, and
            our matching algorithms are all transparent and community-driven.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid sm:grid-cols-3 gap-8 mb-12">
          <SectionItem
            Icon={Code}
            title="Fully Transparent"
            description="Every line of code is public and auditable"
          />

          <SectionItem
            Icon={Users}
            title="Community Database"
            description="Fragrances added and verified by enthusiasts"
          />

          <SectionItem
            Icon={Heart}
            title="Built With Care"
            description="Made by fragrance lovers, for fragrance lovers"
          />
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://github.com/algusaem/layera"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline gap-2"
          >
            <Code size={20} />
            View on GitHub
          </a>
        </div>
      </div>
    </SectionContainer>
  );
};

export default OpenSourceSection;
