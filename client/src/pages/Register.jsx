import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import googleIcon from "../assets/googleicon.png";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { registerUser, googleAuthUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  // Handle redirect result on mount (fallback from signInWithRedirect)
  useEffect(() => {
    setGoogleLoading(true);
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result) return;
        const res = await googleAuthUser({
          name: result.user.displayName,
          email: result.user.email,
        });
        login(res.data.user, res.data.token);
        navigate("/");
      })
      .catch((err) => {
        if (err?.code !== "auth/no-current-user") {
          console.error("Redirect result error:", err);
          setServerErr("Google sign up failed. Please try again.");
        }
      })
      .finally(() => setGoogleLoading(false));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match";
    if (!terms) errs.terms = "You must accept the Terms of Service";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    setServerErr("");
    try {
      await registerUser({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setServerErr(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setServerErr("");
    setGoogleLoading(true);
    try {
      let user;
      try {
        // Try popup first
        const result = await signInWithPopup(auth, provider);
        user = result.user;
      } catch (popupErr) {
        // If popup is blocked by COOP policy, fall back to redirect
        if (
          popupErr?.code === "auth/popup-blocked" ||
          popupErr?.code === "auth/cancelled-popup-request" ||
          popupErr?.message?.includes("Cross-Origin-Opener-Policy")
        ) {
          await signInWithRedirect(auth, provider);
          return; // Page will reload; result handled in useEffect
        }
        throw popupErr; // Re-throw other errors
      }

      const res = await googleAuthUser({
        name: user.displayName,
        email: user.email,
      });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (error) {
      console.error("Google signup error:", error);
      if (error?.code === "auth/popup-closed-by-user") {
        setServerErr("Sign-in popup was closed. Please try again.");
      } else if (error?.message?.includes("Network Error")) {
        setServerErr("Cannot reach the server. Make sure your backend is running.");
      } else {
        setServerErr("Google sign up failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: "" }));
  };

  const inputClass = (field) =>
    `w-full h-10 px-3 rounded-lg border text-sm bg-gray-900 text-white outline-none transition
    ${errors[field] ? "border-red-400" : "border-gray-700 focus:border-violet-500"}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 shadow-2xl p-8 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <div className="mb-6 flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
            <div>
              <h1 className="text-xl font-semibold text-white">
                Create your account
              </h1>
              <p className="text-sm text-gray-400">
                Get started with Neroxa AI for free
              </p>
            </div>
          </div>

          {serverErr && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {serverErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  placeholder="First name"
                  value={form.firstName}
                  onChange={set("firstName")}
                  className={inputClass("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={set("lastName")}
                  className={inputClass("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={set("email")}
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={set("password")}
                className={inputClass("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm password"
                value={form.confirm}
                onChange={set("confirm")}
                className={inputClass("confirm")}
              />
              {errors.confirm && (
                <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="accent-violet-600"
                />
                Accept Terms of Service
              </div>
              {errors.terms && (
                <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-xs text-gray-500">or sign up with</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/5 disabled:opacity-60 transition"
          >
            {googleLoading ? (
              <svg className="animate-spin w-4 h-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
            )}
            {googleLoading ? "Signing in..." : "Sign up with Google"}
          </button>

          <p className="text-center text-xs text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}