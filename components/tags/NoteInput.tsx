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
        className="input w-full resize-none text-sm"
      />
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 text-right">
        {value.length}/500
      </p>
    </div>
  );
}
