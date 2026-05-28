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

      const sample =
        data.slice(0, 30);

      const prompt = `
You are a data analyst AI.

Dataset sample:
${JSON.stringify(sample, null, 2)}

User question:
${question}

Provide a concise analytical answer.
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
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      const answer =
        response.data.choices[0]
          .message.content;

      res.json({
        answer,
      });
    } catch (error) {
      console.error(
  "CHAT ERROR:",
  error
);

      res.status(500).json({
        error:
          "AI chat failed",
      });
    }
  }
);

export default router;