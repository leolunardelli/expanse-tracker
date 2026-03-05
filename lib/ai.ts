import { AI_CATEGORY_LIST } from '@/lib/categories';
import { formatCurrency } from '@/lib/currency';

// Check if OpenAI is configured
function hasOpenAI(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Lazy-load AI SDK only when needed
async function aiGenerateText(prompt: string): Promise<string> {
  const { openai } = await import('@ai-sdk/openai');
  const { generateText } = await import('ai');
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt,
  });
  return text;
}

export async function categorizeExpense(description: string) {
  const text = await aiGenerateText(
    `Categorize this expense into ONE of these categories: ${AI_CATEGORY_LIST}.
    
Expense: "${description}"

Return ONLY the category name, nothing else.`
  );
  
  return text.trim();
}

interface ExpenseData {
  description: string;
  amount: number;
  category: string;
  date: Date | string;
}

// ─── Stat-based fallbacks (no AI required) ───────────────────────

function buildStatInsights(expenses: ExpenseData[]): string {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    const lm = currentMonth === 0 ? 11 : currentMonth - 1;
    const ly = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getMonth() === lm && d.getFullYear() === ly;
  });

  const totalThisMonth = thisMonth.reduce((s, e) => s + e.amount, 0);
  const totalLastMonth = lastMonth.reduce((s, e) => s + e.amount, 0);

  const byCategory = thisMonth.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCats = Object.entries(byCategory).sort(([, a], [, b]) => b - a);
  const topCat = sortedCats[0];

  const insights: string[] = [];

  if (totalThisMonth > 0 && topCat) {
    const pct = ((topCat[1] / totalThisMonth) * 100).toFixed(0);
    insights.push(
      `Your top spending category this month is ${topCat[0]} at ${formatCurrency(topCat[1])} (${pct}% of total).`
    );
  }

  if (totalLastMonth > 0 && totalThisMonth > 0) {
    const change = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
    if (change > 0) {
      insights.push(
        `Spending is up ${change.toFixed(0)}% compared to last month (${formatCurrency(totalLastMonth)} → ${formatCurrency(totalThisMonth)}).`
      );
    } else {
      insights.push(
        `Great job! Spending is down ${Math.abs(change).toFixed(0)}% vs last month (${formatCurrency(totalLastMonth)} → ${formatCurrency(totalThisMonth)}).`
      );
    }
  }

  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  if (totalThisMonth > 0 && dayOfMonth > 1) {
    const projected = (totalThisMonth / dayOfMonth) * daysInMonth;
    insights.push(
      `At your current pace, you're on track to spend ${formatCurrency(projected)} this month.`
    );
  }

  if (thisMonth.length > 0) {
    const avgTransaction = totalThisMonth / thisMonth.length;
    insights.push(
      `Average transaction: ${formatCurrency(avgTransaction)} across ${thisMonth.length} expenses.`
    );
  }

  return insights.slice(0, 3).join('\n');
}

function buildStatSavingTips(expenses: ExpenseData[]) {
  const now = new Date();
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const byCategory = thisMonth.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCats = Object.entries(byCategory).sort(([, a], [, b]) => b - a);
  const total = thisMonth.reduce((s, e) => s + e.amount, 0);

  const tips: { tip: string; potentialSaving: number; category: string }[] = [];

  for (const [cat, amount] of sortedCats.slice(0, 3)) {
    const pct = total > 0 ? ((amount / total) * 100).toFixed(0) : '0';
    const saving = Math.round(amount * 0.15); // suggest 15% reduction
    tips.push({
      tip: `${cat} accounts for ${pct}% of your spending (${formatCurrency(amount)}). Reducing by 15% could save ${formatCurrency(saving)}/month.`,
      potentialSaving: saving,
      category: cat,
    });
  }

  if (tips.length === 0) {
    tips.push(
      { tip: 'Start tracking expenses to get personalized saving tips!', potentialSaving: 0, category: 'General' },
    );
  }

  return tips;
}

function buildStatAssessment(spentSoFar: number, projectedTotal: number, lastMonthTotal: number, dayOfMonth: number, daysInMonth: number): string {
  const daysLeft = daysInMonth - dayOfMonth;
  if (lastMonthTotal > 0) {
    const diff = projectedTotal - lastMonthTotal;
    const pct = ((diff / lastMonthTotal) * 100).toFixed(0);
    if (diff > 0) {
      return `You're on track to spend ${Math.abs(Number(pct))}% more than last month. With ${daysLeft} days left, consider slowing down discretionary spending.`;
    }
    return `You're trending ${Math.abs(Number(pct))}% below last month's spending — keep it up! ${daysLeft} days remaining.`;
  }
  return `You've spent ${formatCurrency(spentSoFar)} so far with ${daysLeft} days remaining this month.`;
}

function buildStatWeeklyAnalysis(thisWeekTotal: number, lastWeekTotal: number, change: number, topCat: string): string {
  const parts: string[] = [];
  if (lastWeekTotal > 0) {
    if (change > 0) {
      parts.push(`Spending increased ${change.toFixed(0)}% this week compared to last week.`);
    } else if (change < 0) {
      parts.push(`Nice work — spending decreased ${Math.abs(change).toFixed(0)}% compared to last week.`);
    } else {
      parts.push('Spending remained steady compared to last week.');
    }
  }
  if (topCat !== 'None') {
    parts.push(`Your top category this week is ${topCat}.`);
  }
  if (thisWeekTotal > 0) {
    const dailyAvg = thisWeekTotal / 7;
    parts.push(`Daily average: ${formatCurrency(dailyAvg)}.`);
  }
  return parts.join(' ') || 'Add expenses to see your weekly analysis.';
}

// ─── Main exports ────────────────────────────────────────────────

export async function generateExpenseInsight(expenses: { description: string; amount: number; category: string; date: Date | string }[]) {
  // Always try stat-based first, then enhance with AI if available
  const statInsights = buildStatInsights(expenses);

  if (!hasOpenAI()) return statInsights;

  try {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    return await aiGenerateText(
      `Analyze these expenses and provide 2-3 actionable insights:
    
Total spent: $${totalSpent.toFixed(2)}
By category: ${JSON.stringify(byCategory, null, 2)}

Recent expenses:
${expenses.slice(0, 10).map(e => `- ${e.description}: $${e.amount} (${e.category})`).join('\n')}

Provide friendly, actionable advice in 2-3 short sentences.`
    );
  } catch {
    return statInsights;
  }
}

export async function generateSavingTips(expenses: ExpenseData[], monthlyBudget?: number) {
  const statTips = buildStatSavingTips(expenses);

  if (!hasOpenAI()) return statTips;

  try {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    const text = await aiGenerateText(
      `You are a helpful financial advisor. Based on this spending data, provide 3 specific, actionable saving tips.

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

Make tips specific to their actual spending patterns. Return ONLY valid JSON array.`
    );

    try {
      return JSON.parse(text);
    } catch {
      return statTips;
    }
  } catch {
    return statTips;
  }
}

export async function predictMonthlySpending(expenses: ExpenseData[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const thisMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const spentSoFar = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgPerDay = dayOfMonth > 0 ? spentSoFar / dayOfMonth : 0;
  const projectedTotal = avgPerDay * daysInMonth;

  const lm = currentMonth === 0 ? 11 : currentMonth - 1;
  const lmYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === lm && d.getFullYear() === lmYear;
  });
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Build assessment: AI if available, otherwise stat-based
  let assessment: string;
  if (hasOpenAI()) {
    try {
      assessment = await aiGenerateText(
        `Analyze this spending prediction and provide a brief assessment:

Current month spending so far: $${spentSoFar.toFixed(2)}
Days elapsed: ${dayOfMonth} of ${daysInMonth}
Average per day: $${avgPerDay.toFixed(2)}
Projected month total: $${projectedTotal.toFixed(2)}
Last month total: $${lastMonthTotal.toFixed(2)}

Provide a 1-2 sentence assessment of their spending trajectory. Be encouraging but honest.`
      );
    } catch {
      assessment = buildStatAssessment(spentSoFar, projectedTotal, lastMonthTotal, dayOfMonth, daysInMonth);
    }
  } else {
    assessment = buildStatAssessment(spentSoFar, projectedTotal, lastMonthTotal, dayOfMonth, daysInMonth);
  }

  return {
    spentSoFar: Math.round(spentSoFar * 100) / 100,
    avgPerDay: Math.round(avgPerDay * 100) / 100,
    projectedTotal: Math.round(projectedTotal * 100) / 100,
    lastMonthTotal: Math.round(lastMonthTotal * 100) / 100,
    daysRemaining: daysInMonth - dayOfMonth,
    assessment,
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

  const topCategory = Object.entries(thisWeekByCategory).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

  // Build analysis: AI if available, otherwise stat-based
  let analysis: string;
  if (hasOpenAI()) {
    try {
      analysis = await aiGenerateText(
        `Provide a brief weekly spending summary:

This week: $${thisWeekTotal.toFixed(2)}
Last week: $${lastWeekTotal.toFixed(2)}
Change: ${change > 0 ? '+' : ''}${change.toFixed(1)}%

This week by category:
${Object.entries(thisWeekByCategory).map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)}`).join('\n')}

Provide a 2-3 sentence weekly summary. Highlight any notable patterns or changes.`
      );
    } catch {
      analysis = buildStatWeeklyAnalysis(thisWeekTotal, lastWeekTotal, change, topCategory);
    }
  } else {
    analysis = buildStatWeeklyAnalysis(thisWeekTotal, lastWeekTotal, change, topCategory);
  }

  return {
    thisWeekTotal: Math.round(thisWeekTotal * 100) / 100,
    lastWeekTotal: Math.round(lastWeekTotal * 100) / 100,
    changePercent: Math.round(change * 10) / 10,
    topCategory,
    analysis,
  };
}
