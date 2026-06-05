import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
      stroke="#7c3aed"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const plans = [
  {
    name: "Free",
    tagline: "Meet Neroxa",
    price: "$0",
    cta: "Use Neroxa for free",
    ctaStyle: "ghost",
    features: [
      "Chat on web, iOS, Android, and desktop",
      "Generate code and visualize data",
      "Connect Slack and Google Workspace",
      "Extended thinking for complex work",
    ],
    moreFeaturesCount: 6,
  },
  {
    name: "Pro",
    tagline: "Research, code, and organize",
    price: "$17",
    priceSuffix: "/ mo",
    priceSuffix2: "billed annually",
    cta: "Get Pro plan",
    ctaStyle: "violet",
    featured: true,
    featuresHeader: "Everything in Free, plus:",
    features: [
      "Neroxa Code directly in your codebase",
      "Power through tasks with Cowork",
      "Higher usage limits",
      "Deep research and analysis",
    ],
    moreFeaturesCount: 5,
  },
  {
    name: "Max",
    tagline: "Higher limits, priority access",
    price: "$50",
    priceSuffix: "/ mo",
    priceSuffix2: "billed monthly",
    cta: "Get Max plan",
    ctaStyle: "white",
    note: "No commitment · Cancel anytime",
    featuresHeader: "Everything in Pro, plus:",
    features: [
      "Up to 20x more usage than Pro",
      "Early access to advanced features",
      "Higher output limits for all tasks",
      "Priority access at high traffic times",
      "Claude in PowerPoint",
    ],
  },
];

export default function PricingCards() {
  const navigate = useNavigate();
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center py-20 px-4 sm:px-6">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-5 right-5 z-50 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
        aria-label="Go back"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      {/* Header */}
      <p className="text-violet-400 text-sm font-medium mb-3">Pricing</p>
      <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-3 text-center">
        Choose the right plan
      </h2>
      <p className="text-gray-500 text-sm mb-14 text-center">
        Start free. Upgrade when you're ready.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col h-full rounded-2xl border p-6 transition-all ${
              plan.featured
                ? "border-violet-500/40 bg-violet-600/5"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            {/* Featured badge */}
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium bg-violet-600 text-white px-3 py-0.5 rounded-full">
                Most popular
              </span>
            )}

            {/* Plan name + tagline */}
            <p className="text-white font-semibold text-base mb-0.5">
              {plan.name}
            </p>
            <p className="text-gray-500 text-xs mb-5">{plan.tagline}</p>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-white font-bold text-3xl">
                {plan.price}
              </span>
              {plan.priceSuffix && (
                <span className="text-gray-400 text-sm">
                  {plan.priceSuffix}
                </span>
              )}
            </div>
            {plan.priceSuffix2 ? (
              <p className="text-gray-600 text-xs mb-5">{plan.priceSuffix2}</p>
            ) : (
              <div className="mb-5" />
            )}

            {/* CTA */}
            <button
              className={`w-full py-2 rounded-lg text-sm font-medium transition mb-2 ${
                plan.ctaStyle === "violet"
                  ? "bg-violet-600 hover:bg-violet-500 text-white"
                  : plan.ctaStyle === "white"
                    ? "bg-white hover:bg-gray-100 text-black"
                    : "border border-white/10 text-gray-300 hover:bg-white/5"
              }`}
            >
              {plan.cta}
            </button>

            {plan.note ? (
              <p className="text-center text-gray-600 text-xs mb-2">
                {plan.note}
              </p>
            ) : (
              <div className="mb-2" />
            )}

            {/* Features — flex-1 pushes this to fill remaining height */}
            <div className="flex flex-col flex-1">
              <div className="border-t border-white/5 my-4" />
              {plan.featuresHeader && (
                <p className="text-gray-400 text-xs font-medium mb-3">
                  {plan.featuresHeader}
                </p>
              )}
              <ul className="flex flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon />
                    <span className="text-gray-400 text-xs leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              {plan.moreFeaturesCount && (
                <p className="text-gray-600 text-xs mt-3">
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
