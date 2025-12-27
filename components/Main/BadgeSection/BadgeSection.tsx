import bleu from "@/public/bleu_de_chanel.png";
import hommesport from "@/public/allure_homme_sport.png";
import diorhomme from "@/public/dior_homme.png";
import PerfumeBadge from "./PerfumeBadge";
import Operator from "./Operator";
import SectionTitle from "./SectionTitle";
import SectionContainer from "../SectionContainer";

const BadgeSection = () => {
  return (
    <SectionContainer className="max-w-4xl">
      {/* Section Header */}
      <SectionTitle />

      {/* Formula Display */}
      <div className="relative">
        {/* Ambient glow background */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-accent/5 to-transparent blur-3xl overflow-hidden" />

        {/* Main formula row */}
        <div className="relative flex flex-wrap justify-center items-center gap-4 md:gap-8">
          {/* Perfume 1 */}
          <PerfumeBadge
            imageSrc={bleu}
            altText={"Perfume Bleu de Chanel"}
            label={"Bleu de Chanel"}
          />
          <Operator>+</Operator>

          {/* Perfume 2 */}
          <PerfumeBadge
            imageSrc={hommesport}
            altText={"Perfume Allure Homme Sport"}
            label={"Allure Homme Sport"}
          />
          <Operator>+</Operator>

          {/* Perfume 3 */}
          <PerfumeBadge
            imageSrc={diorhomme}
            altText={"Perfume Dior Homme"}
            label={"Dior Homme"}
          />
          <Operator>=</Operator>

          {/* Result Badge */}
          <div className="flex flex-col items-center gap-2">
            <div className="px-6 py-2 rounded-full border border-accent">
              <span className="text-accent font-semibold tracking-wide">
                Corporate Meeting
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-center text-secondary/40 mt-12 max-w-md mx-auto">
        Three fragrances, one unforgettable impression. Let Layera find your
        perfect combination.
      </p>
    </SectionContainer>
  );
};

export default BadgeSection;
