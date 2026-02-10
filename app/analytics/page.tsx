import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getAnalyticsData } from '../actions/analytics';
import { getYearOverYearData } from '../actions/yoy';
import Header from '@/components/Header';
import SummaryCards from '@/components/charts/SummaryCards';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import MonthlyBarChart from '@/components/charts/MonthlyBarChart';
import SpendingTrendChart from '@/components/charts/SpendingTrendChart';
import YearOverYearChart from '@/components/charts/YearOverYearChart';
import YoYStatsCards from '@/components/charts/YoYStatsCards';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  const analytics = await getAnalyticsData();
  const yoyData = await getYearOverYearData();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={session.user?.name} userImage={session.user?.image} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold">📊 Analytics</h1>
        </div>
        
        <SummaryCards data={analytics.summary} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <CategoryPieChart data={analytics.categoryData} />
          <MonthlyBarChart data={analytics.monthlyData} />
        </div>
        
        <div className="mt-6">
          <SpendingTrendChart data={analytics.trendData} />
        </div>

        {/* Year-over-Year Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">📈 Year-over-Year Analysis</h2>
          <YoYStatsCards stats={yoyData} />
          <YearOverYearChart 
            data={yoyData.chartData} 
            currentYear={yoyData.currentYear}
            previousYear={yoyData.previousYear}
          />
        </div>
      </main>
    </div>
  );
}
