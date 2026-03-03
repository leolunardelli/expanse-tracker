'use client';

import Link from 'next/link';
import { BarChart3, PieChart, FileText, Target, Calendar, TrendingUp } from 'lucide-react';

const actions = [
  { label: 'Analytics', href: '/analytics', icon: PieChart, color: '#0099CC', bg: '#E0F7FF', darkBg: '#1A3D4A' },
  { label: 'Budget', href: '/budget', icon: Target, color: '#00A86B', bg: '#CFFAEA', darkBg: '#1A4A33' },
  { label: 'Reports', href: '/reports', icon: FileText, color: '#0077FF', bg: '#BDDCFF', darkBg: '#1A3352' },
  { label: 'Planning', href: '/planning', icon: Calendar, color: '#FCAC12', bg: '#FCEED4', darkBg: '#4A3A1A' },
  { label: 'Insights', href: '/insights', icon: TrendingUp, color: '#FD3C4A', bg: '#FDD5D7', darkBg: '#4A1F22' },
  { label: 'YoY', href: '/analytics', icon: BarChart3, color: '#0099CC', bg: '#E0F7FF', darkBg: '#1A3D4A' },
];

export default function QuickActions() {
  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map(({ label, href, icon: Icon, color, bg, darkBg }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-2 p-3 rounded-montra-sm hover:bg-surface-light dark:hover:bg-dark-700 transition-colors group"
          >
            <div
              className="w-10 h-10 rounded-montra-sm flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                backgroundColor: bg,
              }}
            >
              <style>{`
                @media (prefers-color-scheme: dark) {
                  .dark .quick-action-${label.toLowerCase()} { background-color: ${darkBg} !important; }
                }
              `}</style>
              <Icon size={20} style={{ color }} />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
