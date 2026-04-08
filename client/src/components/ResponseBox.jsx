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
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      ) : (
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
      )}
    </div>
  );
};

export default ResponseBox;