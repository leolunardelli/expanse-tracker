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

interface ExpenseData {
  description: string;
  amount: number;
  category: string;
  date: Date | string;
}

export async function generateSavingTips(expenses: ExpenseData[], monthlyBudget?: number) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `You are a helpful financial advisor. Based on this spending data, provide 3 specific, actionable saving tips.

Total spent this month: $${totalSpent.toFixed(2)}
${monthlyBudget ? `Monthly budget: $${monthlyBudget}` : ''}

Top spending categories:
${topCategories.map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)}`).join('\n')}

Recent expenses:
${expenses.slice(0, 15).map(e => `- ${e.description}: $${e.amount} (${e.category})`).join('\n')}

Provide exactly 3 saving tips in this JSON format:
[
  {"tip": "tip text here", "potentialSaving": 50, "category": "Food"},
  {"tip": "tip text here", "potentialSaving": 30, "category": "Transport"},
  {"tip": "tip text here", "potentialSaving": 20, "category": "Entertainment"}
]

Make tips specific to their actual spending patterns. Return ONLY valid JSON array.`,
  });

  try {
    return JSON.parse(text);
  } catch {
    return [
      { tip: 'Review your recurring subscriptions', potentialSaving: 20, category: 'Bills' },
      { tip: 'Try meal prepping to reduce food costs', potentialSaving: 50, category: 'Food' },
      { tip: 'Use public transport when possible', potentialSaving: 30, category: 'Transport' },
    ];
  }
}

export async function predictMonthlySpending(expenses: ExpenseData[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get this month's expenses
  const thisMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const spentSoFar = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgPerDay = spentSoFar / dayOfMonth;
  const projectedTotal = avgPerDay * daysInMonth;

  // Get last month's total for comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Analyze this spending prediction and provide a brief assessment:

Current month spending so far: $${spentSoFar.toFixed(2)}
Days elapsed: ${dayOfMonth} of ${daysInMonth}
Average per day: $${avgPerDay.toFixed(2)}
Projected month total: $${projectedTotal.toFixed(2)}
Last month total: $${lastMonthTotal.toFixed(2)}

Provide a 1-2 sentence assessment of their spending trajectory. Be encouraging but honest.`,
  });

  return {
    spentSoFar: Math.round(spentSoFar * 100) / 100,
    avgPerDay: Math.round(avgPerDay * 100) / 100,
    projectedTotal: Math.round(projectedTotal * 100) / 100,
    lastMonthTotal: Math.round(lastMonthTotal * 100) / 100,
    daysRemaining: daysInMonth - dayOfMonth,
    assessment: text,
  };
}

export async function generateWeeklyAnalysis(expenses: ExpenseData[]) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeek = expenses.filter(e => new Date(e.date) >= weekAgo);
  const lastWeek = expenses.filter(e => {
    const d = new Date(e.date);
    return d >= twoWeeksAgo && d < weekAgo;
  });

  const thisWeekTotal = thisWeek.reduce((sum, e) => sum + e.amount, 0);
  const lastWeekTotal = lastWeek.reduce((sum, e) => sum + e.amount, 0);
  const change = lastWeekTotal > 0 ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100 : 0;

  const thisWeekByCategory = thisWeek.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Provide a brief weekly spending summary:

This week: $${thisWeekTotal.toFixed(2)}
Last week: $${lastWeekTotal.toFixed(2)}
Change: ${change > 0 ? '+' : ''}${change.toFixed(1)}%

This week by category:
${Object.entries(thisWeekByCategory).map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)}`).join('\n')}

Provide a 2-3 sentence weekly summary. Highlight any notable patterns or changes.`,
  });

  return {
    thisWeekTotal: Math.round(thisWeekTotal * 100) / 100,
    lastWeekTotal: Math.round(lastWeekTotal * 100) / 100,
    changePercent: Math.round(change * 10) / 10,
    topCategory: Object.entries(thisWeekByCategory).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None',
    analysis: text,
  };
}
