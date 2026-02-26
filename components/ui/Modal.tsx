'use client';

import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="flex items-end sm:items-center justify-center min-h-full">
        <div
          className="bottom-sheet sm:relative sm:rounded-montra sm:max-w-lg sm:w-full sm:mx-4 sm:my-8 sm:animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle (mobile) */}
          <div className="flex justify-center mb-3 sm:hidden">
            <div className="w-10 h-1 bg-muted-light dark:bg-muted-dark rounded-full" />
          </div>
          
          {title && (
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              {title}
            </h2>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
}
