import { useState } from "react";
import { Link } from "react-router-dom";
import PromptBox from "../components/PromptBox";
import ResponseBox from "../components/ResponseBox";

const Home = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-black">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-5 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          Powered by GPT-4o
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold text-white leading-tight mb-6">
          Write smarter with{" "}
          <span className="text-violet-400">Neroxa AI</span>
        </h1>
        
        <p className="text-gray-600 text-xs mt-4">No credit card required · 10 free generations</p>
      </section>

      {/* Live Demo */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <PromptBox onResponse={setResponse} onLoading={setLoading} />
        <ResponseBox response={response} loading={loading} />
      </section>
    </main>
  );
};

export default Home;