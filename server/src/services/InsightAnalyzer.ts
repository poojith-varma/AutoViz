import axios from "axios";

export const generateInsights =
  async (
    data: any[],
    columnTypes: Record<
      string,
      string
    >
  ) => {
    try {
      const sample =
        data.slice(0, 10);

      const prompt = `
You are an expert business intelligence analyst.

Analyze this dataset and generate 5 short business insights.

Dataset column types:
${JSON.stringify(columnTypes)}

Dataset sample:
${JSON.stringify(sample)}

Rules:
- Keep insights concise
- Mention trends or anomalies
- Mention top-performing categories if possible
- Return ONLY JSON

Format:
[
  {
    "title": "Insight title",
    "description": "Insight explanation"
  }
]
`;

      const response =
        await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model:
              "llama-3.1-8b-instant",

            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],

            temperature: 0.3,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      const content =
        response.data.choices[0]
          .message.content;

      const cleanedContent =
  content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

      try {

  const jsonMatch =
    cleanedContent.match(
      /\[[\s\S]*\]/
    );

  if (!jsonMatch) {
    throw new Error(
      "No JSON array found"
    );
  }

  return JSON.parse(
    jsonMatch[0]
  );

} catch {
        console.error(
          "Invalid Insight JSON:",
          content
        );

        return [];
      }
    } catch (error) {
      console.error(error);

      return [];
    }
  };