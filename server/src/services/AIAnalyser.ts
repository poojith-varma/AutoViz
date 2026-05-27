import axios from "axios";

export const analyzeDataset = async (
  data: any[],
  columnTypes: Record<string, string>
) => {
  try {
    const sampleRows = data.slice(0, 5);

    const prompt = `
You are a data visualization expert.

Analyze this dataset and recommend the best 3 charts.

Dataset column types:
${JSON.stringify(columnTypes, null, 2)}

Sample rows:
${JSON.stringify(sampleRows, null, 2)}

Return ONLY valid JSON in this format:

[
  {
    "chartType": "bar",
    "xAxis": "column",
    "yAxis": "column",
    "reason": "why this chart fits"
  }
]
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

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
          Authorization:
  `Bearer ${process.env.GROQ_API_KEY}`,

          "Content-Type":
            "application/json",
        },
      }
    );

    const content =
      response.data.choices[0].message.content;

    try {
  // Extract JSON array from response
  const jsonMatch =
    content.match(/\[[\s\S]*\]/);

  if (!jsonMatch) {
    throw new Error(
      "No JSON found in AI response"
    );
  }

  return JSON.parse(jsonMatch[0]);
} catch {
  console.error(
    "Invalid JSON from AI:",
    content
  );

  return [];
}
  } catch (error) {
    console.error(error);

    return [];
  }
};