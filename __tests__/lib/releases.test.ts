import { releases } from "@/lib/releases";

describe("releases data", () => {
  it("contains release data", () => {
    expect(releases).toBeDefined();
    expect(Array.isArray(releases)).toBe(true);
    expect(releases.length).toBeGreaterThan(0);
  });

  it("has valid release structure", () => {
    releases.forEach((release) => {
      expect(release).toHaveProperty("version");
      expect(release).toHaveProperty("date");
      expect(release).toHaveProperty("changes");
      expect(Array.isArray(release.changes)).toBe(true);
    });
  });

  it("releases are in descending version order", () => {
    for (let i = 0; i < releases.length - 1; i++) {
      const current = releases[i].version.split(".").map(Number);
      const next = releases[i + 1].version.split(".").map(Number);

      // Compare major.minor.patch
      const isGreaterOrEqual =
        current[0] > next[0] ||
        (current[0] === next[0] && current[1] > next[1]) ||
        (current[0] === next[0] && current[1] === next[1] && current[2] >= next[2]);

      expect(isGreaterOrEqual).toBe(true);
    }
  });

  it("each change has valid type and description", () => {
    const validTypes = ["feature", "improvement", "fix"];

    releases.forEach((release) => {
      release.changes.forEach((change) => {
        expect(change).toHaveProperty("type");
        expect(change).toHaveProperty("description");
        expect(validTypes).toContain(change.type);
        expect(change.description.length).toBeGreaterThan(0);
      });
    });
  });

  it("has valid date format (YYYY-MM-DD)", () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    releases.forEach((release) => {
      expect(release.date).toMatch(dateRegex);
      // Verify it's a valid date
      const date = new Date(release.date);
      expect(date.toString()).not.toBe("Invalid Date");
    });
  });
});
