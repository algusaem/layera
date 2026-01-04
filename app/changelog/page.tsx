import Navbar from "@/components/Navbar";
import ChangelogHeader from "@/components/Changelog/ChangelogHeader";
import CurrentVersionBadge from "@/components/Changelog/CurrentVersionBadge";
import ReleaseCard from "@/components/Changelog/ReleaseCard";
import { releases } from "@/lib/releases";

const ChangelogPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-16">
        <ChangelogHeader />
        <CurrentVersionBadge version={releases[0].version} />

        {/* Releases */}
        <div className="space-y-8">
          {releases.map((release) => (
            <ReleaseCard key={release.version} release={release} />
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-secondary/40 italic">
            More updates coming soon. Stay tuned!
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChangelogPage;
