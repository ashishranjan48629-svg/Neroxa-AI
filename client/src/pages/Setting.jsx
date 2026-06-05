import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { updateSettings } from "../services/api";

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${value ? "bg-violet-600" : "bg-zinc-700"}`}
  >
    <span
      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

const PillSelect = ({ options, value, onChange }) => (
  <div className="flex gap-1 bg-black border border-zinc-800 rounded-lg p-1 flex-shrink-0">
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${value === opt ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"}`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const Badge = ({ children, variant }) => {
  const styles = {
    pro: "bg-gradient-to-r from-violet-600 to-pink-500 text-white",
    new: "bg-emerald-900/40 text-emerald-400 border border-emerald-800/50",
    beta: "bg-amber-900/40 text-amber-400 border border-amber-800/50",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ml-2 ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const Row = ({ label, desc, control, danger = false }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-zinc-800/60 last:border-b-0 hover:bg-white/[0.02] transition-colors">
    <div className="flex-1 min-w-0">
      <div
        className={`text-sm font-medium ${danger ? "text-red-400" : "text-zinc-100"}`}
      >
        {label}
      </div>
      {desc && (
        <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
          {desc}
        </div>
      )}
    </div>
    <div className="flex-shrink-0">{control}</div>
  </div>
);

const Card = ({ children, danger = false }) => (
  <div
    className={`rounded-2xl overflow-hidden border ${danger ? "border-red-500/10" : "border-zinc-800/60"} bg-zinc-900/40`}
  >
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
    {children}
  </h2>
);

export default function Settings() {
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState({
    theme: "Dark",
    emailNotifications: true,
    pushNotifications: true,
    twoFactor: false,
    activityLog: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Auto-save 1 second after any change
  useEffect(() => {
    const timer = setTimeout(() => {
      setSaving(true);
      updateSettings(prefs)
        .then(() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        })
        .catch(() => {})
        .finally(() => setSaving(false));
    }, 1000);
    return () => clearTimeout(timer);
  }, [prefs]);

  const set = (key) => (val) => setPrefs((p) => ({ ...p, [key]: val }));

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-5 right-5 z-50 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      {/* Auto-save indicator */}
      {(saving || saved) && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs font-medium bg-zinc-800 border border-white/10 text-gray-300">
          {saving ? "Saving..." : "✓ Saved"}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-14 pb-24">
        <div className="mb-10">
          <h1
            className="font-extrabold text-3xl tracking-tight text-zinc-50 mb-1.5"
            style={{ letterSpacing: "-0.04em" }}
          >
            Settings
          </h1>
          <p className="text-sm text-zinc-500">
            Manage your preferences, account, and security options.
          </p>
        </div>

        {/* Plan */}
        <div className="mb-8">
          <SectionTitle>Current Plan</SectionTitle>
          <div className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-extrabold text-violet-400 mb-1">
                Free Plan
              </div>
              <div className="text-xs text-zinc-500 mb-3">
                10 free generations included
              </div>
              <div className="flex flex-wrap gap-3">
                {["AI chat", "Basic features", "Web access"].map((f) => (
                  <span
                    key={f}
                    className="text-xs text-zinc-400 flex items-center gap-1.5 before:content-['✦'] before:text-violet-500 before:text-[8px]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate("/pricing")}
              className="flex-shrink-0 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="mb-8">
          <SectionTitle>Appearance</SectionTitle>
          <Card>
            <Row
              label="Theme"
              desc="Choose your preferred color theme"
              control={
                <PillSelect
                  options={["Dark", "Light"]}
                  value={prefs.theme}
                  onChange={set("theme")}
                />
              }
            />
          </Card>
        </div>

        {/* Notifications */}
        <div className="mb-8">
          <SectionTitle>Notifications</SectionTitle>
          <Card>
            <Row
              label={
                <>
                  Email Notifications<Badge variant="pro">Pro</Badge>
                </>
              }
              desc="Receive updates, digests, and alerts via email"
              control={
                <Toggle
                  value={prefs.emailNotifications}
                  onChange={set("emailNotifications")}
                />
              }
            />
            <Row
              label={
                <>
                  Push Notifications<Badge variant="new">New</Badge>
                </>
              }
              desc="Get instant push notifications in your browser"
              control={
                <Toggle
                  value={prefs.pushNotifications}
                  onChange={set("pushNotifications")}
                />
              }
            />
          </Card>
        </div>

        {/* Privacy & Security */}
        <div className="mb-8">
          <SectionTitle>Privacy & Security</SectionTitle>
          <Card>
            <Row
              label={
                <>
                  Two-Factor Authentication<Badge variant="beta">Beta</Badge>
                </>
              }
              desc="Add an extra layer of security to your account"
              control={
                <Toggle value={prefs.twoFactor} onChange={set("twoFactor")} />
              }
            />
            <Row
              label="Activity Log"
              desc="Record logins and significant account changes"
              control={
                <Toggle
                  value={prefs.activityLog}
                  onChange={set("activityLog")}
                />
              }
            />
          </Card>
        </div>

        {/* Danger Zone */}
        <div className="mb-8">
          <SectionTitle>Danger Zone</SectionTitle>
          <Card danger>
            <Row
              label="Delete Account"
              desc="Permanently delete your account and all associated data"
              danger
              control={
                <button className="border border-red-500/60 text-red-400 hover:bg-red-500 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
                  Delete
                </button>
              }
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
