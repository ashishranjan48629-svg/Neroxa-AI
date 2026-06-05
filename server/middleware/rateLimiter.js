import rateLimit from "express-rate-limit";

const freeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?._id?.toString() ?? req.ip,
  validate: { keyGeneratorIpFallback: false },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Rate limit exceeded. Upgrade to Pro for more requests.",
  },
});

const proLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  keyGenerator: (req) => req.user?._id?.toString() ?? req.ip,
  validate: { keyGeneratorIpFallback: false },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Rate limit exceeded.",
  },
});

export const dynamicLimiter = (req, res, next) => {
  const plan = req.user?.plan || "free";
  return plan === "free"
    ? freeLimiter(req, res, next)
    : proLimiter(req, res, next);
};