import { getAIInsights } from '@/app/actions/ai';
import AIInsights from '@/components/AIInsights';

export default async function AsyncAIInsights() {
  const insights = await getAIInsights();
  return <AIInsights insights={insights} />;
}
