import Image from "next/image";
import bleu from "@/public/bleu_de_chanel.png";
import hommesport from "@/public/allure_homme_sport.png";
import diorhomme from "@/public/dior_homme.png";

const BadgeSection = () => {
  return (
    <section className="container mx-auto max-w-4xl px-4 my-24 flex flex-col sm:flex-row gap-8 justify-center items-center font-semibold">
      <Image height={140} src={bleu} alt="Perfume Bleu de Chanel" />
      <span>+</span>
      <Image height={140} src={hommesport} alt="Perfume Allure Homme Sport" />
      <span>+</span>
      <Image height={140} src={diorhomme} alt="Perfume Dior Homme" />
      <span>=</span>
      <span className="badge badge-success rounded-full">
        Corporate Meeting
      </span>
    </section>
  );
};

export default BadgeSection;
