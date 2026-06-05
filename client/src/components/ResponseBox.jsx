import ReactMarkdown from "react-markdown";

const ResponseBox = ({ response, loading }) => {
  if (!response && !loading) return null;

  return (
    <div className="w-full bg-white/5 border border-violet-500/20 rounded-2xl p-5 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
        <span className="text-xs text-violet-400 font-medium">Neroxa AI</span>
      </div>

      {loading ? (
        <div className="flex gap-1 items-center">
          <span
            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      ) : (
        <div
          className="text-gray-300 text-sm leading-relaxed prose prose-invert prose-sm max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-strong:text-white prose-strong:font-semibold
          prose-em:text-gray-300
          prose-code:text-violet-300 prose-code:bg-violet-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
          prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4
          prose-ul:text-gray-300 prose-ol:text-gray-300
          prose-li:marker:text-violet-400
          prose-blockquote:border-violet-500 prose-blockquote:text-gray-400
          prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
          prose-hr:border-white/10"
        >
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ResponseBox;
