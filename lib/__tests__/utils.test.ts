import {
  parseCSV,
  filterCandidates,
  rankCandidates,
  aggregateStats,
} from "../utils";
import fs from "fs";
import path from "path";

describe("ATS-Lite utils", () => {
  // Load test data
  let candidates: any[] = [];

  beforeAll(() => {
    const csvPath = path.join(process.cwd(), "data/candidates.csv");
    const csvData = fs.readFileSync(csvPath, "utf8");
    candidates = parseCSV(csvData);
  });

  test("parseCSV correctly parses candidate data", () => {
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0]).toHaveProperty("id");
    expect(candidates[0]).toHaveProperty("full_name");
    expect(candidates[0]).toHaveProperty("title");
  });

  test("filterCandidates should filter by skills and location correctly", () => {
    const filter = {
      include: {
        skills: "React",
        location: "Cyprus",
      },
    };

    const filtered = filterCandidates(candidates, filter);
    console.log("Filtered candidates:", filtered.length);

    expect(filtered.length).toBeGreaterThan(0);

    filtered.forEach((candidate) => {
      const hasReactSkill =
        Array.isArray(candidate.skills) &&
        candidate.skills.some((skill: string) =>
          skill.toLowerCase().includes("react")
        );
      expect(hasReactSkill).toBeTruthy();
      expect(candidate.location.toLowerCase()).toContain("cyprus");
    });
  });

  test("rankCandidates should rank by experience desc correctly", () => {
    const filter = {
      include: {
        skills: "React",
        location: "Cyprus",
      },
    };

    const filtered = filterCandidates(candidates, filter);
    const ranking = {
      primary: {
        field: "years_experience",
        direction: "desc" as const,
      },
    };

    const ranked = rankCandidates(filtered, ranking);
    for (let i = 0; i < ranked.length - 1; i++) {
      expect(ranked[i].years_experience).toBeGreaterThanOrEqual(
        ranked[i + 1].years_experience
      );
    }
    const testSet = candidates.filter((c) => c.id === "12" || c.id === "5");

    if (testSet.length === 2) {
      testSet.find((c) => c.id === "12")!.years_experience = 10;
      testSet.find((c) => c.id === "5")!.years_experience = 5;

      const testRanked = rankCandidates(testSet, ranking);
      const candidate12Index = testRanked.findIndex((c) => c.id === "12");
      const candidate5Index = testRanked.findIndex((c) => c.id === "5");

      expect(candidate12Index).toBeLessThan(candidate5Index);
    }
  });

  test("aggregateStats calculates stats correctly", () => {
    const filtered = filterCandidates(candidates, {
      include: { title: "Engineer" },
    });

    const stats = aggregateStats(filtered);

    expect(stats).toHaveProperty("count");
    expect(stats).toHaveProperty("avg_experience");
    expect(stats).toHaveProperty("top_skills");

    expect(stats.count).toBe(filtered.length);
    expect(stats.top_skills.length).toBeLessThanOrEqual(5);

    const manualAvg =
      filtered.reduce((sum, c) => sum + c.years_experience, 0) /
      filtered.length;
    const roundedManualAvg = Math.round(manualAvg * 10) / 10;
    expect(stats.avg_experience).toBe(roundedManualAvg);
  });

  test("filterCandidates should find Backend Engineer from South Africa (Sydney Kim)", () => {
    const filter = {
      include: {
        title: "Backend Engineer",
        location: "South Africa",
      },
    };

    const filtered = filterCandidates(candidates, filter);

    expect(filtered.length).toBeGreaterThan(0);

    const sydneyKim = filtered.find((c) => c.full_name === "Sydney Kim");
    expect(sydneyKim).toBeDefined();
    expect(sydneyKim?.id).toBe("1");
    expect(sydneyKim?.location).toContain("South Africa");
  });
});
