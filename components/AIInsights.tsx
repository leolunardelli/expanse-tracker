'use client';

import { Sparkles } from 'lucide-react';

export default function AIInsights({ insights }: { insights: string }) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={24} />
        <h2 className="text-xl font-bold">AI Insights</h2>
      </div>
      <p className="text-white/90 leading-relaxed">{insights}</p>
    </div>
  );
}
