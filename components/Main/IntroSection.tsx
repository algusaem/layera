import { Sparkles, Library } from "lucide-react";
import Image from "next/image";
import heroImg from "@/public/hero_image.jpg";
import SectionContainer from "./SectionContainer";
import Link from "next/link";

const IntroSection = () => {
  return (
    <SectionContainer className="max-w-6xl">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left: Content */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Tagline */}
          <p className="text-accent uppercase tracking-widest text-sm">
            The Art of Layering
          </p>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif italic leading-tight">
            Find the perfect scent for any occasion
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-secondary/60 leading-relaxed max-w-xl">
            Layera helps you discover which perfumes from your collection work
            beautifully together. Tell the AI what you&apos;re going for — a
            date, the office, a lazy Sunday — and get layering suggestions that
            actually make sense.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/ask" className="btn btn-accent btn-lg px-8">
              <Sparkles size={20} />
              Find your scent
            </Link>
            <Link href="/collection" className="btn btn-secondary btn-lg px-8">
              <Library size={20} /> Build your collection
            </Link>
          </div>

          {/* Subtle accent */}
          <p className="text-sm text-secondary/40 italic pt-2">
            Discover combinations that complement, not compete.
          </p>
        </div>

        {/* Right: Hero Image */}
        <div className="hidden lg:flex flex-1 justify-end">
          <div className="relative w-full max-w-md aspect-4/5 rounded-2xl overflow-hidden">
            <Image
              src={heroImg}
              alt="Hero image"
              fill
              className="object-cover brightness-75"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-base-100/40 via-transparent to-base-100/40" />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default IntroSection;
