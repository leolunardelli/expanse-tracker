'use client';

import { StickyNote } from 'lucide-react';

type NoteInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function NoteInput({
  value,
  onChange,
  placeholder = 'Add a note about this expense...',
}: NoteInputProps) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        <StickyNote size={14} />
        Notes
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        maxLength={500}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none text-sm"
      />
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 text-right">
        {value.length}/500
      </p>
    </div>
  );
}
