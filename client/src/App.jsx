import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import NotesInput from './components/NotesInput.jsx';
import Loading from './components/Loading.jsx';
import ErrorState from './components/ErrorState.jsx';
import FlashcardList from './components/FlashcardList.jsx';
import { generateFlashcards } from './services/api.js';

export default function App() {
  // 1. Theme State (Dark / Light) with LocalStorage sync
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('study_assistant_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme class to <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('study_assistant_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Notes state with LocalStorage auto-save
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('study_assistant_notes') || '';
  });

  useEffect(() => {
    localStorage.setItem('study_assistant_notes', notes);
  }, [notes]);

  // 3. Application core states
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 4. Ref for Auto-Scrolling to flashcard results & AbortController ref for race condition handling
  const flashcardRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Handle flashcard generation
  const handleGenerate = async () => {
    // Basic frontend check for empty input
    if (!notes.trim()) {
      setError('Please enter some notes.');
      setFlashcards([]);
      return;
    }

    // Cancel any ongoing in-flight request using AbortController to prevent stale responses
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController instance for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const data = await generateFlashcards(notes, controller.signal);
      
      // Update flashcards state
      setFlashcards(data.flashcards);
      setError(null);

      // Auto-scroll smoothly to flashcards section after generation
      setTimeout(() => {
        const element = document.getElementById('flashcard-deck-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);

    } catch (err) {
      // If request was canceled by a subsequent generate action, ignore error update
      if (err.isCanceled) {
        return;
      }
      console.error('Generation Error:', err);
      setError(err.message || 'Failed to generate flashcards.');
      setFlashcards([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Page Hero Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
            Study Assistant
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Turn your study notes into interactive AI-generated flashcards instantly.
          </p>
        </div>

        {/* Input Form */}
        <NotesInput
          notes={notes}
          setNotes={setNotes}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
        />

        {/* Loading Spinner & Skeleton State */}
        {isLoading && <Loading />}

        {/* Error Alert Component */}
        {!isLoading && error && (
          <ErrorState error={error} onRetry={handleGenerate} />
        )}

        {/* Flashcards Results Deck Section */}
        {!isLoading && !error && flashcards.length > 0 && (
          <div ref={flashcardRef}>
            <FlashcardList flashcards={flashcards} />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
