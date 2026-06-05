import { useState, useRef, useEffect } from "react";
import { generateAI, createChat, updateChat } from "../services/api";

const menuItems = [
  {
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>),
    label: "Add files or photos",
  },
  {
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>),
    label: "Take a screenshot",
  },
  {
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>),
    label: "Add to project",
    hasArrow: true,
    dividerAfter: true,
  },
  {
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>),
    label: "Web search",
    labelColor: "#4f8ef7",
    hasCheck: true,
  },
];

const PromptBox = ({ chatId: initialChatId, onMessages, onLoading, onNewChat, onBeforeSend, onScrollToBottom }) => {
  const [prompt, setPrompt] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const activeChatId = useRef(initialChatId || null);
  const messagesRef = useRef([]);
  const textareaRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (initialChatId) activeChatId.current = initialChatId;
  }, [initialChatId]);

  const handleSubmit = async () => {
    if (!prompt.trim() || sending) return;
    const currentPrompt = prompt;
    setPrompt("");

    onBeforeSend?.(); // 👈 reset scroll lock before anything

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }

    setSending(true);
    onLoading(true);

    // Add user message — scroll down immediately
    onMessages((prev) => {
      const updated = [...prev, { role: "user", content: currentPrompt }];
      messagesRef.current = updated;
      return updated;
    });
    onScrollToBottom?.();

    try {
      const res = await generateAI({
        prompt: currentPrompt,
        history: messagesRef.current.slice(0, -1),
      });

      const reply = res.data.result;

      // Add assistant reply — scroll down immediately
      onMessages((prev) => {
        const updated = [...prev, { role: "assistant", content: reply }];
        messagesRef.current = updated;
        return updated;
      });
      onScrollToBottom?.();

      if (activeChatId.current) {
        await updateChat(activeChatId.current, {
          prompt: currentPrompt,
          response: reply,
        }).catch(() => {});
      } else {
        const created = await createChat({
          title: currentPrompt.slice(0, 60),
          prompt: currentPrompt,
          response: reply,
        });
        activeChatId.current = created.data._id;
      }
    } catch (err) {
      onMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error: " + (err.response?.data?.message || "Something went wrong."),
        },
      ]);
      onScrollToBottom?.();
    } finally {
      onLoading(false);
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4">
      <textarea
        ref={textareaRef}
        rows={1}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        className="w-full bg-transparent text-white placeholder-gray-500 text-sm resize-none outline-none max-h-40 overflow-y-auto"
        style={{ height: "24px" }}
      />
      <div className="flex justify-between items-center mt-3">
        <div className="relative" ref={menuRef}>
          <button className="p-2 rounded-lg hover:bg-white/10" onClick={() => setMenuOpen((v) => !v)}>
            <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {menuOpen && (
            <div
              className="absolute bottom-full mb-2 left-0 z-50 w-56 rounded-2xl overflow-hidden"
              style={{
                background: "#1e1e1e",
                border: "0.5px solid rgba(255,255,255,0.1)",
                boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
              }}
            >
              {menuItems.map((item, i) => (
                <div key={i}>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
                    style={{ color: item.labelColor || "#d1d5db" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span style={{ color: item.labelColor || "#9ca3af", flexShrink: 0 }}>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.hasCheck && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {item.hasArrow && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </button>
                  {item.dividerAfter && (
                    <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "2px 0" }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={sending || !prompt.trim()}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
        >
          {sending ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
};

export default PromptBox;