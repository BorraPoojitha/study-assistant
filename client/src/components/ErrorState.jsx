import React from 'react';
import { AlertTriangle, RotateCcw, HelpCircle } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  if (!error) return null;

  const getHelpTip = (msg) => {
    if (msg.includes('Please enter some notes')) {
      return 'Try pasting lecture notes, textbook summaries, or key points.';
    }
    if (msg.includes('invalid data') || msg.includes('Unexpected AI response')) {
      return 'Try revising or adding slightly more detail to your study notes.';
    }
    if (msg.includes('API key')) {
      return 'Make sure to configure GEMINI_API_KEY inside your backend server/.env file.';
    }
    if (msg.includes('longer than expected') || msg.includes('Network error')) {
      return 'Ensure your backend server (port 5000) is running and accessible.';
    }
    return 'Click Retry below to attempt generating flashcards again.';
  };

  return (
    <div
      role="alert"
      className="w-full max-w-2xl mx-auto my-8 p-6 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-lg text-rose-900 dark:text-rose-200 transition-all duration-300 animate-fade-in"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-900/80 text-rose-600 dark:text-rose-300 flex-shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="flex-1 space-y-2">
          <h4 className="text-lg font-bold text-rose-950 dark:text-rose-100">
            Generation Failed
          </h4>
          <p className="text-sm font-medium text-rose-800 dark:text-rose-200 leading-relaxed">
            {error}
          </p>

          {/* Helpful suggestion tip */}
          <div className="flex items-center space-x-2 text-xs font-normal text-rose-700 dark:text-rose-300 pt-1">
            <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{getHelpTip(error)}</span>
          </div>

          <div className="pt-3">
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
