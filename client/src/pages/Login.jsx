import { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Login({ onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    setServerErr("");
    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setServerErr(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: "" }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 shadow-2xl p-8 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <div className="mb-6 flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-semibold text-white">
              Sign in to Neroxa AI
            </h1>
          </div>

          {serverErr && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {serverErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                className={`w-full h-10 px-3 rounded-lg border text-sm bg-gray-900 text-white outline-none transition
                  ${errors.email ? "border-red-400" : "border-gray-700 focus:border-violet-500"}`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-300">Password</label>
                <button
                  type="button"
                  className="text-xs text-violet-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                className={`w-full h-10 px-3 rounded-lg border text-sm bg-gray-900 text-white outline-none transition
                  ${errors.password ? "border-red-400" : "border-gray-700 focus:border-violet-500"}`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-violet-600 w-3.5 h-3.5"
              />
              <span className="text-xs text-gray-500">Keep me signed in</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            Don't have an account?{" "}
            <button
              onClick={onSwitch}
              className="text-violet-400 hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
