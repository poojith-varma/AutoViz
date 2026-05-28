import express from "express";
import axios from "axios";

const router =
  express.Router();

router.post(
  "/",
  async (req, res) => {

    try {

      const {
        question,
        data,
      } = req.body;

      if (
        !question ||
        !Array.isArray(data)
      ) {
        return res
          .status(400)
          .json({
            error:
              "Invalid request",
          });
      }

      // LIMIT DATA SIZE
      const compactData =
        data
          .slice(0, 10)
          .map((row) => {

            const limited: any =
              {};

            Object.keys(row)
              .slice(0, 8)
              .forEach(
                (key) => {
                  limited[key] =
                    row[key];
                }
              );

            return limited;
          });

      const columns =
        Object.keys(
          compactData[0] || {}
        );

      const prompt = `
You are an expert data analyst AI.

Dataset Columns:
${columns.join(", ")}

Dataset Sample:
${JSON.stringify(
  compactData,
  null,
  2
)}

User Question:
${question}

Rules:
- Give concise analytical answers
- Use dataset context
- Keep answers under 120 words
- Do not hallucinate missing data
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
                content:
                  prompt,
              },
            ],

            temperature:
              0.3,

            max_tokens:
              200,
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

      const answer =
        response.data
          .choices[0]
          .message.content;

      res.json({
        answer,
      });

    } catch (error: any) {

      console.error(
        "CHAT ERROR:",
        error?.response?.data ||
          error.message
      );

      res.status(500).json({
        error:
          "AI request failed",
      });
    }
  }
);

export default router;
