import { useState } from "react";
import axios from "axios";

type Props = {
  data: any[];
};

export default function DatasetChat({
  data,
}: Props) {
  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [answer, setAnswer] =
    useState("");

  const askAI = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);

      const response =
  await axios.post(
    import.meta.env.VITE_API_URL + "/chat",
    {
      question,

      data: data.slice(
        0,
        10
      ),
    }
  );

      setAnswer(
        response.data.answer
      );
    } catch (error) {
      console.error(error);

      alert("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-14 bg-slate-800/60 backdrop-blur p-8 rounded-3xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6">
        AI Dataset Chat
      </h2>

      <div className="flex gap-4">
        <input
          type="text"
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          placeholder="Ask AI about your dataset..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-blue-400"
        />

        <button
          onClick={askAI}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-4 rounded-xl font-bold transition"
        >
          Ask AI
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-blue-400">
          AI is thinking...
        </p>
      )}

      {answer && (
        <div className="mt-8 bg-slate-900 p-6 rounded-2xl">
          <p className="leading-relaxed text-slate-200">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}