import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function categorizeExpense(description: string) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Categorize this expense into ONE of these categories: Food, Transport, Entertainment, Shopping, Bills, Health, Other.
    
Expense: "${description}"

Return ONLY the category name, nothing else.`,
  });
  
  return text.trim();
}

export async function generateExpenseInsight(expenses: { description: string; amount: number; category: string }[]) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Analyze these expenses and provide 2-3 actionable insights:
    
Total spent: $${totalSpent.toFixed(2)}
By category: ${JSON.stringify(byCategory, null, 2)}

Recent expenses:
${expenses.slice(0, 10).map(e => `- ${e.description}: $${e.amount} (${e.category})`).join('\n')}

Provide friendly, actionable advice in 2-3 short sentences.`,
  });
  
  return text;
}
