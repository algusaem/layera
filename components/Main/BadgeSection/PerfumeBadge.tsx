import Image, { StaticImageData } from "next/image";

const PerfumeBadge = ({
  imageSrc,
  altText,
  label,
}: {
  imageSrc: StaticImageData;
  altText: string;
  label: string;
}) => (
  <div className="group flex flex-col items-center gap-3">
    <div className="relative p-4 rounded-2xl bg-base-200/50 backdrop-blur-sm border border-base-content/5 transition-all duration-300 group-hover:border-accent/30 group-hover:shadow-lg group-hover:shadow-accent/10">
      <Image
        height={120}
        src={imageSrc}
        alt={altText}
        className="transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <span className="text-xs text-secondary/60 font-medium tracking-wide">
      {label}
    </span>
  </div>
);

export default PerfumeBadge;
