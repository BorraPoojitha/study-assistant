import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';

const MESSAGES = [
  'Analyzing your study notes...',
  'Extracting key concepts & definitions...',
  'Generating 10 interactive flashcards...',
  'Structuring question & answer pairs...',
  'Finalizing deck formatting...'
];

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-10 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl text-center transition-colors duration-300 animate-fade-in">
      
      {/* Animated Spinner Icon */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 dark:bg-indigo-500/30 blur-xl animate-pulse"></div>
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80 shadow-md relative z-10">
          <BrainCircuit className="w-10 h-10 animate-bounce text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center space-x-2">
        <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
        <span>AI Assistant at work</span>
      </h3>

      <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 h-6 transition-all duration-300">
        {MESSAGES[messageIndex]}
      </p>

      {/* Card Skeleton Loader */}
      <div className="mt-8 p-6 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 text-left">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4 animate-pulse"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 animate-pulse"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 animate-pulse"></div>
        
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex justify-between items-center">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-28 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-16 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
