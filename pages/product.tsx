"use client"

import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useAuth } from '@clerk/nextjs';
import { fetchEventSource } from '@microsoft/fetch-event-source';

export default function Product() {
    const [idea, setIdea] = useState<string>("Click Start to generate an idea");
    const [isStreaming, setIsStreaming] = useState(false);
    const abortCtrlRef = useRef<AbortController | null>(null);
    const { getToken } = useAuth(); // 👈 get auth state

    const handleStreamToggle = async () => {
        const token = await getToken();
        if (!token) {
            setIdea("Authentication required");
            return;
        }
        
        if(!isStreaming) {
            if(abortCtrlRef.current) {
                abortCtrlRef.current.abort();
            }
        
        const newController = new AbortController();
        abortCtrlRef.current = newController;
        setIdea("Loading...");
        setIsStreaming(true);
        let buffer = "";
        
        fetchEventSource('/api', {
            headers: { Authorization: `Bearer ${token}` },
            signal: newController.signal,
            onmessage(ev) {
                buffer += ev.data;
                setIdea(buffer);
            },
            onerror(err) {
                console.error('SSE error:', err);
                setIsStreaming(false);
                abortCtrlRef.current?.abort();
            },
            onclose() {
                setIsStreaming(false);
                abortCtrlRef.current = null;
            },
        });
        } else {
            if(abortCtrlRef.current) {
                abortCtrlRef.current.abort();
                abortCtrlRef.current = null;
            }
            setIsStreaming(false);
            console.log("Streaming is stopped by user");
        }
    };

    useEffect(() => {
        return () => {
            abortCtrlRef.current?.abort();
            abortCtrlRef.current = null;
        }
    }, [])


    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Business Idea Generator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        AI-powered innovation at your fingertips
                    </p>
                </header>

                {/* Control button */}
                <div className='text-center mb-12'>
                    <button
                        onClick={handleStreamToggle}
                        className={`px-6 py-3 rounded-xl text-white font-semibold shadow-md transition 
                            ${isStreaming ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                        {isStreaming ? "Stop streaming" : "Start streaming"}
                    </button>
                </div>

                {/* Content Card */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-95">
                        {idea === "Loading..." ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-pulse text-gray-400">
                                    Generating your business idea...
                                </div>
                            </div>
                        ) : (
                            <div className="markdown-content text-gray-700 dark:text-gray-300">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                >
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