'use client';

import { Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AIInsights({ insights }: { insights: string }) {
  // Split insights into bullet points if they contain newlines or numbered items
  const lines = insights
    .split(/\n|(?=\d+\.)/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const displayLines = lines.length > 1 ? lines.slice(0, 3) : [];
  const singleParagraph = lines.length <= 1 ? insights : '';

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-violet-100 to-violet-80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">AI Insights</h3>
              <p className="text-white/60 text-xs">Powered by AI</p>
            </div>
          </div>
          <Link
            href="/insights"
            className="flex items-center gap-1 text-white/80 hover:text-white text-xs font-medium transition-colors"
          >
            View all
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div className="p-4">
        {singleParagraph ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {singleParagraph}
          </p>
        ) : (
          <ul className="space-y-2">
            {displayLines.map((line, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-100 mt-1.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {line.replace(/^\d+\.\s*/, '')}
                </span>
              </li>
            ))}
          </ul>
        )}
        {lines.length > 3 && (
          <p className="text-xs text-violet-100 mt-2 font-medium">
            +{lines.length - 3} more insights
          </p>
        )}
      </div>
    </div>
  );
}
