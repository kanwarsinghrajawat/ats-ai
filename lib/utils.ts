import { Candidate, FilterPlan, RankingPlan, AggregateStats } from "./types";

//  Parse CSV content into an array of candidate objects

export function parseCSV(csvContent: string): Candidate[] {
  if (!csvContent || typeof csvContent !== "string") {
    console.error("Invalid CSV content provided");
    return [];
  }

  const lines = csvContent.trim().split("\n");
  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0].split(",");

  return lines
    .slice(1)
    .map((line, lineIndex) => {
      try {
        const values = parseCsvLine(line);
        const candidate: Record<string, any> = {};

        headers.forEach((header, index) => {
          const rawValue = index < values.length ? values[index] : "";

          let parsedValue: string | number | boolean | string[] = rawValue;

          if (typeof rawValue === "string") {
            if (rawValue.toLowerCase() === "yes") {
              parsedValue = true;
            } else if (rawValue.toLowerCase() === "no") {
              parsedValue = false;
            }
          }

          if (
            [
              "years_experience",
              "availability_weeks",
              "notice_period_weeks",
              "desired_salary_usd",
              "remote_experience_years",
            ].includes(header)
          ) {
            parsedValue = isNaN(Number(rawValue)) ? 0 : Number(rawValue);
          }

          if (
            ["skills", "languages", "tags"].includes(header) &&
            typeof rawValue === "string"
          ) {
            parsedValue = rawValue.split(";").filter((v) => v.trim() !== "");
          }

          candidate[header] = parsedValue;
        });

        return candidate as Candidate;
      } catch (error) {
        console.error(`Error parsing CSV line ${lineIndex + 1}:`, error);
        return {} as Candidate;
      }
    })
    .filter((candidate) => Object.keys(candidate).length > 0);
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let currentValue = "";
  let insideQuote = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Handle escaped quotes (double quotes inside quoted fields)
      if (insideQuote && i + 1 < line.length && line[i + 1] === '"') {
        currentValue += '"';
        i++; // Skip the next quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === "," && !insideQuote) {
      result.push(currentValue);
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  // Handle unclosed quotes gracefully
  if (insideQuote) {
    console.warn("Unclosed quote in CSV line:", line);
  }

  result.push(currentValue);
  return result;
}

export function filterCandidates(
  candidates: Candidate[],
  plan: FilterPlan
): Candidate[] {
  // Return all candidates if plan is empty
  if (
    !plan ||
    ((!plan.include || Object.keys(plan.include).length === 0) &&
      (!plan.exclude || Object.keys(plan.exclude).length === 0))
  ) {
    return [...candidates];
  }

  // Pre-process the plan to handle special queries
  const processedPlan: FilterPlan = JSON.parse(JSON.stringify(plan)); // Deep clone without using structuredClone

  // Special handling for title and location queries - often these come from the same field
  // in natural language (e.g. "backend engineer from South Africa")
  if (
    processedPlan.include &&
    processedPlan.include.title &&
    processedPlan.include.location
  ) {
    // If title contains location words, clean it up
    const titleCriteria = processedPlan.include.title;
    const locationCriteria = processedPlan.include.location;

    if (
      typeof titleCriteria === "string" &&
      typeof locationCriteria === "string"
    ) {
      // Extract individual location terms to check against title
      const locationTerms = locationCriteria
        .split(/\s+/)
        .filter((term) => term.length > 2);

      // Clean title from location terms
      const cleanedTitle = titleCriteria
        .split(/\s+/)
        .filter(
          (word) =>
            !locationTerms.some(
              (loc) => loc.toLowerCase() === word.toLowerCase()
            )
        )
        .join(" ");

      if (cleanedTitle.trim() !== titleCriteria.trim()) {
        processedPlan.include.title = cleanedTitle.trim();
      }
    }
  }

  return candidates.filter((candidate) => {
    // Check inclusion criteria
    if (
      processedPlan.include &&
      Object.keys(processedPlan.include).length > 0
    ) {
      for (const [field, criteria] of Object.entries(processedPlan.include)) {
        if (
          !matchesCriteria(
            candidate,
            field,
            criteria as string | string[],
            true
          )
        ) {
          return false;
        }
      }
    }

    // Check exclusion criteria
    if (
      processedPlan.exclude &&
      Object.keys(processedPlan.exclude).length > 0
    ) {
      for (const [field, criteria] of Object.entries(processedPlan.exclude)) {
        if (
          matchesCriteria(
            candidate,
            field,
            criteria as string | string[],
            false
          )
        ) {
          return false;
        }
      }
    }

    return true;
  });
}

function matchesCriteria(
  candidate: Candidate,
  field: string,
  criteria: string | string[],
  shouldMatch: boolean
): boolean {
  // Get the field value
  const value = (candidate as any)[field];

  // If the field doesn't exist
  if (value === undefined) return !shouldMatch;

  // Special handling for the location field
  if (
    field === "location" &&
    typeof value === "string" &&
    value.includes(",")
  ) {
    // Extract country/region from location if it contains a comma
    const locationParts = value.split(",");
    const country = locationParts[locationParts.length - 1].trim();

    // If criteria is searching for a country, prioritize the country part
    if (Array.isArray(criteria)) {
      const countryCriteria = criteria.map((c) => String(c).toLowerCase());
      if (countryCriteria.some((c) => country.toLowerCase().includes(c))) {
        return shouldMatch;
      }
    } else if (typeof criteria === "string") {
      if (country.toLowerCase().includes(String(criteria).toLowerCase())) {
        return shouldMatch;
      }
    }
  }

  // Handle array criteria
  if (Array.isArray(criteria)) {
    if (Array.isArray(value)) {
      // Check if any value matches any criteria
      const hasMatch = criteria.some((c) =>
        value.some((v) => matchSingleValue(v, c))
      );
      return shouldMatch ? hasMatch : !hasMatch;
    } else {
      // Check if the single value matches any criteria
      const hasMatch = criteria.some((c) => matchSingleValue(value, c));
      return shouldMatch ? hasMatch : !hasMatch;
    }
  }
  // Handle single criterion
  else {
    if (Array.isArray(value)) {
      // Check if any array value matches the criterion
      const hasMatch = value.some((v) => matchSingleValue(v, criteria));
      return shouldMatch ? hasMatch : !hasMatch;
    } else {
      // Check if the single value matches the single criterion
      const hasMatch = matchSingleValue(value, criteria);
      return shouldMatch ? hasMatch : !hasMatch;
    }
  }
}

function matchSingleValue(
  value: any,
  criterion: string | number | boolean
): boolean {
  // Handle null or undefined values
  if (value === null || value === undefined) {
    return false;
  }

  // Handle array values specially - we need to match any item in the array
  if (Array.isArray(value)) {
    return value.some((item) => matchSingleValue(item, criterion));
  }

  // Ensure we're working with strings for comparison
  const valueStr = String(value).toLowerCase().trim();
  const criterionStr = String(criterion).toLowerCase().trim();

  // For boolean values, directly compare
  if (typeof value === "boolean" && typeof criterion === "boolean") {
    return value === criterion;
  }

  // For number values, allow for direct comparison if criterion is a number or string number
  if (typeof value === "number") {
    if (typeof criterion === "number") {
      return value === criterion;
    }
    if (typeof criterion === "string" && !isNaN(Number(criterion))) {
      return value === Number(criterion);
    }
  }

  // Always perform a case-insensitive check for simple string matches first
  if (valueStr.includes(criterionStr)) {
    return true;
  }

  // For location fields, which may contain multiple parts (e.g. "Cape Town, South Africa")
  // Split by common delimiters and check each part
  if (valueStr.includes(",") || valueStr.includes(";")) {
    const parts = valueStr.split(/[,;]/).map((part) => part.trim());
    if (
      parts.some(
        (part) => part.includes(criterionStr) || criterionStr.includes(part)
      )
    ) {
      return true;
    }
  }

  // Try regex matching for string values
  try {
    if (typeof criterion === "string") {
      // Create a case-insensitive regex to match the criterion anywhere in the value
      const regex = new RegExp(criterionStr, "i");
      return regex.test(valueStr);
    }
  } catch (error) {
    console.warn("Error in regex matching:", error);
  }

  return false;
}

export function rankCandidates(
  candidates: Candidate[],
  plan: RankingPlan
): Candidate[] {
  // Validate input
  if (!candidates || candidates.length === 0) {
    return [];
  }

  if (!plan || !plan.primary || !plan.primary.field) {
    // If no valid ranking plan, return candidates in original order
    return [...candidates];
  }

  const { primary, tie_breakers } = plan;

  // Validate that the primary field exists in the first candidate
  const sampleCandidate = candidates[0];
  const validFields = Object.keys(sampleCandidate);

  // Ensure all fields are valid
  if (!validFields.includes(primary.field)) {
    console.warn(
      `Invalid primary field: ${
        primary.field
      }. Available fields: ${validFields.join(", ")}`
    );
    return [...candidates];
  }

  return [...candidates].sort((a, b) => {
    // Compare by primary field
    const primaryComparison = compareByField(
      a,
      b,
      primary.field,
      primary.direction
    );
    if (primaryComparison !== 0) return primaryComparison;

    // If primary comparison is equal and we have tie breakers
    if (tie_breakers && tie_breakers.length > 0) {
      for (const tieBreaker of tie_breakers) {
        // Skip invalid tie breaker fields
        if (!validFields.includes(tieBreaker.field)) {
          console.warn(`Invalid tie breaker field: ${tieBreaker.field}`);
          continue;
        }

        const tieComparison = compareByField(
          a,
          b,
          tieBreaker.field,
          tieBreaker.direction
        );
        if (tieComparison !== 0) return tieComparison;
      }
    }

    return 0;
  });
}

function compareByField(
  a: Candidate,
  b: Candidate,
  field: string,
  direction: "asc" | "desc"
): number {
  const valueA = (a as any)[field];
  const valueB = (b as any)[field];

  // Handle undefined values
  if (valueA === undefined && valueB === undefined) return 0;
  if (valueA === undefined) return direction === "asc" ? -1 : 1;
  if (valueB === undefined) return direction === "asc" ? 1 : -1;

  // Compare based on value type
  let comparison = 0;

  if (typeof valueA === "number" && typeof valueB === "number") {
    comparison = valueA - valueB;
  } else if (typeof valueA === "boolean" && typeof valueB === "boolean") {
    comparison = valueA === valueB ? 0 : valueA ? 1 : -1;
  } else if (Array.isArray(valueA) && Array.isArray(valueB)) {
    comparison = valueA.length - valueB.length;
  } else {
    comparison = String(valueA).localeCompare(String(valueB));
  }

  return direction === "asc" ? comparison : -comparison;
}

export function aggregateStats(candidates: Candidate[]): AggregateStats {
  if (!candidates.length) {
    return { count: 0, avg_experience: 0, top_skills: [] };
  }

  // Count candidates
  const count = candidates.length;

  // Calculate average years of experience
  const totalExperience = candidates.reduce(
    (sum, candidate) => sum + (candidate.years_experience || 0),
    0
  );
  const avg_experience = Math.round((totalExperience / count) * 10) / 10;

  // Find top skills
  const skillCounts: Record<string, number> = {};
  candidates.forEach((candidate) => {
    (candidate.skills || []).forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  const top_skills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill);

  return { count, avg_experience, top_skills };
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
