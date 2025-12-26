const IntroSection = () => {
  return (
    <section className="container mx-auto max-w-4xl px-4 my-24">
      <div className="max-w-xl flex flex-col gap-6">
        {/* Title */}
        <h1 className="max-w-md text-5xl font-serif italic">
          Find the perfect scent for any occasion
        </h1>

        {/* Description */}
        <p className="text-lg text-secondary/70">
          Layera helps you discover which perfumes from your collection work
          beautifully together. Tell the AI what you are going for — a date, the
          office, a lazy Sunday — and get layering suggestions that actually
          make sense.
        </p>

        {/* Buttons */}
        <div className="w-full flex gap-4">
          <button className="btn btn-accent">Find your scent</button>
          <button className="btn btn-secondary btn-outline">
            Build your collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
