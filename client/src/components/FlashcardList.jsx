import React, { useState, useEffect, useCallback } from 'react';
import Flashcard from './Flashcard.jsx';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  LayoutGrid,
  Square,
  Copy,
  Check,
  Award
} from 'lucide-react';

export default function FlashcardList({ flashcards, onResetAll }) {
  const [cards, setCards] = useState(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedMap, setFlippedMap] = useState({});
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' or 'grid'
  const [copied, setCopied] = useState(false);

  // Sync state when new flashcards arrive
  useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setFlippedMap({});
  }, [flashcards]);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex];
  const isCurrentFlipped = !!flippedMap[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalCards]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleToggleFlip = useCallback((index = currentIndex) => {
    setFlippedMap((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, [currentIndex]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid stealing arrow key presses if user is focused inside a input/textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (viewMode !== 'carousel') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, viewMode]);

  // Shuffle Cards
  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setFlippedMap({});
  };

  // Reset Deck
  const handleResetDeck = () => {
    setCards(flashcards);
    setCurrentIndex(0);
    setFlippedMap({});
  };

  // Copy deck text
  const handleCopyDeck = () => {
    const text = cards.map((c, i) => `Q${i + 1}: ${c.question}\nA${i + 1}: ${c.answer}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!totalCards) return null;

  const progressPercent = Math.round(((currentIndex + 1) / totalCards) * 100);

  return (
    <div id="flashcard-deck-section" className="w-full max-w-4xl mx-auto my-10 space-y-6 animate-fade-in">
      
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        
        {/* Title & Badge */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Generated Flashcards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalCards} interactive cards ready
            </p>
          </div>
        </div>

        {/* Deck Controls */}
        <div className="flex items-center space-x-2 flex-wrap justify-center">
          {/* Shuffle */}
          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Shuffle deck order"
          >
            <Shuffle className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Shuffle
          </button>

          {/* Reset Deck */}
          <button
            type="button"
            onClick={handleResetDeck}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Reset cards position"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Reset
          </button>

          {/* Copy Deck */}
          <button
            type="button"
            onClick={handleCopyDeck}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors"
            title="Copy flashcards text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                Copy Deck
              </>
            )}
          </button>

          {/* View Toggle */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 ml-2">
            <button
              onClick={() => setViewMode('carousel')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'carousel'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Single Card Deck View"
              aria-label="Single Card Deck View"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Progress Bar (For Carousel View) */}
      {viewMode === 'carousel' && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
            <span>Card Progress</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">
              {currentIndex + 1} / {totalCards} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* VIEWMODE CAROUSEL */}
      {viewMode === 'carousel' ? (
        <div className="space-y-6">
          {/* Active Card */}
          <Flashcard
            card={currentCard}
            currentIndex={currentIndex}
            totalCards={totalCards}
            isFlipped={isCurrentFlipped}
            onToggleFlip={() => handleToggleFlip(currentIndex)}
          />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              id="prev-card-btn"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
              aria-label="Previous Card"
            >
              <ChevronLeft className="w-5 h-5 mr-1 text-slate-500" />
              Previous
            </button>

            {/* Card Counter Badge (Required strictly in instructions) */}
            <div
              id="card-counter"
              className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold font-mono text-sm border border-indigo-200 dark:border-indigo-800 shadow-sm"
            >
              {currentIndex + 1} / {totalCards}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === totalCards - 1}
              id="next-card-btn"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
              aria-label="Next Card"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1 text-slate-500" />
            </button>
          </div>

          {/* Shortcut Helper Footnote */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
            💡 Pro tip: Use <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">→</kbd> arrow keys to navigate, and <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">Space</kbd> to flip card.
          </p>
        </div>
      ) : (
        /* VIEWMODE GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {cards.map((c, idx) => (
            <Flashcard
              key={idx}
              card={c}
              currentIndex={idx}
              totalCards={totalCards}
              isFlipped={!!flippedMap[idx]}
              onToggleFlip={() => handleToggleFlip(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
