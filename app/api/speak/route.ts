import OpenAI from "openai";
import { Candidate } from "@/lib/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Check API key existence
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const { query, candidates, stats } = await request.json();

    if (!query || !candidates || !stats) {
      return Response.json(
        {
          error: "Query, candidates, and stats are required",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return Response.json({
        content:
          "I couldn't find any candidates matching your criteria. Please try a different query.",
      });
    }

    // Build a prompt that includes the filtered candidates and statistics
    const systemPrompt = `You are ATS-Lite, a specialized assistant for talent sourcing.
Provide a concise summary of the candidates that match a recruiter's query.
Your response should be professional and helpful for recruiters reviewing talent.
Include relevant statistics and highlight the strengths of the top candidates.
Keep your response brief but informative.`;

    // Format the candidates into a readable structure for the model
    const candidatesList = candidates
      .map((c: Candidate) => {
        return `
ID: ${c.id}
Name: ${c.full_name}
Title: ${c.title}
Location: ${c.location}
Experience: ${c.years_experience} years
Skills: ${Array.isArray(c.skills) ? c.skills.join(", ") : c.skills}
Education: ${c.education_level} in ${c.degree_major}
${c.summary ? "Summary: " + c.summary : ""}
      `;
      })
      .join("\n---\n");

    const statsText = `
Total matches: ${stats.count}
Average experience: ${stats.avg_experience} years
Most common skills: ${stats.top_skills.join(", ")}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Query: ${query}\n\nStatistics:\n${statsText}\n\nTop Candidates:\n${candidatesList}`,
        },
      ],
      stream: false,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    return Response.json({ content });
  } catch (error) {
    console.error("Error in speak API:", error);
    return Response.json(
      {
        error: "Failed to generate summary",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
