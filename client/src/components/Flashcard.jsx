import React from 'react';
import { HelpCircle, CheckCircle2, RotateCw, Eye, EyeOff } from 'lucide-react';

export default function Flashcard({
  card,
  currentIndex,
  totalCards,
  isFlipped,
  onToggleFlip
}) {
  if (!card) return null;

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggleFlip();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000 my-4 select-none">
      <div
        tabIndex={0}
        role="button"
        aria-label={`Flashcard ${currentIndex + 1} of ${totalCards}. ${isFlipped ? 'Showing answer' : 'Showing question'}. Press space or click to flip.`}
        onClick={onToggleFlip}
        onKeyDown={handleKeyDown}
        className={`relative w-full min-h-[300px] sm:min-h-[340px] rounded-3xl transition-transform duration-700 transform-style-3d cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/40 shadow-xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE (Question) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/60 shadow-lg backface-hidden ${
            isFlipped ? 'pointer-events-none' : ''
          }`}
        >
          {/* Card Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
              QUESTION
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono">
              Card {currentIndex + 1} of {totalCards}
            </span>
          </div>

          {/* Question Body */}
          <div className="my-auto py-4">
            <h3 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed text-center">
              {card.question}
            </h3>
          </div>

          {/* Card Bottom Bar & Show Answer Action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            <span className="hidden sm:inline-flex items-center">
              <RotateCw className="w-3.5 h-3.5 mr-1" /> Click or press Space to flip
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFlip();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-sm"
              aria-label="Show Answer"
            >
              <Eye className="w-4 h-4 mr-2 text-indigo-500" />
              Show Answer
            </button>
          </div>
        </div>

        {/* BACK SIDE (Answer) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-2 border-indigo-500/40 shadow-2xl rotate-y-180 backface-hidden ${
            !isFlipped ? 'pointer-events-none' : ''
          }`}
        >
          {/* Card Top Bar */}
          <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              ANSWER
            </span>
            <span className="text-xs font-semibold text-indigo-300/80 font-mono">
              Card {currentIndex + 1} of {totalCards}
            </span>
          </div>

          {/* Answer Body */}
          <div className="my-auto py-4">
            <p className="text-base sm:text-xl font-medium text-indigo-50 leading-relaxed text-center">
              {card.answer}
            </p>
          </div>

          {/* Card Bottom Bar & Hide Answer Action */}
          <div className="flex items-center justify-between pt-3 border-t border-indigo-800/80 text-xs text-indigo-300/70">
            <span className="hidden sm:inline-flex items-center">
              <RotateCw className="w-3.5 h-3.5 mr-1" /> Click to flip back
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFlip();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/30 transition-colors shadow-sm"
              aria-label="Hide Answer"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Answer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
