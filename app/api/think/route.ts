import OpenAI from "openai";
import { ThinkResponse } from "@/lib/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Check API key existence
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const { query, csvHeader } = await request.json();

    if (!query || !csvHeader) {
      return Response.json(
        { error: "Query and CSV header are required" },
        { status: 400 }
      );
    }

    // Prompt the LLM to generate a filtering and ranking plan
    const systemPrompt = `You are ATS-Lite, a specialized assistant for talent sourcing.
Your task is to convert a recruiter's natural language query into structured filters and ranking rules for candidates.
You will be given the CSV header structure and a query. You must respond ONLY with valid JSON.

The JSON must contain a "filter" object (with optional "include" and "exclude" properties) and a "rank" object.
Each property in "include" and "exclude" should match a column name from the CSV and contain string patterns or regexes.

Pay special attention to location-based queries:
1. When you see phrases like "from [location]", "in [location]", or "based in [location]", map these to the "location" field.
2. Treat country names and city names as potential location matches.
3. When a location is specified, give preference to exact matches on the country part of the location.

The "rank" object must have a "primary" sorting field and optional "tie_breakers" array.
Do not provide any explanations or commentary outside the JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `CSV structure: ${csvHeader}\n\nQuery: ${query}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Parse the response as JSON
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    try {
      const plan = JSON.parse(content) as ThinkResponse;
      return Response.json(plan);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return Response.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in think API:", error);
    return Response.json(
      {
        error: "Failed to process query",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
