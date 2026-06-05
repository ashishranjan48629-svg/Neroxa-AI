import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Real-time streaming",
    desc: "Responses stream word-by-word using SSE on Node.js for instant feedback.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Credit system",
    desc: "Free and paid tiers with per-user credit tracking built in.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <path d="M1 10h22" />
      </svg>
    ),
    title: "Stripe billing",
    desc: "One-click checkout with webhook-driven plan sync and receipt emails.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "User accounts",
    desc: "Auth with JWT. Each user gets their own history and settings.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Rate limiting",
    desc: "Per-user request limits via Redis to keep OpenAI costs under control.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Usage dashboard",
    desc: "Live credit usage, generation history, and contextual upgrade prompts.",
  },
];

export default function Feature() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-black relative">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-5 right-5 z-50 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
        aria-label="Go back"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-violet-400 text-sm font-medium mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              Everything you need to ship fast
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              A full-stack AI foundation — streaming, billing, auth, and
              analytics — ready to go.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group flex flex-col gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-violet-500/30 hover:bg-violet-600/5 transition-all duration-200"
              >
                {/* Icon */}
                <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-violet-600/10 text-violet-400 group-hover:bg-violet-600/20 transition-colors">
                  {f.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-white font-medium text-sm mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
