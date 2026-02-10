import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Header from '@/components/Header';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header userName={session.user?.name} userImage={session.user?.image} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Insights
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
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
      </main>
    </div>
  );
}
