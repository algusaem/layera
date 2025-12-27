import { ReactElement } from "react";

const SectionContainer = ({
  children,
  className = "",
}: {
  children: ReactElement | ReactElement[];
  className?: string;
}) => {
  return (
    <section className={`container mx-auto px-4 my-24 ${className}`}>
      {children}
    </section>
  );
};

export default SectionContainer;
