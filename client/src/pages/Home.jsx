import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PromptBox from "../components/PromptBox";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionKey, setSessionKey] = useState(0); // forces PromptBox remount on new chat
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for the newChat signal sent by Sidebar's handleNewChat when already on "/"
  useEffect(() => {
    if (location.state?.newChat) {
      setMessages([]);
      setLoading(false);
      setSessionKey((k) => k + 1);
      // Clear the state so navigating back doesn't re-trigger
      navigate("/", { replace: true, state: {} });
    }
  }, [location.state?.newChat]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setLoading(false);
    setSessionKey((k) => k + 1); // remounts PromptBox, resetting activeChatId ref
  }, []);

  return (
    <main className="flex flex-col h-screen bg-black text-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 right-0 z-50 px-4 sm:px-6 pt-4 flex justify-end">
        <Link
          to="/Pricing"
          className="inline-flex items-center gap-1.5 bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-violet-600/20 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Upgrade
        </Link>
        {!user && (
          <Link
            to="/Register"
            className="ml-2 inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Sign in
          </Link>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pt-16">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center pt-20">
            <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
              Powered by Llama 3.3
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight mb-4">
              Write smarter with{" "}
              <span className="text-violet-400">Neroxa AI</span>
            </h1>
            <p className="text-gray-500 text-xs">
              No credit card required · 10 free generations
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold mr-3 mt-1 shrink-0">
                    N
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === "user" ? "bg-white/10 rounded-2xl px-4 py-3 text-sm text-gray-200" : "text-gray-200 text-sm"}`}>
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none
                      prose-headings:text-white prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
                      prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-2
                      prose-strong:text-white prose-strong:font-semibold
                      prose-code:text-violet-300 prose-code:bg-violet-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
                      prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-3
                      prose-ul:text-gray-300 prose-ul:my-2 prose-ol:text-gray-300 prose-ol:my-2
                      prose-li:my-1 prose-li:marker:text-violet-400
                      prose-blockquote:border-violet-500 prose-blockquote:text-gray-400
                      prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
                      prose-hr:border-white/10">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold mr-3 mt-1 shrink-0">N</div>
                <div className="flex gap-1 items-center mt-2">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prompt Box */}
      <div className="px-4 sm:px-6 py-4 bg-black">
        <div className="max-w-3xl mx-auto">
          {/* key={sessionKey} forces a full remount when New Chat is clicked,
              which resets the activeChatId ref inside PromptBox to null */}
          <PromptBox
            key={sessionKey}
            onMessages={setMessages}
            onLoading={setLoading}
            onNewChat={handleNewChat}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;