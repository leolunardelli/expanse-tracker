'use client';

import { useState, useSyncExternalStore } from 'react';
import { Sun, Moon, Sunset, Coffee } from 'lucide-react';

interface DashboardGreetingProps {
  userName?: string | null;
}

const TIPS = [
  'Track every expense to gain control over your finances.',
  'Small daily savings compound into big results over time.',
  'Review your budget weekly to stay on top of spending.',
  'Use categories to spot where your money goes each month.',
  'Set realistic budgets and adjust as you learn your patterns.',
  'Recurring expenses are the silent budget killers — review them!',
  'Planning ahead prevents impulse spending.',
];

function getGreeting(): { text: string; icon: typeof Sun } {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', icon: Coffee };
  }
  if (hour >= 12 && hour < 17) {
    return { text: 'Good afternoon', icon: Sun };
  }
  if (hour >= 17 && hour < 21) {
    return { text: 'Good evening', icon: Sunset };
  }
  return { text: 'Good night', icon: Moon };
}

// SSR-safe mount detection without useEffect + setState
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function DashboardGreeting({ userName }: DashboardGreetingProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  // Avoid hydration mismatch by only rendering time-based content on client
  if (!mounted) {
    return (
      <div className="h-14" />
    );
  }

  const { text, icon: Icon } = getGreeting();
  const firstName = userName?.split(' ')[0] || 'there';

  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-montra-sm bg-warning-20 dark:bg-warning-100/10 mt-0.5">
        <Icon size={20} className="text-warning-100" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {text}, {firstName}!
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {tip}
        </p>
      </div>
    </div>
  );
}
