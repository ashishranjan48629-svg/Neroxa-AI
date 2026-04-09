import { useState } from "react";
import { generateAI } from "../services/api";

const PromptBox = ({ onResponse, onLoading }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    onLoading(true);
    try {
      const res = await generateAI({ prompt });
      onResponse(res.data.result);
    } catch (err) {
      onResponse(
        "Error: " + (err.response?.data?.message || "Something went wrong"),
      );
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4">
      <textarea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask anything..."
        className="w-full bg-transparent text-white placeholder-gray-500 text-sm resize-none outline-none"
      />
      <div className="flex justify-between items-center mt-3">
        <button className="p-2 rounded-lg hover:bg-white/10">
          <svg
            className="w-5 h-5 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          onClick={handleSubmit}
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default PromptBox;
