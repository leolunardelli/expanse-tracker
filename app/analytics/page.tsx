import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getAnalyticsData } from '../actions/analytics';
import { getYearOverYearData } from '../actions/yoy';
import AppShell from '@/components/AppShell';
import SummaryCards from '@/components/charts/SummaryCards';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import MonthlyBarChart from '@/components/charts/MonthlyBarChart';
import SpendingTrendChart from '@/components/charts/SpendingTrendChart';
import YearOverYearChart from '@/components/charts/YearOverYearChart';
import YoYStatsCards from '@/components/charts/YoYStatsCards';


export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  const analytics = await getAnalyticsData();
  const yoyData = await getYearOverYearData();
  
  return (
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Analytics</h1>
      
      <SummaryCards data={analytics.summary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CategoryPieChart data={analytics.categoryData} />
        <MonthlyBarChart data={analytics.monthlyData} />
      </div>
      
      <div className="mt-6">
        <SpendingTrendChart data={analytics.trendData} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Year-over-Year Analysis</h2>
        <YoYStatsCards stats={yoyData} />
        <YearOverYearChart 
          data={yoyData.chartData} 
          currentYear={yoyData.currentYear}
          previousYear={yoyData.previousYear}
        />
      </div>
    </AppShell>
  );
}
