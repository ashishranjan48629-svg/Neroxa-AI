import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PromptBox from "../components/PromptBox";
import API, { deleteChat } from "../services/api";

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const userScrolled = useRef(false);

  useEffect(() => {
    API.get(`/api/chats/${id}`)
      .then((res) => {
        const chat = res.data;
        const initial = [
          { role: "user", content: chat.prompt },
          { role: "assistant", content: chat.response },
        ];
        const followUps = (chat.messages || []).flatMap((m) => [
          { role: "user", content: m.prompt },
          { role: "assistant", content: m.response },
        ]);
        setMessages([...initial, ...followUps]);
      })
      .catch((err) => console.log("ERROR:", err.response?.data));
  }, [id]);

  // Detect if user manually scrolled up
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 60;
      userScrolled.current = !atBottom;
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to bottom when messages/loading change, but only if user hasn't scrolled up
  useEffect(() => {
    if (!userScrolled.current) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, loading]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteChat(id);
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err.response?.data);
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-black text-white">

      {/* Top bar */}
      <div className="flex justify-end px-4 sm:px-6 pt-4 pb-2">
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300/50 px-3 py-1.5 rounded-lg transition-all"
        >
          🗑 Delete Chat
        </button>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-80 shadow-xl">
            <h2 className="text-white font-semibold text-lg mb-2">Delete this chat?</h2>
            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone. The chat will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
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
                    prose-headings:text-white prose-headings:font-semibold
                    prose-p:text-gray-300 prose-p:leading-relaxed
                    prose-strong:text-white prose-strong:font-semibold
                    prose-code:text-violet-300 prose-code:bg-violet-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
                    prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4
                    prose-ul:text-gray-300 prose-ol:text-gray-300
                    prose-li:marker:text-violet-400
                    prose-a:text-violet-400">
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

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Prompt Box */}
      <div className="px-4 sm:px-6 py-4 bg-black">
        <div className="max-w-3xl mx-auto">
          <PromptBox
            chatId={id}
            onMessages={setMessages}
            onLoading={setLoading}
            onNewChat={() => {}}
            onBeforeSend={() => {
              // 👈 reset scroll lock BEFORE any state update
              userScrolled.current = false;
            }}
            onScrollToBottom={() => {
              userScrolled.current = false;
              bottomRef.current?.scrollIntoView({ behavior: "instant" });
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default ChatPage;