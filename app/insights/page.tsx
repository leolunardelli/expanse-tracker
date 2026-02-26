import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/AppShell';
import SavingTips from '@/components/ai/SavingTips';
import SpendingPrediction from '@/components/ai/SpendingPrediction';
import WeeklyAnalysis from '@/components/ai/WeeklyAnalysis';
import { Brain, Sparkles } from 'lucide-react';

export default async function InsightsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 rounded-montra-sm">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
            AI Insights
          </h1>
        </div>
        <p className="text-muted flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-warning-100" />
          Powered by OpenAI - Personalized spending analysis and recommendations
        </p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SpendingPrediction />
            <WeeklyAnalysis />
          </div>
          
          <div className="space-y-6">
            <SavingTips />
            
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Features
              </h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  Smart expense categorization
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  Personalized saving recommendations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  Monthly spending predictions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  Weekly spending analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  Trend detection & alerts
                </li>
              </ul>
              <p className="mt-4 text-xs opacity-75">
                Tips refresh based on your spending patterns. Click refresh icons to get new insights.
              </p>
            </div>
          </div>
        </div>
    </AppShell>
  );
}
