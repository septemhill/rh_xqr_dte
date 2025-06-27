"use client"

import { useLanguage } from '@/context/language-context';

interface NotesSectionProps {
  notes: string[];
}

export function NotesSection({ notes }: NotesSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-2">{t.comparison.notesTitle}</h2>
      {notes.map((note, index) => (
        <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
          {index + 1}. {note}
        </p>
      ))}
    </div>
  );
}
