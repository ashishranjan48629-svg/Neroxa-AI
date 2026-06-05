import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, updateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function EditProfile() {
  const navigate = useNavigate();
  const { login, user: authUser } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Load real user data on mount
  useEffect(() => {
    getMe()
      .then((res) => {
        setDisplayName(res.data.name || "");
        setUsername(res.data.username || "");
      })
      .catch(() => {
        // Fallback to auth context data
        setDisplayName(authUser?.name || "");
        setUsername(authUser?.username || "");
      })
      .finally(() => setLoading(false));
  }, []);

  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const handleSave = async () => {
    if (!displayName.trim()) return setError("Display name is required");
    setSaving(true);
    setError("");
    try {
      const res = await updateProfile({ name: displayName, username });
      // Update auth context so sidebar reflects new name
      login(res.data, localStorage.getItem("token"));
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate(-1);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-base font-semibold">Edit profile</h2>
          <button
            onClick={() => navigate(-1)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center ring-2 ring-white/20">
              <span className="text-white text-2xl font-semibold tracking-wide">
                {initials}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#2a2a2a] border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-300"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        {saved && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Profile saved!
          </div>
        )}

        <div className="flex flex-col gap-3 mb-4">
          <div className="bg-[#242424] border border-white/10 rounded-xl px-4 py-3 focus-within:border-violet-500/50 transition-colors">
            <label className="block text-xs text-gray-400 font-medium mb-1">
              Display name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-600"
            />
          </div>
          <div className="bg-[#242424] border border-white/10 rounded-xl px-4 py-3 focus-within:border-violet-500/50 transition-colors">
            <label className="block text-xs text-gray-400 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-600"
            />
          </div>
        </div>

        <p className="text-gray-500 text-xs text-center leading-relaxed mb-6">
          Your display name and username are visible to others on Neroxa AI.
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-full text-sm text-gray-300 hover:bg-white/5 border border-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-full text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
