import { useState } from "react";

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className="flex-shrink-0 mt-0.5"
  >
    <path
      d="M2.5 7L5.5 10L11.5 4"
      stroke="#9CA3AF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Optional placeholder icon
const ClaudeIcon = () => <div className="w-6 h-6 rounded-full bg-violet-500" />;

const plans = [
  {
    name: "Max",
    tagline: "Higher limits, priority access",
    price: "$50",
    priceSuffix: "USD / month",
    priceSuffix2: "billed monthly",
    cta: "Get Max plan",
    ctaStyle: "white",
    note: "No commitment · Cancel anytime",
    featuresHeader: "Everything in Pro, plus:",
    features: [
      "Up to 20x more usage than Pro*",
      "Early access to advanced Claude features",
      "Higher output limits for all tasks",
      "Priority access at high traffic times",
      "Claude in PowerPoint",
    ],
    moreFeaturesCount: null,
  },
  {
    name: "Pro",
    tagline: "Research, code, and organize",
    price: "$17",
    priceSuffix: "USD / month",
    priceSuffix2: "billed annually",
    cta: "Get Pro plan",
    ctaStyle: "white",
    note: null,
    featuresHeader: "Everything in Free and:",
    features: [
      "Claude Code directly in your codebase",
      "Power through tasks with Cowork",
      "Higher usage limits",
      "Deep research and analysis",
    ],
    moreFeaturesCount: 5,
    showToggle: true,
  },
  {
    name: "Free",
    tagline: "Meet Claude",
    price: "$0",
    priceSuffix: null,
    priceSuffix2: null,
    cta: "Use Claude for free",
    ctaStyle: "dark",
    note: null,
    featuresHeader: null,
    features: [
      "Chat on web, iOS, Android, and desktop",
      "Generate code and visualize data",
      "Connect Slack and Google Workspace",
      "Extended thinking for complex work",
    ],
    moreFeaturesCount: 6,
  },
];

export default function PricingCards() {
  const [billing, setBilling] = useState("yearly");

  return (
    <div className="bg-black py-16 px-6 md:px-12 lg:px-24 min-h-screen flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
        Choose the right plan for you
      </h2>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className=" rounded-2xl flex flex-col overflow-hidden border border-violet-50"
          >
            {/* Top section */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                {plan.showToggle && (
                  <div className="flex items-center bg-[#1e1e1e] rounded-full p-1 text-xs">
                    <button
                      onClick={() => setBilling("monthly")}
                      className={`px-3 py-1 rounded-full transition-colors ${
                        billing === "monthly"
                          ? "bg-[#3a3a3a] text-white"
                          : "text-gray-400"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBilling("yearly")}
                      className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
                        billing === "yearly"
                          ? "bg-[#3a3a3a] text-white"
                          : "text-gray-400"
                      }`}
                    >
                      Yearly
                      <span className="text-blue-400 font-medium">· Save 17%</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.tagline}</p>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-white font-bold text-3xl md:text-4xl">
                  {plan.price}
                </span>
                {plan.priceSuffix && (
                  <div className="flex flex-col leading-tight">
                    <span className="text-gray-400 text-xs">{plan.priceSuffix}</span>
                    <span className="text-gray-500 text-xs">{plan.priceSuffix2}</span>
                  </div>
                )}
              </div>

              <button
                className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-opacity hover:opacity-90 ${
                  plan.ctaStyle === "white"
                    ? "bg-white text-black"
                    : "bg-[#1e1e1e] text-white border border-white/10"
                }`}
              >
                {plan.cta}
              </button>

              {plan.note && (
                <p className="text-center text-gray-500 text-xs mt-2">{plan.note}</p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-white/5" />

            {/* Features */}
            <div className="p-6 flex flex-col gap-2 flex-1">
              {plan.featuresHeader && (
                <p className="text-white text-sm font-medium mb-2">{plan.featuresHeader}</p>
              )}
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.moreFeaturesCount && (
                <p className="text-gray-400 text-sm mt-1">
                  +{plan.moreFeaturesCount} more features
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}