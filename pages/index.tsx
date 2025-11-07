"use client";

import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function Home() {
  const [idea, setIdea] = useState<string>("Click Start to generate an idea");
  const [isStreaming, setIsStreaming] = useState(false);
  const evtRef = useRef<EventSource | null>(null); // store EventSource so we can close it later

  const handleToggleStream = () => {
    if (!isStreaming) {
      // --- START STREAMING ---
      setIdea("…loading");
      const evt = new EventSource("/api");

      let buffer = "";
      evt.onmessage = (e) => {
        buffer += e.data;
        setIdea(buffer);
      };

      evt.onerror = () => {
        console.error("SSE error, closing");
        evt.close();
        setIsStreaming(false);
      };

      evtRef.current = evt;
      setIsStreaming(true);
    } else {
      // --- STOP STREAMING ---
      evtRef.current?.close();
      evtRef.current = null;
      setIsStreaming(false);
      console.log("SSE closed by user");
    }
  };

  // Clean up if user leaves page
  useEffect(() => {
    return () => {
      evtRef.current?.close();
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Business Idea Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            AI-powered innovation at your fingertips
          </p>
        </header>

        {/* Control Button */}
        <div className="text-center mb-10">
          <button
            onClick={handleToggleStream}
            className={`px-6 py-3 rounded-xl text-white font-semibold shadow-md transition ${
              isStreaming ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isStreaming ? "Stop Streaming" : "Start Streaming"}
          </button>
        </div>

        {/* Content Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-95">
            {idea === "…loading" ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-pulse text-gray-400">
                  Generating your business idea...
                </div>
              </div>
            ) : (
              <div className="markdown-content text-gray-700 dark:text-gray-300">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {idea}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}