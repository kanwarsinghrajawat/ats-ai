import { ThinkResponse, Candidate } from "./types";

export async function getThinkPlan(
  query: string,
  csvHeader: string
): Promise<ThinkResponse> {
  const response = await fetch("/api/think", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      csvHeader,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate filtering plan");
  }

  return response.json();
}

export async function getSpeakResponse(
  query: string,
  topCandidates: Candidate[],
  stats: any
): Promise<{ content: string }> {
  const response = await fetch("/api/speak", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      candidates: topCandidates,
      stats,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate summary");
  }

  return response.json();
}
