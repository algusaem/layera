import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <div className="w-2/4">
          <section className="max-w-xl my-24 flex flex-col gap-8">
            <h1 className="text-4xl font-semi">
              Find the perfect scent for any occasion
            </h1>
            <p className="text-lg">
              Layera helps you discover which perfumes from your collection work
              beautifully together. Tell the AI what you are going for — a date,
              the office, a lazy Sunday — and get layering suggestions that
              actually make sense.
            </p>
            <div className="w-full flex gap-4">
              <button className="btn btn-accent">Find your scent</button>
              <button className="btn btn-secondary btn-outline">
                Build your collection
              </button>
            </div>
          </section>
        </div>
        <div className="divider"></div>
      </main>
    </div>
  );
}
