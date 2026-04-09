export default function Feature() {
    return (
      <main className="min-h-screen bg-black">
       
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
}