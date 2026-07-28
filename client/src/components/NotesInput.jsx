import React from 'react';
import { Sparkles, Trash2, BookMarked, Loader2, FileText } from 'lucide-react';

const SAMPLE_PRESETS = [
  {
    title: '🌿 Biology: Photosynthesis',
    content: `Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy into chemical energy.
It occurs primarily in the chloroplasts of plant cells using chlorophyll pigments.
The general chemical equation for photosynthesis is 6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2.
It consists of two main stages: Light-Dependent Reactions (which convert solar energy into ATP and NADPH in the thylakoid membranes) and the Calvin Cycle (Light-Independent Reactions in the stroma which fix carbon dioxide into glucose).`
  },
  {
    title: '💻 CS: Operating Systems',
    content: `An Operating System (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs.
Key responsibilities include Process Management (scheduling, context switching), Memory Management (paging, virtual memory, RAM allocation), File Systems (data storage, directories), and I/O Device Management.
A deadlock occurs when two or more processes are blocked forever, each waiting for a resource held by another. The four necessary Coffman conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.`
  },
  {
    title: '📜 History: World War II',
    content: `World War II was a global conflict that lasted from 1939 to 1945, involving the vast majority of the world's nations forming two opposing military alliances: the Allies and the Axis.
The war began in Europe on September 1, 1939, with the invasion of Poland by Nazi Germany.
Major pivotal events include the Battle of Stalingrad (turning point on the Eastern Front), D-Day / Normandy Landings (June 6, 1944), and the atomic bombings of Hiroshima and Nagasaki in August 1945.
The conflict concluded with Allied victory, leading to the creation of the United Nations to foster international cooperation.`
  }
];

export default function NotesInput({
  notes,
  setNotes,
  onGenerate,
  isLoading,
  error
}) {
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  const handleClear = () => {
    setNotes('');
  };

  const handlePresetSelect = (presetContent) => {
    setNotes(presetContent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors duration-300">
      
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <label htmlFor="notes-textarea" className="flex items-center space-x-2 text-base font-bold text-slate-800 dark:text-slate-200">
          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Study Notes or Topic</span>
        </label>

        {/* Quick Presets */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap flex items-center">
            <BookMarked className="w-3.5 h-3.5 mr-1" /> Quick Samples:
          </span>
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(preset.content)}
              disabled={isLoading}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200/70 dark:border-indigo-800/60 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            id="notes-textarea"
            rows={8}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            placeholder="Paste your study notes here... (e.g. key concepts, textbook summaries, lecture notes, or any topic you want to learn)"
            className="w-full p-4 text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-700/80 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-y min-h-[180px] disabled:opacity-60"
            aria-label="Study notes input"
          />

          {notes && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Clear notes"
              aria-label="Clear notes"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Counter & Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-4">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            <span>&bull;</span>
            <span>{charCount} characters</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !notes.trim()}
            id="generate-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 active:scale-[0.98] shadow-lg shadow-indigo-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2.5 animate-spin" />
                <span>Generating Flashcards...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2.5 text-indigo-200" />
                <span>Generate Flashcards</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
