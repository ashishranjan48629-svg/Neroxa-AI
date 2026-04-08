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
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          Powered by GPT-4o
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold text-white leading-tight mb-6">
          Write smarter with{" "}
          <span className="text-violet-400">Neroxa AI</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Generate content, answer questions, and automate writing tasks — all in one powerful AI tool.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/login"
            className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-8 py-3 rounded-lg transition-colors">
            Start for free
          </Link>
          <Link to="/pricing"
            className="border border-white/10 hover:border-white/30 text-gray-300 hover:text-white font-medium px-8 py-3 rounded-lg transition-colors">
            View pricing
          </Link>
        </div>
        <p className="text-gray-600 text-xs mt-4">No credit card required · 10 free generations</p>
      </section>

      {/* Live Demo */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <PromptBox onResponse={setResponse} onLoading={setLoading} />
        <ResponseBox response={response} loading={loading} />
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-violet-400 text-sm font-medium text-center mb-2">Features</p>
          <h2 className="text-3xl font-semibold text-white text-center mb-12">
            Everything you need to ship fast
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Real-time streaming", desc: "Responses stream word-by-word using SSE on Node.js." },
              { title: "Credit system", desc: "Free and paid tiers with per-user credit tracking." },
              { title: "Stripe billing", desc: "One-click checkout with webhook plan sync." },
              { title: "User accounts", desc: "Auth with JWT. Each user gets history and settings." },
              { title: "Rate limiting", desc: "Per-user limits via Redis to control OpenAI costs." },
              { title: "Usage dashboard", desc: "Live credit usage, history, and upgrade prompts." },
            ].map((f) => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-colors">
                <h3 className="text-white font-medium mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;